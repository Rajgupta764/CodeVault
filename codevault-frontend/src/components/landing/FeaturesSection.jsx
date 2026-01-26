import './FeaturesSection.css'

export default function FeaturesSection() {
    const features = [
        {
            icon: (
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                </svg>
            ),
            title: 'Paste Any Problem Link',
            description: 'Support for LeetCode, GeeksForGeeks, Codeforces, CodeChef, and more. One click to save any problem.'
        },
        {
            icon: (
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                </svg>
            ),
            title: 'Multi-Solution Storage',
            description: 'Save brute force and optimized approaches side-by-side. Track your thinking process as you improve.'
        },
        {
            icon: (
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
            ),
            title: 'Notes & Concepts',
            description: 'Document your approach, key insights, and patterns. Build your personal knowledge base for quick revision.'
        },
        {
            icon: (
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                </svg>
            ),
            title: 'Organized Collections',
            description: 'Group problems by patterns, topics, or difficulty. Find what you need when revision time comes.'
        },
        {
            icon: (
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            ),
            title: 'Revision Tracking',
            description: 'Never forget a solved problem. Track when to revisit and strengthen your understanding over time.'
        },
        {
            icon: (
                <svg className="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                </svg>
            ),
            title: 'Code Execution',
            description: 'Test your solutions in Python, Java, C++, or JavaScript without leaving the platform.'
        }
    ]

    return (
        <section id="features" className="features-section">
            <div className="features-container">
                <div className="features-header">
                    <div className="features-badge">
                        Features
                    </div>
                    <h2 className="features-title">
                        Everything you need to prepare smarter
                    </h2>
                    <p className="features-subtitle">
                        Stop losing your solutions. Build a permanent library that grows with you through your coding journey.
                    </p>
                </div>

                <div className="features-grid">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="feature-card"
                        >
                            <div className="feature-card-overlay"></div>

                            <div className="feature-card-body">
                                <div className="feature-icon-wrapper">
                                    <span className="feature-icon-inner">{feature.icon}</span>
                                </div>
                                <h3 className="feature-card-title">{feature.title}</h3>
                                <p className="feature-card-text">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
