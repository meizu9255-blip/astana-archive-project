import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

export default function UniversalAssistant() {
  const { lang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const initialMsgRu = 'Здравствуйте! Я ваш Архивный помощник. Чем могу помочь?';
  const initialMsgKz = 'Сәлеметсіз бе! Мен сіздің Архив көмекшіңізбін. Қалай көмектесе аламын?';

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'assistant',
      text: lang === 'ru' ? initialMsgRu : initialMsgKz
    }
  ]);

  // Обновляем текст приветствия при переключении языка
  useEffect(() => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === 1) {
        return { ...msg, text: lang === 'ru' ? initialMsgRu : initialMsgKz };
      }
      return msg;
    }));
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const faqs = [
    {
      id: 1,
      q_ru: 'Как заказать справку?',
      q_kz: 'Анықтаманы қалай тапсырыс беруге болады?',
      a_ru: 'Вы можете заказать архивную справку через портал Egov.kz или оставить заявку на нашем сайте в разделе "Услуги и запросы".',
      a_kz: 'Мұрағаттық анықтаманы Egov.kz порталы арқылы немесе біздің сайттың "Қызметтер мен сұраныстар" бөлімінде тапсырыс бере аласыз.'
    },
    {
      id: 2,
      q_ru: 'Где вы находитесь?',
      q_kz: 'Сіздер қайда орналасқансыздар?',
      a_ru: 'Наш адрес: г. Астана, ул. М. Әуезова, 3. Главное здание архива.',
      a_kz: 'Біздің мекенжайымыз: Астана қ., М. Әуезов көшесі, 3. Мұрағаттың бас ғимараты.'
    },
    {
      id: 3,
      q_ru: 'Сколько стоит услуга?',
      q_kz: 'Қызмет қанша тұрады?',
      a_ru: 'Большинство государственных архивных справок предоставляются бесплатно. Подробный прайс-лист можно посмотреть в разделе "Услуги".',
      a_kz: 'Мемлекеттік мұрағаттық анықтамалардың көпшілігі тегін беріледі. Толық бағалар тізімін "Қызметтер" бөлімінен көре аласыз.'
    }
  ];

  const handleAsk = (faq) => {
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: lang === 'ru' ? faq.q_ru : faq.q_kz
    };
    
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: lang === 'ru' ? faq.a_ru : faq.a_kz
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsgText = inputText.trim();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: userMsgText
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsgText })
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();

      const assistantMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: data.reply
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMsg = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: lang === 'ru' 
          ? 'Извините, сервис временно недоступен.' 
          : 'Кешіріңіз, қызмет уақытша қолжетімсіз.'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Закрыть чат" : "Открыть чат"}
        className="fixed bottom-6 right-6 z-50 p-4 bg-brand-blue hover:bg-blue-800 text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-brand-blue/30"
      >
        {isOpen ? <X className="w-8 h-8" aria-hidden="true" /> : <MessageCircle className="w-8 h-8" aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden flex flex-col"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            <div className="bg-brand-blue p-4 flex items-center shadow-md">
              <div className="bg-white/20 p-2 rounded-full mr-3">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  {lang === 'ru' ? 'Архивный помощник' : 'Архив көмекшісі'}
                </h3>
                <p className="text-white/70 text-xs flex items-center">
                  <span className="w-2 h-2 rounded-full bg-green-400 mr-1 animate-pulse"></span>
                  {lang === 'ru' ? 'Онлайн' : 'Желіде'}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50 min-h-[300px]">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-brand-blue text-white rounded-tr-sm' 
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm border border-slate-100 dark:border-slate-600 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-700 p-3 rounded-2xl rounded-tl-sm shadow-sm border border-slate-100 dark:border-slate-600 flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-blue/60 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-brand-blue/60 animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 rounded-full bg-brand-blue/60 animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-semibold uppercase tracking-wider">
                {lang === 'ru' ? 'Частые вопросы:' : 'Жиі қойылатын сұрақтар:'}
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {faqs.map(faq => (
                  <button 
                    key={faq.id}
                    onClick={() => handleAsk(faq)}
                    className="text-xs text-left bg-slate-100 dark:bg-slate-800 hover:bg-brand-blue hover:text-white dark:hover:bg-brand-cyan dark:hover:text-slate-900 text-slate-700 dark:text-slate-300 py-1.5 px-3 rounded-xl transition-colors duration-200"
                  >
                    {lang === 'ru' ? faq.q_ru : faq.q_kz}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <input 
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={lang === 'ru' ? 'Введите ваш вопрос...' : 'Сұрағыңызды енгізіңіз...'}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-sm text-slate-800 dark:text-slate-100 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-cyan transition-shadow border border-transparent focus:border-transparent disabled:opacity-50"
                disabled={isTyping}
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isTyping}
                className="bg-brand-blue hover:bg-blue-800 text-white p-2.5 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
