import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Building2, ArrowRight } from "lucide-react";
import api from "../services/api";

const RegisterOrg = () => {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        orgName: "",
        email: "",
        password: "",
        adminName: "",
    });

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Send registration request
            const apiRes = await api.post("/auth/register", formData);
            localStorage.setItem("token", apiRes.data.token);

            toast.success("Organization registered successfully!");
            navigate("/employees");
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data?.message || "Registration failed");
                console.log(error.response);
            } else {
                toast.error(error.message);
                console.log(error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-gray-200">

                {/* Header */}
                <div className="p-8 text-center space-y-4">
                    <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Create your organization</h2>
                    <p className="text-gray-500">
                        Get started by registering your organization details
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Organization Name */}
                        <div>
                            <label htmlFor="orgName" className="block text-sm font-medium mb-1">
                                Organization Name
                            </label>
                            <input
                                id="orgName"
                                name="orgName"
                                placeholder="Acme Corporation"
                                value={formData.orgName}
                                onChange={handleChange}
                                required
                                className="w-full border mt-1 border-gray-200 bg-gray-50 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Admin Name */}
                        <div>
                            <label htmlFor="adminName" className="block text-sm font-medium mb-1">
                                Admin Name
                            </label>
                            <input
                                id="adminName"
                                name="adminName"
                                placeholder="John Doe"
                                value={formData.adminName}
                                onChange={handleChange}
                                required
                                className="w-full border mt-1 border-gray-200 bg-gray-50 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Email (full width) */}
                        <div className="md:col-span-2">
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="admin@company.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full border mt-1 border-gray-200 bg-gray-50 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        {/* Password (full width) */}
                        <div className="md:col-span-2">
                            <label htmlFor="password" className="block text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="admin123"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full border mt-1 border-gray-200 bg-gray-50 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
                        >
                            Back to Login
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition flex items-center justify-center"
                        >
                            {isLoading ? "Creating..." : (
                                <>
                                    Create Organization
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default RegisterOrg;

