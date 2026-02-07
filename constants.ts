import { GradeConfig, ThemeConfig, EducationLevel, DifficultyConfig } from './types';

export const LEVELS: Record<EducationLevel, string> = {
  primary: 'TIỂU HỌC 💻',
  middle: 'THCS 🖥️',
  high: 'THPT 🚀',
};

export const THEMES: Record<EducationLevel, ThemeConfig> = {
  primary: {
    bg: 'bg-[#E3F2FD]', // Soft blue
    primary: 'bg-[#2196F3]',
    primaryHover: 'hover:bg-[#42A5F5]',
    text: 'text-blue-800',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
    gradient: 'from-[#2196F3] to-[#64B5F6]',
  },
  middle: {
    bg: 'bg-[#E8F5E9]', // Green
    primary: 'bg-[#4CAF50]',
    primaryHover: 'hover:bg-[#66BB6A]',
    text: 'text-green-800',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-700',
    gradient: 'from-[#4CAF50] to-[#81C784]',
  },
  high: {
    bg: 'bg-[#FFF3E0]', // Orange
    primary: 'bg-[#FF9800]',
    primaryHover: 'hover:bg-[#FFA726]',
    text: 'text-orange-800',
    border: 'border-orange-200',
    badge: 'bg-orange-100 text-orange-700',
    gradient: 'from-[#FF9800] to-[#FFB74D]',
  },
};

export const DIFFICULTY_CONFIG: Record<string, DifficultyConfig> = {
  recognition: { id: 'recognition', label: 'Nhận biết', color: 'bg-[#66BB6A]', textColor: 'text-white' },
  understanding: { id: 'understanding', label: 'Thông hiểu', color: 'bg-[#FFA726]', textColor: 'text-white' },
  application: { id: 'application', label: 'Vận dụng', color: 'bg-[#EF5350]', textColor: 'text-white' },
};

