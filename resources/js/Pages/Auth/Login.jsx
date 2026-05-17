import { useState } from 'react'
import { router } from '@inertiajs/react'
import { useAuth } from '../../Contexts/AuthContext'
import InputField from '../../Components/InputField'
import Alert from '../../Components/Alert'

export default function Login() {
    const { login } = useAuth()
    const [form, setForm] = useState({ email: '', password: '' })
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
            const user = await login(form.email, form.password)
            const role = user.roles?.[0]?.normalized_name
            if (role === 'ADMIN' || role === 'MANAGER') {
                router.visit('/dashboard')
            } else {
                router.visit('/jobs')
            }
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors || {})
            } else {
                setError(err.response?.data?.message || 'Login failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                    <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
                </div>

                <Alert type="error" message={error} />

                <form onSubmit={handleSubmit}>
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
                        label="Password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password?.[0]}
                        placeholder="••••••••"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 mt-2"
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Don't have an account?{' '}
                    <a href="/register" className="text-indigo-600 hover:underline font-medium">
                        Register
                    </a>
                </p>
            </div>
        </div>
    )
}
