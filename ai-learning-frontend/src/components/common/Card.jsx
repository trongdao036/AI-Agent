import React from 'react';
import { cn } from '../../lib/utils';

const Card = ({ children, className, hover = false }) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden",
        hover && "transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer", // Hiệu ứng nổi khi di chuột
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={cn("px-6 py-4 border-b border-gray-50 flex items-center justify-between", className)}>
    {children}
  </div>
);

export const CardBody = ({ children, className }) => (
  <div className={cn("p-6", className)}>
    {children}
  </div>
);

export default Card;