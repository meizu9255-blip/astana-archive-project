import React from 'react';
import { Building2, Users, FileText, Download, ChevronRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-4">{a.title}</h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-slate-600">{a.desc}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-20">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-lg border border-slate-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-brand-blue/10 p-4 rounded-xl"><Building2 className="text-brand-blue w-8 h-8" /></div>
              <h2 className="text-2xl font-bold text-slate-800">{a.historyTitle}</h2>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>{a.historyText1}</p>
              <p>{a.historyText2}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 group hover:border-brand-gold transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-brand-gold/20 p-3 rounded-xl"><Users className="text-brand-dark w-6 h-6" /></div>
                <h2 className="text-xl font-bold text-slate-800">{a.leadershipTitle}</h2>
              </div>
              <ul className="space-y-3 mt-6">
                {a.leadershipArr.map((person, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-bold text-slate-800">{person.name}</p>
                      <p className="text-sm text-slate-500">{person.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 group hover:border-brand-blue transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-brand-blue/10 p-3 rounded-xl"><FileText className="text-brand-blue w-6 h-6" /></div>
                <h2 className="text-xl font-bold text-slate-800">{a.documentsTitle}</h2>
              </div>
              <ul className="space-y-3 mt-6">
                {a.documentsArr.map((doc, index) => (
                  <li key={index} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors rounded-lg cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-slate-400" />
                      <span className="font-medium text-slate-700">{doc.name}</span>
                    </div>
                    <Download className="w-5 h-5 text-brand-blue" />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
