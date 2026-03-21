import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gray-800 bg-gray-900/90 shadow-2xl backdrop-blur-xl"
          >

            <div className="flex flex-col items-center p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                <AlertCircle size={32} />
              </div>
              
              <h3 className="mb-2 text-2xl font-bold text-white">{title || "Are you sure?"}</h3>
              <p className="text-gray-400">
                {message || "This action cannot be undone. Do you want to proceed?"}
              </p>
            </div>


            <div className="flex border-t border-gray-800">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-4 text-sm font-bold text-gray-400 transition-colors hover:bg-gray-800/50 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="flex-1 bg-red-600 px-4 py-4 text-sm font-bold text-white transition-all hover:bg-red-500 active:scale-95"
              >
                Confirm Delete
              </button>
            </div>


            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 transition-colors hover:text-white"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
