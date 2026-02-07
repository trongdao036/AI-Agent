import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Card, { CardHeader, CardBody } from './components/common/Card';
import Badge from './components/common/Badge';
import Button from './components/common/Button';
import LearningSpace from './pages/student/LearningSpace';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import Analytics from './pages/student/Analytics'; // Import trang Analytics

// --- Component Dashboard Học Viên ---
const DashboardPage = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Xin chào, Huy Đỗ 👋</h1>
        <p className="text-gray-500">Hôm nay cậu muốn học gì nào?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card hover onClick={() => navigate('/learn')}>
          <CardHeader>
            <h3 className="font-bold text-lg text-gray-800">Python & AI Agent</h3>
            <Badge variant="ai">AI POWERED</Badge>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-gray-500 text-sm">Tiến độ học tập của cậu đang rất tốt.</p>
            <Button className="w-full" onClick={(e) => {
              e.stopPropagation();
              navigate('/learn');
            }}>
              Tiếp tục học
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

// --- App Component Chính ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Route TRANG CHỦ (Chỉ hiện Dashboard) */}
        <Route path="/" element={
          <MainLayout>
            <DashboardPage />
          </MainLayout>
        } />

        {/* 2. Route KẾT QUẢ/THỐNG KÊ (Chỉ hiện Analytics) */}
        <Route path="/analytics" element={
          <MainLayout>
            <Analytics />
          </MainLayout>
        } />
        
        {/* 3. Route GÓC HỌC TẬP (Full màn hình) */}
        <Route path="/learn" element={<LearningSpace />} />

        {/* 4. Route GIÁO VIÊN */}
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