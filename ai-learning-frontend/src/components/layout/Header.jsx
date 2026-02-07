import React from 'react';
import { Bell, Search } from 'lucide-react';
import Button from '../common/Button';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-20">
      {/* Search bar (Trang trí) */}
      <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl w-64">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Tìm kiếm khóa học..." 
          className="bg-transparent border-none focus:outline-none text-sm w-full"
        />
      </div>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="relative rounded-full w-10 h-10 px-0">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </Button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-800">Huy Đỗ</p>
            <p className="text-xs text-gray-500">Sinh viên năm 2</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white cursor-pointer">
            M
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;