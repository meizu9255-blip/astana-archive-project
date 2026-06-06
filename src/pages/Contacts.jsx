import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Navigation } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapController({ center }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.flyTo(center, 15, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function Contacts() {
  const { lang, t } = useLanguage();
  const c = t.contacts;

  const [form, setForm] = useState({ name: '', message: '' });
  const [isSent, setIsSent] = useState(false);
  const [activeCenter, setActiveCenter] = useState([51.1466, 71.4465]); // Default middle Astana

  const branches = [
    { 
      id: 1, 
      name: lang === 'ru' ? 'Головной офис' : 'Бас кеңсе', 
      address: 'г. Астана, ул. М. Әуезова, 3', 
      coords: [51.1732, 71.4285], 
      phone: '+7 (7172) 28-07-41' 
    },
    { 
      id: 2, 
      name: lang === 'ru' ? 'Служба комплектования' : 'Жинақтау қызметі', 
      address: 'г. Астана, ул. С. Сейфуллина, 56/2', 
      coords: [51.1705, 71.4190], 
      phone: '+7 (7172) 28-07-42' 
    },
    { 
      id: 3, 
      name: lang === 'ru' ? 'Служба научно-исследовательской работы' : 'Ғылыми-зерттеу жұмысы қызметі', 
      address: 'г. Астана, ул. Калдаякова, 13', 
      coords: [51.1195, 71.4642], 
      phone: '+7 (7172) 28-07-43' 
    },
  ];

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
                <div className="bg-brand-blue/10 dark:bg-slate-700 p-3 rounded-xl shrink-0"><Phone className="text-brand-blue dark:text-brand-cyan w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{c.phoneLabel}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{c.phoneVal}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-brand-blue/10 dark:bg-slate-700 p-3 rounded-xl shrink-0"><Mail className="text-brand-blue dark:text-brand-cyan w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{c.emailLabel}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{c.emailVal}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-brand-gold/20 dark:bg-slate-700 p-3 rounded-xl shrink-0"><Clock className="text-brand-dark dark:text-brand-gold w-6 h-6" /></div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{c.scheduleLabel}</h4>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">{c.scheduleVal}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
                <div className="flex items-start space-x-3">
                  <Mail className="text-brand-blue dark:text-brand-cyan w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="block font-semibold text-slate-700 dark:text-slate-300">{c.techSupportLabel}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{c.techSupportVal}</span>
                  </div>
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

        {/* Интерактивная карта и список филиалов */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-colors">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8">{c.mapTitle}</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
              {branches.map(branch => (
                <div key={branch.id} className="p-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 hover:border-brand-blue dark:hover:border-brand-cyan transition-colors">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{branch.name}</h3>
                  <div className="flex items-start text-slate-600 dark:text-slate-400 text-sm mt-2">
                    <MapPin className="w-4 h-4 mr-2 shrink-0 mt-0.5 text-brand-gold" />
                    <span>{branch.address}</span>
                  </div>
                  <div className="flex items-center text-slate-600 dark:text-slate-400 text-sm mt-1 mb-4">
                    <Phone className="w-4 h-4 mr-2 shrink-0 text-brand-gold" />
                    <span>{branch.phone}</span>
                  </div>
                  <button 
                    onClick={() => setActiveCenter(branch.coords)}
                    className="w-full flex justify-center items-center py-2 px-4 rounded-lg bg-white dark:bg-slate-800 text-brand-blue dark:text-brand-cyan border border-slate-200 dark:border-slate-600 hover:bg-brand-blue hover:text-white dark:hover:bg-brand-cyan dark:hover:text-slate-900 transition-colors text-sm font-semibold shadow-sm"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {lang === 'ru' ? 'Показать на карте' : 'Картадан көрсету'}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="lg:col-span-2 h-[500px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner z-0">
              <MapContainer center={activeCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <MapController center={activeCenter} />
                {branches.map(branch => (
                  <Marker key={branch.id} position={branch.coords}>
                    <Popup>
                      <div className="text-center">
                        <strong className="block text-slate-800 text-base">{branch.name}</strong>
                        <span className="text-slate-600 text-sm">{branch.address}</span>
                        <br />
                        <span className="text-brand-blue font-bold">{branch.phone}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
