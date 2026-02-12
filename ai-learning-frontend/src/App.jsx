import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, MessageSquare, BrainCircuit, ArrowLeft } from 'lucide-react';

// --- Imports Layout & UI ---
import MainLayout from './components/layout/MainLayout';
import Card, { CardHeader, CardBody } from './components/common/Card';

// --- Imports Các Trang (Pages) ---
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import StudentDashboard from './pages/student/StudentDashboard'; // Trang danh sách bài học
import OverviewPage from './pages/student/OverviewPage';         // Trang tổng quan
import Analytics from './pages/student/Analytics';

// --- Imports Tính Năng AI (Components) ---
import ChatBox from './components/features/chat/ChatBox'; 
import QuizGenerator from './components/features/quiz/QuizGenerator';

// ============================================================================
// COMPONENT: GÓC HỌC TẬP AI (Logic xử lý bài học được chọn)
// ============================================================================
const AIStudySpace = () => {
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' hoặc 'quiz'
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Lấy dữ liệu bài học được truyền từ trang Library
  const currentDoc = location.state?.currentDoc;

  // 2. Nếu chưa chọn bài nào (truy cập thẳng link) -> Đá về Thư viện
  if (!currentDoc) {
    return <Navigate to="/library" replace />;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]"> {/* Chiều cao full trừ header layout */}
      
      {/* HEADER BÀI HỌC */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100 flex justify-between items-center mb-6">
        <div>
          <button 
            onClick={() => navigate('/library')} // Quay lại thư viện
            className="text-gray-500 text-sm flex items-center gap-1 hover:text-indigo-600 mb-1 transition-colors"
          >
            <ArrowLeft size={16} /> Quay lại thư viện
          </button>
          <h1 className="text-2xl font-bold text-indigo-900 flex items-center gap-2">
            <BookOpen className="text-indigo-600" /> {currentDoc.title}
          </h1>
        </div>
        <div className="hidden md:block text-right">
           <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold border border-green-200">
             {/* Hiển thị tên file để debug, sau này có thể ẩn đi */}
             • AI Connected: {currentDoc.filename}
           </span>
        </div>
      </div>
      
      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* CỘT TRÁI: THÔNG TIN TÀI LIỆU */}
        <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
          <Card>
            <CardHeader><h3 className="font-bold text-gray-800">📖 Nội dung chính</h3></CardHeader>
            <CardBody>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {currentDoc.description}
              </p>
            </CardBody>
          </Card>
          
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 text-sm text-blue-800">
            <strong className="block mb-2 text-lg">💡 Gợi ý học tập:</strong>
            <ul className="list-disc pl-4 space-y-2">
              <li>Hỏi AI tóm tắt các ý chính trong bài.</li>
              <li>Yêu cầu giải thích các thuật ngữ khó hiểu.</li>
              <li>Chuyển qua tab <strong>Luyện thi</strong> để AI tự ra đề kiểm tra kiến thức của bạn.</li>
            </ul>
          </div>
        </div>

        {/* CỘT PHẢI: KHUNG TƯƠNG TÁC (Chat & Quiz) */}
        <div className="lg:col-span-2 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs chuyển đổi */}
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-4 font-bold text-center transition-all flex justify-center items-center gap-2 ${
                activeTab === 'chat' 
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-indigo-500'
              }`}
            >
              <MessageSquare size={18}/> Chat Hỏi Đáp
            </button>
            <button 
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-4 font-bold text-center transition-all flex justify-center items-center gap-2 ${
                activeTab === 'quiz' 
                  ? 'text-green-600 border-b-2 border-green-600 bg-green-50/50' 
                  : 'text-gray-500 hover:bg-gray-50 hover:text-green-500'
              }`}
            >
              <BrainCircuit size={18}/> Luyện thi (Quiz)
            </button>
          </div>

          {/* Nội dung Tab */}
          <div className="flex-1 p-4 bg-gray-50/50 overflow-hidden relative">
            {activeTab === 'chat' ? (
              // --- QUAN TRỌNG: Sửa currentDoc.system_filename thành currentDoc.filename ---
              <ChatBox filename={currentDoc.filename} /> 
            ) : (
              // --- QUAN TRỌNG: Sửa currentDoc.system_filename thành currentDoc.filename ---
              <QuizGenerator filename={currentDoc.filename} topicName={currentDoc.title} /> 
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// APP COMPONENT CHÍNH (Routing System)
// ============================================================================
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Route TRANG CHỦ: Hiển thị Tổng Quan (OverviewPage) */}
        <Route path="/" element={
          <MainLayout>
            <OverviewPage />
          </MainLayout>
        } />

        {/* 2. Route THƯ VIỆN: Hiển thị danh sách bài học (StudentDashboard) */}
        <Route path="/library" element={
          <MainLayout>
            <StudentDashboard />
          </MainLayout>
        } />

        {/* 3. Route GÓC HỌC TẬP: Nơi Chat & Làm Quiz */}
        <Route path="/learn" element={
          <MainLayout> 
             <AIStudySpace />
          </MainLayout>
        } />

        {/* 4. Route KẾT QUẢ/THỐNG KÊ */}
        <Route path="/analytics" element={
          <MainLayout>
            <Analytics />
          </MainLayout>
        } />
        
        {/* 5. Route GIÁO VIÊN: Upload & Quản lý */}
        <Route path="/teacher" element={
          <MainLayout>
            <TeacherDashboard />
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;