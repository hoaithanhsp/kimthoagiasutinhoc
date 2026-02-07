import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, EducationLevel, Difficulty } from "../types";

// --- CONFIGURATION & HELPERS ---

const FALLBACK_ORDER = [
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
  'gemini-2.5-flash',
  'gemini-2.5-pro'
];

const getApiKey = (): string => {
  const localKey = localStorage.getItem('gemini_api_key');
  if (localKey) return localKey;

  // Fallback to env if available
  return process.env.REACT_APP_GEMINI_API_KEY || (import.meta.env?.VITE_GEMINI_API_KEY as string) || '';
};

const getModel = (): string => {
  return localStorage.getItem('gemini_model') || 'gemini-3-flash-preview';
};

const getDifficultyLabel = (diff: Difficulty): string => {
  switch (diff) {
    case 'recognition': return 'Nhận biết';
    case 'understanding': return 'Thông hiểu';
    case 'application': return 'Vận dụng';
  }
};

interface Distribution {
  recognition: number;
  understanding: number;
  application: number;
}

const getDistribution = (level: EducationLevel, grade: number): Distribution => {
  if (level === 'primary') {
    if (grade === 1 || grade === 2) {
      return { recognition: 12, understanding: 6, application: 2 };
    }
    return { recognition: 10, understanding: 6, application: 4 };
  }

  if (level === 'middle') {
    return { recognition: 6, understanding: 8, application: 6 };
  }

  return { recognition: 4, understanding: 8, application: 8 };
};

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "Nội dung câu hỏi tiếng Việt (Unicode Math)" },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "4 lựa chọn A, B, C, D (Unicode Math).",
    },
    correctAnswer: { type: Type.STRING, description: "Đáp án đúng (chỉ ký tự 'A', 'B', 'C' hoặc 'D')" },
    explanation: { type: Type.STRING, description: "Giải thích chi tiết (xuống dòng rõ ràng, Unicode Math)" },
    difficulty: { type: Type.STRING, description: "'recognition', 'understanding', hoặc 'application'" }
  },
  required: ["text", "options", "correctAnswer", "explanation", "difficulty"]
};

const arraySchema: Schema = {
  type: Type.ARRAY,
  items: questionSchema
};

// --- CORE GENERATION LOGIC ---

export const generateQuizQuestions = async (
  level: EducationLevel,
  grade: number,
  topic: string
): Promise<Question[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key not found. Please set it in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const dist = getDistribution(level, grade);

  // Helper with Fallback/Retry Logic
  const generateBatch = async (count: number, difficulty: Difficulty, difficultyLabel: string): Promise<Question[]> => {
    if (count === 0) return [];

    // Start with selected model, then fallback through the list
    const preferredModel = getModel();
    // Create a list starting with preferred, then others in order, filtering duplicates
    const modelChain = [preferredModel, ...FALLBACK_ORDER].filter((v, i, a) => a.indexOf(v) === i);

    const prompt = `
      Generate ${count} [${difficulty}] level computer science (Tin học) questions for Grade ${grade} on topic '${topic}' following Vietnamese curriculum.
      
      QUESTION TYPES FOR COMPUTER SCIENCE:
      1. Conceptual questions: definitions, terminology, how things work
      2. Practical application: what happens when you do X, how to achieve Y
      3. Problem-solving: algorithms, coding logic, debugging
      4. True/False about computer concepts
      5. Comparison questions: differences between technologies/methods
      
      CRITICAL FORMATTING RULES:
      1. Questions must be in Vietnamese.
      2. Use technical terms appropriately (can use English terms in parentheses for clarity).
      3. For code-related questions, format code clearly with backticks if needed.
      4. Options should be realistic and plausible choices.
      
      CONTENT GUIDELINES BY LEVEL:
      - Tiểu học (Grade 1-5): Basic computer parts, mouse/keyboard, Paint, Word basics, internet safety, Scratch basics
      - THCS (Grade 6-9): File management, Office suite, algorithms, Python basics, HTML/CSS
      - THPT (Grade 10-12): OOP, databases, web development, advanced programming
      
      ANSWER DISTRIBUTION (IMPORTANT):
      - Ensure that the correct answers are evenly distributed among A, B, C, and D.
      - Avoid making 'A' the correct answer too frequently.
      - For ${count} questions, aim for approximately ${Math.ceil(count / 4)} of each option.
      
      Difficulty Definition for ${difficultyLabel} (${difficulty}):
      - Nhận biết (Recognition): Direct recall of facts, definitions, simple identification.
      - Thông hiểu (Understanding): Explain concepts, describe processes, apply in simple scenarios.
      - Vận dụng (Application): Solve problems, write/debug code, complex scenarios.
      
      Output JSON format:
      [
        { 
          "text": "Question text in Vietnamese...", 
          "options": ["A. ...", "B. ...", "C. ...", "D. ..."], 
          "correctAnswer": "A", 
          "explanation": "- Bước 1: ...\n- Bước 2: ...\n=> Kết luận...", 
          "difficulty": "${difficulty}" 
        }
      ]
    `;

    for (const model of modelChain) {
      try {
        // console.log(`Generating ${difficulty} using model: ${model}`); // Debug
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: arraySchema,
            temperature: 0.7,
          }
        });

        const rawQuestions = JSON.parse(response.text || "[]");
        if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
          throw new Error("Empty or invalid JSON response");
        }

        return rawQuestions.map((q: any, index: number) => ({
          id: `${difficulty}-${index}-${Date.now()}-${Math.random()}`,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer ? q.correctAnswer.replace(/[^ABCD]/g, '').trim() : 'A',
          explanation: q.explanation,
          difficulty: difficulty,
          difficultyLabel: getDifficultyLabel(difficulty)
        }));

      } catch (error: any) {
        console.warn(`Model ${model} failed for ${difficulty}:`, error);
        // Continue to next model in chain
        if (model === modelChain[modelChain.length - 1]) {
          // If this was the last model, throw the error with specific API code if possible
          const errorMsg = error.toString();
          if (errorMsg.includes("429")) throw new Error("429 RESOURCE_EXHAUSTED");
          throw error;
        }
      }
    }

    return []; // Should throw before reaching here if all fail
  };

  // Run in parallel for speed, but each batch has its own internal fallback/retry
  try {
    const [recogQs, underQs, applyQs] = await Promise.all([
      generateBatch(dist.recognition, 'recognition', 'Nhận biết'),
      generateBatch(dist.understanding, 'understanding', 'Thông hiểu'),
      generateBatch(dist.application, 'application', 'Vận dụng')
    ]);

    const allQuestions = [...recogQs, ...underQs, ...applyQs];

    if (allQuestions.length === 0) {
      throw new Error("Không thể tạo câu hỏi. Tất cả các model đều thất bại. Vui lòng kiểm tra API Key và Quota.");
    }

    return allQuestions.sort(() => Math.random() - 0.5);
  } catch (e: any) {
    throw e;
  }
};

