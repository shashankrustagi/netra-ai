import React, { useEffect, useState } from 'react'
// Added missing icons: Radio, Search, Map, etc.
import {
  Camera, Shield, Target, AlertCircle, Clock, Brain, Bell,
  Activity, TrendingUp, Route, MapPin, CheckCircle, Eye, Zap, RotateCcw,
  Lock, ShieldCheck, Search, Radio, Map as MapIcon
} from 'lucide-react'

type Alert = { id: number; type: string; priority: 'HIGH' | 'MEDIUM' | 'CRITICAL'; loc: string; cam: string; conf: string; time: string }
type TrackNode = { id: number; cam: string; loc: string; time: string; conf: number; match: boolean; type: string }

const CAM_COORDS: Record<string, string> = {
  'CAM-0012': '80,420', 'CAM-6391': '180,350', 'CAM-1930': '310,270',
  'CAM-5245': '430,190', 'CAM-6481': '580,120', 'CAM-2010': '720,60',
};

export default function App() {
  const [tab, setTab] = useState<'command' | 'tracking'>('command')
  const [duration, setDuration] = useState(0)
  const [wsStatus, setWsStatus] = useState<'connected' | 'disconnected' | 'reconnecting'>('disconnected')
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [route, setRoute] = useState<TrackNode[]>([])

  const handleReset = () => { setRoute([]); setDuration(0); };

  useEffect(() => {
    const t = setInterval(() => setDuration(d => d + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/alerts')
        const data = await res.json()
        setAlerts(data)
      } catch (err) { console.error("Alerts fetch error", err) }
    }
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: any;
    const connect = () => {
      setWsStatus('reconnecting')
      ws = new WebSocket('ws://localhost:8000/ws/live-tracking')
      ws.onopen = () => setWsStatus('connected')
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        setRoute(prev => {
          if (prev.some(p => p.cam === data.camera && p.time === data.time)) return prev
          return [...prev, {
            id: Date.now(), cam: data.camera, loc: data.location, time: data.time,
            conf: data.confidence, match: data.status === 'CONFIRMED', type: data.method,
          }]
        })
      }
      ws.onclose = () => { setWsStatus('disconnected'); reconnectTimer = setTimeout(connect, 3000); }
      ws.onerror = () => ws.close()
    }
    connect()
    return () => { ws?.close(); clearTimeout(reconnectTimer) }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* DELHI POLICE TOP BRANDING BAR */}
      <div className="h-2 w-full flex">
        <div className="h-full w-1/2 bg-[#ed1c24]"></div> {/* DP RED */}
        <div className="h-full w-1/2 bg-[#002147]"></div> {/* DP NAVY */}
      </div>

      {/* HEADER */}
      <header className="bg-[#002147] text-white p-4 shadow-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-full shadow-lg border-2 border-[#ed1c24]">
                <ShieldCheck className="text-[#002147]" size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-none">DELHI POLICE <span className="text-[#ed1c24] ml-1">NETRA-AI</span></h1>
              <p className="text-[10px] text-blue-200 font-bold tracking-[0.2em] mt-1 uppercase">Shanti, Seva, Nyaya • Command & Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-6 border-l border-white/20 pl-6">
            <div className="text-right hidden md:block">
              <p className="text-[10px] opacity-60 uppercase font-black">Authorized Personnel Only</p>
              <p className="text-sm font-mono font-bold text-emerald-400">LOGGED: DCP_NORTH_01</p>
            </div>
            <div className="bg-black/30 p-2 rounded-lg text-center min-w-[100px] border border-white/10">
              <p className="text-lg font-black font-mono leading-none">{new Date().toLocaleTimeString()}</p>
              <p className="text-[8px] opacity-50 uppercase mt-1">Local IST</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* POLICE TAB NAV */}
        <div className="flex bg-white rounded-xl shadow-md mb-6 p-1 border border-slate-200">
          <button onClick={() => setTab('command')} className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-3 font-black uppercase tracking-tighter transition-all ${tab === 'command' ? 'bg-[#002147] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
            <Shield size={18} /> Command Dashboard
          </button>
          <button onClick={() => setTab('tracking')} className={`flex-1 py-3 px-6 rounded-lg flex items-center justify-center gap-3 font-black uppercase tracking-tighter transition-all ${tab === 'tracking' ? 'bg-[#ed1c24] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
            <Target size={18} /> Live Suspect Tracking
          </button>
        </div>

        {tab === 'command' ? (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {[
                { label: 'City Surveillance', value: '9,847', sub: 'Cams Online', icon: Camera, color: 'border-b-[#002147]' },
                { label: 'Active PCR Units', value: '412', sub: 'Patrolling', icon: Radio, color: 'border-b-[#002147]' },
                { label: 'BOLO Alerts', value: '23', sub: 'Be On Look Out', icon: AlertCircle, color: 'border-b-[#ed1c24]' },
                { label: 'AI Detections', value: '1,204', sub: 'Past 24 Hours', icon: Brain, color: 'border-b-[#002147]' },
                { label: 'Emergency Resp.', value: '4.2m', sub: 'Average Time', icon: Clock, color: 'border-b-[#002147]' },
              ].map((m, i) => (
                <div key={i} className={`bg-white p-5 rounded-xl shadow-sm border-b-4 ${m.color} hover:shadow-md transition-shadow`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-slate-100 rounded-lg text-[#002147]"><m.icon size={20} /></div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SECURE</span>
                  </div>
                  <p className="text-3xl font-black text-[#002147] tracking-tighter">{m.value}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">{m.label}</p>
                  <p className="text-[9px] text-slate-400 mt-2 italic">{m.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-black text-xs uppercase tracking-widest text-[#002147] flex items-center gap-2"><Bell size={14} className="text-[#ed1c24]"/> Priority AI Dispatch</h3>
                  <span className="bg-[#ed1c24]/10 text-[#ed1c24] text-[9px] px-2 py-0.5 rounded-full font-bold">LIVE</span>
                </div>
                <div className="p-4 space-y-3">
                  {alerts.map(a => (
                    <div key={a.id} className="group cursor-pointer border-l-4 border-[#ed1c24] bg-slate-50 p-3 rounded-r-lg hover:bg-slate-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <span className="font-black text-[11px] text-[#002147]">{a.type}</span>
                        <span className="bg-red-100 text-[#ed1c24] text-[8px] px-1.5 py-0.5 rounded font-black">{a.priority}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{a.loc} • {a.cam}</p>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[9px] font-bold text-blue-600 uppercase flex items-center gap-1">Dispatch PCR <Zap size={10}/></span>
                         <span className="text-[9px] text-slate-400 font-mono">{a.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h3 className="font-black text-xs uppercase tracking-widest text-[#002147] flex items-center gap-2"><Activity size={14} className="text-emerald-600"/> Field Operations</h3>
                </div>
                <div className="p-4">
                  <div onClick={() => setTab('tracking')} className="group cursor-pointer bg-[#002147] text-white p-5 rounded-2xl relative overflow-hidden shadow-lg hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={80} /></div>
                    <div className="flex items-center gap-2 text-[#ed1c24] mb-2">
                        <div className="w-2 h-2 bg-[#ed1c24] rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Interception Active</span>
                    </div>
                    <p className="text-sm font-mono text-blue-200 mb-1">#INC-2024-DL-00142</p>
                    <h4 className="text-xl font-black tracking-tight uppercase italic italic">Armed Robbery Suspect</h4>
                    <p className="text-[10px] mt-4 font-bold flex items-center gap-2 text-emerald-400 uppercase">
                        <Search size={12}/> {route.length} Visual Contacts Logged
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <h3 className="font-black text-xs uppercase tracking-widest text-[#002147] flex items-center gap-2"><TrendingUp size={14} className="text-blue-600"/> Crime Hotspots</h3>
                </div>
                <div className="p-4">
                  <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-[#ed1c24] uppercase mb-1 tracking-widest">Statistical Risk: 87%</p>
                        <h4 className="text-lg font-black text-[#002147]">Karol Bagh Sector 4</h4>
                        <p className="text-[10px] text-slate-500 font-bold mt-2 italic tracking-tight">AI Warning: Significant Gait anomaly cluster detected near Metro Exit.</p>
                    </div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-8 -mb-8"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            {/* LIVE TRACKING HEADER */}
            <div className="bg-[#002147] text-white rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden border-b-4 border-[#ed1c24]">
              <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none" />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="bg-[#ed1c24] text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> Critical Intercept
                    </span>
                    <span className="text-blue-300/60 font-mono text-[11px] font-bold">REF_LOG: 2024-DL-142</span>
                  </div>
                  <h2 className="text-4xl font-black mt-3 tracking-tighter uppercase italic italic">Armed Robbery Target Tracking</h2>
                  
                  <div className="flex items-center gap-3 text-[10px] mt-4 bg-black/40 w-fit px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                    <span className={`w-2.5 h-2.5 rounded-full ${wsStatus === 'connected' ? 'bg-emerald-400 shadow-[0_0_8px_#4ade80]' : wsStatus === 'reconnecting' ? 'bg-amber-400 animate-pulse' : 'bg-[#ed1c24]'}`} />
                    <span className="font-black uppercase tracking-widest text-blue-100">{wsStatus === 'connected' ? 'Secure AI Data-Link Established' : wsStatus === 'reconnecting' ? 'Re-establishing Uplink...' : 'AI Downlink Lost'}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4">
                    <div className="bg-black/30 p-5 rounded-2xl text-center border border-white/10 backdrop-blur-sm min-w-[150px]">
                        <p className="text-5xl font-black font-mono tracking-tighter text-[#ed1c24]">{route.length}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest mt-1 opacity-70 text-blue-200">Confirmed Hits</p>
                    </div>
                    <button onClick={handleReset} className="flex items-center gap-2 bg-[#ed1c24] hover:bg-red-700 transition-all text-[10px] font-black uppercase px-6 py-2.5 rounded-full shadow-lg group">
                        <RotateCcw size={14} className="group-hover:rotate-[-180deg] transition-transform duration-500" /> Reset Mission
                    </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-8 text-[10px] mt-8 uppercase font-black tracking-[0.2em] text-blue-300/50 relative z-10">
                  <div className="border-l border-white/10 pl-4">Initial Contact<br /><b className="text-white text-sm tracking-tighter uppercase italic italic">Connaught Place Metro</b></div>
                  <div className="border-l border-white/10 pl-4">Last Visual<br /><b className="text-white text-sm tracking-tighter uppercase italic italic">{route[route.length-1]?.loc || 'SCANNING...'}</b></div>
                  <div className="border-l border-white/10 pl-4">System Sync<br /><b className="text-white text-sm tracking-tighter uppercase italic italic">{route[route.length-1]?.time || 'SCANNING...'}</b></div>
                  <div className="border-l border-white/10 pl-4">Mission Time<br /><b className="text-white text-sm tracking-tighter uppercase italic italic font-mono">{Math.floor(duration/60)}m {duration%60}s</b></div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-6 h-[580px]">
              {/* LIVE MAP (DELHI THEME) */}
              <div className="col-span-12 lg:col-span-7 bg-[#001529] rounded-3xl relative overflow-hidden border border-[#002147] shadow-2xl group">
                {/* Tech Overlays */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 1.5px)', backgroundSize: '40px 40px' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002147] via-transparent to-transparent pointer-events-none" />
                
                <svg className="absolute inset-0 w-full h-full p-12">
                  <defs>
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                  </defs>
                  {/* Digital Grid Path */}
                  <polyline fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="10,10" points="80,420 180,350 310,270 430,190 580,120 720,60" className="opacity-10" />
                  
                  {/* Suspect Trajectory */}
                  <polyline fill="none" stroke="#ed1c24" strokeWidth="4" strokeDasharray="12,6" points={route.map(p => CAM_COORDS[p.cam] || '0,0').join(' ')} filter="url(#glow)" className="transition-all duration-1000" />
                  
                  {/* Live Beacon */}
                  {route.length > 0 && (
                    <g transform={`translate(${CAM_COORDS[route[route.length-1].cam] || '0,0'})`}>
                      <circle r="22" fill="#ed1c24" className="animate-ping opacity-30" />
                      <circle r="8" fill="#ed1c24" filter="url(#glow)" />
                      <text y="-20" textAnchor="middle" className="fill-white text-[10px] font-black uppercase tracking-widest italic italic">Live Target</text>
                    </g>
                  )}
                </svg>

                <div className="absolute bottom-6 left-6 flex gap-3 pointer-events-none">
                    <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl">
                        <p className="text-[9px] font-black text-[#ed1c24] uppercase tracking-[0.3em] mb-1">Target Geo-Lock</p>
                        <p className="text-xl font-black text-white italic italic tracking-tighter uppercase">{route[route.length-1]?.loc || 'Acquiring...'}</p>
                    </div>
                </div>
              </div>

              {/* TRACKING PIPELINE (DELHI THEME) */}
              <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl shadow-2xl p-5 flex flex-col border border-slate-200 overflow-hidden">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                    <span className="font-black text-sm uppercase tracking-widest text-[#002147] flex gap-3 items-center">
                        <div className="w-1.5 h-6 bg-[#ed1c24] rounded-full" /> Digital Evidence Pipeline
                    </span>
                    <div className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 tracking-tighter">{route.length} TOTAL HITS</div>
                </div>
                
                <div className="space-y-4 overflow-y-auto flex-1 pr-3 custom-scrollbar">
                  {[...route].reverse().map((p, i) => (
                    <div key={p.id} className="flex gap-4 animate-in slide-in-from-right-4 duration-300">
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-500 hover:rotate-12 ${p.match ? 'bg-[#002147] text-white' : 'bg-slate-200 text-slate-400'}`}>
                          {p.match ? <CheckCircle size={20} /> : <Eye size={20} />}
                        </div>
                        {i < route.length - 1 && <div className="w-0.5 h-full bg-slate-100 my-1" />}
                      </div>
                      <div className={`flex-1 border-2 rounded-2xl p-4 relative overflow-hidden transition-all ${p.match ? 'bg-white border-slate-100 shadow-md hover:border-[#002147]/20' : 'bg-slate-50 border-dashed border-slate-200 opacity-60'}`}>
                        {p.match && <div className="absolute top-0 right-0 p-2"><ShieldCheck size={12} className="text-[#ed1c24] opacity-20" /></div>}
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-black text-[#ed1c24] text-xs tracking-widest font-mono">{p.cam}</div>
                            <div className="text-xs font-black text-[#002147] mt-1 uppercase leading-tight tracking-tighter">{p.loc}</div>
                            <span className="inline-block mt-3 text-[9px] bg-[#002147]/5 text-[#002147] font-black px-2.5 py-1 rounded-md tracking-widest uppercase border border-[#002147]/10">{p.type}</span>
                          </div>
                          <div className="text-right flex flex-col items-end">
                            <div className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 mb-2">{p.time}</div>
                            <div className="font-black text-[#ed1c24] text-xl tracking-tighter">{p.conf}%</div>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Confidence</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {route.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Lock size={32} className="text-slate-300" />
                        </div>
                        <p className="font-black text-slate-400 uppercase tracking-[0.3em] text-[10px] text-center px-10 leading-relaxed">System Armed & Encrypted.<br/>Awaiting Visual Handshake...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center opacity-40 border-t border-slate-200 mt-10">
        <div className="flex items-center gap-2">
            <Shield size={16} />
            <p className="text-[9px] font-bold uppercase tracking-widest text-[#002147]">NETRA-AI Surveillance Core v4.2.0 • Government of India</p>
        </div>
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Restricted Data Access</p>
      </footer>
    </div>
  )
}