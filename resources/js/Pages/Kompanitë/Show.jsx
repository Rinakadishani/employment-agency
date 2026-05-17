import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import api from '../../utils/axiosInstance'
import MainLayout from '../../Layouts/MainLayout'

export default function KompaniaShow({ id }) {
    const [kompania, setKompania] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get(`/api/kompanitë/${id}`)
            .then(r => setKompania(r.data.kompania))
            .catch(() => setError('Company not found'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <MainLayout><div className="text-center py-12 text-gray-500">Loading...</div></MainLayout>
    if (error || !kompania) return <MainLayout><div className="text-center py-12 text-red-500">{error || 'Company not found'}</div></MainLayout>

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link href="/kompanitë" className="text-sm text-indigo-600 hover:underline">
                        ← Back to companies
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{kompania.emri_kompanise}</h1>
                            <p className="text-indigo-600 font-medium mt-1">{kompania.sektori || '—'}</p>
                        </div>
                        <Link
                            href={`/kompanitë/${id}/edit`}
                            className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600"
                        >
                            Edit
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Contact Person</p>
                            <p className="font-medium text-gray-900">{kompania.personi_kontaktit || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{kompania.email || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{kompania.telefoni || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Website</p>
                            <p className="font-medium text-gray-900">
                                {kompania.faqja_web ? (
                                    <a href={kompania.faqja_web} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">
                                        {kompania.faqja_web}
                                    </a>
                                ) : '—'}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-500">Address</p>
                            <p className="font-medium text-gray-900">{kompania.adresa || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Employees</p>
                            <p className="font-medium text-gray-900">{kompania.numri_punonjesve || '—'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">
                        Job Positions ({kompania.vendet_punes?.length || 0})
                    </h2>
                    {!kompania.vendet_punes?.length ? (
                        <p className="text-sm text-gray-400">No job positions yet</p>
                    ) : (
                        <div className="space-y-2">
                            {kompania.vendet_punes.map(v => (
                                <div key={v.vend_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{v.titulli}</p>
                                        <p className="text-xs text-gray-500">{v.lokacioni} · {v.lloji_kontrates}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                        v.statusi === 'aktiv' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                        {v.statusi}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
