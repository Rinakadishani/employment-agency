import { Link, router } from '@inertiajs/react'
import { useAuth } from '../Contexts/AuthContext'

export default function MainLayout({ children }) {
    const { user, logout, isAuthenticated, isAdmin, isManager } = useAuth()

    const handleLogout = async () => {
        await logout()
        router.visit('/')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link href="/" className="text-xl font-bold text-indigo-600">
                        Employment Agency
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link href="/jobs" className="text-sm text-gray-600 hover:text-indigo-600">
                            Job Positions
                        </Link>

                        {isAuthenticated ? (
                            <>
                                {(isAdmin() || isManager()) && (
                                    <Link href="/dashboard" className="text-sm text-gray-600 hover:text-indigo-600">
                                        Dashboard
                                    </Link>
                                )}
                                <span className="text-sm text-gray-500">
                                    {user?.emri} {user?.mbiemri}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-sm text-gray-600 hover:text-indigo-600">
                                    Login
                                </Link>
                                <Link href="/register" className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Page content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </main>
        </div>
    )
}