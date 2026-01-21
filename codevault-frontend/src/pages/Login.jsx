import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, register as registerApi } from '../utils/api'

export default function Login() {
    const [isRegister, setIsRegister] = useState(false)
    const [form, setForm] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const resetMessages = () => {
        setError('')
        setSuccess('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        resetMessages()
        setLoading(true)
        try {
            if (isRegister) {
                await registerApi({
                    username: form.username.trim(),
                    email: form.email.trim(),
                    password: form.password,
                })
                setSuccess('Account created successfully. You can log in now.')
                setIsRegister(false)
            } else {
                const { data } = await loginApi({
                    username: form.username.trim(),
                    password: form.password,
                })
                if (data?.access) {
                    localStorage.setItem('token', data.access)
                    navigate('/dashboard')
                } else {
                    setError('Login succeeded but no token returned.')
                }
            }
        } catch (err) {
            const apiError = err?.response?.data
            const message =
                apiError?.error ||
                apiError?.detail ||
                (Array.isArray(apiError) ? apiError.join(' ') : '') ||
                'Something went wrong. Please try again.'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-slate-800/70 border border-slate-700 rounded-xl shadow-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-semibold">
                        {isRegister ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <button
                        type="button"
                        onClick={() => {
                            resetMessages()
                            setIsRegister((prev) => !prev)
                        }}
                        className="text-sm text-blue-300 hover:text-blue-200"
                    >
                        {isRegister ? 'Have an account? Login' : 'New here? Register'}
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 rounded-lg border border-emerald-500 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                        {success}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm mb-1" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            value={form.username}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="your_username"
                        />
                    </div>

                    {isRegister && (
                        <div>
                            <label className="block text-sm mb-1" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="you@example.com"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm mb-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-slate-100 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-blue-900 disabled:cursor-not-allowed px-4 py-2 font-semibold text-white transition"
                    >
                        {loading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}
