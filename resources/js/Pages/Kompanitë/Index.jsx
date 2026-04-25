import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import axios from 'axios'
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
            const response = await axios.get('/api/kompanitë', { params })
            setKompanite(response.data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
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
                    <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white">
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('')
                            fetchKompanite()
                        }}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600"
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
                                className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">{k.emri_kompanise}</h2>
                                        <p className="mt-0.5 text-sm text-indigo-600">{k.sektori}</p>
                                        <div className="mt-2 flex flex-wrap gap-3">
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
                                    <Link
                                        href={`/kompanitë/${k.kompani_id}`}
                                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </MainLayout>
    )
}
