import { useState } from 'react'
import { Link } from '@inertiajs/react'
import axios from 'axios'
import MainLayout from '../../Layouts/MainLayout'
import InputField from '../../Components/InputField'
import Alert from '../../Components/Alert'

const initialForm = {
    emri: '',
    mbiemri: '',
    email: '',
    telefoni: '',
    data_lindjes: '',
    adresa: '',
    profesioni: '',
    pervoja_vite: '',
}

export default function KandidatiCreate() {
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
            await axios.post('/api/kandidatet', form)
            setSuccess('Candidate created successfully!')
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
                    <Link href="/kandidatet" className="text-sm text-indigo-600 hover:underline">
                        ← Back to candidates
                    </Link>
                    <h1 className="mt-2 text-2xl font-bold text-gray-900">Add Candidate</h1>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <Alert type="success" message={success} />

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="First name"
                                name="emri"
                                value={form.emri}
                                onChange={handleChange}
                                error={errors.emri?.[0]}
                            />
                            <InputField
                                label="Last name"
                                name="mbiemri"
                                value={form.mbiemri}
                                onChange={handleChange}
                                error={errors.mbiemri?.[0]}
                            />
                        </div>
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
                            label="Date of birth"
                            type="date"
                            name="data_lindjes"
                            value={form.data_lindjes}
                            onChange={handleChange}
                            error={errors.data_lindjes?.[0]}
                        />
                        <InputField
                            label="Address"
                            name="adresa"
                            value={form.adresa}
                            onChange={handleChange}
                            error={errors.adresa?.[0]}
                        />
                        <InputField
                            label="Profession"
                            name="profesioni"
                            value={form.profesioni}
                            onChange={handleChange}
                            error={errors.profesioni?.[0]}
                        />
                        <InputField
                            label="Years of experience"
                            type="number"
                            name="pervoja_vite"
                            value={form.pervoja_vite}
                            onChange={handleChange}
                            error={errors.pervoja_vite?.[0]}
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-2 w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Candidate'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}
