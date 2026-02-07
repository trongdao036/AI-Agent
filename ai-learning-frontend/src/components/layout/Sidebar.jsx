import React from 'react';
import { NavLink } from 'react-router-dom';
// 👇 Thêm 'Users' vào dòng import này
import { LayoutDashboard, BookOpen, BarChart2, Settings, LogOut, Users } from 'lucide-react';
import { cn } from '../../lib/utils';

const Sidebar = () => {
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Tổng quan', path: '/' },
    { icon: <BookOpen size={20} />, label: 'Góc học tập', path: '/learn' },
    { icon: <BarChart2 size={20} />, label: 'Kết quả', path: '/analytics' },
    
    // 👇 THÊM DÒNG NÀY ĐỂ HIỆN NÚT GIÁO VIÊN
    { icon: <Users size={20} />, label: 'Khu vực Giáo viên', path: '/teacher' },

    { icon: <Settings size={20} />, label: 'Cài đặt', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full shrink-0">
      <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-50">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-indigo-200 shadow-md">
          <span className="text-white font-bold text-lg">AI</span>
        </div>
        <span className="text-xl font-bold text-gray-800 tracking-tight">Learning<span className="text-indigo-600">.io</span></span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium",
              isActive 
                ? "bg-indigo-50 text-indigo-600 shadow-sm" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50">
        <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full rounded-xl transition-colors font-medium">
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;