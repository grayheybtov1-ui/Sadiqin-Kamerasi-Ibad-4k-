'use client';

import React, { useEffect, useRef, useState } from 'react';

const CameraDetector = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'detected'>('idle');

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
        setStatus('scanning');
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Kameraya giriş icazəsi verilmir və ya kamera tapılmadı.");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
      setStatus('idle');
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative aspect-video rounded-3xl overflow-hidden glass-card bg-black/40 group">
        {!isActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 mb-4 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Detektor Hazırdır</h3>
            <p className="text-blue-200/60 mb-6 text-sm">Scan etmək üçün kameranı işə salın</p>
            <button 
              onClick={startCamera}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] active:scale-95"
            >
              Kameranı Başlat
            </button>
          </div>
        ) : (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="scan-line" />
            
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full glass bg-black/40">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-white tracking-wider uppercase">LIVE SCANNING</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="p-3 rounded-2xl glass bg-black/60 max-w-[200px]">
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Status</p>
                <p className="text-xs text-white/80 leading-tight">Sistem aktivdir. Obyektlər analiz edilir...</p>
              </div>
              
              <button 
                onClick={stopCamera}
                className="w-12 h-12 flex items-center justify-center rounded-full glass bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-all border border-red-500/30"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </>
        )}
        
        {error && (
          <div className="absolute inset-x-0 bottom-0 p-4 bg-red-500/90 text-white text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraDetector;
