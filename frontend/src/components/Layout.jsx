import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Users, UsersRound, LogOut, LogsIcon, Menu, X } from "lucide-react";
import toast from "react-hot-toast";

const Layout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => {
        toast("Logged out successfully");
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navItems = [
        { path: "/employees", label: "Employees", icon: Users },
        { path: "/teams", label: "Teams", icon: UsersRound },
        { path: "/logs", label: "Logs", icon: LogsIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-50">

            {/* NAVBAR */}
            <nav className="border-b border-gray-200 bg-white sticky top-0 z-50 shadow-md">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">

                    {/* Left Part */}
                    <div className="flex items-center gap-3">

                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-lg">OrgManage</span>
                        </div>

                        {/* DESKTOP NAV */}
                        <div className="hidden md:flex items-center gap-2 ml-6">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const active = location.pathname === item.path;
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => navigate(item.path)}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-md transition 
                                            ${active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}
                                        `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="items-center hidden md:flex gap-1 px-3 py-1 rounded-md text-red-600 hover:bg-red-100"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>

                    {/* MOBILE MENU BUTTON */}

                    <button
                        className="md:hidden p-2 rounded hover:bg-gray-100"
                        onClick={() => setDrawerOpen(true)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>

            </nav>

            {/* Drawer */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out
                 ${drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={() => setDrawerOpen(false)}
            />

            <div
                className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg z-50 p-5 flex flex-col
                    transform transition-transform duration-300 ease-in-out
                    ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`
                }
            >

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <span className="font-bold text-lg">Menu</span>
                    <button onClick={() => setDrawerOpen(false)} className="p-2 rounded hover:bg-gray-200">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Menu List */}
                <div className="flex flex-col gap-2 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = location.pathname === item.path;

                        return (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setDrawerOpen(false);
                                }}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md transition 
                                     ${active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"}`
                                }
                            >
                                <Icon className="w-5 h-5" /> {item.label}
                            </button>
                        );
                    })}
                </div>

                {/* Logout Button Fixed at Bottom */}
                <div className="pt-4 border-t border-gray-200 mt-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center  gap-2 w-full px-3 py-2 rounded-md hover:bg-red-100 text-red-600 text-left"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>

            </div>



            {/* PAGE CONTENT */}
            <main className="container mx-auto px-4 py-8">{children}</main>

        </div>
    );
};

export default Layout;

