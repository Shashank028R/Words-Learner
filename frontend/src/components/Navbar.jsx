import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Sun, Moon } from "lucide-react";

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

export default Navbar;

