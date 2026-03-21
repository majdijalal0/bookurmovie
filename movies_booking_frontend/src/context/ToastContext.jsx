import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto rounded-xl shadow-2xl p-4 min-w-[300px] flex items-center justify-between gap-4 backdrop-blur-xl border ${
                toast.type === 'success' 
                  ? 'bg-green-900/80 border-green-500/50 text-green-100' 
                  : toast.type === 'error'
                  ? 'bg-red-900/80 border-red-500/50 text-red-100'
                  : 'bg-gray-800/90 border-gray-600/50 text-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && (
                   <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">✓</div>
                )}
                {toast.type === 'error' && (
                   <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400">!</div>
                )}
                <span className="font-medium text-sm">{toast.message}</span>
              </div>
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-white/50 hover:text-white transition-colors"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
