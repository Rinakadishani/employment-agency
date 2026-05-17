import './bootstrap'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers'
import { AuthProvider } from './Contexts/AuthContext'
import { Suspense } from 'react'

// Loading spinner shown while page chunks load
function PageLoader() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Loading...</p>
            </div>
        </div>
    )
}

createInertiaApp({
    title: (title) => `${title} - Employment Agency`,
    resolve: (name) => {
        const pages = import.meta.glob('./Pages/**/*.jsx')
        return pages[`./Pages/${name}.jsx`]()
    },
    setup({ el, App, props }) {
        const root = createRoot(el)
        root.render(
            <AuthProvider>
                <Suspense fallback={<PageLoader />}>
                    <App {...props} />
                </Suspense>
            </AuthProvider>
        )
    },
    progress: {
        color: '#4F46E5',
    },
})
