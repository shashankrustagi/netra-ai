import React, { useEffect, useState } from 'react'
import {
  Camera,
  Shield,
  Target,
  AlertCircle,
  Clock,
  Brain,
  Bell,
  Activity,
  TrendingUp,
  Radio,
  Route,
  MapPin,
  Download,
  Play,
  CheckCircle,
  Eye,
  Zap,
} from 'lucide-react'

type Alert = {
  id: number
  type: string
  priority: 'HIGH' | 'MEDIUM' | 'CRITICAL'
  loc: string
  cam: string
  conf: string
  time: string
}

type TrackNode = {
  id: number
  cam: string
  loc: string
  time: string
  conf: number
  match: boolean
  type: string
}

export default function App() {
  const [tab, setTab] = useState<'command' | 'tracking'>('command')
  const [duration, setDuration] = useState(13 * 60)

  /* ---------------- COMMAND CENTER DATA ---------------- */
  const alerts: Alert[] = [
    { id: 1, type: 'FACE MATCH', priority: 'HIGH', loc: 'Karol Bagh', cam: 'CAM-0443', conf: '91.6%', time: '23:30:19' },
    { id: 2, type: 'VEHICLE ANPR', priority: 'MEDIUM', loc: 'CP Metro', cam: 'CAM-7417', conf: '87.1%', time: '23:29:19' },
    { id: 3, type: 'VEHICLE ANPR', priority: 'MEDIUM', loc: 'Karol Bagh', cam: 'CAM-2368', conf: '93.4%', time: '23:24:55' },
    { id: 4, type: 'FACE MATCH', priority: 'HIGH', loc: 'CP Metro', cam: 'CAM-2746', conf: '85.5%', time: '23:24:46' },
  ]

  /* ---------------- LIVE TRACKING DATA ---------------- */
  const [route, setRoute] = useState<TrackNode[]>([
    { id: 1, cam: 'CAM-0012', loc: 'CP Metro Exit Gate 2', time: '14:24:10', conf: 98.2, match: true, type: 'FACE+CLOTHING' },
    { id: 2, cam: 'CAM-0045', loc: 'Barakhamba Road Junction', time: '14:26:35', conf: 96.8, match: true, type: 'RE-ID+VEHICLE' },
    { id: 3, cam: 'CAM-0089', loc: 'Patel Chowk Crossing', time: '14:29:12', conf: 94.1, match: true, type: 'RE-ID' },
    { id: 4, cam: 'CAM-0134', loc: 'RK Ashram Marg', time: '14:32:48', conf: 91.5, match: true, type: 'GAIT+RE-ID' },
    { id: 5, cam: 'CAM-0201', loc: 'Karol Bagh Metro', time: '14:35:20', conf: 93.3, match: true, type: 'FACE+RE-ID' },
    { id: 6, cam: 'CAM-0267', loc: 'Ajmal Khan Road', time: '~14:37:45', conf: 88, match: false, type: 'PREDICTED' },
  ])

  useEffect(() => {
    const t = setInterval(() => setDuration(d => d + 1), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => {
      setRoute(prev => {
        const copy = [...prev]
        const next = copy.find(n => !n.match)
        if (next) {
          next.match = true
          next.conf = +(90 + Math.random() * 6).toFixed(1)
          next.type = 'FACE+RE-ID'
          next.time = new Date().toLocaleTimeString()
        }
        return [...copy]
      })
    }, 6000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded">
              <Camera className="text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold">NETRA-AI Surveillance Platform</div>
              <div className="text-sm text-blue-100">
                National Enhanced Tracking & Real-time Analytics
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm">Delhi Police Command Center</div>
            <div className="text-lg font-bold">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex bg-white rounded shadow mb-4">
          <button onClick={() => setTab('command')} className={`px-6 py-3 flex gap-2 items-center ${tab === 'command' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
            <Shield size={18} /> Command Center
          </button>
          <button onClick={() => setTab('tracking')} className={`px-6 py-3 flex gap-2 items-center ${tab === 'tracking' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}>
            <Target size={18} /> Live Tracking
          </button>
        </div>

        {/* ================= COMMAND CENTER ================= */}
        {tab === 'command' && (
          <>
            {/* METRICS */}
            <div className="grid grid-cols-5 gap-4 mb-4">
              {[
                { label: 'Active Cameras', value: '9,847', sub: '153 offline', icon: Camera, bg: 'bg-blue-500' },
                { label: 'Active Incidents', value: '23', sub: '8 Critical • 15 Medium', icon: AlertCircle, bg: 'bg-red-500' },
                { label: 'Tracked Today', value: '147', sub: '89 Apprehended', icon: Target, bg: 'bg-green-500' },
                { label: 'Response Time', value: '4.2 min', sub: '↓ 32% vs last month', icon: Clock, bg: 'bg-purple-500' },
                { label: 'AI Accuracy', value: '96.3%', sub: 'Uptime 99.87%', icon: Brain, bg: 'bg-orange-500' },
              ].map((m, i) => (
                <div key={i} className={`${m.bg} text-white p-4 rounded shadow`}>
                  <div className="flex justify-between mb-2">
                    <m.icon />
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">LIVE</span>
                  </div>
                  <div className="text-2xl font-bold">{m.value}</div>
                  <div className="text-sm">{m.label}</div>
                  <div className="text-xs">{m.sub}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* AI Alerts */}
              <div className="bg-white rounded shadow p-3">
                <div className="font-bold flex gap-2 items-center mb-2">
                  <Bell /> AI Alerts
                </div>
                {alerts.map(a => (
                  <div key={a.id} className="border-l-4 border-orange-500 bg-orange-50 p-2 mb-2">
                    <div className="font-semibold">{a.type} ({a.priority})</div>
                    <div className="text-sm">{a.loc} • {a.cam} • {a.conf}</div>
                  </div>
                ))}
              </div>

              {/* Active Ops */}
              <div className="bg-white rounded shadow p-3">
                <div className="font-bold flex gap-2 items-center mb-2">
                  <Activity /> Active Operations
                </div>
                <div onClick={() => setTab('tracking')} className="cursor-pointer bg-red-50 border-2 border-red-300 p-3 rounded">
                  <div className="font-bold">INC-2024-DL-00142</div>
                  <div className="text-sm">Armed Robbery</div>
                  <div className="text-xs mt-1">Tracked: 5 cameras • 3 units</div>
                </div>
              </div>

              {/* Predictive */}
              <div className="bg-white rounded shadow p-3">
                <div className="font-bold flex gap-2 items-center mb-2">
                  <TrendingUp /> Predictive Analytics
                </div>
                <div className="bg-red-50 border-l-4 border-red-500 p-2">
                  <div className="font-semibold">HIGH CRIME PROBABILITY</div>
                  <div className="text-sm">Karol Bagh Market</div>
                  <div className="text-xs">Risk: 87/100</div>
                </div>
                <div className="mt-3 text-sm flex justify-between">
                  <span>PCR Vans</span><span className="font-bold text-green-600">156/180</span>
                </div>
                <div className="text-sm flex justify-between">
                  <span>Officers</span><span className="font-bold text-blue-600">834</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ================= LIVE TRACKING ================= */}
        {tab === 'tracking' && (
          <>
            {/* INCIDENT HEADER */}
            <div className="bg-red-700 text-white rounded p-4 mb-4 flex justify-between">
              <div>
                <div className="font-bold flex gap-2 items-center">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  INC-2024-DL-00142
                  <span className="bg-white text-red-700 px-2 py-0.5 rounded text-xs">CRITICAL</span>
                </div>
                <div className="text-xl font-semibold mt-1">Armed Robbery</div>
                <div className="grid grid-cols-4 gap-4 text-sm mt-2">
                  <div>Origin<br /><b>Connaught Place Metro</b></div>
                  <div>Last Seen<br /><b>Karol Bagh Metro</b></div>
                  <div>Time<br /><b>14:23:45</b></div>
                  <div>Duration<br /><b>{Math.floor(duration / 60)}m {duration % 60}s</b></div>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded text-center">
                <div className="text-xl font-bold">LIVE</div>
                <div className="text-sm">5 Cameras • 3 Units</div>
              </div>
            </div>

            {/* BODY */}
            <div className="grid grid-cols-12 gap-4">
              {/* MAP */}
              <div className="col-span-7 bg-gray-900 rounded relative flex items-center justify-center text-gray-400">
                <MapPin size={36} /> <span className="ml-2">Live Map View</span>
              </div>

              {/* PIPELINE */}
              <div className="col-span-5 bg-white rounded shadow p-4 space-y-4 max-h-[520px] overflow-y-auto">
                <div className="font-bold flex gap-2 items-center">
                  <Route /> Tracking Pipeline
                </div>
                {route.map((p, i) => (
                  <div key={p.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${p.match ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>
                        {p.match ? <CheckCircle size={16} /> : <Eye size={16} />}
                      </div>
                      {i < route.length - 1 && <div className="w-1 h-10 bg-gray-300" />}
                    </div>
                    <div className={`flex-1 border rounded p-3 ${p.match ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-dashed'}`}>
                      <div className="flex justify-between">
                        <div>
                          <div className="font-semibold text-blue-600">{p.cam}</div>
                          <div className="text-sm">{p.loc}</div>
                          <span className="text-xs bg-blue-100 px-2 py-0.5 rounded">{p.type}</span>
                        </div>
                        <div className="text-right text-sm">
                          <div>{p.time}</div>
                          <div>{p.conf}%</div>
                        </div>
                      </div>
                      {p.match && (
                        <div className="flex gap-2 mt-2">
                          <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded flex gap-1">
                            <Play size={12} /> View
                          </button>
                          <button className="text-xs bg-gray-600 text-white px-2 py-1 rounded flex gap-1">
                            <Download size={12} /> Save
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
