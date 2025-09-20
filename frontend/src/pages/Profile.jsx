import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { BookOpen, Sun, Moon } from "lucide-react";


// A simple Navbar component defined within the same file to resolve the import error.
const Navbar = ({ theme, toggleTheme }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const token = localStorage.getItem("token");

    const navItems = [
        { path: "/", label: "Home" },
        { path: "/dashboard", label: "Dashboard" },
        { path: "/courses", label: "Courses" },
        { path: "/profile", label: "Profile" },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem("token"); // clear token
        navigate("/login"); // redirect to login
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


// Helper component for stat cards with progress bars
const StatCard = ({ label, value, goal, color, emoji }) => {
    const percentage = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;
    return (
        <div className="glass-card p-6 rounded-2xl shadow-lg flex flex-col justify-between h-full">
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white/80">{label}</h3>
                    <span className="text-xl">{emoji}</span>
                </div>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2.5">
                    <div
                        className={`${color} h-2.5 rounded-full`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
                <p className="text-right text-sm text-white/60 mt-1">{`${value} / ${goal}`}</p>
            </div>
        </div>
    );
};


// Main Profile Component
const Profile = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [theme, setTheme] = useState('dark'); // State for theme

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

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await fetch("/api/user/profile", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch profile");
                const data = await response.json();
                setUserData(data.user);
                setNewName(data.user.name);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [token, navigate]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/user/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newName })
            });

            if (!response.ok) throw new Error("Failed to update profile");

            setUserData(prev => ({ ...prev, name: newName }));
            setIsModalOpen(false);
        } catch (error) {
            console.error("Update error:", error);
        }
    };
    
    const badges = [
        { name: "Word Warrior", emoji: "⚔️", desc: "Learned 100 words" },
        { name: "Streak Starter", emoji: "🔥", desc: "7-day streak" },
        { name: "Course Completer", emoji: "🎓", desc: "Finished a day's course" },
        { name: "Perfect Day", emoji: "✅", desc: "Completed all words in a day" }
    ];

    if (isLoading) return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center"><p className="text-center text-white text-xl">Loading Profile...</p></div>;
    
    if (!userData) return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center"><p className="text-center text-white text-xl">Could not load profile data. Please try logging in again.</p></div>;


    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 pb-20 font-sans">
            <Navbar theme={theme} toggleTheme={toggleTheme} />

            {/* Main Content */}
            <div className="max-w-5xl mx-auto pt-24 sm:pt-32 px-4 space-y-8">

                {/* User Info Card */}
                <div className="glass-card p-6 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative w-28 h-28">
                        <div className="w-full h-full rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-4xl font-bold text-white uppercase">
                            {userData.name[0]}
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-3xl font-bold text-white">{userData.name}</h2>
                        <p className="text-white/60">{userData.email}</p>
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition duration-300 backdrop-blur-sm border border-white/20">
                        Edit Profile
                    </button>
                </div>

                {/* Learning Stats */}
                <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Learning Stats</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <StatCard label="Total Words Learned" value={userData.totalWordsLearned} goal={1500} color="bg-cyan-400" emoji="🧠" />
                        <StatCard label="Current Streak" value={userData.streak} goal={30} color="bg-orange-400" emoji="🔥" />
                        <StatCard label="Courses Completed" value={userData.coursesCompleted} goal={30} color="bg-emerald-400" emoji="🎓"/>
                    </div>
                </div>


                {/* Badges / Achievements */}
                <div className="glass-card p-6 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-white mb-4">Achievements</h3>
                    <div className="flex flex-wrap gap-4">
                        {badges.length > 0
                            ? badges.map((badge) => (
                                <div key={badge.name} className="group relative bg-yellow-400/10 text-yellow-300 px-4 py-2 rounded-lg flex items-center gap-2 border border-yellow-400/30 transition-all duration-300 hover:bg-yellow-400/20 hover:shadow-lg hover:shadow-yellow-400/10 cursor-pointer">
                                    <span>{badge.emoji}</span>
                                    <span>{badge.name}</span>
                                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                        {badge.desc}
                                    </div>
                                </div>
                            ))
                            : <p className="text-white/60">No badges earned yet. Keep learning!</p>
                        }
                    </div>
                </div>
                
                {/* Settings & Motivation */}
                <div className="grid md:grid-cols-2 gap-8">
                     {/* Settings Card */}
                    <div className="glass-card p-6 rounded-2xl shadow-lg">
                        <h3 className="text-2xl font-bold text-white mb-6">Settings</h3>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                                <label htmlFor="notifications" className="text-white/80">Email Notifications</label>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="notifications" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                </label>
                            </div>
                           <button className="w-full text-left bg-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/20 transition duration-300 border border-white/20">
                                Change Password
                           </button>
                        </div>
                    </div>
                     {/* Motivational Section */}
                    <div className="glass-card p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center">
                        <span className="text-4xl mb-3">💬</span>
                        <p className="text-lg text-white/90 italic">"Keep learning, one word at a time!"</p>
                    </div>
                </div>

            </div>

            {/* Edit Profile Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="glass-card p-8 rounded-2xl shadow-lg w-full max-w-md m-4 border border-white/20">
                        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-white/80 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                />
                            </div>
                            <div className="flex justify-end gap-4 mt-8">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition">Cancel</button>
                                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

