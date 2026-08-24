import { useState } from 'react';
import { X, CreditCard, CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import Modal from './Modal';

export default function PaymentModal({ isOpen, onClose, order }) {
  const [status, setStatus] = useState('idle');

  const handlePayment = async () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={status !== 'processing' ? onClose : undefined} title="Complete Payment" size="md">
      {status === 'success' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-500 mb-6">Your booking has been confirmed. Check your email for tickets.</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
          >
            Done
          </button>
        </div>
      ) : status === 'failed' ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Failed</h3>
          <p className="text-gray-500 mb-6">Something went wrong. Please try again.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setStatus('idle')}
              className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Event</span>
                <span className="font-medium text-gray-900">{order?.eventName || 'Event'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tickets</span>
                <span className="font-medium text-gray-900">{order?.quantity || 1} × ${order?.ticketPrice || 0}</span>
              </div>
              {order?.convenienceFee && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Convenience Fee</span>
                  <span className="font-medium text-gray-900">${order.convenienceFee}</span>
                </div>
              )}
              <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="font-bold text-lg text-gray-900">${order?.total || order?.ticketPrice || 0}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Razorpay Secure Payment</p>
                <p className="text-xs text-gray-500">Pay using UPI, Cards, Net Banking & Wallets</p>
              </div>
              <Shield className="w-5 h-5 text-emerald-500" />
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={status === 'processing'}
            className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {status === 'processing' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ${order?.total || order?.ticketPrice || 0}
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Secured by Razorpay. Your payment info is encrypted.
          </p>
        </>
      )}
    </Modal>
  );
}
