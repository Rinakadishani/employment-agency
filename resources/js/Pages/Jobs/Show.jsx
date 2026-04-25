import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from '@inertiajs/react'
import MainLayout from '../../Layouts/MainLayout'
import { useAuth } from '../../Contexts/AuthContext'
import Alert from '../../Components/Alert'

export default function JobShow({ id }) {
    const { isAuthenticated } = useAuth()
    const [job, setJob] = useState(null)
    const [loading, setLoading] = useState(true)
    const [success] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        fetchJob()
    }, [])

    const fetchJob = async () => {
        try {
            const response = await axios.get(`/api/vendet-punes/${id}`)
            setJob(response.data.vendi)
        } catch (err) {
            setError('Job not found')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <MainLayout>
                <div className="py-12 text-center">Loading...</div>
            </MainLayout>
        )
    }

    if (!job) {
        return (
            <MainLayout>
                <div className="py-12 text-center text-red-500">{error}</div>
            </MainLayout>
        )
    }

    return (
        <MainLayout>
            <div className="mx-auto max-w-3xl">
                <Link href="/jobs" className="mb-4 inline-block text-sm text-indigo-600 hover:underline">
                    ← Back to jobs
                </Link>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{job.titulli}</h1>
                            <p className="mt-1 font-medium text-indigo-600">{job.kompania?.emri_kompanise}</p>
                        </div>
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${
                                job.statusi === 'aktiv'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-gray-100 text-gray-500'
                            }`}
                        >
                            {job.statusi}
                        </span>
                    </div>

                    <div className="mb-6 flex flex-wrap gap-3">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                            {job.lokacioni}
                        </span>
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-600">
                            {job.lloji_kontrates}
                        </span>
                        <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-green-600">
                            €{job.paga_min} - €{job.paga_max}
                        </span>
                    </div>

                    <div className="mb-6">
                        <h2 className="mb-2 font-semibold text-gray-900">Description</h2>
                        <p className="text-sm leading-relaxed text-gray-600">{job.pershkrimi}</p>
                    </div>

                    {job.kerkesat && (
                        <div className="mb-6">
                            <h2 className="mb-2 font-semibold text-gray-900">Requirements</h2>
                            <p className="text-sm leading-relaxed text-gray-600">{job.kerkesat}</p>
                        </div>
                    )}

                    <p className="mb-6 text-sm text-gray-400">
                        Application deadline: {new Date(job.afati).toLocaleDateString()}
                    </p>

                    <Alert type="success" message={success} />
                    <Alert type="error" message={error} />

                    {isAuthenticated ? (
                        <Link
                            href={`/jobs/${job.vend_id}/apply`}
                            className="block w-full rounded-lg bg-indigo-600 py-3 text-center text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            Apply for this position
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="block w-full rounded-lg bg-gray-100 py-3 text-center text-sm font-medium text-gray-600 hover:bg-gray-200"
                        >
                            Login to apply
                        </Link>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
