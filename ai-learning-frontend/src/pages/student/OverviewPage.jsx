import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, BrainCircuit, ArrowRight, ShieldCheck } from 'lucide-react';
import Card from '../../components/common/Card';

const OverviewPage = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <Sparkles className="text-yellow-300" /> Xin chào, Huy Đỗ!
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed">
            Chào mừng bạn đến với hệ thống <strong>AI Learning</strong>. 
            Tại đây, bạn có thể biến mọi tài liệu PDF thành bài giảng tương tác và bài kiểm tra trắc nghiệm chỉ trong vài giây.
          </p>
          <button 
            onClick={() => navigate('/library')}
            className="mt-4 bg-white text-indigo-700 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-yellow-300 hover:text-indigo-900 transition-all flex items-center gap-2 transform hover:scale-105"
          >
            Vào Thư Viện Bài Giảng <ArrowRight size={20} />
          </button>
        </div>
        
        {/* Hình minh họa (Icon lớn) */}
        <div className="hidden md:block bg-white/10 p-6 rounded-full backdrop-blur-sm">
          <BrainCircuit size={120} className="text-white opacity-90" />
        </div>
      </div>

      {/* 2. Tính năng nổi bật (Giới thiệu) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="hover:shadow-lg transition-shadow border-t-4 border-indigo-500">
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto text-indigo-600">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Học tập thông minh</h3>
            <p className="text-gray-500">
              Tải lên tài liệu của bạn. Hệ thống sẽ tự động đọc hiểu và tóm tắt nội dung chính.
            </p>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-t-4 border-purple-500">
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto text-purple-600">
              <BrainCircuit size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Trợ giảng AI</h3>
            <p className="text-gray-500">
              Chat trực tiếp với tài liệu. Hỏi bất cứ điều gì, AI sẽ trả lời dựa trên nội dung bạn cung cấp.
            </p>
          </div>
        </Card>

        <Card className="hover:shadow-lg transition-shadow border-t-4 border-green-500">
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto text-green-600">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Luyện thi Tự động</h3>
            <p className="text-gray-500">
              Chỉ cần một nút bấm, AI sẽ sinh ra bộ đề trắc nghiệm ngẫu nhiên để bạn ôn tập.
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Thống kê nhanh (Optional) */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">Thống kê hoạt động</h2>
        <div className="flex gap-10">
            <div>
                <span className="text-3xl font-bold text-indigo-600">12</span>
                <p className="text-gray-500 text-sm">Tài liệu đã học</p>
            </div>
            <div>
                <span className="text-3xl font-bold text-green-600">85%</span>
                <p className="text-gray-500 text-sm">Điểm trung bình</p>
            </div>
        </div>
      </div>

    </div>
  );
};

export default OverviewPage;