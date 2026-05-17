import { useState } from 'react'
import { Link, router, usePage } from '@inertiajs/react'
import { useAuth } from '../Contexts/AuthContext'

function NavLink({ href, children }) {
    const { url } = usePage()
    const active = url === href || (href !== '/' && url.startsWith(href))
    return (
        <Link
            href={href}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                    ? 'bg-indigo-50 text-indigo-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
            {children}
        </Link>
    )
}

function SectionLabel({ children }) {
    return (
        <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {children}
        </p>
    )
}

export default function MainLayout({ children }) {
    const { user, logout, isAuthenticated, isAdmin, isManager } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(true)

    const handleLogout = async () => {
        await logout()
        router.visit('/')
    }

    const showSidebar = isAuthenticated && sidebarOpen

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top navbar */}
            <nav className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    {isAuthenticated && (
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                            aria-label="Toggle sidebar"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}
                    <Link href="/" className="text-xl font-bold text-indigo-600">
                        Employment Agency
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm text-gray-500 hidden sm:block">
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
                            <Link
                                href="/register"
                                className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            <div className="flex pt-14">
                {/* Sidebar */}
                {showSidebar && (
                    <aside className="fixed left-0 top-14 bottom-0 w-56 bg-white border-r border-gray-200 overflow-y-auto z-20 flex-shrink-0">
                        <nav className="p-2 pb-6">
                            {(isAdmin() || isManager()) && (
                                <>
                                    <SectionLabel>Overview</SectionLabel>
                                    <NavLink href="/dashboard">Dashboard</NavLink>
                                </>
                            )}

                            <SectionLabel>People</SectionLabel>
                            <NavLink href="/kandidatet">Candidates</NavLink>
                            <NavLink href="/kompanitë">Companies</NavLink>

                            <SectionLabel>Jobs</SectionLabel>
                            <NavLink href="/jobs">Job Positions</NavLink>
                            <NavLink href="/aplikimet">Applications</NavLink>
                            <NavLink href="/intervistat">Interviews</NavLink>
                            <NavLink href="/ofertat">Offers</NavLink>

                            <SectionLabel>My Profile</SectionLabel>
                            <NavLink href="/aftesite">Skills</NavLink>
                            <NavLink href="/cvt">My CVs</NavLink>

                            {isAdmin() && (
                                <>
                                    <SectionLabel>Admin</SectionLabel>
                                    <NavLink href="/admin/users">Users</NavLink>
                                    <NavLink href="/admin/punonjesit">Staff</NavLink>
                                    <NavLink href="/admin/faturat">Invoices</NavLink>
                                </>
                            )}
                        </nav>
                    </aside>
                )}

                {/* Main content */}
                <main className={`flex-1 min-w-0 px-6 py-8 transition-all ${showSidebar ? 'ml-56' : ''}`}>
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
