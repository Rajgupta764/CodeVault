import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCollections, createCollection, deleteCollection, getCollectionById } from '../utils/api'
import CollectionCard from '../components/CollectionCard'
import {
    Plus,
    ArrowLeft,
    FileCode,
    FolderPlus,
    Trash2,
} from 'lucide-react'
import './Collections.css'

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
            <div className="collections-page">
                {/* Header */}
                <div className="collections-header">
                    <div className="collections-header__container">
                        <div className="collections-header__content">
                            <button
                                onClick={() => {
                                    setSelectedCollection(null)
                                    navigate('/collections')
                                }}
                                className="collections-header__back-btn"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Collections
                            </button>
                            <button
                                onClick={() => handleDeleteCollection(selectedCollection.id, selectedCollection.name)}
                                className="collections-header__delete-btn"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Collection
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="collections-content">
                    {/* Collection Info */}
                    <div className="collection-info">
                        <h1 className="collection-info__title">
                            {selectedCollection.name}
                        </h1>
                        {selectedCollection.description && (
                            <p className="collection-info__description">{selectedCollection.description}</p>
                        )}
                        <p className="collection-info__count">
                            {selectedCollection.problem_count} {selectedCollection.problem_count === 1 ? 'problem' : 'problems'}
                        </p>
                    </div>

                    {/* Problems Grid or Empty State */}
                    {selectedCollection.problems && selectedCollection.problems.length > 0 ? (
                        <div className="problems-grid">
                            {selectedCollection.problems.map((problem) => (
                                <div
                                    key={problem.id}
                                    onClick={() => navigate(`/problem/${problem.id}`)}
                                    className="problem-card"
                                >
                                    <h3 className="problem-card__title">
                                        {problem.problem_name}
                                    </h3>
                                    <div className="problem-card__tags">
                                        <span className="problem-card__tag--difficulty">
                                            {problem.difficulty}
                                        </span>
                                        <span className="problem-card__tag--platform">
                                            {problem.platform}
                                        </span>
                                    </div>
                                    <div className="problem-card__solutions">
                                        {problem.solution_count} {problem.solution_count === 1 ? 'solution' : 'solutions'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="empty-state">
                            <div className="empty-state__container">
                                <div className="empty-state__icon">
                                    <FileCode className="w-8 h-8" />
                                </div>
                                <h3 className="empty-state__title">
                                    No problems in this collection yet
                                </h3>
                                <p className="empty-state__description">
                                    To add problems to this collection:
                                </p>
                                <ol className="empty-state__steps">
                                    <li>
                                        <span className="empty-state__step-number">1</span>
                                        <span>Go to <span className="highlight">Dashboard</span></span>
                                    </li>
                                    <li>
                                        <span className="empty-state__step-number">2</span>
                                        <span>Click on any problem to view details</span>
                                    </li>
                                    <li>
                                        <span className="empty-state__step-number">3</span>
                                        <span>Use the <span className="highlight">"Add to Collection"</span> dropdown at the top</span>
                                    </li>
                                    <li>
                                        <span className="empty-state__step-number">4</span>
                                        <span>Select this collection to add the problem</span>
                                    </li>
                                </ol>
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="empty-state__button"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Go to Dashboard
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )
    }

    // Collections List View
    return (
        <div className="collections-page">
            {/* Header Section */}
            <div className="collections-list">
                {/* Page Title & Actions */}
                <div className="collections-list__header">
                    <div className="collections-list__title-section">
                        <h1>Collections</h1>
                        <p>Organize your problems into collections</p>
                    </div>
                    <div className="collections-list__actions">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="collections-list__dashboard-btn"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span>Dashboard</span>
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="collections-list__create-btn"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create Collection</span>
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-state__content">
                            <div className="loading-spinner"></div>
                            <p className="loading-state__text">Loading collections...</p>
                        </div>
                    </div>
                ) : collections.length === 0 ? (
                    /* Empty State */
                    <div className="empty-collections">
                        <div className="empty-collections__icon">
                            <FolderPlus className="w-10 h-10" />
                        </div>
                        <h3 className="empty-collections__title">No collections yet</h3>
                        <p className="empty-collections__description">
                            Organize your coding problems by creating collections.
                            Group related problems together for easier revision.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="empty-collections__button"
                        >
                            <Plus className="w-5 h-5" />
                            Create your first collection
                        </button>
                    </div>
                ) : (
                    /* Collections Grid */
                    <div className="collections-grid">
                        {collections.map((collection) => (
                            <CollectionCard
                                key={collection.id}
                                collection={collection}
                                onView={() => navigate(`/collections/${collection.id}`)}
                                onEdit={() => {
                                    // TODO: Implement edit modal
                                }}
                                onDelete={() => handleDeleteCollection(collection.id, collection.name)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Create Collection Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal__header">
                            <h2 className="modal__title">Create Collection</h2>
                        </div>

                        <form onSubmit={handleCreateCollection} className="modal__form">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">
                                    Collection Name <span className="required">*</span>
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="form-input"
                                    placeholder="e.g., Arrays & Strings"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description" className="form-label">
                                    Description (optional)
                                </label>
                                <textarea
                                    id="description"
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="form-input form-textarea"
                                    placeholder="Describe this collection..."
                                />
                            </div>

                            <div className="modal__actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false)
                                        setFormData({ name: '', description: '' })
                                        setError('')
                                    }}
                                    className="modal__cancel-btn"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="modal__submit-btn"
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
