import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, BookOpen } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.token) {
                localStorage.setItem("token", data.token);
                navigate("/dashboard"); // Redirect to dashboard on success
            } else {
                setMessage(data.message || "Login failed! Please check your credentials.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setMessage("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-blue-900 font-sans">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center space-x-3">
                        <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                           <BookOpen className="h-8 w-8 text-cyan-400" />
                        </div>
                        <span className="text-3xl font-bold text-white">
                           Learn Words
                        </span>
                    </Link>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="glass-card p-8 rounded-2xl shadow-lg border border-white/20"
                >
                    <h2 className="text-2xl font-bold mb-2 text-center text-white">
                        Welcome Back!
                    </h2>
                    <p className="text-center text-white/60 mb-6">
                        Enter your credentials to continue.
                    </p>

                    {message && <p className="text-center bg-red-500/20 text-red-300 border border-red-500/30 p-3 rounded-lg mb-4">{message}</p>}

                    <div className="mb-4">
                        <label className="block text-white/80 mb-2 text-sm" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                            required
                        />
                    </div>

                    <div className="relative mb-6">
                         <label className="block text-white/80 mb-2 text-sm" htmlFor="password">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/10 text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-9 text-white/60 hover:text-white/90"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button 
                        type="submit"
                        className="w-full bg-cyan-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-cyan-600 shadow-lg hover:shadow-cyan-500/40 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Login"}
                    </button>

                    <p className="text-center mt-6 text-sm text-white/60">
                        Don’t have an account?{" "}
                        <Link to="/signup" className="font-medium text-cyan-400 hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
