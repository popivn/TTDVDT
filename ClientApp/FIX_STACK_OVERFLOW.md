# Hướng dẫn sửa lỗi STATUS_STACK_OVERFLOW

## Nguyên nhân
Tailwind CSS v4 (4.1.17) không tương thích với Angular build system, gây ra stack overflow.

## Giải pháp

### Bước 1: Gỡ Tailwind CSS v4
```bash
npm uninstall tailwindcss
```

### Bước 2: Cài đặt Tailwind CSS v3
```bash
npm install -D tailwindcss@^3.4.1
```

### Bước 3: Bật lại Tailwind trong styles.css
Mở `src/styles.css` và uncomment:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Bước 4: Rebuild
```bash
npm run build
```

## Lưu ý
- Tailwind CSS v4 vẫn đang trong giai đoạn alpha/beta và chưa ổn định với Angular
- Nên sử dụng Tailwind CSS v3.x cho đến khi v4 chính thức release

