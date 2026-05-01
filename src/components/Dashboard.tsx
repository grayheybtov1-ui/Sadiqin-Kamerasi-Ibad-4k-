'use client';
// Force refresh 1.0


import React, { useState, useEffect } from 'react';
import { Shield, Camera, AlertTriangle, List, Activity, User, Flower2, Zap, Monitor, Clock, MapPin, ArrowRight, Scan, CigaretteOff, Footprints, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import ParkScene from './ParkScene';
import * as THREE from 'three';

// Small 3D Face Preview Component
const FacePreview = () => (
  <Canvas shadows camera={{ position: [0, 1.8, 0.6], fov: 35 }}>
    <ambientLight intensity={1.5} />
    <pointLight position={[2, 2, 2]} intensity={2} />
    <spotLight position={[0, 2, 2]} angle={0.3} penumbra={1} intensity={2} castShadow />
    <group position={[0, 0, 0]}>
      {/* Body top */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.5, 0.8, 0.3]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      {/* Head */}
      <group position={[0, 1.8, 0]}>
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial color="#ffdbac" />
        </mesh>
        {/* Eyes for better orientation */}
        <mesh position={[-0.08, 0.05, 0.2]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <mesh position={[0.08, 0.05, 0.2]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="black" />
        </mesh>
      </group>
    </group>
    <Environment preset="city" />
  </Canvas>
);

interface Incident {
  id: string;
  type: string;
  timestamp: string;
  location: string;
  confidence: number;
  status: 'new' | 'investigating' | 'resolved';
  image?: string;
}

interface DashboardProps {
  onBack?: () => void;
  onNotify?: (message: string) => void;
}

const Dashboard = ({ onBack, onNotify }: DashboardProps) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isAlertActive, setIsAlertActive] = useState(false);
  const [activeModel, setActiveModel] = useState<number>(0);
  const [currentView, setCurrentView] = useState<'monitoring' | 'arxiv' | 'cameras' | 'analytics'>('monitoring');
  const [recSeconds, setRecSeconds] = useState(0);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Format seconds → HH:MM:SS
  const formatRecTime = (s: number) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  const handleIncident = (type: string, data: any) => {
    const newIncident: Incident = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      ...data,
      status: 'new'
    };
    setIncidents(prev => [newIncident, ...prev]);
    setIsAlertActive(true);

    if (onNotify) {
      onNotify(`${type} - Bakı`);
    }

    // Play alert sound simulation (optional)
    console.log("ALERT: Flower picked!");
  };

  useEffect(() => {
    if (isAlertActive) {
      const timer = setTimeout(() => setIsAlertActive(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isAlertActive]);

  // Live REC timer — starts from 0
  useEffect(() => {
    const timer = setInterval(() => setRecSeconds(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate model switching/scanning
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModel(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
      {/* Sidebar (Desktop) */}
      <div className="hidden lg:flex w-64 border-r border-white/10 flex-col items-start p-4 gap-8 glass bg-black/20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />
          <span className="font-bold text-xl tracking-tight">ARBO<span className="text-blue-500">RO</span></span>
        </div>

        <nav className="flex flex-col gap-2 w-full">
          <NavItem
            icon={<Monitor className="w-5 h-5" />}
            label="Monitorinq"
            active={currentView === 'monitoring'}
            onClick={() => setCurrentView('monitoring')}
          />
          <NavItem
            icon={<Camera className="w-5 h-5" />}
            label="Kameralar"
            active={currentView === 'cameras'}
            onClick={() => setCurrentView('cameras')}
          />
          <NavItem
            icon={<List className="w-5 h-5" />}
            label="Arxiv"
            active={currentView === 'arxiv'}
            onClick={() => setCurrentView('arxiv')}
          />
          <NavItem
            icon={<Activity className="w-5 h-5" />}
            label="Analitika"
            active={currentView === 'analytics'}
            onClick={() => setCurrentView('analytics')}
          />
        </nav>

        {/* Left Side Violation Bar */}
        <div className="hidden lg:flex flex-col gap-4 w-full mt-4 flex-1 overflow-hidden">
          <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" /> Qayda Pozuntuları
          </h3>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide">
            <AnimatePresence initial={false}>
              {incidents.map((incident) => (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all group"
                >
                  <p className="text-[10px] font-bold text-red-400 uppercase leading-tight group-hover:text-red-300 transition-colors">
                    {incident.type}
                  </p>
                  <div className="flex items-center gap-2 mt-1 opacity-60">
                    <Clock className="w-2.5 h-2.5" />
                    <span className="text-[9px] font-mono">{incident.timestamp}</span>
                  </div>
                </motion.div>
              ))}
              {incidents.length === 0 && (
                <div className="text-[10px] text-white/20 px-2 italic">Aktiv pozuntu yoxdur</div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-auto w-full">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hidden lg:block">
            <div className="flex items-center gap-2 mb-2 text-xs text-white/50 uppercase tracking-widest font-bold">
              <Zap className="w-3 h-3 text-yellow-500" /> System Status
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">Bütün Sistemlər Aktivdir</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-[#0e0e0e] border-r border-white/10 p-6 flex flex-col gap-8 z-[101] lg:hidden"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse" />
                  <span className="font-bold text-xl tracking-tight">ARBO<span className="text-blue-500">RO</span></span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>

              <nav className="flex flex-col gap-2 w-full">
                <NavItem
                  icon={<Monitor className="w-5 h-5" />}
                  label="Monitorinq"
                  active={currentView === 'monitoring'}
                  onClick={() => { setCurrentView('monitoring'); setIsMobileMenuOpen(false); }}
                  mobile
                />
                <NavItem
                  icon={<Camera className="w-5 h-5" />}
                  label="Kameralar"
                  active={currentView === 'cameras'}
                  onClick={() => { setCurrentView('cameras'); setIsMobileMenuOpen(false); }}
                  mobile
                />
                <NavItem
                  icon={<List className="w-5 h-5" />}
                  label="Arxiv"
                  active={currentView === 'arxiv'}
                  onClick={() => { setCurrentView('arxiv'); setIsMobileMenuOpen(false); }}
                  mobile
                />
                <NavItem
                  icon={<Activity className="w-5 h-5" />}
                  label="Analitika"
                  active={currentView === 'analytics'}
                  onClick={() => { setCurrentView('analytics'); setIsMobileMenuOpen(false); }}
                  mobile
                />
              </nav>

              <div className="flex flex-col gap-4 w-full mt-4 flex-1 overflow-hidden">
                <h3 className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" /> Qayda Pozuntuları
                </h3>
                <div className="flex flex-col gap-3 overflow-y-auto pr-2">
                  {incidents.slice(0, 5).map((incident) => (
                    <div key={incident.id} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <p className="text-[10px] font-bold text-red-400 uppercase leading-tight">{incident.type}</p>
                      <div className="flex items-center gap-2 mt-1 opacity-60">
                        <Clock className="w-2.5 h-2.5" />
                        <span className="text-[9px] font-mono">{incident.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2 mb-2 text-xs text-white/50 uppercase tracking-widest font-bold">
                    <Zap className="w-3 h-3 text-yellow-500" /> Status
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-medium text-white/80">Online</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="h-16 md:h-20 border-b border-white/10 flex items-center justify-between px-4 md:px-8 glass bg-black/40 z-10">
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-2 md:px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] md:text-xs font-bold hover:bg-white/10 transition-all text-white/70"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" /> <span className="hidden sm:inline">XƏRİTƏ</span>
              </button>
            )}
            <h2 className="text-xs md:text-lg font-semibold flex items-center gap-2 truncate max-w-[150px] md:max-w-none">
              <Camera className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
              <span className="truncate">Kamera №042</span>
            </h2>
            <div className="hidden sm:block px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
              4K Ultra HD
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden sm:flex items-center gap-2 text-sm text-white/60">
              <Clock className="w-4 h-4" />
              {new Date().toLocaleTimeString()}
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10" />
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {currentView === 'monitoring' ? (
            <>
              {/* Main Viewport */}
              <div className="flex-1 relative bg-black group cctv-grain">
                <ParkScene onIncident={handleIncident} isAlertActive={isAlertActive} />

                {/* HUD Overlay */}
                <div className="absolute inset-0 pointer-events-none p-6 border-[20px] border-transparent group-hover:border-white/5 transition-all duration-700">
                  {/* Corner Brackets */}
                  <div className="absolute top-0 left-0 w-4 h-4 md:w-8 md:h-8 border-t-2 border-l-2 border-white/30" />
                  <div className="absolute top-0 right-0 w-4 h-4 md:w-8 md:h-8 border-t-2 border-r-2 border-white/30" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 md:w-8 md:h-8 border-b-2 border-l-2 border-white/30" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 md:w-8 md:h-8 border-b-2 border-r-2 border-white/30" />

                  <div className="absolute top-4 left-4 md:top-10 md:left-10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-2 md:px-3 py-1 bg-black/60 rounded-lg border border-white/10 backdrop-blur-md">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[8px] md:text-[10px] font-mono text-white/80 tracking-widest uppercase">REC {formatRecTime(recSeconds)}</span>
                    </div>
                  </div>

                </div>

                {/* Face Capture Overlay */}
                {/* Alert Overlay */}
                <AnimatePresence>
                  {isAlertActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-red-600/30 pointer-events-none flex items-center justify-center border-[20px] border-red-600/50 animate-pulse z-30"
                    />
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : currentView === 'cameras' ? (
            <div className="flex-1 p-8 overflow-y-auto bg-black/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Kamera Şəbəkəsi</h1>
                  <p className="text-white/50 text-xs md:text-sm mt-1">Sektor B üzrə bütün aktiv kameralar (12/12)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[42, 43, 44, 45, 46, 47].map((num) => (
                  <div key={num} className="group relative bg-black rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all cursor-pointer aspect-video shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                    {/* HUD elements for thumbnail */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[8px] font-mono font-bold tracking-widest text-white/80">CAM №0{num}</span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <p className="text-[10px] font-bold text-white/90">Sektor B - Zona {num - 41}</p>
                      <p className="text-[8px] text-white/40 uppercase tracking-tighter">Live Feed • 30 FPS</p>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                        <Monitor className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : currentView === 'analytics' ? (
            <div className="flex-1 p-8 overflow-y-auto bg-black/40">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Statistika</h1>
                  <p className="text-white/50 text-xs md:text-sm mt-1">Gündəlik və aylıq pozuntu analizi</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[10px] font-bold text-white/60">
                    SON 30 GÜN
                  </div>
                  <button className="px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                    HESABATI YÜKLƏ
                  </button>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                  title="Gündəlik Pozuntular" 
                  value="12" 
                  trend="+20%" 
                  icon={<Clock className="w-5 h-5 text-blue-500" />} 
                  color="blue"
                />
                <StatCard 
                  title="Aylıq Pozuntular" 
                  value="342" 
                  trend="-5%" 
                  icon={<Activity className="w-5 h-5 text-purple-500" />} 
                  color="purple"
                />
                <StatCard 
                  title="Ən Çox Pozulan Qayda" 
                  value="Gül Dərmək" 
                  icon={<Flower2 className="w-5 h-5 text-red-500" />} 
                  color="red"
                />
                <StatCard 
                  title="Sistem Dəqiqliyi" 
                  value="98.4%" 
                  trend="+0.2%" 
                  icon={<Shield className="w-5 h-5 text-green-500" />} 
                  color="green"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Distribution Chart Simulation */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Gündəlik Pozuntu Paylanması</h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[40, 70, 45, 90, 65, 30, 55, 80, 40, 60, 75, 50].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          className={`w-full rounded-t-lg bg-gradient-to-t ${i === 3 ? 'from-blue-600 to-blue-400' : 'from-white/10 to-white/20'} group-hover:from-blue-500 group-hover:to-blue-300 transition-all`}
                        />
                        <span className="text-[8px] font-mono text-white/20">{i + 8}:00</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Violations Trend Simulation */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Aylıq Pozuntu Trendi</h3>
                  <div className="h-64 flex items-end justify-between gap-4">
                    {['Yan', 'Fev', 'Mar', 'Apr', 'May', 'İyun'].map((month, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${[30, 45, 25, 60, 85, 40][i]}%` }}
                          className={`w-full rounded-t-lg bg-gradient-to-t from-purple-600/40 to-purple-400/40 border-t border-purple-400 group-hover:from-purple-500 group-hover:to-purple-300 transition-all`}
                        />
                        <span className="text-[10px] font-medium text-white/40">{month}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-6">Pozuntu Kateqoriyaları (Aylıq)</h3>
                  <div className="space-y-4">
                    <CategoryBar label="Gül dərənler" value={145} total={342} color="bg-red-500" />
                    <CategoryBar label="Zibil atanlar" value={88} total={342} color="bg-orange-500" />
                    <CategoryBar label="Qadağan olunmuş ərazi" value={64} total={342} color="bg-yellow-500" />
                    <CategoryBar label="Digər" value={45} total={342} color="bg-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 p-8 overflow-y-auto bg-black/40">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">İnsident Arxivi</h1>
                  <p className="text-white/50 text-sm mt-1">Sistem tərəfindən qeydə alınmış bütün qayda pozuntuları</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-sm">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span>Cəmi: {incidents.length}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                  {incidents.map((incident) => (
                    <motion.div
                      key={incident.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-red-500/30 transition-all group"
                    >
                      <div className="aspect-video bg-black relative overflow-hidden">
                        <img
                          src={incident.image || "/suspect.png"}
                          alt="Incident Capture"
                          className="w-full h-full object-cover grayscale brightness-75 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4 px-2 py-1 bg-red-600 text-[10px] font-bold rounded uppercase">
                          Kamera №042
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-red-400 uppercase tracking-tight">{incident.type}</h4>
                          <span className="text-[10px] text-white/40">{incident.timestamp}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-white/60">
                            <MapPin className="w-3.5 h-3.5 text-blue-500" />
                            <span>Ərazi: {incident.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/60">
                            <Activity className="w-3.5 h-3.5 text-green-500" />
                            <span>Sistem Dəqiqliyi: {(incident.confidence * 100).toFixed(0)}%</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/60">
                            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                            <span>Status: Cərimə Qeyd Edildi</span>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedIncident(incident)}
                          className="w-full mt-6 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-xs font-bold text-blue-400 hover:bg-blue-600/40 hover:border-blue-400/50 transition-all"
                        >
                          DETALLI BAXIŞ
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {incidents.length === 0 && (
                  <div className="col-span-full py-20 text-center text-white/30 italic border-2 border-dashed border-white/5 rounded-3xl">
                    Arxiv boşdur. Heç bir insident qeydə alınmayıb.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Incident Detail Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedIncident(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-2xl bg-[#0e0e0e] border border-white/10 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            >
              {/* Top image */}
              <div className="relative aspect-video bg-black">
                <img
                  src={selectedIncident.image || '/suspect.png'}
                  alt="Insident"
                  className="w-full h-full object-cover grayscale brightness-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-2 py-1 bg-red-600 text-[10px] font-bold rounded uppercase">
                  Kamera №042
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setSelectedIncident(null)}
                    className="w-8 h-8 rounded-full bg-black/60 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-white/70 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-lg font-black text-red-400 uppercase tracking-tight">{selectedIncident.type}</h3>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 grid grid-cols-2 gap-4">
                <DetailRow icon={<Clock className="w-4 h-4 text-blue-400" />} label="Vaxt" value={selectedIncident.timestamp} />
                <DetailRow icon={<MapPin className="w-4 h-4 text-blue-400" />} label="Ərazi" value={selectedIncident.location} />
                <DetailRow icon={<Activity className="w-4 h-4 text-green-400" />} label="Dəqiqlik" value={`${(selectedIncident.confidence * 100).toFixed(1)}%`} />
                <DetailRow icon={<AlertTriangle className="w-4 h-4 text-yellow-400" />} label="Status" value="Cərimə Qeyd Edildi" />
                <DetailRow icon={<Camera className="w-4 h-4 text-white/40" />} label="Kamera" value="Kamera №042 — 4K Ultra HD" />
                <DetailRow icon={<Scan className="w-4 h-4 text-purple-400" />} label="İnsident ID" value={`#${selectedIncident.id.toUpperCase()}`} />
              </div>

              {/* Actions */}
              <div className="px-6 pb-6 flex gap-3">
                <button className="flex-1 py-3 bg-red-600/20 border border-red-500/30 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-600/30 transition-all">
                  Hesabat Yarat
                </button>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-white/60 hover:bg-white/10 transition-all"
                >
                  Bağla
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick, mobile = false }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void, mobile?: boolean }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-lg' : 'hover:bg-white/5 text-white/60'}`}
  >
    {icon}
    <span className={`${mobile ? 'block' : 'hidden lg:block'} font-medium text-sm`}>{label}</span>
  </div>
);

const DetailRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
    <div className="mt-0.5">{icon}</div>
    <div>
      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">{label}</p>
      <p className="text-sm font-semibold mt-0.5">{value}</p>
    </div>
  </div>
);

const ModelIndicator = ({ active, icon, label, status }: { active: boolean, icon: React.ReactNode, label: string, status: string }) => (
  <motion.div
    animate={{
      scale: active ? 1.05 : 1,
      opacity: active ? 1 : 0.6,
      borderColor: active ? 'rgba(59, 130, 246, 0.5)' : 'rgba(255, 255, 255, 0.1)'
    }}
    className={`flex items-center gap-3 px-4 py-2 bg-black/80 rounded-xl border backdrop-blur-xl pointer-events-none transition-all`}
  >
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-white/30'}`}>
      {icon}
    </div>
    <div className="hidden md:block">
      <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{label}</p>
      <p className="text-xs font-medium">{status}</p>
    </div>
    {active && <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping ml-auto" />}
  </motion.div>
);

const StatCard = ({ title, value, trend, icon, color }: { title: string, value: string, trend?: string, icon: React.ReactNode, color: string }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all group">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}-500/10 text-${color}-500`}>
        {icon}
      </div>
      {trend && (
        <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'} bg-white/5 px-2 py-1 rounded-lg`}>
          {trend}
        </span>
      )}
    </div>
    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{title}</p>
    <p className="text-2xl font-bold mt-1 group-hover:text-blue-400 transition-colors">{value}</p>
  </div>
);

const CategoryBar = ({ label, value, total, color }: { label: string, value: number, total: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between text-xs">
      <span className="font-medium text-white/70">{label}</span>
      <span className="font-mono text-white/40">{value} / {total}</span>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${(value / total) * 100}%` }}
        className={`h-full ${color} rounded-full`}
      />
    </div>
  </div>
);

export default Dashboard;

