import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DetailsModal({ isOpen, onClose, title, content, meta, icon: Icon }) {
  // Закрытие по нажатию на Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Блокировка прокрутки фона
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Header */}
            <div className="flex items-start justify-between p-6 md:p-8 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-3 pr-8">
                {Icon && (
                  <div className="bg-brand-gold/20 p-3 rounded-xl flex-shrink-0">
                    <Icon className="text-brand-dark dark:text-brand-gold w-6 h-6" />
                  </div>
                )}
                <div>
                  <h2 id="modal-title" className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-tight">
                    {title}
                  </h2>
                  {meta && (
                    <p className="text-sm font-medium text-brand-blue dark:text-brand-cyan mt-1">
                      {meta}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                aria-label="Закрыть"
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
              <div className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                {content}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-brand-blue dark:bg-brand-cyan text-white dark:text-brand-dark font-bold rounded-lg hover:bg-blue-700 dark:hover:bg-cyan-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
