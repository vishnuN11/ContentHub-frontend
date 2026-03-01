import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';

function SubscribeModal() {
  const { showSubscribeModal, setShowSubscribeModal, selectedPdfForDownload } = useSubscription();
  const navigate = useNavigate();

  if (!showSubscribeModal) return null;

  const handleSubscribe = () => {
    setShowSubscribeModal(false);
    navigate('/subscription', { 
      state: { fromDownload: true, pdf: selectedPdfForDownload }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-xl max-w-md w-full border border-gray-800">
        <h3 className="text-2xl font-bold text-white mb-4">
          📥 Subscription Required
        </h3>
        
        <p className="text-gray-300 mb-6">
          To download this PDF, you need an active subscription. 
          Subscribe now to get unlimited downloads!
        </p>

        {selectedPdfForDownload && (
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-400">Selected PDF:</p>
            <p className="text-white font-semibold">{selectedPdfForDownload.title}</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleSubscribe}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            View Plans
          </button>
          
          <button
            onClick={() => setShowSubscribeModal(false)}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SubscribeModal;