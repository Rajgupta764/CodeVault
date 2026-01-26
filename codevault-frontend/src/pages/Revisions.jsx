import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRevisionsDue, markRevised } from '../utils/api'
import './Revisions.css'

export default function Revisions() {
    const navigate = useNavigate()
    const [revisions, setRevisions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [markingId, setMarkingId] = useState(null)

    useEffect(() => {
        fetchRevisions()
    }, [])

    const fetchRevisions = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await getRevisionsDue()
            // Handle paginated API response
            const revisionsData = Array.isArray(response.data)
                ? response.data
                : (response.data?.problems || response.data?.results || [])
            setRevisions(revisionsData)
        } catch (err) {
            console.error('Error fetching revisions:', err)
            setError('Failed to load revisions due today')
        } finally {
            setLoading(false)
        }
    }

    const handleMarkRevised = async (problemId) => {
        setMarkingId(problemId)
        setError('')

        try {
            await markRevised(problemId)
            // Refresh the list after marking as revised
            await fetchRevisions()
        } catch (err) {
            console.error('Error marking as revised:', err)
            setError(err.response?.data?.error || 'Failed to mark problem as revised')
        } finally {
            setMarkingId(null)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'Never'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const getDifficultyClass = (difficulty) => {
        switch (difficulty) {
            case 'EASY':
                return 'bg-green-500/20 text-green-400 border-green-500'
            case 'MEDIUM':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
            case 'HARD':
                return 'bg-red-500/20 text-red-400 border-red-500'
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500'
        }
    }

    const getPlatformBadge = (platform) => {
        const badges = {
            LEETCODE: { text: 'LeetCode', color: 'bg-orange-500/20 text-orange-400' },
            GFG: { text: 'GFG', color: 'bg-green-500/20 text-green-400' },
            CODEFORCES: { text: 'CodeForces', color: 'bg-blue-500/20 text-blue-400' }
        }
        return badges[platform] || { text: platform, color: 'bg-gray-500/20 text-gray-400' }
    }

    return (
        <div className="revisions-page">
            {/* Header */}
            <header className="revisions-header">
                <div className="revisions-header__container">
                    <div className="revisions-header__content">
                        <div className="revisions-header__title-section">
                            <h1>Revisions Due</h1>
                            <p>
                                Problems scheduled for revision today
                            </p>
                        </div>
                        <div className="revisions-header__actions">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="revisions-header__back-btn"
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token')
                                    navigate('/')
                                }}
                                className="revisions-header__logout-btn"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="revisions-main">
                {/* Error Message */}
                {error && (
                    <div className="revisions-error">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="revisions-loading">
                        <div className="revisions-loading__content">
                            <div className="revisions-loading__spinner"></div>
                            <p className="revisions-loading__text">Loading revisions...</p>
                        </div>
                    </div>
                ) : revisions.length === 0 ? (
                    /* No Revisions */
                    <div className="revisions-empty">
                        <div className="revisions-empty__icon-wrapper">
                            <svg
                                className="revisions-empty__icon"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="revisions-empty__title">
                            No Revisions Due Today
                        </h2>
                        <p className="revisions-empty__description">
                            Great job! You're all caught up. Check back tomorrow or add new problems to your collection.
                        </p>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="revisions-empty__button"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    /* Revisions Grid */
                    <>
                        <div className="revisions-count">
                            <p>
                                <span className="revisions-count__number">{revisions.length}</span>{' '}
                                {revisions.length === 1 ? 'problem' : 'problems'} due for revision
                            </p>
                        </div>

                        <div className="revisions-grid">
                            {revisions.map((problem) => {
                                const platformBadge = getPlatformBadge(problem.platform)
                                return (
                                    <div
                                        key={problem.id}
                                        className="revision-card"
                                    >
                                        {/* Problem Header */}
                                        <div className="revision-card__header">
                                            <h3 className="revision-card__title">
                                                {problem.problem_name}
                                            </h3>
                                            <div className="revision-card__badges">
                                                <span
                                                    className={`revision-card__badge revision-card__badge--${problem.difficulty.toLowerCase()}`}
                                                >
                                                    {problem.difficulty}
                                                </span>
                                                <span
                                                    className={`revision-card__badge revision-card__badge--${problem.platform.toLowerCase()}`}
                                                >
                                                    {platformBadge.text}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Revision Info */}
                                        <div className="revision-card__info">
                                            <div className="revision-card__info-row">
                                                <span>Last Solved:</span>
                                                <span className="revision-card__info-value">
                                                    {formatDate(problem.last_solved)}
                                                </span>
                                            </div>
                                            <div className="revision-card__info-row">
                                                <span>Revision Due:</span>
                                                <span className="revision-card__info-value revision-card__info-value--due">
                                                    {formatDate(problem.next_revision_date)}
                                                </span>
                                            </div>
                                            <div className="revision-card__info-row">
                                                <span>Solved Count:</span>
                                                <span className="revision-card__info-value revision-card__info-value--count">
                                                    {problem.solved_count} times
                                                </span>
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        {problem.tags && problem.tags.length > 0 && (
                                            <div className="revision-card__tags">
                                                <div className="revision-card__tags-list">
                                                    {problem.tags.slice(0, 3).map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="revision-card__tag"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {problem.tags.length > 3 && (
                                                        <span className="revision-card__tag revision-card__tag--more">
                                                            +{problem.tags.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        <div className="revision-card__actions">
                                            <button
                                                onClick={() => navigate(`/problem/${problem.id}`)}
                                                className="revision-card__view-btn"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleMarkRevised(problem.id)}
                                                disabled={markingId === problem.id}
                                                className="revision-card__mark-btn"
                                            >
                                                {markingId === problem.id ? (
                                                    <>
                                                        <svg
                                                            className="revision-card__mark-btn-spinner"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                                fill="none"
                                                            />
                                                            <path
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            />
                                                        </svg>
                                                        Marking...
                                                    </>
                                                ) : (
                                                    'Mark Revised'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </main>
        </div>
    )
}
