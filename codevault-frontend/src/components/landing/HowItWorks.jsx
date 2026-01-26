import './HowItWorks.css'

export default function HowItWorks() {
    const steps = [
        {
            number: '01',
            title: 'Add a Problem',
            description: 'Paste a link from LeetCode, Codeforces, or any platform. CodeVault creates a permanent entry instantly.'
        },
        {
            number: '02',
            title: 'Save Your Solutions',
            description: 'Store multiple approaches—brute force, optimized, different languages. Add notes and complexity analysis.'
        },
        {
            number: '03',
            title: 'Organize & Revise',
            description: 'Group by patterns or topics. Track your progress and revisit problems before interviews.'
        }
    ]

    return (
        <section id="how-it-works" className="how-section">
            <div className="how-bg-grid"></div>
            <div className="how-container">
                <div className="how-header">
                    <div className="how-badge">
                        <span className="how-badge-dot"></span>
                        How it works
                    </div>
                    <h2 className="how-title">Simple workflow, powerful results</h2>
                    <p className="how-subtitle">Three steps to build your coding interview vault</p>
                </div>

                <div className="how-grid">
                    {steps.map((step, index) => (
                        <div key={index} className="how-step">
                            <div className="how-step-card">
                                <div className="how-step-header">
                                    <div className="how-step-number">{step.number}</div>
                                </div>
                                <div className="how-step-body">
                                    <h3 className="how-step-title">{step.title}</h3>
                                    <p className="how-step-text">{step.description}</p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="how-connector"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
