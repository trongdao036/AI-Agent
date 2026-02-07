import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ children, variant = 'default', className }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100", // Xanh lá dịu
    warning: "bg-amber-50 text-amber-700 border border-amber-100",       // Vàng cam
    danger: "bg-rose-50 text-rose-700 border border-rose-100",           // Đỏ hồng
    ai: "bg-gradient-to-r from-violet-100 to-fuchsia-100 text-violet-800 border border-violet-200", // Màu dành riêng cho AI
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;