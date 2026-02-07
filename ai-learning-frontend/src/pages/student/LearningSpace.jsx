import React, { useState } from 'react';
import { ChevronLeft, MessageSquare, BookOpen, CheckCircle, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';

const LearningSpace = () => {
  const [activeTab, setActiveTab] = useState('quiz'); // 'quiz' hoặc 'chat'

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden font-sans text-slate-800">
      
      {/* 1. HEADER RIÊNG CHO TRANG HỌC (Gọn gàng hơn) */}
      <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="px-2">
                <ChevronLeft size={20} />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
             <h1 className="font-bold text-gray-800 truncate text-lg">Bài 1: Tổng quan về AI Agent</h1>
             <Badge variant="ai">Adaptive Mode</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
           <span className="hidden md:inline">Thời gian học:</span> 
           <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">12:45</span>
        </div>
      </header>

      {/* 2. KHUNG CHÍNH (Split Layout) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* === CỘT TRÁI: NỘI DUNG BÀI HỌC (60%) === */}
        <div className="w-[60%] h-full flex flex-col border-r border-gray-200 bg-gray-50">
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="max-w-3xl mx-auto bg-white p-10 rounded-2xl shadow-sm min-h-full border border-gray-100">
              {/* Giả lập nội dung tài liệu từ Content Agent */}
              <h1 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">
                Kiến trúc Multi-Agent System (MAS)
              </h1>
              
              <div className="prose prose-indigo max-w-none text-gray-600 space-y-5 leading-7 text-justify">
                <p>
                  <strong>Hệ đa tác tử (MAS)</strong> là một hệ thống bao gồm nhiều tác tử thông minh tương tác với nhau để giải quyết các vấn đề phức tạp mà một tác tử đơn lẻ khó có thể thực hiện được.
                </p>
                
                <div className="bg-indigo-50 p-5 rounded-xl border-l-4 border-indigo-500 my-6">
                  <h4 className="font-bold text-indigo-900 flex items-center gap-2 mb-2">
                    <BrainCircuit size={18} />
                    Ghi nhớ cốt lõi
                  </h4>
                  <p className="text-indigo-800 text-sm">
                    Mỗi Agent trong hệ thống đóng vai trò như một chuyên gia: Content Agent xử lý dữ liệu, Assessment Agent lo kiểm tra, và Adaptive Agent điều hướng lộ trình.
                  </p>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mt-8">Đặc điểm chính</h3>
                <ul className="space-y-2 list-none pl-0">
                    {[
                        "Tự chủ (Autonomy): Tự đưa ra quyết định.",
                        "Xã hội (Social Ability): Giao tiếp với agent khác.",
                        "Phản ứng (Reactivity): Nhận thức môi trường."
                    ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <CheckCircle size={18} className="text-green-500 mt-1 shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-gray-400 italic mt-8 text-sm text-center">--- Hết trang 1 ---</p>
              </div>
            </div>
          </div>
        </div>

        {/* === CỘT PHẢI: TƯƠNG TÁC (40%) === */}
        <div className="w-[40%] h-full flex flex-col bg-white">
          
          {/* Tabs chuyển đổi */}
          <div className="flex border-b border-gray-200">
             <button 
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'quiz' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 border-transparent hover:bg-gray-50'}`}
             >
                Bài tập (Quiz)
             </button>
             <button 
                onClick={() => setActiveTab('chat')}
                className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'chat' ? 'text-indigo-600 border-indigo-600 bg-indigo-50/50' : 'text-gray-500 border-transparent hover:bg-gray-50'}`}
             >
                Hỏi AI Mentor
             </button>
          </div>

          {/* Nội dung Tab */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
             
             {activeTab === 'quiz' ? (
                 <div className="space-y-6">
                    <Card>
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Câu hỏi 1/3</span>
                                <Badge variant="warning">Intermediate</Badge>
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-6">
                                Đặc điểm nào giúp Agent có khả năng giao tiếp với các Agent khác?
                            </h3>
                            
                            <div className="space-y-3">
                                {['Autonomy (Tự chủ)', 'Social Ability (Xã hội)', 'Reactivity (Phản ứng)'].map((opt, i) => (
                                    <label key={i} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-indigo-50 hover:border-indigo-200 transition-all group bg-white">
                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-indigo-500 flex items-center justify-center">
                                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <span className="text-gray-700 font-medium">{opt}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
                                <Button size="lg" className="w-full md:w-auto shadow-lg shadow-indigo-200">
                                    Kiểm tra đáp án
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Feedback mẫu */}
                    <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-xs shrink-0">AI</div>
                        <div>
                            <p className="text-sm text-green-800 font-bold mb-1">Gợi ý từ Adaptive Agent:</p>
                            <p className="text-sm text-green-700 leading-relaxed">Đúng hướng rồi! Social Ability chính là khả năng sử dụng ngôn ngữ chung để đàm phán và phối hợp.</p>
                        </div>
                    </div>
                 </div>
             ) : (
                 <div className="flex flex-col h-full justify-center items-center text-gray-400">
                    <MessageSquare size={48} className="mb-2 opacity-20" />
                    <p>Chức năng Chat đang phát triển...</p>
                 </div>
             )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default LearningSpace;