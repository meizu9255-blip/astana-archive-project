import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Archive,
  FileText,
  Clock,
  Users,
  ArrowRight,
  Search,
  FileSearch,
  BookOpen,
} from "lucide-react";
import { useLanguage } from "../LanguageContext";
import DetailsModal from "../components/DetailsModal";

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { icon: Archive, count: "500+", label: t.home.statFunds },
    { icon: FileText, count: "100 000+", label: t.home.statDocs },
    { icon: Clock, count: "1997", label: t.home.statYear },
    { icon: Users, count: "10 000+", label: t.home.statRequests },
  ];

  const news = t.home.newsArr;

  const services = [
    {
      icon: FileSearch,
      title: t.home.servicesArr[0].title,
      desc: t.home.servicesArr[0].desc,
      fullText: t.home.servicesArr[0].fullText,
    },
    {
      icon: Search,
      title: t.home.servicesArr[1].title,
      desc: t.home.servicesArr[1].desc,
      fullText: t.home.servicesArr[1].fullText,
    },
    {
      icon: BookOpen,
      title: t.home.servicesArr[2].title,
      desc: t.home.servicesArr[2].desc,
      fullText: t.home.servicesArr[2].fullText,
    },
  ];

  const [selectedItem, setSelectedItem] = useState(null);

  const [typedTitle, setTypedTitle] = useState("");
  const fullTitle = t.home.title;

  useEffect(() => {
    let i = 0;
    setTypedTitle("");
    const interval = setInterval(() => {
      setTypedTitle(fullTitle.substring(0, i));
      i++;
      if (i > fullTitle.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [fullTitle]);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative bg-brand-blue text-white overflow-hidden py-32 lg:py-48">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/90 to-transparent z-10"></div>

          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold to-transparent"></div>
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              {typedTitle}
              <span className="animate-pulse">|</span> <br />
              <span className="text-brand-gold">{t.home.subtitle}</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl leading-relaxed">
              {t.home.desc}
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/funds"
                className="bg-brand-gold text-brand-dark px-8 py-4 rounded-lg font-bold text-center hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                {t.home.btnCatalog}
              </Link>
              <Link
                to="/services"
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-lg font-bold text-center hover:bg-white/20 transition-all"
              >
                {t.home.btnRequest}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-slate-800 relative z-30 -mt-10 mx-4 sm:mx-6 lg:mx-8 rounded-2xl shadow-xl max-w-7xl lg:mx-auto transition-colors duration-300">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 group"
            >
              <div className="bg-brand-light dark:bg-slate-700 p-4 rounded-full mb-4 group-hover:bg-brand-gold/10 transition-colors">
                <stat.icon className="h-8 w-8 text-brand-blue dark:text-brand-cyan group-hover:text-brand-gold transition-colors" />
              </div>
              <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">
                {stat.count}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
              {t.home.popularServices}
            </h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-700 group"
              >
                <div className="bg-brand-blue/5 dark:bg-slate-700 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-brand-gold transition-colors">
                  <service.icon className="h-8 w-8 text-brand-blue dark:text-brand-cyan group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  {service.desc}
                </p>
                <button
                  onClick={() =>
                    setSelectedItem({ type: "service", data: service })
                  }
                  className="inline-flex items-center text-brand-blue dark:text-brand-cyan font-bold hover:text-brand-gold dark:hover:text-brand-gold transition-colors cursor-pointer"
                >
                  {t.home.readMore} <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
                {t.home.latestNews}
              </h2>
              <div className="w-24 h-1 bg-brand-gold rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {news.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-8 hover:bg-brand-blue dark:hover:bg-brand-blue transition-colors group cursor-pointer border border-slate-100 dark:border-slate-700"
              >
                <div className="text-sm font-bold text-brand-gold mb-3">
                  {item.date}
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-white mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 group-hover:text-white/80 mb-6 line-clamp-3">
                  {item.description}
                </p>
                <button
                  onClick={() => setSelectedItem({ type: "news", data: item })}
                  className="inline-flex items-center text-sm font-bold text-brand-blue dark:text-brand-cyan group-hover:text-brand-gold transition-colors cursor-pointer"
                >
                  {t.home.readMore} <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DetailsModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.data?.title || ""}
        meta={selectedItem?.type === "news" ? selectedItem.data.date : ""}
        content={selectedItem?.data?.fullText || ""}
        icon={
          selectedItem?.type === "service" ? selectedItem.data.icon : undefined
        }
      />
    </div>
  );
}
