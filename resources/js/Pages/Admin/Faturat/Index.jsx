import { useState, useEffect } from 'react'
import axios from 'axios'
import MainLayout from '../../../Layouts/MainLayout'
import Alert from '../../../Components/Alert'

const statusColors = {
    paguar: 'bg-green-100 text-green-700',
    papaguar: 'bg-yellow-100 text-yellow-700',
    vonuar: 'bg-red-100 text-red-700',
}

export default function FaturatIndex() {
    const [faturat, setFaturat] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState('')
    const [filterStatus, setFilterStatus] = useState('')

    useEffect(() => { fetchFaturat() }, [])

    const fetchFaturat = async (params = {}) => {
        setLoading(true)
        try {
            const response = await axios.get('/api/faturat', { params })
            setFaturat(response.data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusUpdate = async (fatura, statusi) => {
        try {
            await axios.put(`/api/faturat/${fatura.fature_id}`, { statusi })
            setMessage('Invoice status updated')
            fetchFaturat()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <MainLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
                    <p className="text-gray-500 mt-1">Manage company invoices</p>
                </div>
                <a href="/admin/faturat/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                    + Create Invoice
                </a>
            </div>

            <Alert type="success" message={message} />

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="flex gap-3">
                    <select
                        value={filterStatus}
                        onChange={e => { setFilterStatus(e.target.value); fetchFaturat({ statusi: e.target.value }) }}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    >
                        <option value="">All statuses</option>
                        <option value="papaguar">Unpaid</option>
                        <option value="paguar">Paid</option>
                        <option value="vonuar">Overdue</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Company</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Amount</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Description</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Due Date</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {faturat.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-gray-400">No invoices found</td></tr>
                            ) : faturat.map(f => (
                                <tr key={f.fature_id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{f.kompania?.emri_kompanise}</td>
                                    <td className="px-4 py-3 text-gray-900 font-medium">€{f.shuma}</td>
                                    <td className="px-4 py-3 text-gray-500">{f.pershkrimi || '—'}</td>
                                    <td className="px-4 py-3 text-gray-500">
                                        {f.data_pageses ? new Date(f.data_pageses).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[f.statusi]}`}>
                                            {f.statusi}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {f.statusi !== 'paguar' && (
                                                <button onClick={() => handleStatusUpdate(f, 'paguar')} className="text-green-600 hover:underline text-xs">
                                                    Mark paid
                                                </button>
                                            )}
                                            <a href={`/admin/faturat/${f.fature_id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</a>
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
