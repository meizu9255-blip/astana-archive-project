import React, { useState, useRef } from 'react';
import { useLanguage } from '../LanguageContext';

export default function DocumentViewer() {
  const { t } = useLanguage();
  const f = t.funds;

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const imgRef = useRef(null);

  // Изображение старой рукописи
  const imageUrl = "/manuscript.jpg";
  const MAGNIFIER_SIZE = 250;
  const ZOOM_LEVEL = 2;

  const handleMouseMove = (e) => {
    if (!imgRef.current) return;
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    if (x >= 0 && y >= 0 && x <= width && y <= height) {
      setShowMagnifier(true);
      setPosition({ x, y });
    } else {
      setShowMagnifier(false);
    }
  };

  return (
    <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-200 mt-12 mb-8 relative z-10 overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 opacity-50 -z-10"></div>
      
      <div className="mb-8 text-center relative z-20">
        <h3 className="text-2xl md:text-3xl font-extrabold text-slate-800">{f.restorerTitle}</h3>
        <div className="w-20 h-1.5 bg-brand-gold mx-auto mt-4 rounded-full group-hover:w-32 transition-all duration-500"></div>
      </div>
      
      <div 
        className="relative overflow-hidden rounded-xl cursor-crosshair max-w-4xl mx-auto shadow-inner bg-slate-200/50 flex items-center justify-center border-4 border-slate-100"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowMagnifier(false)}
        ref={imgRef}
      >
        <img 
          src={imageUrl} 
          alt="Old manuscript" 
          className="w-full max-w-4xl h-96 object-cover mx-auto rounded-lg shadow-lg opacity-90 mix-blend-multiply pointer-events-none"
        />

        {showMagnifier && imgRef.current && (
          <div
            className="absolute pointer-events-none border-2 border-amber-500/80 shadow-xl rounded-full bg-white z-30 transition-transform duration-75 ease-out"
            style={{
              width: `${MAGNIFIER_SIZE}px`,
              height: `${MAGNIFIER_SIZE}px`,
              left: `${position.x - MAGNIFIER_SIZE / 2}px`,
              top: `${position.y - MAGNIFIER_SIZE / 2}px`,
              backgroundImage: `url(${imageUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${imgRef.current.getBoundingClientRect().width * ZOOM_LEVEL}px ${imgRef.current.getBoundingClientRect().height * ZOOM_LEVEL}px`,
              backgroundPosition: `-${position.x * ZOOM_LEVEL - MAGNIFIER_SIZE / 2}px -${position.y * ZOOM_LEVEL - MAGNIFIER_SIZE / 2}px`,
              filter: 'contrast(1.3) grayscale(0.8) brightness(0.95)'
            }}
          />
        )}
      </div>
    </div>
  );
}
