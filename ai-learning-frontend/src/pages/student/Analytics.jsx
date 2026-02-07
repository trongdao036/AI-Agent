import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { Trophy, TrendingUp, Clock, Target } from 'lucide-react';
import Card from '../../components/common/Card';

const Analytics = () => {
  // Dữ liệu giả lập cho biểu đồ tiến bộ (Progress Score)
  const progressData = [
    { name: 'Ngày 1', score: 65 },
    { name: 'Ngày 2', score: 68 },
    { name: 'Ngày 3', score: 75 },
    { name: 'Ngày 4', score: 72 },
    { name: 'Ngày 5', score: 85 },
    { name: 'Hôm nay', score: 90 },
  ];

  // Dữ liệu giả lập cho biểu đồ kỹ năng (Learner Profile)
  const skillData = [
    { subject: 'Tư duy Logic', A: 120, fullMark: 150 },
    { subject: 'Lập trình', A: 98, fullMark: 150 },
    { subject: 'Toán học', A: 86, fullMark: 150 },
    { subject: 'Tiếng Anh', A: 99, fullMark: 150 },
    { subject: 'Kiến thức AI', A: 85, fullMark: 150 },
    { subject: 'Gỡ lỗi (Debug)', A: 65, fullMark: 150 },
  ];

  return (
    <div className="space-y-8">
      {/* 1. Header & Điểm số tổng quan */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Đánh giá năng lực 📊</h1>
        <p className="text-gray-500">Evaluation Agent đã phân tích quá trình học tập của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {/* Card điểm tổng kết (Công thức trong đề tài) */}
         <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
            <div className="flex justify-between items-start mb-4">
               <div className="bg-white/20 p-2 rounded-lg"><Trophy size={24} className="text-yellow-300" /></div>
               <span className="text-indigo-100 text-xs font-bold bg-white/10 px-2 py-1 rounded">Excellent</span>
            </div>
            <p className="text-indigo-100 text-sm mb-1">Điểm đánh giá chung</p>
            <h2 className="text-4xl font-bold">8.5<span className="text-lg opacity-60">/10</span></h2>
            <p className="text-xs text-indigo-200 mt-4 opacity-80">*Dựa trên 50% Test + 30% Nỗ lực</p>
         </div>

         {/* Các chỉ số phụ */}
         {[
            { label: 'Thời gian học', val: '24h', icon: <Clock className="text-blue-500" />, sub: '+2h hôm qua' },
            { label: 'Bài tập đã làm', val: '15', icon: <Target className="text-green-500" />, sub: 'Tỷ lệ đúng 80%' },
            { label: 'Tiến bộ', val: '+15%', icon: <TrendingUp className="text-rose-500" />, sub: 'So với tuần trước' },
         ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-500 text-sm font-medium">{item.label}</span>
                  <div className="bg-gray-50 p-2 rounded-lg">{item.icon}</div>
               </div>
               <div>
                  <h3 className="text-2xl font-bold text-gray-800">{item.val}</h3>
                  <p className="text-xs text-green-600 font-medium mt-1">{item.sub}</p>
               </div>
            </div>
         ))}
      </div>

      {/* 2. Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Biểu đồ tiến độ (Line Chart) */}
         <Card>
            <div className="p-6 border-b border-gray-50">
               <h3 className="font-bold text-gray-800">Lộ trình thăng tiến</h3>
               <p className="text-sm text-gray-400">Điểm số qua các bài kiểm tra gần đây</p>
            </div>
            <div className="p-6 h-80">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={progressData}>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                     <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                     <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} />
                     <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={3} dot={{r: 4, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Biểu đồ kỹ năng (Radar Chart) */}
         <Card>
            <div className="p-6 border-b border-gray-50">
               <h3 className="font-bold text-gray-800">Bản đồ kỹ năng</h3>
               <p className="text-sm text-gray-400">Được phân tích bởi Learner Profiling Agent</p>
            </div>
            <div className="p-6 h-80 flex justify-center items-center bg-gray-50/30">
               <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                     <PolarGrid stroke="#e5e7eb" />
                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 11, fontWeight: 600 }} />
                     <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                     <Radar name="My Skill" dataKey="A" stroke="#8b5cf6" strokeWidth={2} fill="#8b5cf6" fillOpacity={0.3} />
                  </RadarChart>
               </ResponsiveContainer>
            </div>
         </Card>
      </div>
    </div>
  );
};

export default Analytics;