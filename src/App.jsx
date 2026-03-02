import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import {
    Leaf,
    Search,
    Code2,
    Music,
    Palette,
    UserPlus,
    MessageSquare,
    Twitter,
    Instagram,
    Linkedin,
    ArrowRight,
    BookOpen,
    X,
    LogOut
} from 'lucide-react';

function App() {
    const [swappers, setSwappers] = useState([]);
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    // Search states
    const [teachSearch, setTeachSearch] = useState('');
    const [learnSearch, setLearnSearch] = useState('');
    const [filteredSwappers, setFilteredSwappers] = useState([]);

    // Modal states
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [newSwapper, setNewSwapper] = useState({
        full_name: '',
        teaches: '',
        wants: '',
        image_url: ''
    });

    useEffect(() => {
        // 1. Initial Session Check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            }
        });

        // 2. Listen for Auth Changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchUserProfile(session.user.id);
            } else {
                setUserProfile(null);
            }
        });

        fetchSwappers();

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (teachSearch === '' && learnSearch === '') {
            setFilteredSwappers(swappers);
        } else {
            const filtered = swappers.filter(s =>
                s.teaches?.toLowerCase().includes(teachSearch.toLowerCase()) ||
                s.wants?.toLowerCase().includes(learnSearch.toLowerCase())
            );
            setFilteredSwappers(filtered);
        }
    }, [teachSearch, learnSearch, swappers]);

    const fetchUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (data) {
                setUserProfile(data);
                setNewSwapper({
                    full_name: data.full_name,
                    teaches: data.teaches,
                    wants: data.wants,
                    image_url: data.image_url
                });
            }
        } catch (err) {
            console.log('No existing profile found for user');
        }
    };

    const fetchSwappers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const demoData = [
                { id: 'd1', full_name: 'Sarah Jenkins', teaches: 'Digital Illustration, UX Design', wants: 'French Language, Yoga', image_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', is_pro: true },
                { id: 'd2', full_name: 'David Chen', teaches: 'Python, Machine Learning', wants: 'Pottery, Interior Design', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', is_pro: false },
                { id: 'd3', full_name: 'Maya Rodriguez', teaches: 'Abstract Art, Sculpting', wants: 'Social Media Marketing', image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', is_pro: false },
                { id: 'd4', full_name: 'James Wilson', teaches: 'Financial Literacy, Investing', wants: 'Cooking Asian, Chess', image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80', is_pro: false }
            ];

            if (data && data.length > 0) {
                setSwappers([...data, ...demoData]);
            } else {
                setSwappers(demoData);
            }
        } catch (err) {
            console.error('Error fetching swappers:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) alert('Error logging in: ' + error.message);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setUserProfile(null);
    };

    const handleJoinClick = () => {
        if (!user) {
            handleGoogleLogin();
        } else {
            setShowJoinModal(true);
        }
    };

    const handleAddSwapper = async (e) => {
        e.preventDefault();
        if (!user) return handleGoogleLogin();

        setSubmitting(true);
        try {
            const profileData = {
                ...newSwapper,
                user_id: user.id,
                image_url: newSwapper.image_url || user.user_metadata.avatar_url
            };

            let result;
            if (userProfile) {
                // Update existing
                result = await supabase
                    .from('profiles')
                    .update(profileData)
                    .eq('user_id', user.id)
                    .select();
            } else {
                // Create new
                result = await supabase
                    .from('profiles')
                    .insert([profileData])
                    .select();
            }

            if (result.error) throw result.error;

            setUserProfile(result.data[0]);
            fetchSwappers();
            setShowJoinModal(false);
            alert(userProfile ? 'Profile updated successfully!' : 'Welcome to the community!');
        } catch (err) {
            console.error('Error saving profile:', err);
            alert('Error saving profile. Please check your database setup!');
        } finally {
            setSubmitting(false);
        }
    };

    const handleJoinHub = async (e) => {
        e.preventDefault();
        if (!email) return;
        setSubmitting(true);
        try {
            const { error } = await supabase
                .from('newsletter_subscriptions')
                .insert([{ email }]);

            if (error) throw error;
            alert('Thanks for joining SkillSwap Hub!');
            setEmail('');
        } catch (err) {
            console.error('Error joining:', err);
            alert('Error joining newsletter.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleConnect = (name) => {
        alert(`Connection request sent to ${name}!`);
    };

    return (
        <>
            <div className="container">
                {/* Navbar */}
                <nav className="navbar">
                    <div className="logo">
                        <Leaf className="logo-icon" size={24} />
                        <span>SkillSwap Hub</span>
                    </div>
                    <div className="nav-links">
                        <a href="#how-it-works">How It Works</a>
                        <a href="#explore">Explore Skills</a>
                        <a href="#community">Community</a>
                        <a href="#pricing">Pricing</a>
                    </div>
                    <div className="nav-buttons">
                        {user ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div onClick={handleJoinClick} style={{ cursor: 'pointer', textAlign: 'right' }}>
                                    <div style={{ fontSize: '14px', fontWeight: '700' }}>{user.user_metadata.full_name}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{userProfile ? 'View Profile' : 'Complete Profile'}</div>
                                </div>
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="avatar"
                                    style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--primary)' }}
                                />
                                <button className="social-icon" onClick={handleLogout} title="Logout">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <button className="btn btn-primary" onClick={handleGoogleLogin}>Login with Google</button>
                            </>
                        )}
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <div className="hero-badge">World's #1 Skill Exchange</div>
                        <h1 className="hero-title">
                            Trade Skills,<br />
                            <span>Not Money</span>
                        </h1>
                        <p className="hero-desc">
                            Join a vibrant community-driven platform where you exchange your expertise for new skills. No catch, just mutual growth.
                        </p>
                        <div className="hero-buttons">
                            <button className="btn btn-primary" onClick={handleJoinClick}>
                                {userProfile ? 'Edit Your Profile' : 'Get Started'}
                            </button>
                            <button className="btn btn-secondary" onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}>
                                See How It Works
                            </button>
                        </div>

                        <div className="search-bar">
                            <div className="search-field">
                                <span className="search-label">I can teach...</span>
                                <div className="search-input-wrapper">
                                    <BookOpen className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Photography, Python"
                                        value={teachSearch}
                                        onChange={(e) => setTeachSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="search-field">
                                <span className="search-label">I want to learn...</span>
                                <div className="search-input-wrapper">
                                    <Search className="search-icon" />
                                    <input
                                        type="text"
                                        placeholder="e.g. Cooking, Guitar"
                                        value={learnSearch}
                                        onChange={(e) => setLearnSearch(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="btn btn-primary search-submit" onClick={fetchSwappers}>Search</button>
                        </div>
                    </div>

                    <div className="hero-image-wrapper">
                        <div className="hero-image-bg">
                            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="People learning together" />
                        </div>

                        <div className="floating-badge badge-1">
                            <Code2 size={18} color="#FF5A36" /> Coding
                        </div>
                        <div className="floating-badge badge-2">
                            <Music size={18} color="#8C52FF" /> Guitar
                        </div>
                        <div className="floating-badge badge-3">
                            <Palette size={18} color="#00877A" /> Design
                        </div>
                    </div>
                </section>

                {/* Featured Swappers */}
                <section className="featured" id="explore">
                    <div className="section-header">
                        <h2 className="section-title">Featured Swappers</h2>
                        <a href="#" className="view-all">View All <ArrowRight size={16} /></a>
                    </div>

                    <div className="swapper-grid">
                        {filteredSwappers.map((swapper) => (
                            <div key={swapper.id} className="swapper-card">
                                {swapper.is_pro && <div className="pro-badge">Pro Swapper</div>}
                                <div className="swapper-image">
                                    <img src={swapper.image_url} alt={swapper.full_name} />
                                </div>
                                <div className="swapper-info">
                                    <h3 className="swapper-name">{swapper.full_name}</h3>
                                    <div className="skills-row">
                                        <div className="skill-item">
                                            <span className="skill-label">Teaches</span>
                                            <span className="skill-text">{swapper.teaches}</span>
                                        </div>
                                        <div className="skill-item">
                                            <span className="skill-label wants">Wants</span>
                                            <span className="skill-text">{swapper.wants}</span>
                                        </div>
                                    </div>
                                    <button className="btn btn-outline-primary" onClick={() => handleConnect(swapper.full_name)}>Connect</button>
                                </div>
                            </div>
                        ))}
                        {filteredSwappers.length === 0 && (
                            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px', opacity: 0.6 }}>
                                <p>No swappers found. Try clearing your search!</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* How It Works */}
            <section className="how-it-works" id="how-it-works">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <p className="how-desc">Trading skills is simpler than you think. Follow these three steps to start your growth journey.</p>

                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-icon-wrapper bg-orange">
                                <UserPlus size={32} />
                                <div className="step-number">1</div>
                            </div>
                            <h3 className="step-title">Create Your Profile</h3>
                            <p className="step-desc">List the skills you're proud of and the ones you've always wanted to learn. Be specific!</p>
                        </div>

                        <div className="step-card">
                            <div className="step-icon-wrapper bg-teal">
                                <Search size={32} />
                                <div className="step-number">2</div>
                            </div>
                            <h3 className="step-title">Find a Match</h3>
                            <p className="step-desc">Use our smart filters to find members who need what you teach and can offer what you want.</p>
                        </div>

                        <div className="step-card">
                            <div className="step-icon-wrapper bg-purple">
                                <MessageSquare size={32} />
                                <div className="step-number">3</div>
                            </div>
                            <h3 className="step-title">Start Swapping</h3>
                            <p className="step-desc">Message your match, set up a call or meet up, and start sharing knowledge. It's that easy!</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-box">
                        <h2 className="cta-title">Ready to level up your life?</h2>
                        <p className="cta-desc">Join 50,000+ members already trading knowledge. Your next mentor (and student) is just a click away.</p>
                        <form className="cta-form" onSubmit={handleJoinHub}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="cta-input"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                className="btn btn-primary"
                                style={{ padding: '14px 32px' }}
                                disabled={submitting}
                            >
                                {submitting ? 'Joining...' : 'Join the Hub'}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-top">
                        <div className="footer-info">
                            <div className="logo" style={{ marginBottom: '16px' }}>
                                <Leaf className="logo-icon" size={24} />
                                <span>SkillSwap Hub</span>
                            </div>
                            <p className="footer-desc">Empowering people to learn anything from anyone, without the barrier of cost.</p>
                            <div className="social-links">
                                <a href="#" className="social-icon"><Twitter size={18} /></a>
                                <a href="#" className="social-icon"><Instagram size={18} /></a>
                                <a href="#" className="social-icon"><Linkedin size={18} /></a>
                            </div>
                        </div>

                        <div>
                            <h4 className="footer-title">Platform</h4>
                            <ul className="footer-links">
                                <li><a href="#">Explore Skills</a></li>
                                <li><a href="#">Premium Hub</a></li>
                                <li><a href="#">Success Stories</a></li>
                                <li><a href="#">SkillSwap Groups</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-title">Company</h4>
                            <ul className="footer-links">
                                <li><a href="#">About Us</a></li>
                                <li><a href="#">Careers</a></li>
                                <li><a href="#">Press Kit</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="footer-title">Support</h4>
                            <ul className="footer-links">
                                <li><a href="#">Help Center</a></li>
                                <li><a href="#">Community Guidelines</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>© 2024 SkillSwap Hub. All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <a href="#">English (US)</a>
                            <a href="#">Privacy Shield</a>
                        </div>
                    </div>
                </div>
            </footer>

            {/* MODAL: Join as a Swapper */}
            {showJoinModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setShowJoinModal(false)}>
                            <X size={24} />
                        </button>
                        <h2 className="modal-title">{userProfile ? 'Update Profile' : 'Join the Community'}</h2>
                        <p className="modal-subtitle">Share your skills and find your next mentor.</p>

                        <form className="modal-form" onSubmit={handleAddSwapper}>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. John Doe"
                                    required
                                    value={newSwapper.full_name || (user ? user.user_metadata.full_name : '')}
                                    onChange={(e) => setNewSwapper({ ...newSwapper, full_name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>What can you teach?</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Piano, French, React"
                                    required
                                    value={newSwapper.teaches}
                                    onChange={(e) => setNewSwapper({ ...newSwapper, teaches: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>What do you want to learn?</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Yoga, Gardening"
                                    required
                                    value={newSwapper.wants}
                                    onChange={(e) => setNewSwapper({ ...newSwapper, wants: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Profile Image URL (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="Leave blank to use Google Avatar"
                                    value={newSwapper.image_url}
                                    onChange={(e) => setNewSwapper({ ...newSwapper, image_url: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
                                {submitting ? 'Saving...' : (userProfile ? 'Update Profile' : 'Create Profile')}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default App;
