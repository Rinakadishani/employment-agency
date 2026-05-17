import { useState, useEffect } from 'react'
import api from '../../../utils/axiosInstance'
import MainLayout from '../../../Layouts/MainLayout'
import Alert from '../../../Components/Alert'

export default function PunonjesitIndex() {
    const [punonjesit, setPunonjesit] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')

    useEffect(() => { fetchPunonjesit() }, [])

    const fetchPunonjesit = async () => {
        setLoading(true)
        try {
            const response = await api.get('/api/punonjesit')
            setPunonjesit(response.data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggle = async (p) => {
        try {
            await api.patch(`/api/punonjesit/${p.punonjes_id}/toggle`)
            setMessage('Status updated successfully')
            fetchPunonjesit()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (p) => {
        if (!confirm(`Delete ${p.emri} ${p.mbiemri}?`)) return
        try {
            await api.delete(`/api/punonjesit/${p.punonjes_id}`)
            setMessage('Staff member deleted')
            fetchPunonjesit()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <MainLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agency Staff</h1>
                    <p className="text-gray-500 mt-1">Manage agency employees</p>
                </div>
                <a href="/admin/punonjesit/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                    + Add Staff
                </a>
            </div>

            <Alert type="success" message={message} />

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Role</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {punonjesit.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-400">No staff found</td></tr>
                            ) : punonjesit.map(p => (
                                <tr key={p.punonjes_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{p.emri} {p.mbiemri}</td>
                                    <td className="px-4 py-3 text-gray-500">{p.email}</td>
                                    <td className="px-4 py-3 text-gray-500">{p.roli || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            p.aktiv ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {p.aktiv ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <a href={`/admin/punonjesit/${p.punonjes_id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</a>
                                            <button onClick={() => handleToggle(p)} className="text-amber-600 hover:underline text-xs">
                                                {p.aktiv ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button onClick={() => handleDelete(p)} className="text-red-500 hover:underline text-xs">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    )
}
