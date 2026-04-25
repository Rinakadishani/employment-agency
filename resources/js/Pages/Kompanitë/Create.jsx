import { useState } from 'react'
import { Link } from '@inertiajs/react'
import axios from 'axios'
import MainLayout from '../../Layouts/MainLayout'
import InputField from '../../Components/InputField'
import Alert from '../../Components/Alert'

const initialForm = {
    emri_kompanise: '',
    sektori: '',
    adresa: '',
    personi_kontaktit: '',
    email: '',
    telefoni: '',
    faqja_web: '',
    numri_punonjesve: '',
}

export default function KompaniaCreate() {
    const [form, setForm] = useState(initialForm)
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setSuccess('')

        try {
            await axios.post('/api/kompanitë', form)
            setSuccess('Company created successfully!')
            setForm(initialForm)
            setErrors({})
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
            <div className="mx-auto max-w-2xl">
                <div className="mb-6">
                    <Link href="/kompanitë" className="text-sm text-indigo-600 hover:underline">
                        ← Back to companies
                    </Link>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900">Add Company</h1>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <Alert type="success" message={success} />

                    <form onSubmit={handleSubmit}>
                        <InputField
                            label="Company name"
                            name="emri_kompanise"
                            value={form.emri_kompanise}
                            onChange={handleChange}
                            error={errors.emri_kompanise?.[0]}
                        />
                        <InputField
                            label="Sector"
                            name="sektori"
                            value={form.sektori}
                            onChange={handleChange}
                            error={errors.sektori?.[0]}
                        />
                        <InputField
                            label="Address"
                            name="adresa"
                            value={form.adresa}
                            onChange={handleChange}
                            error={errors.adresa?.[0]}
                        />
                        <InputField
                            label="Contact person"
                            name="personi_kontaktit"
                            value={form.personi_kontaktit}
                            onChange={handleChange}
                            error={errors.personi_kontaktit?.[0]}
                        />
                        <InputField
                            label="Email"
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            error={errors.email?.[0]}
                        />
                        <InputField
                            label="Phone"
                            name="telefoni"
                            value={form.telefoni}
                            onChange={handleChange}
                            error={errors.telefoni?.[0]}
                        />
                        <InputField
                            label="Website"
                            name="faqja_web"
                            value={form.faqja_web}
                            onChange={handleChange}
                            error={errors.faqja_web?.[0]}
                        />
                        <InputField
                            label="Number of employees"
                            type="number"
                            name="numri_punonjesve"
                            value={form.numri_punonjesve}
                            onChange={handleChange}
                            error={errors.numri_punonjesve?.[0]}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Company'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}
