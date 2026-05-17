import { useState, useEffect } from 'react'
import api from '../../utils/axiosInstance'
import MainLayout from '../../Layouts/MainLayout'
import Alert from '../../Components/Alert'

export default function CvIndex() {
    const [cvt, setCvt] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [form, setForm] = useState({ titulli_cv: '', skedari: null })

    useEffect(() => { fetchCvt() }, [])

    const fetchCvt = async () => {
        setLoading(true)
        try {
            const r = await api.get('/api/auth/cvt')
            setCvt(r.data.cvt)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!form.skedari) {
            setError('Please select a file to upload')
            return
        }
        setUploading(true)
        setSuccess('')
        setError('')
        try {
            const data = new FormData()
            data.append('titulli_cv', form.titulli_cv)
            data.append('skedari', form.skedari)
            await api.post('/api/auth/cvt', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setSuccess('CV uploaded successfully!')
            setForm({ titulli_cv: '', skedari: null })
            // Reset file input
            const fileInput = document.getElementById('cv-file-input')
            if (fileInput) fileInput.value = ''
            fetchCvt()
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload CV')
        } finally {
            setUploading(false)
        }
    }

    const handleSetActive = async (id) => {
        try {
            await api.patch(`/api/auth/cvt/${id}/set-active`)
            setSuccess('Active CV updated!')
            fetchCvt()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this CV?')) return
        try {
            await api.delete(`/api/auth/cvt/${id}`)
            fetchCvt()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <MainLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My CVs</h1>
                <p className="text-gray-500 mt-1">Upload and manage your CVs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload form */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Upload New CV</h2>
                    <Alert type="success" message={success} />
                    <Alert type="error" message={error} />
                    <form onSubmit={handleUpload}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">CV Title</label>
                            <input
                                type="text"
                                value={form.titulli_cv}
                                onChange={e => setForm({ ...form, titulli_cv: e.target.value })}
                                placeholder="e.g. Software Developer CV 2026"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">CV File (PDF, DOC, DOCX)</label>
                            <input
                                id="cv-file-input"
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={e => setForm({ ...form, skedari: e.target.files[0] })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={uploading}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {uploading ? 'Uploading...' : 'Upload CV'}
                        </button>
                    </form>
                </div>

                {/* CV list */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h2 className="font-semibold text-gray-900">My CVs ({cvt.length})</h2>
                    </div>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : cvt.length === 0 ? (
                        <div className="text-center py-8 text-gray-400">No CVs uploaded yet</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {cvt.map(cv => (
                                <div key={cv.cv_id} className="flex items-center justify-between px-4 py-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-gray-900">{cv.titulli_cv}</p>
                                            {cv.aktive && (
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Active</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {new Date(cv.data_ngarkimit).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {!cv.aktive && (
                                            <button
                                                onClick={() => handleSetActive(cv.cv_id)}
                                                className="text-xs text-indigo-600 hover:underline"
                                            >
                                                Set Active
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(cv.cv_id)}
                                            className="text-xs text-red-500 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
