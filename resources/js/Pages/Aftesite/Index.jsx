import { useState, useEffect } from 'react'
import api from '../../utils/axiosInstance'
import MainLayout from '../../Layouts/MainLayout'
import InputField from '../../Components/InputField'
import Alert from '../../Components/Alert'

export default function AftesiteIndex() {
    const [aftesite, setAftesite] = useState([])
    const [loading, setLoading] = useState(true)
    const [form, setForm] = useState({ emri_aftesise: '', kategoria: '' })
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => { fetchAftesite() }, [])

    const fetchAftesite = async () => {
        setLoading(true)
        try {
            const r = await api.get('/api/auth/aftesite')
            setAftesite(r.data.aftesite)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setSuccess('')
        setErrors({})
        try {
            await api.post('/api/auth/aftesite', form)
            setSuccess('Skill added successfully!')
            setForm({ emri_aftesise: '', kategoria: '' })
            fetchAftesite()
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {})
            }
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this skill?')) return
        try {
            await api.delete(`/api/auth/aftesite/${id}`)
            fetchAftesite()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <MainLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
                <p className="text-gray-500 mt-1">Manage all available skills</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Add skill form */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-semibold text-gray-900 mb-4">Add New Skill</h2>
                    <Alert type="success" message={success} />
                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="Skill name"
                            name="emri_aftesise"
                            value={form.emri_aftesise}
                            onChange={e => setForm({ ...form, emri_aftesise: e.target.value })}
                            error={errors.emri_aftesise?.[0]}
                            placeholder="e.g. React, PHP, Leadership"
                        />
                        <InputField
                            label="Category"
                            name="kategoria"
                            value={form.kategoria}
                            onChange={e => setForm({ ...form, kategoria: e.target.value })}
                            error={errors.kategoria?.[0]}
                            placeholder="e.g. Tech, Soft Skills"
                        />
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {submitting ? 'Adding...' : 'Add Skill'}
                        </button>
                    </form>
                </div>

                {/* Skills list */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                        <h2 className="font-semibold text-gray-900">All Skills ({aftesite.length})</h2>
                    </div>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : (
                        <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                            {aftesite.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">No skills yet</div>
                            ) : aftesite.map(a => (
                                <div key={a.aftesi_id} className="flex items-center justify-between px-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{a.emri_aftesise}</p>
                                        <p className="text-xs text-gray-500">{a.kategoria || '—'}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(a.aftesi_id)}
                                        className="text-xs text-red-500 hover:text-red-700 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    )
}
