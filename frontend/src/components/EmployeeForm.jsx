import { useEffect, useMemo, useState } from "react";

const EmployeeForm = ({ open, onOpenChange, onSubmit, editing }) => {

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });


    // Initial form state
    const initialFormData = useMemo(() => {
        return editing ? {
            first_name: editing.first_name || "",
            last_name: editing.last_name || "",
            email: editing.email || "",
            phone: editing.phone || "",
        } : {
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
        }
    }, [editing])


    useEffect(() => {
        // Update form state
        setFormData(initialFormData)
    }, [initialFormData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ first_name: "", last_name: "", email: "", phone: "" });
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-auto p-4"
            onClick={() => onOpenChange(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 animate-fadeIn relative"
            >
                <h2 className="text-xl font-bold">
                    {editing ? "Edit Employee" : "Add New Employee"}
                </h2>
                <p className="text-gray-600 mt-1">
                    Fill in the details to {editing ? "update" : "add"} an employee.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="block mb-1 text-sm font-semibold">First Name</label>
                        <input
                            name="first_name"
                            placeholder="Enter first name"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold">Last Name</label>
                        <input
                            name="last_name"
                            placeholder="Enter last name"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="john@company.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-semibold">Phone Number</label>
                        <input
                            name="phone"
                            placeholder="1234567890"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 border border-gray-200 py-2 rounded-md hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
                        >
                            {editing ? "Update" : "Add"} Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;
