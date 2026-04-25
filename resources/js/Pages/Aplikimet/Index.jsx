import { useEffect, useState } from 'react'
import axios from 'axios'
import MainLayout from '../../Layouts/MainLayout'

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    reviewed: 'bg-blue-100 text-blue-700',
    intervistuar: 'bg-purple-100 text-purple-700',
    pranuar: 'bg-green-100 text-green-700',
    refuzuar: 'bg-red-100 text-red-700',
}

export default function AplimiIndex() {
    const [aplikimet, setAplikimet] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAplikimet()
    }, [])

    const fetchAplikimet = async () => {
        setLoading(true)
        try {
            const response = await axios.get('/api/aplikimet')
            setAplikimet(response.data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleWithdraw = async (id) => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) return

        try {
            await axios.delete(`/api/aplikimet/${id}`)
            fetchAplikimet()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <MainLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
                <p className="mt-1 text-gray-500">Track all your job applications</p>
            </div>

            {loading ? (
                <div className="py-12 text-center text-gray-500">Loading...</div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Position</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Company</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {aplikimet.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">
                                        No applications yet
                                    </td>
                                </tr>
                            ) : (
                                aplikimet.map((a) => (
                                    <tr key={a.aplikim_id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {a.vendi_punes?.titulli}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {a.vendi_punes?.kompania?.emri_kompanise}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(a.data_aplikimit).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2 py-1 text-xs font-medium ${statusColors[a.statusi]}`}
                                            >
                                                {a.statusi}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {a.statusi === 'pending' && (
                                                <button
                                                    onClick={() => handleWithdraw(a.aplikim_id)}
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Withdraw
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    )
}
