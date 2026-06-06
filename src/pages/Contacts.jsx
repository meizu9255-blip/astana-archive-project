import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Contacts() {
  const { t } = useLanguage();
  const c = t.contacts;

  const [form, setForm] = useState({ name: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.message) {
      setIsSent(true);
      setTimeout(() => {
        setIsSent(false);
        setForm({ name: '', message: '' });
      }, 3000);
    }
  };

  return (
    <div className="py-12 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">{c.title}</h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600 dark:text-slate-400">{c.desc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          
          <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-colors">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">{c.infoTitle}</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-brand-blue/10 dark:bg-slate-700 p-3 rounded-xl shrink-0"><MapPin className="text-brand-blue dark:text-brand-cyan w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{c.addressLabel}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{c.addressVal}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-brand-blue/10 dark:bg-slate-700 p-3 rounded-xl shrink-0"><Phone className="text-brand-blue dark:text-brand-cyan w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{c.phoneLabel}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">+7 (7172) 12-34-56</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-brand-blue/10 dark:bg-slate-700 p-3 rounded-xl shrink-0"><Mail className="text-brand-blue dark:text-brand-cyan w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{c.emailLabel}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">info@archive-astana.kz</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-brand-gold/20 dark:bg-slate-700 p-3 rounded-xl shrink-0"><Clock className="text-brand-dark dark:text-brand-gold w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{c.scheduleLabel}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{c.scheduleVal}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-colors">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">{c.feedbackTitle}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{c.nameLabel}</label>
                <input 
                  type="text" 
                  required
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-cyan focus:border-brand-blue outline-none bg-slate-50 dark:bg-slate-700 dark:text-slate-100 transition-colors"
                  placeholder={c.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{c.msgLabel}</label>
                <textarea 
                  required
                  rows="4"
                  value={form.message}
                  onChange={e => setForm({...form, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-cyan focus:border-brand-blue outline-none bg-slate-50 dark:bg-slate-700 dark:text-slate-100 resize-none transition-colors"
                  placeholder={c.msgPlaceholder}
                ></textarea>
              </div>
              <button 
                type="submit" 
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex justify-center items-center ${isSent ? 'bg-green-500' : 'bg-brand-blue hover:bg-brand-dark'}`}
              >
                {isSent ? (
                  <><CheckCircle className="mr-2 w-5 h-5" /> {c.sentSucc}</>
                ) : (
                  <><Send className="mr-2 w-5 h-5" /> {c.sendBtn}</>
                )}
              </button>
            </form>
          </div>

        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-colors">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 p-4">{c.mapTitle}</h2>
          <div className="w-full h-[400px] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10023.275466827725!2d71.4285434!3d51.130635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4245869389975765%3A0xcb1b593eb423d242!2z0JPQvtGB0YPQtNCw0YDRgdGC0LLQtdC90L3Ri9C5INCw0YDRhdC40LIg0LMuINCQ0YHRgtCw0L3Riw!5e0!3m2!1sru!2skz!4v1700000000000!5m2!1sru!2skz" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
}
