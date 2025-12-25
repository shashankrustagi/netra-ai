import React, { useState, useEffect } from 'react'
import {
  Camera,
  MapPin,
  AlertCircle,
  Clock,
  Activity,
  Bell,
  Route,
  Zap,
  Shield,
  TrendingUp,
  Target,
  Radio,
  Brain,
  CheckCircle,
  Eye,
  Download,
  Play,
} from 'lucide-react'

const metricColorMap: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  red: 'from-red-500 to-red-600',
  green: 'from-green-500 to-green-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
}

const NETRAAISystem = () => {
  const [activeTab, setActiveTab] = useState<'command' | 'tracking'>('command')
  const [alerts, setAlerts] = useState<any[]>([])

  const metrics = {
    activeCameras: 9847,
    offlineCameras: 153,
    activeIncidents: 23,
    trackedToday: 147,
    responseTime: '4.2 min',
    systemUptime: 99.87,
    aiAccuracy: 96.3,
  }

  const incident = {
    id: 'INC-2024-DL-00142',
    type: 'Armed Robbery',
    severity: 'CRITICAL',
    location: 'Connaught Place Metro, Gate 2',
    time: '14:23:45',
    suspect: {
      desc: 'Male, 25-30, Blue jacket, Black helmet',
      lastSeen: 'Karol Bagh Metro',
    },
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const sample = [
        {
          type: 'WEAPON DETECTED',
          priority: 'CRITICAL',
          color: 'red',
          loc: 'Chandni Chowk',
          cam: 'CAM-2119',
          conf: '86.7%',
        },
        {
          type: 'VEHICLE ANPR',
          priority: 'MEDIUM',
          color: 'blue',
          loc: 'CP Metro',
          cam: 'CAM-5540',
          conf: '95.2%',
        },
      ]
      setAlerts(sample)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const StatCard = ({
    icon: Icon,
    label,
    value,
    sub,
    color,
  }: any) => (
    <div
      className={`bg-gradient-to-br ${metricColorMap[color]} text-white rounded-xl p-5 shadow-lg`}
    >
      <div className="flex justify-between items-center mb-3">
        <Icon size={22} />
        <span className="text-xs bg-white/20 px-2 py-0.5 rounded">LIVE</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
      <div className="text-xs mt-1 opacity-80">{sub}</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 shadow">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded">
              <Camera className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                NETRA-AI Surveillance Platform
              </h1>
              <p className="text-sm text-blue-100">
                National Enhanced Tracking & Real-time Analytics
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">
              Delhi Police Command Center
            </div>
            <div className="text-xl font-bold">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* TABS */}
        <div className="bg-white rounded-xl shadow mb-6 flex">
          {[
            { id: 'command', label: 'Command Center', icon: Shield },
            { id: 'tracking', label: 'Live Tracking', icon: Target },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-6 py-3 font-medium ${
                activeTab === t.id
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50'
                  : 'text-gray-600'
              }`}
            >
              <t.icon size={18} />
              {t.label}
            </button>
          ))}
        </div>

        {/* COMMAND CENTER */}
        {activeTab === 'command' && (
          <>
            {/* METRICS */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <StatCard
                icon={Camera}
                label="Active Cameras"
                value="9,847"
                sub="153 offline"
                color="blue"
              />
              <StatCard
                icon={AlertCircle}
                label="Active Incidents"
                value="23"
                sub="8 Critical • 15 Medium"
                color="red"
              />
              <StatCard
                icon={Target}
                label="Tracked Today"
                value="147"
                sub="89 Apprehended"
                color="green"
              />
              <StatCard
                icon={Clock}
                label="Response Time"
                value="4.2 min"
                sub="↓ 32% vs last month"
                color="purple"
              />
              <StatCard
                icon={Brain}
                label="AI Accuracy"
                value="96.3%"
                sub="Uptime 99.87%"
                color="orange"
              />
            </div>

            {/* PANELS */}
            <div className="grid grid-cols-3 gap-6">
              {/* ALERTS */}
              <div className="bg-white rounded-xl shadow p-4">
                <div className="flex justify-between mb-3">
                  <h3 className="font-bold flex gap-2">
                    <Bell size={18} className="text-red-500" /> AI Alerts
                  </h3>
                  <span className="text-xs bg-red-100 text-red-600 px-2 rounded">
                    LIVE
                  </span>
                </div>
                <div className="space-y-3">
                  {alerts.map((a, i) => (
                    <div
                      key={i}
                      className={`border-l-4 p-3 rounded ${
                        a.priority === 'CRITICAL'
                          ? 'border-red-500 bg-red-50'
                          : 'border-blue-500 bg-blue-50'
                      }`}
                    >
                      <div className="font-semibold">{a.type}</div>
                      <div className="text-xs text-gray-600">
                        📍 {a.loc} • 📷 {a.cam} • {a.conf}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIVE OP */}
              <div className="bg-white rounded-xl shadow p-4">
                <h3 className="font-bold flex gap-2 mb-3">
                  <Activity size={18} className="text-blue-500" />
                  Active Operations
                </h3>
                <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">{incident.id}</span>
                    <span className="bg-red-600 text-white text-xs px-2 rounded">
                      CRITICAL
                    </span>
                  </div>
                  <div className="font-semibold">{incident.type}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    📍 {incident.location}
                  </div>
                  <div className="text-xs mt-2 text-green-700 font-medium">
                    ✅ Tracked: 5 cameras • 3 units deployed
                  </div>
                </div>
              </div>

              {/* PREDICTIVE */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-bold flex gap-2 mb-3">
                    <TrendingUp size={18} className="text-purple-500" />
                    Predictive Analytics
                  </h3>
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded">
                    <div className="font-semibold text-sm">
                      HIGH CRIME PROBABILITY
                    </div>
                    <div className="text-xs text-gray-600">
                      Karol Bagh Market (18:00–21:00)
                    </div>
                    <div className="text-xs">Risk: 87/100</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                  <h3 className="font-bold flex gap-2 mb-3">
                    <Radio size={18} className="text-green-500" />
                    Field Units
                  </h3>
                  <div className="flex justify-between text-sm">
                    <span>PCR Vans Active</span>
                    <span className="font-bold text-green-600">156/180</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Officers Patrolling</span>
                    <span className="font-bold text-blue-600">834</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CORE CAPABILITIES */}
            <div className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6">
              <h3 className="font-bold text-lg mb-4 flex gap-2">
                <Brain size={20} /> NETRA-AI Core Capabilities
              </h3>
              <div className="grid grid-cols-6 gap-4">
                {[
                  'Face Recognition',
                  'Person Re-ID',
                  'Vehicle ANPR',
                  'Weapon Detect',
                  'Crowd Analysis',
                  'Route Predict',
                ].map((c) => (
                  <div
                    key={c}
                    className="bg-white/10 rounded-lg p-4 text-sm text-center"
                  >
                    {c}
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

export default NETRAAISystem
