'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, AlertTriangle, Shield, Activity, Camera, ArrowRight, Bell, Settings, Search, Clock, Menu, X } from 'lucide-react';
import Dashboard from './Dashboard';

// --- Helper Components (Defined before usage to avoid hoisting issues) ---

const StatItem = ({ label, value, color }: any) => (
  <div className="flex justify-between items-end border-b border-white/5 pb-4 last:border-0 last:pb-0">
    <span className="text-xs text-white/40 font-medium">{label}</span>
    <span className={`text-xl font-black ${color}`}>{value}</span>
  </div>
);

const NotificationItem = ({ title, time, severity }: any) => {
  const colors: any = {
    high: 'bg-red-500',
    low: 'bg-yellow-500',
    info: 'bg-blue-500'
  };
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
      <div className={`w-2 h-2 rounded-full ${colors[severity]} ${severity === 'high' ? 'animate-pulse' : ''}`} />
      <div className="flex-1">
        <p className="text-xs font-bold group-hover:text-blue-400 transition-colors">{title}</p>
        <div className="flex items-center gap-1 text-[10px] text-white/30 font-medium">
          <Clock className="w-2.5 h-2.5" /> {time}
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: any) => (
  <div className="flex items-center gap-2">
    <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</span>
  </div>
);

const SectorCard = ({ city, type, status, active = false, onClick }: any) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-2xl border transition-all cursor-pointer ${active ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
  >
    <div className="flex justify-between items-start mb-2">
      <h4 className="text-xs font-black">{city}</h4>
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
    </div>
    <p className="text-[10px] text-white/40 font-bold mb-3">{type}</p>
    <div className="flex items-center justify-between">
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${active ? 'bg-red-500/20 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
        {status}
      </span>
      <Camera className="w-3.5 h-3.5 text-white/20" />
    </div>
  </div>
);

const CityMarker = ({ x, y, city, count, active, onClick }: any) => (
  <g className="cursor-pointer" onClick={onClick}>
    <circle cx={x} cy={y} r="30" fill="transparent" />
    <motion.g
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <circle cx={x} cy={y} r="8" fill={active ? "#ef4444" : "#3b82f6"} className={active ? "animate-pulse" : ""} />
      {active && <circle cx={x} cy={y} r="20" fill="transparent" stroke="#ef4444" strokeWidth="2" className="animate-ping" style={{ pointerEvents: 'none' }} />}
      <foreignObject x={x + 12} y={y - 12} width="140" height="50" style={{ pointerEvents: 'none' }}>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-white bg-black/80 px-2 py-1 rounded-full border border-white/20 backdrop-blur-md shadow-xl whitespace-nowrap">
            {city} {count > 0 && <span className="text-red-400 ml-1">({count})</span>}
          </span>
        </div>
      </foreignObject>
    </motion.g>
  </g>
);

const AzerbaijanMap = ({ onSelectCity, activeViolations }: { onSelectCity: (city: string) => void, activeViolations: any[] }) => {
  return (
    <div className="relative w-full aspect-[4/3] flex items-center justify-center p-4">
      <svg viewBox="0 0 1024 1024" className="w-full h-full drop-shadow-[0_0_30px_rgba(37,99,235,0.2)]">
        <g transform="translate(0.000000,1024.000000) scale(0.100000,-0.100000)" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="20">
          <path d="M6638 9205 c-36 -13 -87 -38 -112 -57 -38 -28 -46 -39 -51 -78 -10 -69 -12 -72 -64 -115 -47 -38 -52 -47 -96 -175 -26 -74 -52 -141 -58 -147 -5 -7 -22 -13 -36 -13 -15 0 -69 -20 -119 -45 -82 -39 -95 -50 -124 -96 -35 -57 -77 -81 -235 -133 -82 -27 -83 -28 -83 -62 0 -27 -6 -36 -29 -48 -17 -9 -31 -27 -35 -43 -4 -15 -18 -65 -32 -110 l-25 -82 -42 -3 -41 -3 -29 -89 -28 -89 33 -34 33 -35 -35 -29 c-19 -16 -51 -32 -72 -35 -37 -6 -48 -22 -48 -71 0 -23 1 -23 -164 -44 l-89 -11 -24 31 c-23 29 -28 31 -94 31 -66 0 -70 -1 -81 -27 -7 -16 -13 -29 -14 -31 -1 -2 -18 0 -38 4 -29 5 -41 14 -56 45 -18 34 -23 37 -52 33 -18 -2 -69 -8 -112 -13 -90 -11 -85 -13 -243 107 -61 45 -75 62 -88 102 -9 26 -25 56 -36 66 -41 37 -99 148 -99 189 0 30 -14 60 -62 137 -68 109 -71 112 -110 122 -25 6 -28 3 -28 -17 0 -17 -12 -32 -40 -51 -22 -14 -44 -26 -49 -26 -23 0 -59 62 -70 121 -12 58 -19 70 -77 131 -35 36 -64 73 -64 82 0 13 -14 16 -84 16 l-83 0 -30 68 c-17 37 -36 90 -43 117 -16 60 -16 61 -60 69 -31 5 -37 2 -55 -24 -19 -28 -24 -30 -84 -30 -54 0 -70 -4 -99 -27 -47 -35 -67 -23 -68 42 -1 44 -3 48 -48 78 -41 26 -56 30 -104 28 -34 -1 -86 7 -127 19 -83 24 -99 25 -92 6 24 -62 20 -79 -47 -171 -36 -49 -71 -98 -78 -108 -8 -11 -34 -21 -66 -26 l-53 -8 -31 39 c-17 22 -34 36 -38 31 -4 -4 -20 -41 -35 -81 l-28 -72 33 -108 c18 -59 44 -126 58 -150 23 -41 27 -43 66 -41 90 4 101 -1 -111 -54 7 -34 5 -37 -15 -37 -20 0 -22 -4 -16 -32 9 -44 26 -68 88 -121 34 -29 87 -59 147 -83 54 -22 111 -54 136 -76 41 -36 46 -38 139 -44 88 -6 99 -10 126 -35 16 -16 41 -29 54 -29 24 0 36 -28 36 -88 0 -14 15 -41 36 -65 l37 -40 -48 -42 -48 -41 7 -65 c4 -35 9 -78 12 -95 l6 -31 -78 -9 -78 -9 -46 -77 c-25 -43 -49 -78 -53 -78 -5 0 -21 9 -37 20 -15 11 -81 38 -146 61 -112 38 -122 44 -167 95 l-49 54 -63 0 c-88 0 -239 -37 -305 -74 -52 -29 -60 -31 -140 -28 -80 4 -90 7 -161 48 -74 43 -78 44 -164 44 l-87 0 -69 61 c-60 53 -69 65 -69 96 0 31 4 36 40 50 22 9 40 19 40 23 0 4 -9 18 -20 32 -16 21 -31 26 -85 31 -40 4 -80 15 -100 27 -20 12 -50 20 -77 20 -40 0 -47 3 -57 28 -9 21 -33 39 -97 70 -46 23 -88 42 -93 42 -6 0 -13 -10 -16 -21 -6 -18 -13 -21 -47 -16 -25 3 -51 16 -68 32 -28 27 -31 27 -105 20 l-76 -7 -25 -50 c-22 -43 -33 -54 -82 -75 -52 -23 -63 -34 -136 -136 -70 -100 -88 -118 -167 -172 -49 -33 -89 -62 -89 -65 0 -3 21 -18 46 -34 25 -16 57 -46 71 -68 l26 -39 -21 -22 -22 -23 32 -24 c30 -22 35 -23 88 -12 31 7 61 12 66 12 20 0 74 -88 74 -118 0 -56 -7 -62 -69 -62 -46 0 -66 -6 -104 -30 -52 -33 -54 -38 -32 -80 14 -27 16 -28 52 -17 21 6 51 20 67 31 l29 19 26 -31 c14 -17 43 -38 64 -47 50 -21 51 -55 2 -85 -41 -25 -42 -29 -13 -65 l21 -27 17 32 c14 27 130 120 150 120 4 0 19 -18 33 -39 l27 -40 87 30 c48 16 91 29 96 29 9 0 4 -52 -10 -108 -5 -23 -4 -23 40 -17 l46 7 17 -41 c13 -33 21 -41 42 -41 15 0 45 -16 73 -40 35 -30 56 -40 82 -40 30 0 35 -4 40 -27 7 -32 -30 -150 -48 -157 -7 -2 -76 -46 -154 -97 -136 -89 -144 -96 -187 -167 l-44 -73 20 -47 c19 -43 28 -52 95 -85 71 -35 75 -39 75 -69 0 -18 -7 -42 -15 -52 -21 -28 -19 -38 21 -90 25 -33 55 -57 106 -82 106 -53 209 -135 238 -188 13 -26 31 -48 40 -51 8 -2 46 -11 85 -20 38 -9 128 -42 200 -74 103 -46 144 -60 198 -65 37 -3 72 -8 78 -12 6 -3 0 -19 -15 -39 -15 -19 -26 -36 -26 -38 0 -2 23 -19 50 -38 39 -26 50 -39 46 -54 -2 -11 -10 -55 -17 -98 -11 -75 -14 -80 -46 -95 -29 -14 -33 -20 -33 -55 0 -31 -13 -61 -61 -139 -34 -54 -64 -97 -68 -95 -3 1 -44 21 -91 44 -85 40 -85 40 -165 32 -44 -4 -110 -8 -147 -8 l-67 -1 25 -74 c25 -74 25 -74 53 -63 23 8 42 5 111 -22 73 -28 90 -31 145 -25 57 6 63 5 67 -12 2 -11 -1 -31 -6 -46 -8 -21 -4 -41 18 -97 27 -69 29 -71 114 -126 87 -56 93 -57 154 -39 12 3 29 -11 57 -49 27 -37 61 -67 105 -93 53 -30 68 -45 77 -74 6 -19 17 -42 24 -50 7 -8 18 -32 25 -53 11 -34 20 -42 76 -68 108 -48 134 -53 207 -40 43 7 91 26 136 51 l71 40 52 -26 c29 -14 73 -46 98 -70 l45 -43 125 -3 c152 -4 160 -13 69 -77 l-61 -43 37 -38 c35 -36 36 -39 18 -49 -11 -5 -36 -8 -56 -4 -29 4 -38 1 -49 -16 -11 -18 -22 -21 -79 -21 -61 0 -68 -2 -83 -26 -16 -24 -16 -29 5 -100 30 -100 67 -134 150 -134 49 0 61 -4 102 -36 26 -20 47 -38 47 -39 0 -1 -7 -20 -16 -40 l-16 -38 51 -51 51 -51 64 3 c57 3 66 1 76 -18 12 -23 14 -22 -70 -43 l-55 -13 -3 -47 c-2 -34 -8 -50 -22 -57 -18 -9 -23 -4 -47 45 -16 32 -34 55 -43 54 -8 0 -40 -8 -70 -17 -41 -13 -56 -23 -58 -38 -6 -39 17 -73 82 -124 110 -86 109 -84 104 -341 -2 -120 0 -219 4 -219 4 0 22 17 40 37 18 20 80 89 139 153 104 115 105 117 118 187 l14 71 98 81 97 81 75 -6 75 -7 82 58 c108 76 207 198 216 265 6 45 7 47 84 88 67 36 80 48 94 83 15 37 24 44 110 84 l93 43 46 88 c53 102 69 115 202 164 50 18 99 43 111 55 11 12 61 49 111 83 58 39 102 77 120 104 26 39 36 45 99 62 65 18 73 23 102 67 l31 47 101 7 100 8 50 54 c40 43 50 62 50 89 l0 34 83 0 82 0 311 -313 c250 -252 315 -322 334 -364 l23 -52 -41 -54 c-37 -47 -49 -56 -102 -71 -80 -22 -155 -78 -186 -138 -19 -38 -24 -63 -24 -125 l0 -78 61 -24 c52 -20 63 -29 81 -66 18 -37 31 -47 111 -86 50 -24 108 -59 129 -77 l37 -34 -24 -65 c-34 -91 -73 -134 -170 -193 l-84 -51 -88 3 -88 3 -15 -58 c-9 -33 -23 -63 -32 -68 -21 -12 -67 -13 -102 -4 l-29 8 6 -63 c4 -35 7 -71 7 -80 0 -28 233 -177 300 -191 74 -17 234 -133 225 -164 -18 -56 -16 -60 37 -112 47 -46 60 -53 113 -61 42 -7 81 -6 132 3 l73 12 25 -43 c14 -23 35 -51 48 -61 12 -10 33 -36 46 -58 13 -22 39 -56 57 -75 19 -20 37 -52 41 -74 l8 -38 130 -52 c130 -52 130 -52 188 -40 55 11 66 18 103 71 9 13 35 26 67 34 28 6 68 24 90 38 l38 26 -6 125 c-9 182 -22 266 -52 343 -25 64 -26 72 -15 140 l11 72 -70 152 c-38 83 -69 161 -69 173 0 11 7 37 15 57 8 19 15 64 15 99 0 80 25 138 55 130 77 -20 71 -23 83 36 10 51 9 54 -18 83 -21 23 -26 35 -20 50 5 11 9 45 9 75 1 30 4 79 7 107 6 50 10 55 78 111 61 51 132 90 143 79 1 -2 -1 -25 -6 -51 -7 -39 -6 -50 11 -71 11 -14 26 -25 34 -25 8 0 14 -10 14 -24 0 -13 14 -39 32 -57 l32 -34 10 37 10 38 56 0 c62 0 78 -7 54 -24 -14 -10 -13 -14 4 -37 11 -13 26 -45 33 -69 7 -25 15 -48 19 -53 3 -4 16 57 29 136 21 133 22 152 11 256 -15 135 -9 309 11 321 7 5 43 12 78 16 61 6 66 5 80 -17 9 -13 29 -37 46 -54 29 -29 30 -29 33 -9 2 12 -11 44 -27 72 -33 53 -36 62 -22 62 5 0 26 -26 45 -59 43 -70 66 -93 66 -65 0 11 -9 37 -19 59 -16 36 -16 44 -3 83 8 23 12 48 9 56 -3 7 -29 27 -59 43 -89 51 -154 108 -187 167 l-32 55 26 50 c14 28 32 83 40 122 8 39 33 105 55 147 22 43 42 90 45 105 4 20 15 31 36 39 16 6 28 13 26 17 -1 3 -17 35 -34 71 -27 58 -30 71 -23 110 5 25 9 63 10 84 0 26 9 50 25 72 14 18 25 38 25 44 0 6 -14 40 -30 77 l-30 66 21 56 c12 33 33 67 52 82 l31 26 -19 29 c-10 16 -37 49 -60 74 -24 25 -45 55 -49 67 -10 30 18 79 48 87 49 12 58 31 50 115 l-6 76 133 89 c160 107 252 178 280 217 19 28 24 29 95 29 66 0 80 3 110 26 29 22 34 33 34 66 0 39 23 98 39 98 4 0 41 -11 81 -25 53 -18 95 -25 150 -25 75 0 77 1 140 47 63 45 65 46 104 34 23 -7 77 -16 121 -21 44 -5 104 -13 134 -19 29 -6 55 -11 56 -11 1 0 26 -36 54 -79 87 -132 115 -144 91 -38 -8 34 -14 82 -13 106 2 36 -5 53 -37 102 -44 64 -51 104 -21 114 19 6 19 7 1 63 -11 31 -24 76 -30 100 -10 39 -13 42 -38 36 -15 -4 -30 -8 -33 -10 -4 -2 0 -34 7 -70 8 -37 12 -69 10 -71 -2 -3 -23 6 -45 19 l-41 23 6 51 6 51 -34 6 c-18 3 -76 9 -128 13 l-95 7 -61 59 c-34 32 -72 79 -85 102 l-23 44 -40 -18 c-23 -9 -55 -20 -72 -23 -17 -3 -84 -30 -148 -58 l-117 -53 -102 17 c-56 10 -124 17 -150 17 -37 0 -64 8 -110 34 -34 19 -87 39 -117 46 -30 7 -62 16 -72 21 -9 5 -46 56 -82 114 l-66 105 17 67 16 67 -64 59 c-39 37 -91 72 -134 92 -131 60 -180 98 -220 170 -30 52 -52 76 -113 121 -91 66 -107 89 -171 254 -35 91 -54 157 -67 240 -16 107 -22 123 -82 235 -71 132 -189 279 -576 719 -178 202 -202 233 -211 276 -12 57 -100 162 -155 184 -32 12 -41 11 -102 -9z" />
          <path d="M429 3842 c-42 -32 -94 -59 -152 -79 l-88 -30 -11 21 c-6 12 -12 22 -13 24 -2 3 -157 -57 -163 -63 -2 -1 6 -18 17 -36 14 -22 21 -51 21 -82 0 -27 7 -64 16 -82 17 -36 24 -39 125 -50 l55 -6 12 -45 c7 -24 12 -60 12 -79 0 -23 10 -49 29 -76 17 -22 37 -64 47 -92 28 -88 41 -104 109 -142 63 -35 67 -40 121 -141 30 -57 83 -139 117 -181 59 -74 66 -79 157 -118 135 -57 179 -89 282 -210 65 -76 105 -113 140 -131 50 -25 63 -55 36 -82 -9 -9 -9 -18 0 -36 8 -19 26 -30 69 -42 32 -9 70 -25 85 -35 15 -11 43 -19 66 -19 22 0 61 -9 87 -20 32 -14 69 -20 119 -20 117 0 374 -83 468 -152 14 -10 24 -10 50 1 18 7 73 17 122 22 48 4 101 11 116 14 18 4 40 0 59 -9 16 -9 52 -16 80 -16 l50 0 -28 68 c-15 37 -38 99 -51 137 -30 93 -52 135 -118 230 -78 111 -125 214 -151 323 -26 117 -26 120 3 128 24 6 40 43 29 70 -2 6 -88 44 -191 84 -103 41 -199 79 -213 86 l-27 13 19 88 c11 49 27 109 36 134 16 46 16 47 -17 135 l-33 89 -93 44 -93 43 -91 -56 c-85 -53 -94 -56 -154 -56 l-63 0 -49 -52 c-27 -29 -61 -68 -76 -86 l-27 -33 -48 25 c-26 13 -66 42 -87 64 -35 37 -45 41 -102 48 l-64 6 0 60 c0 49 -4 63 -25 83 -13 14 -28 25 -33 25 -5 0 -36 -25 -70 -56 -54 -48 -64 -54 -82 -44 -20 11 -21 17 -15 103 l7 92 -41 48 c-22 27 -59 82 -81 123 l-41 74 -53 0 c-48 0 -59 -5 -117 -48z" />
        </g>
        {activeViolations.map((v) => (
          <CityMarker key={v.id} x={v.mapX} y={v.mapY} city={v.city} count={v.count} active={v.active} onClick={() => onSelectCity(v.city)} />
        ))}
      </svg>
    </div>
  );
};

// --- Main Component ---

const ControlCenter = () => {
  const [view, setView] = useState<'map' | 'camera'>('map');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const violations = [
    { id: 1, city: 'Bakı', mapX: 850, mapY: 450, count: 1, active: true, type: 'Qayda Pozuntusu' },
    { id: 2, city: 'Gəncə', mapX: 350, mapY: 520, count: 0, active: false, type: 'Yol hərəkəti' },
    { id: 3, city: 'Sumqayıt', mapX: 800, mapY: 380, count: 0, active: false, type: 'İctimai asayiş' },
    { id: 4, city: 'Lənkəran', mapX: 750, mapY: 850, count: 0, active: false, type: 'Ekologiya' },
    { id: 5, city: 'Quba', mapX: 680, mapY: 220, count: 0, active: false, type: 'Meşə mühafizəsi' },
  ];

  const handleCitySelect = (city: string) => {
    if (city === 'Bakı') {
      setSelectedCity(city);
      setView('camera');
    }
  };

  if (view === 'camera') {
    return (
      <div className="relative h-screen w-full">
        <Dashboard onBack={() => setView('map')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-blue-500/30">
      {/* Top Navigation */}
      <nav className="h-20 border-b border-white/5 glass flex items-center justify-between px-4 md:px-10 z-[100] relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h1 className="text-xl font-black tracking-tighter">ARB<span className="text-blue-500">ORO</span></h1>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-white/50">
          <a href="#" className="text-blue-400 border-b-2 border-blue-500 pb-1">Xülasə</a>
          <a href="#" className="hover:text-white transition-colors">Kameralar</a>
          <a href="#" className="hover:text-white transition-colors">Hesabatlar</a>
          <a href="#" className="hover:text-white transition-colors">Sektorlar</a>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl bg-white/5 border border-white/10">
            <Search className="w-4 h-4 text-white/40" />
            <input type="text" placeholder="Axtarış..." className="bg-transparent border-none outline-none text-xs w-20 md:w-32" />
          </div>
          <button className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
            <Bell className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 border-2 border-white/20" />
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-0 right-0 bg-[#0e0e0e]/95 backdrop-blur-2xl border-b border-white/10 p-6 lg:hidden z-50 flex flex-col gap-4 shadow-2xl"
            >
              <a href="#" className="text-lg font-bold text-blue-400 py-2 border-b border-white/5">Xülasə</a>
              <a href="#" className="text-lg font-bold text-white/60 py-2 border-b border-white/5">Kameralar</a>
              <a href="#" className="text-lg font-bold text-white/60 py-2 border-b border-white/5">Hesabatlar</a>
              <a href="#" className="text-lg font-bold text-white/60 py-2">Sektorlar</a>
              
              <div className="mt-4 flex flex-col gap-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 border border-white/10">
                  <Search className="w-5 h-5 text-white/40" />
                  <input type="text" placeholder="Axtarış..." className="bg-transparent border-none outline-none text-sm w-full" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto lg:overflow-hidden scrollbar-hide">
        <div className="grid grid-cols-12 gap-4 md:gap-6 p-4 md:p-8">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-3 order-2 lg:order-1 flex flex-col gap-4 md:gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-5 md:p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-5 flex items-center gap-2">
                <Activity className="w-4 h-4 text-green-500" /> Canlı Analitika
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                <StatItem label="Aktiv Pozuntular" value="1" color="text-red-500" />
                <StatItem label="Qorunan Obyektlər" value="1,240" color="text-blue-500" />
                <StatItem label="Aİ Modelləri" value="3 Aktiv" color="text-yellow-500" />
                <StatItem label="Sistem Gecikməsi" value="12ms" color="text-green-500" />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card p-5 md:p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" /> Son Xəbərdarlıqlar
              </h3>
              <div className="space-y-3 max-h-48 lg:max-h-none overflow-y-auto pr-1">
                <NotificationItem title="Qayda Pozuntusu - Bakı" time="2 dəq əvvəl" severity="high" />
                <NotificationItem title="Hərəkət - Gəncə" time="15 dəq əvvəl" severity="low" />
                <NotificationItem title="Sistem Yeniləmə" time="1 saat əvvəl" severity="info" />
              </div>
            </motion.div>
          </div>

          {/* Center Map */}
          <div className="col-span-12 lg:col-span-6 order-1 lg:order-2 glass-card p-4 md:p-8 relative flex flex-col items-center justify-center min-h-[400px] lg:min-h-0 overflow-hidden">
            <div className="absolute top-6 left-6 md:top-8 md:left-8 z-10">
              <h2 className="text-xl md:text-3xl font-black leading-tight">Azərbaycan <br /><span className="text-blue-500">Nəzarət Xəritəsi</span></h2>
              <p className="text-white/40 text-[10px] md:text-sm mt-1 font-medium">Bütün bölgələr üzrə real-vaxt monitorinqi</p>
            </div>
            <AzerbaijanMap onSelectCity={handleCitySelect} activeViolations={violations} />
            <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 flex items-center gap-3 md:gap-4 z-10">
              <LegendItem color="bg-red-500" label="Kritik" />
              <LegendItem color="bg-yellow-500" label="Xəb." />
              <LegendItem color="bg-blue-500" label="Norm." />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-12 lg:col-span-3 order-3 flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="flex-1 glass-card p-5 md:p-6 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                  <Camera className="w-4 h-4" /> Seçilmiş Sektorlar
                </h3>
                <button className="text-[10px] font-bold text-blue-400 hover:underline">Hamısına bax</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 flex-1 overflow-y-auto pr-2 scrollbar-hide max-h-[300px] lg:max-h-none">
                <SectorCard city="Bakı" type="Mərkəzi Park" status="Həyəcan" active onClick={() => handleCitySelect('Bakı')} />
                <SectorCard city="Gəncə" type="Heydər Əliyev Parkı" status="Normal" />
                <SectorCard city="Sumqayıt" type="Dənizkənarı Bulvar" status="Normal" />
                <SectorCard city="Quba" type="Qırmızı Qəsəbə" status="Normal" />
              </div>
              <div className="mt-6 pt-6 border-t border-white/5">
                <button className="w-full py-3 md:py-4 bg-blue-600 rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:bg-blue-500 transition-all flex items-center justify-center gap-2 group">
                  Yeni Sektor Əlavə Et <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlCenter;
