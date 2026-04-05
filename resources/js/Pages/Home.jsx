export default function Home() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-indigo-600 mb-4">
                    Employment Agency
                </h1>
                <p className="text-gray-500 text-lg">
                    Laravel + React + Inertia.js is working! ✓
                </p>
                <div className="mt-6 flex gap-3 justify-center">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">Laravel 12</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">React 18</span>
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">Tailwind v4</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">JWT Auth</span>
                </div>
            </div>
        </div>
    )
}