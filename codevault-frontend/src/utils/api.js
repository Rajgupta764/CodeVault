import axios from 'axios'

// Axios instance configured for backend API
// Uses environment variable or falls back to localhost
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

// Attach JWT access token from localStorage if present
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Auth endpoints
export const register = (userData) => api.post('/register/', userData)
export const login = (credentials) => api.post('/token/', credentials)

// Problem endpoints
export const getProblems = () => api.get('/problems/')
export const createProblem = (data) => api.post('/problems/', data)
export const getProblemById = (id) => api.get(`/problems/${id}/`)
export const updateProblem = (id, data) => api.patch(`/problems/${id}/`, data)
export const deleteProblem = (id) => api.delete(`/problems/${id}/`)
export const getStats = () => api.get('/problems/stats/')

// Solution endpoints
export const getSolutions = (problemId) => api.get(`/problems/${problemId}/solutions/`)
export const createSolution = (data) => api.post('/solutions/', data)

// Revision endpoints
export const getRevisionsDue = () => api.get('/problems/revision_due/')
export const markRevised = (id) => api.post(`/problems/${id}/mark_revised/`)

// Collection endpoints
export const getCollections = () => api.get('/collections/')
export const createCollection = (data) => api.post('/collections/', data)
export const getCollectionById = (id) => api.get(`/collections/${id}/`)
export const updateCollection = (id, data) => api.patch(`/collections/${id}/`, data)
export const deleteCollection = (id) => api.delete(`/collections/${id}/`)
export const addProblemToCollection = (collectionId, problemId) => api.post(`/collections/${collectionId}/add_problem/`, { problem_id: problemId })
export const removeProblemFromCollection = (collectionId, problemId) => api.post(`/collections/${collectionId}/remove_problem/`, { problem_id: problemId })

// Code execution endpoint
export const executeCode = (data) => api.post('/execute/', data)

export default api
