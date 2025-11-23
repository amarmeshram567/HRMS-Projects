import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Building2, Eye, EyeOffIcon, LogIn } from "lucide-react";
import api from "../services/api";

const Login = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);

    // Handle login
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Send login request
            const apiRes = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", apiRes.data.token);
            setIsLoading(false);

            toast.success("Welcome back!");
            navigate("/employees");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
        finally {
            setIsLoading(false);
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 p-4">
            <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg">

                {/* Header */}
                <div className="p-8 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold">Welcome back</h2>
                    <p className="text-gray-500">Sign in to manage your organization</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-4">

                        {/* Email */}
                        <div className="space-y-1">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="admin@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border mt-1 border-gray-200 bg-gray-50 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-1 relative">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password
                            </label>
                            <input
                                id="password"
                                type={!show ? "text" : "password"}
                                placeholder="admin123"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full border mt-1 border-gray-200 bg-gray-50 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShow(!show)}
                                className="absolute inset-y-0 top-5 right-2 flex items-center"
                            >
                                {show ? (
                                    <EyeOffIcon className="h-4 w-4 text-gray-100" />
                                ) : (
                                    <Eye className="h-4 w-4 text-gray-100" />
                                )}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center px-3 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            {isLoading ? (
                                "Signing in..."
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Sign in
                                </>
                            )}
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an organization?{" "}
                            <button
                                onClick={() => navigate("/register")}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Register here
                            </button>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
