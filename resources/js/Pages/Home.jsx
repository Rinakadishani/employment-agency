import MainLayout from '../Layouts/MainLayout'
import { useAuth } from '../Contexts/AuthContext'

export default function Home() {
    const { isAuthenticated, user } = useAuth()

    return (
        <MainLayout>
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Find your next opportunity
                </h1>
                <p className="text-lg text-gray-500 mb-8">
                    Browse hundreds of job positions from top companies
                </p>
                {isAuthenticated ? (
                    <div>
                        <p className="text-indigo-600 font-medium mb-4">
                            Welcome back, {user?.emri}!
                        </p>
                        <a href="/jobs" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
                            Browse Jobs
                        </a>
                    </div>
                ) : (
                    <div className="flex gap-3 justify-center">
                        <a href="/register" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
                            Get Started
                        </a>
                        <a href="/login" className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50">
                            Sign In
                        </a>
                    </div>
                )}
            </div>
        </MainLayout>
    )
}
