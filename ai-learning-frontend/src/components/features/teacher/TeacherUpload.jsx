import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Type, AlignLeft, CheckCircle, Loader2, X, AlertCircle } from 'lucide-react';

const TeacherUpload = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Dùng ref để reset input file khi xóa
  const fileInputRef = useRef(null);

  // Xử lý khi chọn file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra định dạng PDF
      if (file.type !== 'application/pdf') {
        setError("Chỉ chấp nhận file định dạng .pdf thôi cậu ơi!");
        return;
      }
      // Kiểm tra dung lượng (Ví dụ giới hạn 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("File nặng quá! Tối đa 10MB nhé.");
        return;
      }
      
      setSelectedFile(file);
      setError(""); // Xóa lỗi nếu có trước đó
    }
  };

  // Xử lý xóa file đã chọn
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Cậu chưa chọn tài liệu nào cả!");
      return;
    }

    setLoading(true);
    setSuccess(false);
    setError("");

    const form = e.target;
    const formData = new FormData();
    formData.append("title", form.title.value);
    formData.append("description", form.description.value);
    formData.append("file", selectedFile);

    try {
      // Gọi API Backend (Đúng endpoint đã sửa trong main.py)
      const res = await fetch("http://localhost:8000/teacher/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (data.status === 'success') {
        setSuccess(true);
        // Reset toàn bộ form sau khi thành công
        form.reset();
        removeFile();
        // Tự động tắt thông báo thành công sau 5s
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || "Lỗi server không xác định");
      }
    } catch (err) {
      setError("Không kết nối được Backend. Hãy kiểm tra xem Terminal Python có đang chạy không?");
    } finally {
      setLoading(false);
    }
  };

  return (
    // FIX LAYOUT: w-full để chiếm trọn chiều rộng, bg-white để tránh nền đen
    <div className="w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      
      {/* Header Form */}
      <div className="text-center mb-8 border-b border-gray-100 pb-6">
        <h2 className="text-2xl font-bold text-indigo-900 flex items-center justify-center gap-2">
          <UploadCloud className="text-indigo-600" /> Upload Tài Liệu Mới
        </h2>
        <p className="text-gray-500 mt-2 text-sm">
          Thêm tài liệu vào Kho Tri Thức để AI học và tạo đề thi tự động.
        </p>
      </div>

      {/* Thông báo Thành công */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl flex items-center gap-3 border border-green-200 animate-fade-in-down">
          <CheckCircle className="shrink-0" />
          <div>
            <span className="font-bold">Thành công rực rỡ!</span>
            <p className="text-sm">Content Agent đã nạp kiến thức xong. Cậu có thể kiểm tra trong danh sách.</p>
          </div>
        </div>
      )}

      {/* Thông báo Lỗi */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-200 animate-shake">
          <AlertCircle className="shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Nhập Tiêu đề */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Type size={16} className="text-indigo-500"/> Tiêu đề bài học
          </label>
          <input 
            name="title" 
            required
            placeholder="Ví dụ: Lập trình C++ - Bài 1: Biến và Kiểu dữ liệu"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* 2. Nhập Mô tả */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <AlignLeft size={16} className="text-indigo-500"/> Mô tả nội dung
          </label>
          <textarea 
            name="description" 
            required
            rows="3"
            placeholder="Mô tả ngắn gọn nội dung chính của tài liệu..."
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
          />
        </div>

        {/* 3. Khu vực Upload File (Đã làm đẹp) */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <FileText size={16} className="text-indigo-500"/> Tài liệu PDF
          </label>

          {!selectedFile ? (
            // Trạng thái CHƯA chọn file
            <div 
              className="group relative w-full border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-xl p-8 text-center hover:bg-indigo-50 hover:border-indigo-400 transition-all cursor-pointer"
              onClick={() => fileInputRef.current.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                name="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden" // Ẩn input xấu xí đi
              />
              <div className="bg-white p-3 rounded-full w-fit mx-auto shadow-sm group-hover:scale-110 transition-transform mb-3">
                <UploadCloud className="text-indigo-500" size={32} />
              </div>
              <p className="text-lg font-bold text-indigo-900">Bấm để chọn tài liệu</p>
              <p className="text-sm text-indigo-400 mt-1">Chỉ hỗ trợ file .pdf (Max 10MB)</p>
            </div>
          ) : (
            // Trạng thái ĐÃ chọn file
            <div className="flex items-center justify-between p-4 bg-white border border-indigo-200 rounded-xl shadow-sm ring-1 ring-indigo-50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-50 rounded-lg text-red-500">
                  <FileText size={28} />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={removeFile}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                title="Xóa file này"
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Nút Submit */}
        <button 
          type="submit" 
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-lg flex justify-center items-center gap-2 transition-all transform active:scale-[0.98] ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-200"
          }`}
        >
          {loading ? <Loader2 className="animate-spin" /> : <UploadCloud />}
          {loading ? "AI đang xử lý (15s)..." : "Lưu & Học Tài Liệu"}
        </button>
      </form>
    </div>
  );
};

export default TeacherUpload;