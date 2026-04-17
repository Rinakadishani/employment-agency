import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from '@inertiajs/react'
import MainLayout from '../../Layouts/MainLayout'

const defaultFilters = {
    search: '',
    lloji_kontrates: '',
    lokacioni: '',
    paga_min: '',
    paga_max: '',
}

export default function JobsIndex() {
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState(defaultFilters)

    useEffect(() => {
        fetchJobs()
    }, [])

    const fetchJobs = async (params = {}) => {
        setLoading(true)

        try {
            const response = await axios.get('/api/vendet-punes', { params })
            setJobs(response.data.data ?? [])
        } catch (error) {
            console.error('Failed to fetch jobs', error)
            setJobs([])
        } finally {
            setLoading(false)
        }
    }

    const handleFilter = (e) => {
        e.preventDefault()
        fetchJobs(filters)
    }

    const handleReset = () => {
        setFilters(defaultFilters)
        fetchJobs()
    }

    return (
        <MainLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Job Positions</h1>
                <p className="mt-1 text-gray-500">Find your next opportunity</p>
            </div>

            <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">
                <form onSubmit={handleFilter}>
                    <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="col-span-2 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                        <select
                            value={filters.lloji_kontrates}
                            onChange={(e) => setFilters({ ...filters, lloji_kontrates: e.target.value })}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        >
                            <option value="">All types</option>
                            <option value="full-time">Full-time</option>
                            <option value="part-time">Part-time</option>
                            <option value="remote">Remote</option>
                            <option value="internship">Internship</option>
                        </select>
                        <input
                            type="text"
                            placeholder="Location..."
                            value={filters.lokacioni}
                            onChange={(e) => setFilters({ ...filters, lokacioni: e.target.value })}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                        >
                            Filter
                        </button>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 hover:bg-gray-200"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="py-12 text-center text-gray-500">Loading jobs...</div>
            ) : jobs.length === 0 ? (
                <div className="py-12 text-center text-gray-500">No job positions found.</div>
            ) : (
                <div className="grid gap-4">
                    {jobs.map((job) => (
                        <div
                            key={job.vend_id}
                            className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-indigo-300"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{job.titulli}</h2>
                                    <p className="mt-0.5 text-sm font-medium text-indigo-600">
                                        {job.kompania?.emri_kompanise}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-3">
                                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                                            {job.lokacioni}
                                        </span>
                                        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
                                            {job.lloji_kontrates}
                                        </span>
                                        <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-600">
                                            €{job.paga_min} - €{job.paga_max}
                                        </span>
                                    </div>
                                </div>

                                <Link
                                    href={`/jobs/${job.vend_id}`}
                                    className="flex-shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
                                >
                                    View
                                </Link>
                            </div>

                            <p className="mt-3 line-clamp-2 text-sm text-gray-500">{job.pershkrimi}</p>
                            <p className="mt-2 text-xs text-gray-400">
                                Deadline: {new Date(job.afati).toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </MainLayout>
    )
}
