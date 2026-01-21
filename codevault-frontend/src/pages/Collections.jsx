import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCollections, createCollection, deleteCollection, getCollectionById } from '../utils/api'

export default function Collections() {
    const navigate = useNavigate()
    const { id } = useParams()
    const [collections, setCollections] = useState([])
    const [selectedCollection, setSelectedCollection] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({ name: '', description: '' })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        fetchCollections()
    }, [])

    useEffect(() => {
        if (id) {
            fetchCollectionDetail(id)
        } else {
            setSelectedCollection(null)
        }
    }, [id])

    const fetchCollections = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await getCollections()
            // Handle paginated API response
            const collectionsData = Array.isArray(response.data) ? response.data : response.data?.results || []
            setCollections(collectionsData)
        } catch (err) {
            console.error('Error fetching collections:', err)
            setError('Failed to load collections')
        } finally {
            setLoading(false)
        }
    }

    const fetchCollectionDetail = async (collectionId) => {
        try {
            const response = await getCollectionById(collectionId)
            setSelectedCollection(response.data)
        } catch (err) {
            console.error('Error fetching collection details:', err)
            setError('Failed to load collection details')
        }
    }

    const handleCreateCollection = async (e) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            setError('Collection name is required')
            return
        }

        setSubmitting(true)
        setError('')

        try {
            await createCollection({
                name: formData.name.trim(),
                description: formData.description.trim()
            })
            setFormData({ name: '', description: '' })
            setShowModal(false)
            await fetchCollections()
        } catch (err) {
            console.error('Error creating collection:', err)
            setError(err.response?.data?.error || 'Failed to create collection')
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteCollection = async (collectionId, collectionName) => {
        if (!confirm(`Are you sure you want to delete "${collectionName}"?`)) {
            return
        }

        try {
            await deleteCollection(collectionId)
            await fetchCollections()
            if (selectedCollection?.id === collectionId) {
                setSelectedCollection(null)
                navigate('/collections')
            }
        } catch (err) {
            console.error('Error deleting collection:', err)
            setError('Failed to delete collection')
        }
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

    if (selectedCollection) {
        // Collection Detail View
        return (
            <div className="min-h-screen bg-slate-900 text-slate-100">
                <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-10">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => {
                                    setSelectedCollection(null)
                                    navigate('/collections')
                                }}
                                className="text-blue-400 hover:text-blue-300 font-medium"
                            >
                                ← Back to Collections
                            </button>
                            <button
                                onClick={() => handleDeleteCollection(selectedCollection.id, selectedCollection.name)}
                                className="rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 font-medium text-white transition"
                            >
                                Delete Collection
                            </button>
                        </div>
                    </div>
                </header>

                <main className="container mx-auto px-4 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-slate-100 mb-2">
                            {selectedCollection.name}
                        </h1>
                        {selectedCollection.description && (
                            <p className="text-slate-400">{selectedCollection.description}</p>
                        )}
                        <p className="text-sm text-slate-500 mt-2">
                            {selectedCollection.problem_count} {selectedCollection.problem_count === 1 ? 'problem' : 'problems'}
                        </p>
                    </div>

                    {selectedCollection.problems && selectedCollection.problems.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {selectedCollection.problems.map((problem) => (
                                <div
                                    key={problem.id}
                                    onClick={() => navigate(`/problem/${problem.id}`)}
                                    className="rounded-lg border border-slate-700 bg-slate-800/50 p-5 hover:border-slate-600 transition cursor-pointer"
                                >
                                    <h3 className="text-lg font-semibold text-slate-100 mb-2 line-clamp-2">
                                        {problem.problem_name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium border ${getDifficultyClass(
                                                problem.difficulty
                                            )}`}
                                        >
                                            {problem.difficulty}
                                        </span>
                                        <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-slate-300">
                                            {problem.platform}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-400">
                                        {problem.solution_count} {problem.solution_count === 1 ? 'solution' : 'solutions'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-12 text-center">
                            <div className="max-w-md mx-auto">
                                <svg
                                    className="h-16 w-16 text-slate-600 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                                    No problems in this collection yet
                                </h3>
                                <p className="text-slate-400 text-sm mb-6">
                                    To add problems to this collection:
                                </p>
                                <ol className="text-left text-sm text-slate-400 space-y-2 mb-6">
                                    <li className="flex items-start gap-2">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold">1</span>
                                        <span>Go to <strong className="text-slate-300">Dashboard</strong></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold">2</span>
                                        <span>Click on any problem to view details</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold">3</span>
                                        <span>Use the <strong className="text-slate-300">"Add to Collection"</strong> dropdown at the top</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold">4</span>
                                        <span>Select this collection to add the problem</span>
                                    </li>
                                </ol>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-2.5 font-medium text-white transition"
                                >
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        )
    }

    // Collections List View
    return (
        <div className="min-h-screen bg-slate-900 text-slate-100">
            <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-blue-400">Collections</h1>
                            <p className="text-sm text-slate-400 mt-1">
                                Organize your problems into collections
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="rounded-lg border border-slate-600 hover:bg-slate-700 px-4 py-2 font-medium text-slate-300 transition"
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="rounded-lg bg-blue-600 hover:bg-blue-700 px-4 py-2 font-semibold text-white transition"
                            >
                                + Create Collection
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {error && (
                    <div className="mb-6 rounded-lg border border-red-500 bg-red-500/10 px-4 py-3 text-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-blue-500"></div>
                            <p className="text-slate-400">Loading collections...</p>
                        </div>
                    </div>
                ) : collections.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="rounded-full bg-slate-800 p-6 mb-4">
                            <svg
                                className="h-16 w-16 text-slate-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-300 mb-2">
                            No Collections Yet
                        </h2>
                        <p className="text-slate-400 mb-6 text-center max-w-md">
                            Create your first collection to organize problems by topic, difficulty, or any category you choose.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-3 font-semibold text-white transition"
                        >
                            Create First Collection
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {collections.map((collection) => (
                            <div
                                key={collection.id}
                                className="rounded-lg border border-slate-700 bg-slate-800/50 p-6 hover:border-slate-600 transition group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3
                                        onClick={() => navigate(`/collections/${collection.id}`)}
                                        className="text-xl font-semibold text-slate-100 cursor-pointer hover:text-blue-400 transition line-clamp-2"
                                    >
                                        {collection.name}
                                    </h3>
                                    <button
                                        onClick={() => handleDeleteCollection(collection.id, collection.name)}
                                        className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition"
                                        title="Delete collection"
                                    >
                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {collection.description && (
                                    <p className="text-sm text-slate-400 mb-4 line-clamp-3">
                                        {collection.description}
                                    </p>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-slate-500">
                                        {collection.problem_count} {collection.problem_count === 1 ? 'problem' : 'problems'}
                                    </div>
                                    <button
                                        onClick={() => navigate(`/collections/${collection.id}`)}
                                        className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                                    >
                                        View →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create Collection Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-lg shadow-xl max-w-md w-full border border-slate-700">
                        <div className="border-b border-slate-700 px-6 py-4">
                            <h2 className="text-xl font-bold text-slate-100">Create Collection</h2>
                        </div>

                        <form onSubmit={handleCreateCollection} className="p-6 space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2 text-slate-300">
                                    Collection Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g., Arrays & Strings"
                                />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium mb-2 text-slate-300">
                                    Description (optional)
                                </label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 placeholder:text-slate-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    placeholder="Describe this collection..."
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setFormData({ name: '', description: '' })
                                        setError('')
                                    }}
                                    className="flex-1 rounded-lg border border-slate-600 hover:bg-slate-700 px-4 py-2.5 font-medium text-slate-300 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:cursor-not-allowed px-4 py-2.5 font-semibold text-white transition"
                                >
                                    {submitting ? 'Creating...' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
