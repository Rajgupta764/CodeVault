import './HeroSection.css'

export default function HeroSection({ onGetStarted }) {
    return (
        <section className="hero-section">
            <div className="hero-grid-bg"></div>
            <div className="hero-spacer"></div>

            <div className="hero-content">
                <div className="hero-stack">
                    <div className="hero-header">
                        <div className="hero-badge">
                            <span className="hero-badge-dot">
                                <span className="hero-badge-ping"></span>
                                <span className="hero-badge-core"></span>
                            </span>
                            Now supporting 4 core languages
                        </div>

                        <h1 className="hero-title">
                            Your personal vault for
                            <br className="hero-title-break" />
                            <span className="gradient-text">coding interviews</span>
                        </h1>

                        <p className="hero-subtitle">
                            Save problems from any platform. Track your solutions. Build a permanent library of interview prep materials—organized for when you need them most.
                        </p>

                        <div className="hero-ctas">
                            <button onClick={onGetStarted} className="hero-btn primary">
                                Start building your vault
                            </button>
                            <a href="#features" className="hero-btn secondary">
                                See how it works
                            </a>
                        </div>
                    </div>

                    <div className="hero-code">
                        <div className="hero-code-overlay"></div>
                        <div className="hero-code-card">
                            <div className="hero-code-header">
                                <div className="hero-code-header-content">
                                    <div className="hero-code-dots">
                                        <div className="hero-code-dot red"></div>
                                        <div className="hero-code-dot yellow"></div>
                                        <div className="hero-code-dot green"></div>
                                    </div>
                                    <div className="hero-code-header-info">
                                        <div className="hero-code-title">Two Sum</div>
                                        <div className="hero-code-subtitle">LeetCode Problem</div>
                                    </div>
                                </div>
                                <div className="hero-code-badge">Python</div>
                            </div>
                            <div className="hero-code-body">
                                <div className="code-lines">
                                    <div className="code-line">
                                        <span className="code-line-num">1</span>
                                        <span className="code-keyword">def</span> <span className="code-func">twoSum</span>
                                        <span className="code-default">(nums, target):</span>
                                    </div>
                                    <div className="code-line">
                                        <span className="code-line-num">2</span>
                                        <span className="code-default">    seen = {'{}'}</span>
                                    </div>
                                    <div className="code-line">
                                        <span className="code-line-num">3</span>
                                        <span className="code-keyword">    for</span> <span className="code-default">i, num</span>{' '}
                                        <span className="code-keyword">in</span> <span className="code-func">enumerate</span>
                                        <span className="code-default">(nums):</span>
                                    </div>
                                    <div className="code-line">
                                        <span className="code-line-num">4</span>
                                        <span className="code-default">        diff = target - num</span>
                                    </div>
                                    <div className="code-line highlight">
                                        <span className="code-line-num">5</span>
                                        <span className="code-keyword">        if</span> <span className="code-default">diff</span>{' '}
                                        <span className="code-keyword">in</span> <span className="code-default">seen:</span>
                                    </div>
                                    <div className="code-line highlight">
                                        <span className="code-line-num">6</span>
                                        <span className="code-keyword">            return</span>{' '}
                                        <span className="code-default">[seen[diff], i]</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
