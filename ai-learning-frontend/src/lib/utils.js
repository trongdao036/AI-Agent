// Hàm này giúp nối chuỗi class và xử lý logic điều kiện gọn hơn
export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}