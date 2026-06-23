import React from "react";
import { useLanguage } from "../LanguageContext";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicy() {
  const { lang } = useLanguage();

  const content = {
    ru: {
      title: "Политика конфиденциальности",
      subtitle: "Государственного архива города Астаны",
      intro:
        'Настоящая Политика конфиденциальности описывает, как Государственный архив города Астаны собирает, использует и защищает ваши персональные данные в соответствии с законодательством Республики Казахстан (Закон РК "О персональных данных и их защите").',
      sections: [
        {
          icon: FileText,
          title: "1. Сбор информации",
          text: "Мы собираем минимально необходимый объем персональных данных (ФИО, ИИН, контактные данные) исключительно для оказания государственных архивных услуг и обработки ваших запросов.",
        },
        {
          icon: Shield,
          title: "2. Защита данных",
          text: "Все передаваемые данные шифруются. Мы применяем современные технические и организационные меры для защиты вашей информации от несанкционированного доступа, изменения или уничтожения.",
        },
        {
          icon: Lock,
          title: "3. Неразглашение третьим лицам",
          text: "Государственный архив не передает ваши персональные данные третьим лицам, за исключением случаев, прямо предусмотренных действующим законодательством Республики Казахстан.",
        },
        {
          icon: CheckCircle2,
          title: "4. Согласие пользователя",
          text: "Оставляя заявку на нашем портале, вы даете добровольное согласие на сбор и обработку ваших персональных данных в указанных целях.",
        },
      ],
    },
    kz: {
      title: "Құпиялылық саясаты",
      subtitle: "Астана қаласының Мемлекеттік архиві",
      intro:
        'Осы Құпиялылық саясаты Астана қаласының Мемлекеттік архиві сіздің дербес деректеріңізді Қазақстан Республикасының заңнамасына ("Дербес деректер және оларды қорғау туралы" ҚР Заңы) сәйкес қалай жинайтынын, пайдаланатынын және қорғайтынын сипаттайды.',
      sections: [
        {
          icon: FileText,
          title: "1. Ақпарат жинау",
          text: "Біз мемлекеттік мұрағаттық қызметтерді көрсету және сіздің сұрауларыңызды өңдеу үшін ғана дербес деректердің ең аз қажетті көлемін (Аты-жөні, ЖСН, байланыс деректері) жинаймыз.",
        },
        {
          icon: Shield,
          title: "2. Деректерді қорғау",
          text: "Барлық берілетін деректер шифрланады. Біз сіздің ақпаратыңызды рұқсатсыз кіруден, өзгертуден немесе жоюдан қорғау үшін заманауи техникалық және ұйымдастырушылық шараларды қолданамыз.",
        },
        {
          icon: Lock,
          title: "3. Үшінші тұлғаларға жария етпеу",
          text: "Мемлекеттік мұрағат Қазақстан Республикасының қолданыстағы заңнамасында тікелей көзделген жағдайларды қоспағанда, сіздің дербес деректеріңізді үшінші тұлғаларға бермейді.",
        },
        {
          icon: CheckCircle2,
          title: "4. Пайдаланушының келісімі",
          text: "Біздің порталда өтінім қалдыра отырып, сіз өзіңіздің дербес деректеріңізді көрсетілген мақсаттарда жинауға және өңдеуге өз еркіңізбен келісім бересіз.",
        },
      ],
    },
  };

  const t = content[lang] || content.ru;

  return (
    <div className="py-16 bg-slate-50 dark:bg-slate-900 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 mb-4">
            {t.title}
          </h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto rounded-full mb-6"></div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-blue dark:text-brand-cyan">
            {t.subtitle}
          </h2>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 md:p-12 border border-slate-200 dark:border-slate-700 transition-colors">
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10 text-center">
            {t.intro}
          </p>

          <div className="space-y-8">
            {t.sections.map((section, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-600 hover:shadow-md transition-shadow"
              >
                <div className="bg-brand-blue dark:bg-slate-800 p-4 rounded-full shadow-sm">
                  <section.icon className="w-8 h-8 text-brand-gold" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
