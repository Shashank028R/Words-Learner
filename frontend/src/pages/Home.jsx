import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { 
    BookOpen, 
    TrendingUp, 
    Target, 
    Star, 
    Facebook, 
    Twitter, 
    Instagram,
    Sun,
    Moon,
    MonitorSmartphone
} from "lucide-react";

// To avoid import errors in this environment, the Navbar is included in the same file.
const Navbar = ({ theme, toggleTheme, navItems }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const token = localStorage.getItem("token");

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 dark:bg-gray-900/10 backdrop-blur-lg shadow-sm border-b border-white/10 dark:border-gray-800/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="p-2 bg-white/20 dark:bg-gray-800/30 rounded-lg">
                           <BookOpen className="h-6 w-6 text-cyan-900 dark:text-cyan-400" />
                        </div>
                        <span className="text-xl font-bold text-gray-800 dark:text-white">
                           Learn Words
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                                    isActive(item.path)
                                        ? "bg-cyan-500 text-white"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        
                         {token && (
                           <button
                                onClick={handleLogout}
                                className="hidden md:block px-4 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-transform duration-300 hover:scale-105"
                            >
                                Logout
                            </button>
                        )}
                        <div className="md:hidden">
                            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5">
                                <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                                    <span className="w-5 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
                                    <span className="w-5 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
                                    <span className="w-5 h-0.5 bg-gray-800 dark:bg-gray-200"></span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {menuOpen && (
                <div className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md border-t border-white/10 dark:border-gray-800/20">
                    <div className="flex flex-col space-y-2 p-4">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path} onClick={() => setMenuOpen(false)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition ${isActive(item.path) ? "bg-cyan-500 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"}`}>
                                {item.label}
                            </Link>
                        ))}
                         {token && (
                            <button
                                onClick={() => { setMenuOpen(false); handleLogout(); }}
                                className="w-full px-3 py-2 text-sm font-medium rounded-md bg-red-500 text-white hover:bg-red-600 transition text-left"
                            >
                                Logout
                            </button>
                       )}
                    </div>
                </div>
            )}
        </nav>
    );
};

// Reusable component for feature cards
const FeatureCard = ({ icon, title, description }) => (
    <div className="glass-card p-6 text-center rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-cyan-400/20">
        <div className="bg-white/20 dark:bg-gray-800/40 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center border border-white/20 dark:border-gray-700/50">
            {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            {description}
        </p>
    </div>
);


const Home = () => {
    const navigate = useNavigate();
    const [theme, setTheme] = useState('light');

    const navItems = [
        { path: "/", label: "Home" },
        { path: "/dashboard", label: "Dashboard" },
        { path: "/courses", label: "Courses" },
        { path: "/profile", label: "Profile" },
    ];

    // Handle theme switching
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleBegin = () => {
        const token = localStorage.getItem("token");
        navigate(token ? "/dashboard" : "/login");
    };
    
    const features = [
        { icon: <BookOpen className="h-8 w-8 text-cyan-900 dark:text-cyan-400" />, title: "Daily Word Tracking", description: "Learn new English words every day with our structured and engaging lessons." },
        { icon: <TrendingUp className="h-8 w-8 text-cyan-900 dark:text-cyan-400" />, title: "Growth Dashboard", description: "Visualize your learning journey with an intuitive dashboard and progress charts." },
        { icon: <Target className="h-8 w-8 text-cyan-900 dark:text-cyan-400" />, title: "Course Progress", description: "Stay on track by monitoring your completion of daily word courses and modules." },
        { icon: <MonitorSmartphone className="h-8 w-8 text-cyan-900 dark:text-cyan-400" />, title: "Dark/Light UI", description: "Switch between a light and dark interface for a comfortable viewing experience." }
    ];

    const socialLinks = [
      { icon: Facebook, href: "#", label: "Facebook" },
      { icon: Twitter, href: "#", label: "Twitter" },
      { icon: Instagram, href: "#", label: "Instagram" }
    ];

    return (
        <div className="bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
            <Navbar theme={theme} toggleTheme={toggleTheme} navItems={navItems} />
            <main>
                {/* Hero Section */}
                <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 bg-gradient-to-br from-cyan-300 to-blue-500 dark:from-gray-900 dark:to-blue-900">
                    <div className="glass-card p-8 sm:p-12 rounded-2xl shadow-xl max-w-4xl">
                        <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-800 dark:text-white leading-tight">
                            Learn all common English words day by day
                        </h1>
                        <p className="mt-8 text-lg text-gray-700 dark:text-gray-300">
                            Track your growth, complete daily lessons, and master vocabulary with a personalized dashboard. Login is required to save your progress.
                        </p>
                        <button
                            className="mt-8 bg-cyan-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-cyan-600 shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105"
                            onClick={handleBegin}
                        >
                            Start Learning
                        </button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white">
                            Why Choose Learn Words?
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <FeatureCard key={index} {...feature} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="glass-footer py-12 border-t border-white/10 dark:border-gray-800/20">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
                        <div className="space-y-4 flex flex-col items-center md:items-start">
                            <div className="flex items-center space-x-2">
                                <div className="p-2 bg-white/20 dark:bg-gray-800/30 rounded-lg">
                                   <BookOpen className="h-6 w-6 text-cyan-900 dark:text-cyan-400" />
                                </div>
                                <span className="text-xl font-bold text-gray-800 dark:text-white">Learn Words</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                Master English vocabulary with structured daily lessons and progress tracking.
                            </p>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Quick Links</h3>
                            <div className="space-y-2">
                                {navItems.map((link) => (
                                    <Link key={link.path} to={link.path} className="block text-gray-600 dark:text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-300">
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Follow Us</h3>
                            <div className="flex space-x-4 justify-center md:justify-start">
                                {socialLinks.map((social) => (
                                    <a key={social.label} href={social.href} className="p-3 bg-white/10 dark:bg-gray-800/30 rounded-full text-gray-700 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:scale-110 transition-all duration-300" aria-label={social.label}>
                                        <social.icon className="h-5 w-5" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    <div className="border-t border-white/10 dark:border-gray-800/50 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Learn Words. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

