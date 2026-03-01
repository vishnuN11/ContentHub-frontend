import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { useSubscription } from '../contexts/SubscriptionContext';
import SubscribeModal from '../components/SubscribeModal';

// PDF.js worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function PdfViewPage() {
  const { pdfId } = useParams();
  const navigate = useNavigate();
  const { requestDownload, canDownload } = useSubscription();
  
  const [pdf, setPdf] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPdfDetails();
  }, [pdfId]);

  const fetchPdfDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/pdf/${pdfId}/details`);
      setPdf(response.data);
    } catch (error) {
      setError('PDF details not found');
    } finally {
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400 text-lg">{error}</p>
        <button
          onClick={() => navigate('/pdfs')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="bg-gray-900 p-4 rounded-t-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{pdf?.title || 'PDF Viewer'}</h1>
          <p className="text-sm text-gray-400">
            {pdf?.category} • {pdf?.language} • {(pdf?.size / 1024).toFixed(2)} KB
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => requestDownload(pdfId, pdf?.title)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {canDownload() ? '📥 Download' : '🔒 Subscribe to Download'}
          </button>

          <button
            onClick={() => navigate('/pdfs')}
            className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="bg-gray-900 p-6 rounded-b-xl">
        <div className="bg-gray-800 rounded-lg overflow-auto max-h-[70vh]">
          <Document
            file={`http://localhost:5000/api/pdf/${pdfId}`}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            }
          >
            <Page pageNumber={pageNumber} />
          </Document>
        </div>

        {/* Page Navigation */}
        {numPages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
              disabled={pageNumber <= 1}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Previous
            </button>
            
            <span className="text-gray-400">
              Page {pageNumber} of {numPages}
            </span>
            
            <button
              onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages))}
              disabled={pageNumber >= numPages}
              className="bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      <SubscribeModal />
    </div>
  );
}

export default PdfViewPage;