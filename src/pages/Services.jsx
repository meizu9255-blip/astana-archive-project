import React, { useState } from 'react';
import { FileText, Send, CheckCircle, AlertCircle, Paperclip, Search, CreditCard, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Services() {
  const { t } = useLanguage();
  const s = t.services;

  const [formData, setFormData] = useState({
    fullName: '',
    iin: '',
    email: '',
    phone: '',
    type: '',
    query: '',
    file: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [postError, setPostError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = s.errors.fio;
    if (!/^\d{12}$/.test(formData.iin)) newErrors.iin = s.errors.iin;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = s.errors.email;
    if (!formData.phone.trim()) newErrors.phone = s.errors.phone;
    if (!formData.type) newErrors.type = s.errors.type;
    if (!formData.query.trim()) newErrors.query = s.errors.query;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setPostError('');
      try {
        const orderData = {
          fullName: formData.fullName,
          iin: formData.iin,
          email: formData.email,
          phone: formData.phone,
          type: formData.type,
          query: formData.query,
          id: `AST-2026-${Math.floor(Math.random() * 9000) + 1000}`,
          date: new Date().toISOString(),
          status: 'received'
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderData)
        });

        if (!res.ok) throw new Error('Server error');

        setShowSuccess(true);
        setFormData({ fullName: '', iin: '', email: '', phone: '', type: '', query: '', file: null });
      } catch (err) {
        setPostError(s.postError);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-900 min-h-screen relative transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">{s.title}</h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{s.desc}</p>
        </div>

        {/* Стандартная форма */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden mt-12 transition-colors duration-300">
          <div className="bg-brand-blue dark:bg-slate-950 p-6 text-white flex items-center space-x-3">
            <FileText className="h-8 w-8 text-brand-gold" />
            <div>
              <h2 className="text-xl font-bold">{s.formTitle}</h2>
              <p className="text-sm text-white/80">{s.formDesc}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{s.fioLabel}</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={s.fioPlaceholder}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-brand-blue'} focus:outline-none focus:ring-2 bg-slate-50 dark:bg-slate-700 dark:text-slate-100 transition-colors`}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{s.iinLabel}</label>
                <input
                  type="text"
                  name="iin"
                  value={formData.iin}
                  onChange={handleChange}
                  maxLength="12"
                  placeholder={s.iinPlaceholder}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.iin ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-brand-blue'} focus:outline-none focus:ring-2 bg-slate-50 dark:bg-slate-700 dark:text-slate-100 transition-colors`}
                />
                {errors.iin && <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.iin}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{s.emailLabel}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={s.emailPlaceholder}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-brand-blue'} focus:outline-none focus:ring-2 bg-slate-50 dark:bg-slate-700 dark:text-slate-100 transition-colors`}
                />
                {errors.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{s.phoneLabel}</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={s.phonePlaceholder}
                  className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-brand-blue'} focus:outline-none focus:ring-2 bg-slate-50 dark:bg-slate-700 dark:text-slate-100 transition-colors`}
                />
                {errors.phone && <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.phone}</p>}
              </div>

            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{s.typeLabel}</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${errors.type ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-brand-blue'} focus:outline-none focus:ring-2 bg-slate-50 dark:bg-slate-700 dark:text-slate-100 transition-colors`}
              >
                <option value="">{s.errors.type}</option>
                {s.typeOptions.map((opt, i) => (
                  <option key={i} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.type && <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{s.queryLabel}</label>
              <textarea
                name="query"
                value={formData.query}
                onChange={handleChange}
                rows="4"
                placeholder={s.queryPlaceholder}
                className={`w-full px-4 py-3 rounded-xl border ${errors.query ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600 focus:ring-brand-blue'} focus:outline-none focus:ring-2 bg-slate-50 dark:bg-slate-700 dark:text-slate-100 resize-none transition-colors`}
              ></textarea>
              {errors.query && <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/>{errors.query}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{s.fileLabel}</label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Paperclip className="w-8 h-8 mb-3 text-slate-400 dark:text-slate-500" />
                    <p className="mb-2 text-sm text-slate-500 dark:text-slate-400"><span className="font-semibold">{s.fileHint1}</span></p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.fileHint2}</p>
                  </div>
                  <input type="file" className="hidden" onChange={(e) => setFormData({...formData, file: e.target.files[0]})} />
                </label>
              </div>
              {formData.file && <p className="mt-2 text-sm text-brand-blue dark:text-brand-cyan font-semibold flex items-center"><CheckCircle className="w-4 h-4 mr-1"/> {s.fileAttached} {formData.file.name}</p>}
            </div>

            <div className="pt-4 border-t border-slate-100">
              {postError && <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm text-center font-semibold">{postError}</div>}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-8 py-4 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-dark transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {s.submitting}
                  </span>
                ) : (
                  <>{s.submitBtn} <Send className="ml-2 h-5 w-5" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative animate-in fade-in zoom-in duration-300">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-2">{s.successTitle}</h3>
            <p className="text-slate-600 mb-6">
              {s.successNum} <br/>
              <span className="text-brand-blue font-bold text-lg inline-block mt-2 px-4 py-1 bg-brand-blue/10 rounded-lg">AST-2026-{(Math.floor(Math.random() * 9000) + 1000)}</span>
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-sm text-amber-800 text-left">
              <strong>{s.successWarning}</strong>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-brand-blue text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors"
            >
              {s.closeBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
