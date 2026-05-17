import { useState } from 'react'
import { router } from '@inertiajs/react'
import { useAuth } from '../../Contexts/AuthContext'
import InputField from '../../Components/InputField'
import Alert from '../../Components/Alert'

export default function Register() {
    const { register } = useAuth()
    const [form, setForm] = useState({
        emri: '', mbiemri: '', email: '',
        password: '', password_confirmation: '', phone_number: '',
    })
    const [errors, setErrors] = useState({})
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            await register(form)
            router.visit('/jobs')
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {})
            } else {
                setError(err.response?.data?.message || 'Registration failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-10">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
                    <p className="text-sm text-gray-500 mt-1">Join Employment Agency today</p>
                </div>

                <Alert type="error" message={error} />

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-3">
                        <InputField
                            label="First name"
                            name="emri"
                            value={form.emri}
                            onChange={handleChange}
                            error={errors.emri?.[0]}
                            placeholder="Rina"
                        />
                        <InputField
                            label="Last name"
                            name="mbiemri"
                            value={form.mbiemri}
                            onChange={handleChange}
                            error={errors.mbiemri?.[0]}
                            placeholder="Kadishani"
                        />
                    </div>
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email?.[0]}
                        placeholder="you@example.com"
                    />
                    <InputField
                        label="Phone number (optional)"
                        name="phone_number"
                        value={form.phone_number}
                        onChange={handleChange}
                        error={errors.phone_number?.[0]}
                        placeholder="+383 44 000 000"
                    />
                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password?.[0]}
                        placeholder="Min 8 characters"
                    />
                    <InputField
                        label="Confirm password"
                        type="password"
                        name="password_confirmation"
                        value={form.password_confirmation}
                        onChange={handleChange}
                        error={errors.password_confirmation?.[0]}
                        placeholder="Repeat password"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Already have an account?{' '}
                    <a href="/login" className="text-indigo-600 hover:underline font-medium">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    )
}
