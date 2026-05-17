import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import api from '../../utils/axiosInstance'
import MainLayout from '../../Layouts/MainLayout'

export default function KandidatiShow({ id }) {
    const [kandidati, setKandidati] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        api.get(`/api/kandidatet/${id}`)
            .then(r => setKandidati(r.data.kandidati))
            .catch(() => setError('Candidate not found'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return <MainLayout><div className="text-center py-12 text-gray-500">Loading...</div></MainLayout>
    if (error || !kandidati) return <MainLayout><div className="text-center py-12 text-red-500">{error || 'Candidate not found'}</div></MainLayout>

    return (
        <MainLayout>
            <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                    <Link href="/kandidatet" className="text-sm text-indigo-600 hover:underline">
                        ← Back to candidates
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{kandidati.emri} {kandidati.mbiemri}</h1>
                            <p className="text-indigo-600 font-medium mt-1">{kandidati.profesioni || '—'}</p>
                        </div>
                        <Link
                            href={`/kandidatet/${id}/edit`}
                            className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600"
                        >
                            Edit
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{kandidati.email}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{kandidati.telefoni || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Address</p>
                            <p className="font-medium text-gray-900">{kandidati.adresa || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Experience</p>
                            <p className="font-medium text-gray-900">{kandidati.pervoja_vite} years</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Date of birth</p>
                            <p className="font-medium text-gray-900">{kandidati.data_lindjes || '—'}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Registered</p>
                            <p className="font-medium text-gray-900">{new Date(kandidati.data_regjistrimit).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {kandidati.aftesite?.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
                        <h2 className="font-semibold text-gray-900 mb-3">Skills</h2>
                        <div className="flex gap-2 flex-wrap">
                            {kandidati.aftesite.map(a => (
                                <span key={a.aftesi_id} className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                                    {a.emri_aftesise} — {a.pivot?.niveli}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {kandidati.aplikimet?.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="font-semibold text-gray-900 mb-3">Applications</h2>
                        <div className="space-y-2">
                            {kandidati.aplikimet.map(a => (
                                <div key={a.aplikim_id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                    <p className="text-sm text-gray-900">{a.vendi_punes?.titulli}</p>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{a.statusi}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
