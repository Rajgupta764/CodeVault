// Example: Basic CollectionCard usage

import CollectionCard from '@/components/CollectionCard'
import { useNavigate } from 'react-router-dom'
import './CollectionCard.examples.css'

// ============================================
// Example 1: Simple Collection Card
// ============================================
const BasicExample = () => {
    const navigate = useNavigate()

    const collection = {
        id: '1',
        name: 'Arrays & Strings',
        description: 'Common array and string manipulation problems',
        problem_count: 12,
    }

    return (
        <CollectionCard
            collection={collection}
            onView={() => navigate(`/collections/${collection.id}`)}
            onEdit={() => console.log('Edit collection')}
            onDelete={() => console.log('Delete collection')}
        />
    )
}

// ============================================
// Example 2: Collection with Progress Tracking
// ============================================
const WithProgressExample = () => {
    const navigate = useNavigate()

    const collection = {
        id: '2',
        name: 'Dynamic Programming',
        description: 'DP problems organized by difficulty and pattern',
        problem_count: 25,
        solved_count: 15, // Shows progress bar: 15/25 solved
    }

    return (
        <CollectionCard
            collection={collection}
            onView={() => navigate(`/collections/${collection.id}`)}
            onEdit={() => console.log('Edit collection')}
            onDelete={() => console.log('Delete collection')}
        />
    )
}

// ============================================
// Example 3: Collection with Color Accent
// ============================================
const WithColorExample = () => {
    const navigate = useNavigate()

    const collection = {
        id: '3',
        name: 'Graph Theory',
        description: 'BFS, DFS, Dijkstra, and more',
        problem_count: 18,
        solved_count: 12,
        color: 'purple', // Adds purple top border accent
    }

    return (
        <CollectionCard
            collection={collection}
            onView={() => navigate(`/collections/${collection.id}`)}
            onEdit={() => console.log('Edit collection')}
            onDelete={() => console.log('Delete collection')}
        />
    )
}

// ============================================
// Example 4: Grid of Collections
// ============================================
const CollectionGridExample = () => {
    const navigate = useNavigate()

    const collections = [
        {
            id: '1',
            name: 'Arrays & Strings',
            description: 'String manipulation and array operations',
            problem_count: 12,
            solved_count: 10,
            color: 'blue',
        },
        {
            id: '2',
            name: 'Binary Trees',
            description: 'Tree traversal, BST operations, and problems',
            problem_count: 15,
            solved_count: 8,
            color: 'green',
        },
        {
            id: '3',
            name: 'Interview Prep',
            description: 'Curated problems for technical interviews',
            problem_count: 20,
            solved_count: 5,
            color: 'red',
        },
    ]

    const handleDelete = (id, name) => {
        if (window.confirm(`Delete "${name}"?`)) {
            // Call API to delete collection
            console.log('Deleting:', id)
        }
    }

    return (
        <div className="collections-grid">
            {collections.map((collection) => (
                <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onView={() => navigate(`/collections/${collection.id}`)}
                    onEdit={() => console.log('Edit:', collection.id)}
                    onDelete={() => handleDelete(collection.id, collection.name)}
                />
            ))}
        </div>
    )
}

// ============================================
// Example 5: With Callbacks and State
// ============================================
import { useState } from 'react'

const WithCallbacksExample = () => {
    const navigate = useNavigate()
    const [editingId, setEditingId] = useState(null)

    const collections = [
        {
            id: '1',
            name: 'Study Collection',
            description: 'Problems to review this week',
            problem_count: 8,
            solved_count: 3,
        },
    ]

    const handleEdit = (collectionId) => {
        setEditingId(collectionId)
        // Open edit modal or navigate to edit page
        console.log('Edit modal opened for:', collectionId)
    }

    const handleDelete = (collectionId, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            // Call API
            console.log('Deleting:', collectionId)
        }
    }

    return (
        <div className="collections-grid-stacked">
            {collections.map((collection) => (
                <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onView={() => navigate(`/collections/${collection.id}`)}
                    onEdit={() => handleEdit(collection.id)}
                    onDelete={() => handleDelete(collection.id, collection.name)}
                />
            ))}
        </div>
    )
}

// ============================================
// Example 6: All Color Variants
// ============================================
const ColorVariantsExample = () => {
    const navigate = useNavigate()
    const colors = ['blue', 'green', 'purple', 'red', 'yellow']

    const collections = colors.map((color, index) => ({
        id: index.toString(),
        name: `${color.charAt(0).toUpperCase() + color.slice(1)} Collection`,
        description: `This collection uses the ${color} accent color`,
        problem_count: 10 + index,
        solved_count: 5 + index,
        color: color,
    }))

    return (
        <div className="collections-grid">
            {collections.map((collection) => (
                <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onView={() => navigate(`/collections/${collection.id}`)}
                    onEdit={() => console.log('Edit')}
                    onDelete={() => console.log('Delete')}
                />
            ))}
        </div>
    )
}

// ============================================
// Example 7: Empty Description
// ============================================
const WithoutDescriptionExample = () => {
    const navigate = useNavigate()

    const collection = {
        id: '1',
        name: 'Quick Problems',
        // No description provided
        problem_count: 5,
        solved_count: 2,
    }

    return (
        <CollectionCard
            collection={collection}
            onView={() => navigate(`/collections/${collection.id}`)}
            onEdit={() => console.log('Edit')}
            onDelete={() => console.log('Delete')}
        />
    )
}

export {
    BasicExample,
    WithProgressExample,
    WithColorExample,
    CollectionGridExample,
    WithCallbacksExample,
    ColorVariantsExample,
    WithoutDescriptionExample,
}
