import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/axiosInstance'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('access_token'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (token) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            fetchUser()
        } else {
            setLoading(false)
        }
    }, [token])

    const fetchUser = async () => {
        try {
            const response = await api.get('/api/auth/me')
            setUser(response.data.user)
        } catch (error) {
            logout()
        } finally {
            setLoading(false)
        }
    }

    const login = async (email, password) => {
        const response = await api.post('/api/auth/login', { email, password })
        const { access_token, user } = response.data
        localStorage.setItem('access_token', access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        setToken(access_token)
        setUser(user)
        return user
    }

    const register = async (data) => {
        const response = await api.post('/api/auth/register', data)
        const { access_token, user } = response.data
        localStorage.setItem('access_token', access_token)
        api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        setToken(access_token)
        setUser(user)
        return user
    }

    const logout = async () => {
        try {
            await api.post('/api/auth/logout')
        } catch (error) {
            // continue logout even if request fails
        }
        localStorage.removeItem('access_token')
        delete api.defaults.headers.common['Authorization']
        setToken(null)
        setUser(null)
    }

    const hasRole = (role) => {
        return user?.roles?.some(r => r.normalized_name === role.toUpperCase())
    }

    const isAdmin   = () => hasRole('ADMIN')
    const isManager = () => hasRole('MANAGER')

    return (
        <AuthContext.Provider value={{
            user, token, loading,
            login, register, logout,
            hasRole, isAdmin, isManager,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
