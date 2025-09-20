import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { BookOpen, Sun, Moon } from "lucide-react";


// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Navbar component defined in the same file to avoid import issues.
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


// A reusable component for the stat cards
const StatCard = ({ title, value, icon, description }) => (
    <div className="glass-card p-6 rounded-2xl shadow-lg flex items-start gap-4 h-full transition-all duration-300 hover:scale-105 hover:shadow-cyan-400/20">
        <div className="text-3xl">{icon}</div>
        <div className="flex flex-col">
            <h2 className="text-lg font-semibold text-white/80">{title}</h2>
            <p className="text-3xl font-bold text-white">{value}</p>
            {description && <p className="text-sm text-white/60 mt-1">{description}</p>}
        </div>
    </div>
);

// A reusable component for the large action cards at the bottom
const ActionCard = ({ title, description, icon, to }) => (
    <Link to={to} className="glass-card p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:shadow-cyan-400/20 h-full">
        <div className="mb-4 text-cyan-400">{icon}</div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-white/60 mt-1">{description}</p>
    </Link>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const token = localStorage.getItem("token");
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

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/progress`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Failed to fetch data");
                const data = await response.json();
                setUserData(data.user);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [token, navigate]);

    if (isLoading) return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center"><p className="text-center text-white text-xl">Loading Dashboard...</p></div>;
    
    if (!userData) return <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 flex items-center justify-center"><p className="text-center text-white text-xl">Could not load dashboard. Please try again.</p></div>;

    const progress = userData.progress || [];
    const todayProgress = progress.length > 0 ? progress[progress.length - 1] : { wordsRead: [] };
    
    const weeklyData = progress.slice(-7); 

    const chartData = {
        labels: weeklyData.map((d) => `Day ${d.day}`),
        datasets: [
            {
                label: "Words Learned",
                data: weeklyData.map((d) => d.wordsRead.length),
                backgroundColor: "rgba(56, 189, 248, 0.6)", 
                borderColor: "rgba(56, 189, 248, 1)",
                borderWidth: 2,
                borderRadius: 8,
                hoverBackgroundColor: "rgba(56, 189, 248, 0.8)",
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top",
                labels: { color: "#e5e7eb" },
            },
            title: {
                display: true,
                text: "Your Progress Over the Last 7 Sessions",
                color: "#e5e7eb",
                font: { size: 18 },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                titleFont: { size: 14 },
                bodyFont: { size: 12 },
                padding: 10,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: "rgba(255, 255, 255, 0.1)" },
                ticks: { color: "#d1d5db", stepSize: 10 },
            },
            x: {
                grid: { color: "rgba(255, 255, 255, 0.05)" },
                ticks: { color: "#d1d5db" },
            },
        },
    };
    
    const motivationalQuotes = [
        "Every word you learn is a new window to the world. 🌍",
        "Consistency is the key to mastering any language. 🔑",
        "Don't watch the clock; do what it does. Keep going. ⏰",
        "The beautiful thing about learning is that no one can take it away from you. ✨"
    ];
    const quote = motivationalQuotes[new Date().getDate() % motivationalQuotes.length];

    const bookIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
    );

    const chartIcon = (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 pb-20 font-sans">
            <Navbar theme={theme} toggleTheme={toggleTheme} />
            <div className="max-w-7xl mx-auto pt-24 sm:pt-32 px-4 space-y-8">
                <h1 className="text-3xl font-bold text-white">
                    Welcome {userData.name} 👋, you learned{" "}
                    <span className="text-cyan-400">{todayProgress.wordsRead.length}</span> words today.
                </h1>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Daily Progress" value={`${todayProgress.wordsRead.length} words`} icon="✅" />
                    <StatCard title="Current Streak" value={`${userData.streak} day${userData.streak !== 1 ? 's' : ''}`} icon="🔥" />
                    <StatCard title="Total Words" value={userData.totalWordsLearned} icon="🧠" />
                    <StatCard title="Tip of the Day" value={quote} icon="💡" />
                </div>

                <div className="glass-card p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-400/20">
                    <div className="h-80 md:h-96">
                        <Bar options={chartOptions} data={chartData} />
                    </div>
                </div>

                {/* New Action Cards Section */}
                <div className="grid md:grid-cols-2 gap-6">
                    <ActionCard 
                        title="Continue Learning"
                        description="Pick up where you left off"
                        icon={bookIcon}
                        to="/courses"
                    />
                    <ActionCard 
                        title="View All Stats"
                        description="Detailed analytics and insights"
                        icon={chartIcon}
                        to="/profile"
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