// --- CHAT TUTOR SERVICE ---

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
}

export const getChatTutorResponse = async (history: ChatMessage[], newMessage: string, imageBase64?: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return "Vui lòng nhập API Key trong Settings để sử dụng Chat.";

  const ai = new GoogleGenAI({ apiKey });

  const preferredModel = getModel();
  const modelChain = [preferredModel, ...FALLBACK_ORDER].filter((v, i, a) => a.indexOf(v) === i);

  const systemInstruction = `
    VAI TRÒ:
    - Bạn là "Thầy Tin AI", một gia sư Tin học thân thiện, kiên nhẫn và thông thái.
    - Nhiệm vụ: Giúp học sinh hiểu bài, giải đáp câu hỏi về máy tính, lập trình, và công nghệ thông tin.
    - Đối tượng: Học sinh từ lớp 1 đến lớp 12.

    LĨNH VỰC HỖ TRỢ:
    - Tiểu học: Sử dụng máy tính, Paint, Word, Internet an toàn
    - THCS: Office, Scratch, Python cơ bản, HTML/CSS
    - THPT: Lập trình nâng cao, Database, Web development, OOP

    QUY TẮC SƯ PHẠM CHUNG:
    1. Hiểu câu hỏi & Xác nhận.
    2. Phương pháp Socrate: Gợi mở để học sinh tự tư duy.
    3. Giải thích từng bước dễ hiểu.
    4. Đưa ví dụ code nếu cần (giải thích từng dòng).
    5. Luôn tích cực, dùng emoji (👋😊💡🎯💻).

    WORKFLOW Xử LÝ ẢNH (OCR):
    1. Trích xuất văn bản/code từ ảnh.
    2. Nếu mờ -> yêu cầu chụp lại.
    3. Nếu đọc được -> Trả lời theo cấu trúc: 
       ## 📷 Nội dung nhận dạng: ...
       ## ❓ Xác nhận: ...
       ## 📖 Hướng dẫn giải: ...
       ## 💡 Lưu ý: ...
  `;

  const chatHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.text }]
  }));

  let contentParts: any[] = [];
  if (imageBase64) {
    const mimeMatch = imageBase64.match(/^data:([^;]+);base64,/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const cleanBase64 = imageBase64.replace(/^data:([^;]+);base64,/, '');
    contentParts.push({ inlineData: { data: cleanBase64, mimeType: mimeType } });
  }
  contentParts.push({ text: newMessage || "Hãy giải bài này giúp em." });

  for (const model of modelChain) {
    try {
      const chat = ai.chats.create({
        model: model,
        config: { systemInstruction, temperature: 0.7 },
        history: chatHistory
      });

      const result = await chat.sendMessage({ message: { parts: contentParts } });
      return result.text;

    } catch (error) {
      console.warn(`Chat Model ${model} failed:`, error);
      if (model === modelChain[modelChain.length - 1]) {
        const errStr = String(error);
        if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED")) {
          return "⚠️ Hệ thống đang quá tải (Lỗi 429). Vui lòng thử lại sau giây lát hoặc đổi API Key.";
        }
        return `⚠️ Lỗi kết nối: ${errStr}. Vui lòng kiểm tra API Key.`;
      }
    }
  }

  return "Xin lỗi, thầy không thể kết nối ngay lúc này. 😔";
};
