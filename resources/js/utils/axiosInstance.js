import axios from 'axios'

const api = axios.create({
    baseURL: '/',
    withCredentials: true,
})

// Track if we are already refreshing to avoid infinite loops
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            prom.resolve(token)
        }
    })
    failedQueue = []
}

// Request interceptor - attach token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    (error) => Promise.reject(error)
)

// Response interceptor - handle 401 and auto refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // If 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue the request while refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject })
                }).then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`
                    return api(originalRequest)
                }).catch(err => Promise.reject(err))
            }

            originalRequest._retry = true
            isRefreshing = true

            try {
                // Try to refresh the token
                const response = await axios.post('/api/auth/refresh', {}, {
                    withCredentials: true
                })

                const newToken = response.data.access_token
                localStorage.setItem('access_token', newToken)
                api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`

                processQueue(null, newToken)

                // Retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${newToken}`
                return api(originalRequest)

            } catch (refreshError) {
                // Refresh failed - logout user
                processQueue(refreshError, null)
                localStorage.removeItem('access_token')
                delete api.defaults.headers.common['Authorization']
                window.location.href = '/login'
                return Promise.reject(refreshError)
            } finally {
                isRefreshing = false
            }
        }

        return Promise.reject(error)
    }
)

export default api
