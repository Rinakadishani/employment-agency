import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import axios from 'axios'
import MainLayout from '../../Layouts/MainLayout'

export default function KandidatetIndex() {
    const [kandidatet, setKandidatet] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchKandidatet()
    }, [])

    const fetchKandidatet = async (params = {}) => {
        setLoading(true)
        try {
            const response = await axios.get('/api/kandidatet', { params })
            setKandidatet(response.data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        fetchKandidatet({ search })
    }

    return (
        <MainLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
                    <p className="mt-1 text-gray-500">Manage all registered candidates</p>
                </div>
                <Link
                    href="/kandidatet/create"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                >
                    + Add Candidate
                </Link>
            </div>

            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
                <form onSubmit={handleSearch} className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search by name, profession, email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    />
                    <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                    >
                        Search
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setSearch('')
                            fetchKandidatet()
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
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Profession</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Experience</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {kandidatet.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-400">
                                        No candidates found
                                    </td>
                                </tr>
                            ) : (
                                kandidatet.map((k) => (
                                    <tr key={k.kandidat_id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {k.emri} {k.mbiemri}
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{k.email}</td>
                                        <td className="px-4 py-3 text-gray-500">{k.profesioni || '—'}</td>
                                        <td className="px-4 py-3 text-gray-500">{k.pervoja_vite} years</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <Link
                                                    href={`/kandidatet/${k.kandidat_id}`}
                                                    className="text-xs text-indigo-600 hover:underline"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/kandidatet/${k.kandidat_id}/edit`}
                                                    className="text-xs text-amber-600 hover:underline"
                                                >
                                                    Edit
                                                </Link>
                                            </div>
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
