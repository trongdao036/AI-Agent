import React from 'react';
import TeacherUpload from '../../components/features/teacher/TeacherUpload';

const TeacherDashboard = () => {
  return (
    // FIX: Dùng min-h-screen thay vì h-full để tránh bị đen chân trang
    <div className="w-full min-h-[calc(100vh-4rem)] bg-gray-50"> 
      
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            👨‍🏫 Khu vực Giáo viên
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý kho tri thức, upload tài liệu và ngân hàng câu hỏi.
          </p>
        </div>
        
        <div className="flex gap-3">
            <span className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-600 shadow-sm">
              Bài giảng: 12
            </span>
        </div>
      </div>

      {/* Form Upload - Đặt max-width để form gọn gàng ở giữa */}
      <div className="max-w-5xl mx-auto">
         <TeacherUpload />
      </div>
      
    </div>
  );
};

export default TeacherDashboard;