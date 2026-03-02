import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";

// ✅ API URL from environment variable with fallback
const API_URL = import.meta.env.VITE_API_BASE_URL
const workerUrl = process.env.NODE_ENV === 'production'
  ? '/pdfjs/pdf.worker.min.js'  
  : new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

export default function ViewerPage() {
  const { id } = useParams();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fullscreen, setFullscreen] = useState(false);
  const navigate = useNavigate();

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1.0);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  const goBack = () => {
    navigate('/pdflist');
  };

  // ✅ योग्य PDF URL (API_URL मध्ये /api आहे)
  const pdfUrl = `${API_URL}/pdf/view/${id}`;
  console.log('Loading PDF from:', pdfUrl);
  console.log('PDF.js version:', pdfjs.version); // Debug

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header with Zoom Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={goBack}
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-white text-sm transition"
              title="Back to PDF List"
            >
              ← Back
            </button>
            <h1 className="text-white font-semibold">📄 PDF Reader</h1>
            <span className="text-gray-400 text-sm">
              Page {pageNumber} of {numPages || '-'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-700/50 rounded-lg p-1">
              <button
                onClick={zoomOut}
                disabled={scale <= 0.5}
                className="p-1.5 hover:bg-gray-600 rounded text-white disabled:opacity-30 transition"
                title="Zoom Out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="text-white text-xs min-w-[45px] text-center">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={zoomIn}
                disabled={scale >= 2.5}
                className="p-1.5 hover:bg-gray-600 rounded text-white disabled:opacity-30 transition"
                title="Zoom In"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={resetZoom}
                className="p-1.5 hover:bg-gray-600 rounded text-white transition ml-1"
                title="Reset Zoom"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-gray-700 rounded-lg text-white transition"
              title="Fullscreen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {fullscreen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20H5v-4m14 0v4h-4M5 14V8h4m10 0v6h-4" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer - Center Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="min-h-full flex items-center justify-center">
          {loading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-gray-400 mt-4">Loading PDF...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-900/50 backdrop-blur-sm border border-red-700 rounded-xl p-6 text-center max-w-md">
              <div className="text-red-400 text-5xl mb-4">📄❌</div>
              <h3 className="text-white font-semibold text-lg mb-2">Failed to Load PDF</h3>
              <p className="text-gray-400 text-sm">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition"
              >
                Try Again
              </button>
            </div>
          )}

          <div className={`transition-all duration-300 ${loading ? 'hidden' : ''}`}>
            <Document
              file={pdfUrl}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setLoading(false);
              }}
              onLoadError={(err) => {
                console.error("PDF load error:", err);
                setError("PDF लोड करताना एरर आली. कृपया पुन्हा प्रयत्न करा.");
                setLoading(false);
              }}
              className="shadow-2xl rounded-lg overflow-hidden"
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="bg-white"
              />
            </Document>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      {numPages > 1 && (
        <div className="bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 px-6 py-3">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <button
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-white text-sm transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>

            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={numPages}
                value={pageNumber}
                onChange={(e) => setPageNumber(parseInt(e.target.value))}
                className="w-48 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-white text-sm min-w-[90px] text-center">
                Page {pageNumber} of {numPages}
              </span>
            </div>

            <button
              onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
              disabled={pageNumber >= numPages}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-white text-sm transition"
            >
              Next
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}