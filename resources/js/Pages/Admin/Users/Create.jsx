import { useState, useEffect } from 'react'
import api from '../../../utils/axiosInstance'
import MainLayout from '../../../Layouts/MainLayout'
import InputField from '../../../Components/InputField'
import Alert from '../../../Components/Alert'

export default function UserCreate() {
    const [form, setForm] = useState({
        emri: '', mbiemri: '', email: '',
        password: '', phone_number: '', role_id: ''
    })
    const [roles, setRoles] = useState([])
    const [errors, setErrors] = useState({})
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        api.get('/api/roles').then(r => setRoles(r.data))
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
        setErrors({ ...errors, [e.target.name]: '' })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await api.post('/api/users', form)
            setSuccess('User created successfully!')
            setForm({ emri: '', mbiemri: '', email: '', password: '', phone_number: '', role_id: '' })
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
                    <a href="/admin/users" className="text-sm text-indigo-600 hover:underline">← Back to users</a>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2">Add User</h1>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <Alert type="success" message={success} />

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <InputField label="First name" name="emri" value={form.emri} onChange={handleChange} error={errors.emri?.[0]} />
                            <InputField label="Last name" name="mbiemri" value={form.mbiemri} onChange={handleChange} error={errors.mbiemri?.[0]} />
                        </div>
                        <InputField label="Email" type="email" name="email" value={form.email} onChange={handleChange} error={errors.email?.[0]} />
                        <InputField label="Phone" name="phone_number" value={form.phone_number} onChange={handleChange} error={errors.phone_number?.[0]} />
                        <InputField label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password?.[0]} />

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                            <select
                                name="role_id"
                                value={form.role_id}
                                onChange={handleChange}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.role_id ? 'border-red-500' : 'border-gray-300'}`}
                            >
                                <option value="">Select role...</option>
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.emertimi}</option>
                                ))}
                            </select>
                            {errors.role_id && <p className="mt-1 text-xs text-red-500">{errors.role_id[0]}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 mt-2"
                        >
                            {loading ? 'Saving...' : 'Save User'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    )
}
