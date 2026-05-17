import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import api from '../../utils/axiosInstance'
import MainLayout from '../../Layouts/MainLayout'

export default function KompaniteIndex() {
    const [kompanite, setKompanite] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchKompanite()
    }, [])

    const fetchKompanite = async (params = {}) => {
        setLoading(true)
        try {
            const response = await api.get('/api/kompanitë', { params })
            setKompanite(response.data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return
        try {
            await api.delete(`/api/kompanitë/${id}`)
            fetchKompanite()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <MainLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
                    <p className="mt-1 text-gray-500">All registered companies</p>
                </div>
                <Link
                    href="/kompanitë/create"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                >
                    + Add Company
                </Link>
            </div>

            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        fetchKompanite({ search })
                    }}
                    className="flex gap-3"
                >
                    <input
                        type="text"
                        placeholder="Search companies..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                    <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700">
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('')
                            fetchKompanite()
                        }}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
                    >
                        Reset
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="py-12 text-center text-gray-500">Loading...</div>
            ) : (
                <div className="grid gap-4">
                    {kompanite.length === 0 ? (
                        <div className="py-12 text-center text-gray-400">No companies found</div>
                    ) : (
                        kompanite.map((k) => (
                            <div
                                key={k.kompani_id}
                                className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-200"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-lg font-semibold text-gray-900">{k.emri_kompanise}</h2>
                                        <p className="mt-0.5 text-sm text-indigo-600">{k.sektori}</p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {k.adresa && (
                                                <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                                    {k.adresa}
                                                </span>
                                            )}
                                            {k.numri_punonjesve && (
                                                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
                                                    {k.numri_punonjesve} employees
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Link
                                            href={`/kompanitë/${k.kompani_id}`}
                                            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-700"
                                        >
                                            View
                                        </Link>
                                        <Link
                                            href={`/kompanitë/${k.kompani_id}/edit`}
                                            className="rounded-lg bg-amber-500 px-3 py-1.5 text-sm text-white hover:bg-amber-600"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(k.kompani_id, k.emri_kompanise)}
                                            className="rounded-lg bg-red-100 px-3 py-1.5 text-sm text-red-600 hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </MainLayout>
    )
}
