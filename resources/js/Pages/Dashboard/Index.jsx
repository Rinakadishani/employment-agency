import { useState, useEffect } from 'react'
import api from '../../utils/axiosInstance'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import MainLayout from '../../Layouts/MainLayout'
import { StatCardSkeleton } from '../../Components/LoadingSkeleton'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PIE_COLORS = ['#6366F1', '#F59E0B', '#8B5CF6', '#10B981', '#EF4444']

const statusColors = {
    pending:      'bg-yellow-100 text-yellow-700',
    reviewed:     'bg-blue-100 text-blue-700',
    intervistuar: 'bg-purple-100 text-purple-700',
    pranuar:      'bg-green-100 text-green-700',
    refuzuar:     'bg-red-100 text-red-700',
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

export default function DashboardIndex() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/api/dashboard/stats')
            .then(r => setStats(r.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <MainLayout>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Employment Agency overview</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <StatCardSkeleton key={i} />
                    ))}
                </div>
            </MainLayout>
        )
    }

    // Format monthly data for chart
    const monthlyData = stats?.aplikimet_per_muaj?.map(item => ({
        name: MONTHS[item.muaji - 1],
        aplikime: item.total
    })) || []

    // Format status data for pie chart
    const statusData = stats?.aplikimet_statusi?.map(item => ({
        name: item.statusi,
        value: item.total
    })) || []

    // Format top companies for bar chart
    const kompaniteData = stats?.kompanitë_top?.map(k => ({
        name: k.emri_kompanise.length > 15 ? k.emri_kompanise.substring(0, 15) + '...' : k.emri_kompanise,
        pozita: k.vendet_punes_count
    })) || []

    return (
        <MainLayout>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Employment Agency overview</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Candidates" value={stats?.total_kandidatet} icon="👤" color="bg-indigo-50" />
                <StatCard title="Companies" value={stats?.total_kompanitë} icon="🏢" color="bg-blue-50" />
                <StatCard title="Open Positions" value={stats?.total_vendet_punes} icon="💼" color="bg-green-50" />
                <StatCard title="Applications" value={stats?.total_aplikimet} icon="📄" color="bg-amber-50" />
                <StatCard title="Total Users" value={stats?.total_users} icon="👥" color="bg-purple-50" />
                <StatCard title="Interviews" value={stats?.total_intervistat} icon="🗓️" color="bg-pink-50" />
                <StatCard title="Unpaid Invoices" value={stats?.faturat_papaguara} icon="⚠️" color="bg-red-50" />
                <StatCard title="Revenue Collected" value={`€${stats?.faturat_shuma || 0}`} icon="💰" color="bg-teal-50" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Applications per month */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Applications per month</h2>
                    {monthlyData.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">No data yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Line type="monotone" dataKey="aplikime" stroke="#6366F1" strokeWidth={2} dot={{ fill: '#6366F1' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Applications by status */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Applications by status</h2>
                    {statusData.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-sm">No data yet</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, value }) => `${name}: ${value}`}
                                >
                                    {statusData.map((_, index) => (
                                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Top companies chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8">
                <h2 className="text-base font-semibold text-gray-900 mb-4">Top companies by job positions</h2>
                {kompaniteData.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">No data yet</div>
                ) : (
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={kompaniteData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Bar dataKey="pozita" fill="#6366F1" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Bottom tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent applications */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Applications</h2>
                    <div className="space-y-3">
                        {stats?.aplikimet_recent?.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">No applications yet</p>
                        ) : stats?.aplikimet_recent?.map(a => (
                            <div key={a.aplikim_id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {a.kandidati?.emri} {a.kandidati?.mbiemri}
                                    </p>
                                    <p className="text-xs text-gray-500">{a.vendi_punes?.titulli}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[a.statusi]}`}>
                                    {a.statusi}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming interviews */}
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
                    <div className="space-y-3">
                        {stats?.intervistat_upcoming?.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">No upcoming interviews</p>
                        ) : stats?.intervistat_upcoming?.map(i => (
                            <div key={i.interviste_id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {i.aplikimi?.kandidati?.emri} {i.aplikimi?.kandidati?.mbiemri}
                                    </p>
                                    <p className="text-xs text-gray-500">{i.aplikimi?.vendi_punes?.titulli}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-medium text-indigo-600">
                                        {new Date(i.data_intervistes).toLocaleDateString()}
                                    </p>
                                    <p className="text-xs text-gray-400">{i.ora}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    )
}
