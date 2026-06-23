import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useLanguage } from "../LanguageContext";

export default function GlobalErrorFallback({ error, resetErrorBoundary }) {
  const { lang } = useLanguage();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 text-center border border-slate-200 dark:border-slate-700">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
          {lang === "ru"
            ? "Упс! Что-то пошло не так"
            : "Қап! Бірдеңе дұрыс болмады"}
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          {lang === "ru"
            ? "Произошла непредвиденная ошибка. Мы уже работаем над её устранением."
            : "Күтпеген қате орын алды. Біз оны жою үстіндеміз."}
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-4 mb-6 overflow-x-auto text-left">
            <p className="text-red-500 font-mono text-sm">{error.message}</p>
          </div>
        )}

        <button
          onClick={resetErrorBoundary}
          className="w-full flex justify-center items-center px-6 py-3 bg-brand-blue hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
        >
          <RefreshCw className="w-5 h-5 mr-2" />
          {lang === "ru" ? "Попробовать снова" : "Қайта байқап көру"}
        </button>
      </div>
    </div>
  );
}
