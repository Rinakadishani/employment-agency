import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import api from '../../utils/axiosInstance'
import MainLayout from '../../Layouts/MainLayout'
import InputField from '../../Components/InputField'
import Alert from '../../Components/Alert'

export default function KandidatiEdit({ id }) {
    const [form, setForm] = useState({
        emri: '', mbiemri: '', telefoni: '',
        data_lindjes: '', adresa: '', profesioni: '', pervoja_vite: ''
    })
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        api.get(`/api/kandidatet/${id}`).then(r => {
            const k = r.data.kandidati
            setForm({
                emri:          k.emri || '',
                mbiemri:       k.mbiemri || '',
                telefoni:      k.telefoni || '',
                data_lindjes:  k.data_lindjes || '',
                adresa:        k.adresa || '',
                profesioni:    k.profesioni || '',
                pervoja_vite:  k.pervoja_vite || '',
            })
        })
    }, [id])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setSuccess('')
        try {
            await api.put(`/api/kandidatet/${id}`, form)
            setSuccess('Candidate updated successfully!')
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {})
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                    <Link href="/kandidatet" className="text-sm text-indigo-600 hover:underline">
                        ← Back to candidates
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Candidate</h1>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <Alert type="success" message={success} />

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="First name" name="emri" value={form.emri} onChange={handleChange} error={errors.emri?.[0]} />
                            <InputField label="Last name" name="mbiemri" value={form.mbiemri} onChange={handleChange} error={errors.mbiemri?.[0]} />
                        </div>
                        <InputField label="Phone" name="telefoni" value={form.telefoni} onChange={handleChange} error={errors.telefoni?.[0]} />
                        <InputField label="Date of birth" type="date" name="data_lindjes" value={form.data_lindjes} onChange={handleChange} error={errors.data_lindjes?.[0]} />
                        <InputField label="Address" name="adresa" value={form.adresa} onChange={handleChange} error={errors.adresa?.[0]} />
                        <InputField label="Profession" name="profesioni" value={form.profesioni} onChange={handleChange} error={errors.profesioni?.[0]} />
                        <InputField label="Years of experience" type="number" name="pervoja_vite" value={form.pervoja_vite} onChange={handleChange} error={errors.pervoja_vite?.[0]} />

                        <div className="flex gap-3 mt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Update Candidate'}
                            </button>
                            <Link
                                href={`/kandidatet/${id}`}
                                className="px-4 py-2.5 rounded-lg text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}
