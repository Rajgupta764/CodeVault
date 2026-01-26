import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginApi, register as registerApi } from '../../utils/api'
import './AuthModal.css'

export default function AuthModal({ isOpen, onClose }) {
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
                    password: form.password
                })
                setSuccess('Account created successfully. You can log in now.')
                setIsRegister(false)
            } else {
                const { data } = await loginApi({
                    username: form.username.trim(),
                    password: form.password
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

    if (!isOpen) return null

    return (
        <div className="auth-modal" role="dialog" aria-modal="true">
            <div className="auth-modal-wrapper">
                <div className="auth-card">
                    <div className="auth-card-header">
                        <div className="auth-brand-row">
                            <div className="auth-brand">
                                <div className="auth-brand-icon">
                                    <svg className="auth-brand-icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <span className="auth-brand-name">CodeVault</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="auth-close"
                                aria-label="Close dialog"
                            >
                                <svg className="auth-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div>
                            <h1 className="auth-title">
                                {isRegister ? 'Create account' : 'Sign in'}
                            </h1>
                            <p className="auth-subtitle">
                                {isRegister
                                    ? 'Join thousands preparing for technical interviews'
                                    : 'Continue your interview preparation journey'}
                            </p>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="auth-card-body">
                        {/* Status Messages */}
                        {error && (
                            <div className="auth-alert error">
                                <svg className="auth-alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="auth-alert-text">{error}</p>
                            </div>
                        )}
                        {success && (
                            <div className="auth-alert success">
                                <svg className="auth-alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="auth-alert-text">{success}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="auth-form">
                            {/* Username Field */}
                            <div className="auth-field">
                                <label htmlFor="username" className="auth-label">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={form.username}
                                    onChange={handleChange}
                                    className="auth-input"
                                    placeholder="username"
                                    autoComplete="username"
                                />
                            </div>

                            {/* Email Field (Register only) */}
                            {isRegister && (
                                <div className="auth-field">
                                    <label htmlFor="email" className="auth-label">
                                        Email address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        className="auth-input"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                    />
                                </div>
                            )}

                            {/* Password Field */}
                            <div className="auth-field">
                                <label htmlFor="password" className="auth-label">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className="auth-input"
                                    placeholder="••••••••"
                                    autoComplete={isRegister ? 'new-password' : 'current-password'}
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="auth-submit"
                            >
                                {loading ? (
                                    <span className="auth-submit-loading">
                                        <svg className="auth-spinner" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle className="auth-spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="auth-spinner-head" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing
                                    </span>
                                ) : isRegister ? (
                                    'Create account'
                                ) : (
                                    'Sign in'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Footer Section */}
                    <div className="auth-card-footer">
                        <p className="auth-footer-text">
                            {isRegister ? 'Already have an account?' : "Don't have an account?"}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                resetMessages()
                                setIsRegister((prev) => !prev)
                            }}
                            className="auth-switch"
                        >
                            {isRegister ? 'Sign in' : 'Create one'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
