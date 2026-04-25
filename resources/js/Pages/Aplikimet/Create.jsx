import { useState } from 'react'
import axios from 'axios'
import Alert from '../../Components/Alert'
import MainLayout from '../../Layouts/MainLayout'

export default function AplimiCreate({ vendId }) {
    const [form, setForm] = useState({ letra_motivimit: '', shenimet: '' })
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await axios.post('/api/aplikimet', {
                vend_id: vendId,
                ...form,
            })
            setSuccess('Application submitted successfully!')
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit application')
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <a href="/jobs" className="text-sm text-indigo-600 hover:underline">
                        ← Back to jobs
                    </a>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900">Apply for Position</h1>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <Alert type="success" message={success} />
                    <Alert type="error" message={error} />

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Cover Letter
                            </label>
                            <textarea
                                value={form.letra_motivimit}
                                onChange={(e) => setForm({ ...form, letra_motivimit: e.target.value })}
                                rows={6}
                                placeholder="Tell us why you're the right candidate..."
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                Additional Notes (optional)
                            </label>
                            <textarea
                                value={form.shenimet}
                                onChange={(e) => setForm({ ...form, shenimet: e.target.value })}
                                rows={3}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !!success}
                            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit Application'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}