export const CURRICULUM: Record<EducationLevel, GradeConfig[]> = {
  primary: [
    {
      grade: 1,
      label: 'Lớp 1',
      topics: [
        'Làm quen với máy tính (màn hình, bàn phím, chuột)',
        'Bật và tắt máy tính đúng cách',
        'Sử dụng chuột: click, double-click, kéo thả',
        'Làm quen với bàn phím (phím chữ cái, số)',
        'Vẽ tranh với Paint: vẽ hình cơ bản, tô màu',
        'Lưu và mở file',
        'An toàn khi sử dụng máy tính'
      ]
    },
    {
      grade: 2,
      label: 'Lớp 2',
      topics: [
        'Gõ phím 10 ngón cơ bản (hàng ASDF JKL;)',
        'Gõ tiếng Việt có dấu',
        'Tạo và quản lý thư mục, file',
        'Sao chép, di chuyển, xóa file',
        'Làm quen với Microsoft Word',
        'Gõ văn bản và định dạng chữ cơ bản',
        'Tìm kiếm trên Google an toàn',
        'An toàn trên Internet'
      ]
    },
    {
      grade: 3,
      label: 'Lớp 3',
      topics: [
        'Word nâng cao: bảng biểu, danh sách',
        'Chèn hình ảnh vào văn bản',
        'Làm quen với PowerPoint',
        'Tạo slide đơn giản',
        'Sử dụng Email cơ bản',
        'Paint 3D và vẽ nâng cao',
        'Bảo mật thông tin cá nhân'
      ]
    },
    {
      grade: 4,
      label: 'Lớp 4',
      topics: [
        'PowerPoint nâng cao: animation, transition',
        'Làm quen với Excel: nhập dữ liệu, tính toán đơn giản',
        'Lập trình Scratch cơ bản: kéo thả khối lệnh',
        'Tạo game đơn giản với Scratch',
        'Tìm kiếm và đánh giá thông tin',
        'Thiết kế poster với Canva',
        'Đạo đức khi sử dụng Internet'
      ]
    },
    {
      grade: 5,
      label: 'Lớp 5',
      topics: [
        'Scratch nâng cao: biến, điều kiện, vòng lặp',
        'Tạo game và hoạt hình với Scratch',
        'Excel: công thức SUM, AVERAGE',
        'Tạo biểu đồ đơn giản',
        'Dự án tổng hợp: trình bày về chủ đề tự chọn',
        'Tư duy logic và giải quyết vấn đề',
        'Chuẩn bị cho THCS'
      ]
    }
  ],
  middle: [
    {
      grade: 6,
      label: 'Lớp 6',
      topics: [
        'Thông tin và dữ liệu: khái niệm, phân loại',
        'Số nhị phân và đơn vị đo dữ liệu (Bit, Byte, KB, MB, GB)',
        'Thuật toán là gì? Lưu đồ và mã giả',
        'Scratch: biến, phép toán, cấu trúc rẽ nhánh',
        'Mạng máy tính: LAN, WAN, Internet',
        'Duyệt web hiệu quả và Email nâng cao',
        'Word: định dạng đoạn văn, bảng biểu, Header/Footer',
        'An toàn mạng xã hội'
      ]
    },
    {
      grade: 7,
      label: 'Lớp 7',
      topics: [
        'Excel: hàm SUM, AVERAGE, MAX, MIN, COUNT, IF',
        'Tạo biểu đồ và phân tích dữ liệu',
        'Scratch nâng cao: tạo game phức tạp',
        'PowerPoint nâng cao: thiết kế chuyên nghiệp',
        'Thiết kế đồ họa cơ bản với Canva/Photopea',
        'Chỉnh sửa ảnh và video cơ bản',
        'Quyền sở hữu trí tuệ và bản quyền số'
      ]
    },
    {
      grade: 8,
      label: 'Lớp 8',
      topics: [
        'Python cơ bản: biến, kiểu dữ liệu, nhập/xuất',
        'Cấu trúc điều khiển: if-else, vòng lặp for, while',
        'Hàm trong Python',
        'Xử lý chuỗi và danh sách (list)',
        'Cơ sở dữ liệu: khái niệm DBMS, bảng, trường, bản ghi',
        'Dự án Python đơn giản',
        'Tư duy phản biện với thông tin số'
      ]
    },
    {
      grade: 9,
      label: 'Lớp 9',
      topics: [
        'HTML5: cấu trúc trang web, thẻ cơ bản',
        'CSS3: định dạng, màu sắc, bố cục',
        'Responsive Design cơ bản',
        'JavaScript cơ bản: biến, hàm, sự kiện',
        'DOM manipulation: thao tác với trang web',
        'Thiết kế trang web tĩnh hoàn chỉnh',
        'Dự án web cá nhân'
      ]
    }
  ],
  high: [
    {
      grade: 10,
      label: 'Lớp 10',
      topics: [
        'Kiến trúc máy tính: CPU, RAM, ROM, Storage',
        'Hệ điều hành: Windows, Linux, macOS',
        'Python nâng cao: cấu trúc dữ liệu (List, Tuple, Set, Dictionary)',
        'File I/O: đọc/ghi file text, CSV',
        'Lập trình hướng đối tượng (OOP) cơ bản: Class, Object',
        'SQL cơ bản: SELECT, WHERE, ORDER BY, JOIN',
        'Python kết nối SQLite',
        'HTML5/CSS3 nâng cao: Flexbox, Grid',
        'JavaScript và DOM nâng cao'
      ]
    },
    {
      grade: 11,
      label: 'Lớp 11',
      topics: [
        'JavaScript ES6+: Arrow functions, Modules, Async/Await',
        'React.js cơ bản: Components, State, Props',
        'Backend cơ bản: Node.js/Express hoặc Flask',
        'RESTful API: thiết kế và xây dựng',
        'Kết nối Frontend với Backend',
        'Git và GitHub: quản lý phiên bản code',
        'Triển khai ứng dụng web (Deployment)',
        'Bảo mật ứng dụng web cơ bản'
      ]
    },
    {
      grade: 12,
      label: 'Lớp 12',
      topics: [
        'Full-stack Development: dự án hoàn chỉnh',
        'Database nâng cao: PostgreSQL, MongoDB',
        'Cloud Computing cơ bản: AWS, GCP',
        'AI/ML cơ bản: khái niệm, thư viện Python (scikit-learn)',
        'Phân tích dữ liệu với Pandas và Matplotlib',
        'DevOps cơ bản: CI/CD',
        'Chuẩn bị thi THPT môn Tin học',
        'Định hướng nghề nghiệp IT: các lĩnh vực và xu hướng'
      ]
    }
  ]
};