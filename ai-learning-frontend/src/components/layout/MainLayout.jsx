import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-slate-800 overflow-hidden">
      {/* 1. Sidebar cố định bên trái */}
      <Sidebar />

      {/* 2. Khu vực bên phải (Header + Nội dung) */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {/* Nội dung chính sẽ thay đổi ở đây */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;