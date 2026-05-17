import { useState, useEffect } from 'react'
import { Link } from '@inertiajs/react'
import api from '../../utils/axiosInstance'
import MainLayout from '../../Layouts/MainLayout'
import InputField from '../../Components/InputField'
import Alert from '../../Components/Alert'

export default function KompaniaEdit({ id }) {
    const [form, setForm] = useState({
        emri_kompanise: '', sektori: '', adresa: '',
        personi_kontaktit: '', email: '', telefoni: '',
        faqja_web: '', numri_punonjesve: ''
    })
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        api.get(`/api/kompanitë/${id}`).then(r => {
            const k = r.data.kompania
            setForm({
                emri_kompanise:    k.emri_kompanise || '',
                sektori:           k.sektori || '',
                adresa:            k.adresa || '',
                personi_kontaktit: k.personi_kontaktit || '',
                email:             k.email || '',
                telefoni:          k.telefoni || '',
                faqja_web:         k.faqja_web || '',
                numri_punonjesve:  k.numri_punonjesve || '',
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
            await api.put(`/api/kompanitë/${id}`, form)
            setSuccess('Company updated successfully!')
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
                    <Link href="/kompanitë" className="text-sm text-indigo-600 hover:underline">
                        ← Back to companies
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Company</h1>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <Alert type="success" message={success} />

                    <form onSubmit={handleSubmit}>
                        <InputField label="Company name" name="emri_kompanise" value={form.emri_kompanise} onChange={handleChange} error={errors.emri_kompanise?.[0]} />
                        <InputField label="Sector" name="sektori" value={form.sektori} onChange={handleChange} error={errors.sektori?.[0]} />
                        <InputField label="Address" name="adresa" value={form.adresa} onChange={handleChange} error={errors.adresa?.[0]} />
                        <InputField label="Contact person" name="personi_kontaktit" value={form.personi_kontaktit} onChange={handleChange} error={errors.personi_kontaktit?.[0]} />
                        <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email?.[0]} />
                        <InputField label="Phone" name="telefoni" value={form.telefoni} onChange={handleChange} error={errors.telefoni?.[0]} />
                        <InputField label="Website" name="faqja_web" value={form.faqja_web} onChange={handleChange} error={errors.faqja_web?.[0]} />
                        <InputField label="Number of employees" type="number" name="numri_punonjesve" value={form.numri_punonjesve} onChange={handleChange} error={errors.numri_punonjesve?.[0]} />

                        <div className="flex gap-3 mt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Saving...' : 'Update Company'}
                            </button>
                            <Link
                                href={`/kompanitë/${id}`}
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
