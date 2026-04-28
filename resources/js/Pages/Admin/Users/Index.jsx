import { useState, useEffect } from 'react'
import axios from 'axios'
import MainLayout from '../../../Layouts/MainLayout'
import Alert from '../../../Components/Alert'

export default function UsersIndex() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [message, setMessage] = useState('')

    useEffect(() => { fetchUsers() }, [])

    const fetchUsers = async (params = {}) => {
        setLoading(true)
        try {
            const response = await axios.get('/api/users', { params })
            setUsers(response.data.data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleStatus = async (user) => {
        try {
            await axios.patch(`/api/users/${user.id}/toggle-status`)
            setMessage(`User ${user.emri} status updated`)
            fetchUsers()
        } catch (err) {
            console.error(err)
        }
    }

    const handleDelete = async (user) => {
        if (!confirm(`Delete ${user.emri} ${user.mbiemri}?`)) return
        try {
            await axios.delete(`/api/users/${user.id}`)
            setMessage('User deleted successfully')
            fetchUsers()
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <MainLayout>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-500 mt-1">Manage all system users</p>
                </div>
                <a href="/admin/users/create" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">
                    + Add User
                </a>
            </div>

            <Alert type="success" message={message} />

            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <form onSubmit={(e) => { e.preventDefault(); fetchUsers({ search }) }} className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm">Search</button>
                    <button type="button" onClick={() => { setSearch(''); fetchUsers() }} className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-sm">Reset</button>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Name</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Email</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Roles</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Status</th>
                                <th className="text-left px-4 py-3 text-gray-600 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.length === 0 ? (
                                <tr><td colSpan="5" className="text-center py-8 text-gray-400">No users found</td></tr>
                            ) : users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{u.emri} {u.mbiemri}</td>
                                    <td className="px-4 py-3 text-gray-500">{u.email}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1 flex-wrap">
                                            {u.roles?.map(r => (
                                                <span key={r.id} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                                                    {r.emertimi}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                            u.statusi ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {u.statusi ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <a href={`/admin/users/${u.id}/edit`} className="text-indigo-600 hover:underline text-xs">Edit</a>
                                            <button onClick={() => handleToggleStatus(u)} className="text-amber-600 hover:underline text-xs">
                                                {u.statusi ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button onClick={() => handleDelete(u)} className="text-red-500 hover:underline text-xs">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </MainLayout>
    )
}
