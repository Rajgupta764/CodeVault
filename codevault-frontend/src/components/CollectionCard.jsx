import { useRef, useEffect, useState } from 'react'
import {
    FolderOpen,
    MoreVertical,
    FileCode,
    ArrowRight,
    Edit2,
    Trash2,
    Plus,
} from 'lucide-react'
import './CollectionCard.css'

/**
 * Professional Collection Card Component
 * 
 * @param {Object} props
 * @param {Object} props.collection - Collection data
 * @param {string} props.collection.id - Collection ID
 * @param {string} props.collection.name - Collection name
 * @param {string} props.collection.description - Collection description
 * @param {number} props.collection.problem_count - Total problems in collection
 * @param {number} [props.collection.solved_count] - Number of solved problems
 * @param {string} [props.collection.color] - Border accent color (e.g., 'blue', 'green', 'purple')
 * @param {Date} [props.collection.created_at] - Creation date
 * @param {Function} props.onView - Callback when viewing collection
 * @param {Function} props.onEdit - Callback when editing collection
 * @param {Function} props.onDelete - Callback when deleting collection
 */
export default function CollectionCard({ collection, onView, onEdit, onDelete }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef(null)

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false)
            }
        }

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            return () => document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isMenuOpen])

    // Calculate solved percentage for progress bar
    const solvedCount = collection.solved_count || 0
    const totalCount = collection.problem_count || 0
    const solvePercentage = totalCount > 0 ? (solvedCount / totalCount) * 100 : 0

    return (
        <div
            className={`collection-card ${collection.color ? `color-${collection.color}` : ''}`}
        >
            {/* Card Header */}
            <div className="collection-card-header">
                <div className="collection-card-header-left">
                    <div className={`collection-card-icon ${collection.color ? `color-${collection.color}` : ''}`}>
                        <FolderOpen className="w-6 h-6" />
                    </div>
                    <h3
                        onClick={onView}
                        className="collection-card-title"
                    >
                        {collection.name}
                    </h3>
                </div>

                {/* Options Menu */}
                <div className="collection-card-menu-wrapper" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="collection-card-menu-btn"
                        title="Options"
                        aria-label="Collection options"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="collection-card-menu">
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false)
                                    onEdit()
                                }}
                                className="collection-card-menu-item"
                            >
                                <Edit2 className="w-4 h-4" />
                                <span>Edit collection</span>
                            </button>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false)
                                    // TODO: Implement add problems functionality
                                }}
                                className="collection-card-menu-item"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add problems</span>
                            </button>
                            <button
                                onClick={() => {
                                    setIsMenuOpen(false)
                                    onDelete()
                                }}
                                className="collection-card-menu-item delete"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete collection</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            {collection.description && (
                <div className="collection-card-description">
                    <p className="collection-card-description-text">
                        {collection.description}
                    </p>
                </div>
            )}

            {/* Divider */}
            <div className="collection-card-divider" />

            {/* Progress Bar (if solved_count exists) */}
            {collection.solved_count !== undefined && collection.problem_count > 0 && (
                <div className="collection-card-progress">
                    <div className="collection-card-progress-header">
                        <span>Progress</span>
                        <span>{solvedCount}/{totalCount} solved</span>
                    </div>
                    <div className="collection-card-progress-bar">
                        <div
                            className={`collection-card-progress-fill ${collection.color ? `color-${collection.color}` : ''}`}
                            style={{ width: `${solvePercentage}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="collection-card-footer">
                <div className="collection-card-stats">
                    <FileCode className="collection-card-stats-icon" />
                    <span>{totalCount} {totalCount === 1 ? 'problem' : 'problems'}</span>
                </div>
                <button
                    onClick={onView}
                    className="collection-card-view-btn"
                >
                    <span>View all</span>
                    <ArrowRight className="collection-card-view-btn-icon" />
                </button>
            </div>
        </div>
    )
}
