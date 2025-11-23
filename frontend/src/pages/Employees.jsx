import { useState, useEffect } from "react";
import { Plus, Mail, Trash2Icon, PencilIcon } from "lucide-react";
import Layout from "../components/Layout";
import EmployeeForm from "../components/EmployeeForm";
import api from "../services/api";
import toast from "react-hot-toast";

const Employees = () => {
    const [showForm, setShowForm] = useState(false);
    const [employees, setEmployees] = useState([]);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch employees from backend
        const loadEmployees = async () => {
            try {
                setLoading(true);
                const res = await api.get("/employees");
                console.log(res.data)
                setEmployees(
                    res.data.employees.map((emp) => ({
                        id: emp.id,
                        name: `${emp.first_name} ${emp.last_name}`,
                        email: emp.email,
                        phone: emp.phone || "N/A",
                    }))
                );
            } catch (err) {
                setLoading(false);
                console.error(err);
                toast.error("Failed to load employees");
            }
            finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000)
            }

        }
        loadEmployees();
    }, []);

    // Add or update employee
    const handleAddOrUpdateEmployee = async (formData) => {
        try {
            if (editing) {
                // Update employee
                await api.put(`/employees/${editing.id}`, {
                    first_name: formData.first_name,
                    last_name: formData.last_name || "",
                    email: formData.email,
                    phone: formData.phone,
                });
                toast.success("Employee updated successfully!");
                setEditing(null);
            } else {
                // Create employee
                await api.post("/employees", {
                    first_name: formData.first_name,
                    last_name: formData.last_name || "",
                    email: formData.email,
                    phone: formData.phone,
                });
                toast.success("Employee added successfully!");
            }
            // fetchEmployees();

            const res = await api.get("/employees");
            setEmployees(
                res.data.employees.map((emp) => ({
                    id: emp.id,
                    name: `${emp.first_name} ${emp.last_name}`,
                    email: emp.email,
                    phone: emp.phone || "N/A",
                }))
            )
            setShowForm(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to add/update employee");
        }
    };

    console.log(employees);


    // Delete employee
    const handleDeleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await api.delete(`/employees/${id}`);
            toast.success("Employee deleted successfully!");
            // fetch employees 
            const res = await api.get("/employees");
            setEmployees(
                res.data.employees.map((emp) => ({
                    id: emp.id,
                    name: `${emp.first_name} ${emp.last_name}`,
                    email: emp.email,
                    phone: emp.phone || "N/A",
                }))
            )
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete employee");
        }
    };

    return (
        <Layout>
            <div className="flex flex-col min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white shadow">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl font-semibold">Employees</h1>
                        <p className="text-gray-600 mt-1">
                            Manage your team members and their roles
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowForm(true);
                            setEditing(null);
                        }}
                        className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow"
                    >
                        <Plus className="w-4 h-4" /> Add Employee
                    </button>
                </div>


                {/* Team Directory Section */}
                <div className="flex-1 overflow-auto p-8 flex flex-col bg-gray-50">
                    <div className="bg-white rounded-lg border p-6 border-gray-200 flex flex-col gap-6 min-h-full">

                        {/* Title */}
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-1">Team Directory</h2>
                            <p className="text-gray-600 text-center text-sm">
                                Manage your team members and their roles
                            </p>
                        </div>

                        {/* Table */}
                        <div>
                            {
                                loading ? (
                                    <div className="flex justify-center items-center h-50">
                                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                        <table className="w-full text-left min-w-[600px]">
                                            <thead className="bg-gray-100 border-t border-gray-100">
                                                <tr>
                                                    <th className="py-3 px-4 font-medium">Name</th>
                                                    <th className="py-3 px-4 font-medium">Email</th>
                                                    <th className="py-3 px-4 font-medium text-center">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {employees.map((emp) => (
                                                    <tr key={emp.id} className="border border-gray-100 hover:bg-gray-50">
                                                        <td className="py-3 px-4 font-medium text-gray-600">{emp.name}</td>
                                                        <td className="py-3 px-4 text-gray-600 flex items-center gap-2">
                                                            <Mail className="w-4 h-4" /> {emp.email}
                                                        </td>
                                                        <td className="py-3 px-4 text-center">
                                                            <div className="inline-flex gap-2">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditing(emp);
                                                                        setShowForm(true);
                                                                    }}
                                                                    className="px-3 py-2 bg-yellow-400 cursor-pointer text-white rounded hover:bg-yellow-500 transition"
                                                                >
                                                                    <PencilIcon className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteEmployee(emp.id)}
                                                                    className="px-3 py-2 bg-red-400 cursor-pointer text-white rounded hover:bg-red-500 transition"
                                                                >
                                                                    <Trash2Icon className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {employees.length === 0 && (
                                                    <tr>
                                                        <td colSpan="3" className="py-6 text-center text-gray-500">
                                                            No employees found
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                        </div>
                    </div>
                </div>

                {/* Employee Form Modal */}
                <EmployeeForm
                    open={showForm}
                    onOpenChange={setShowForm}
                    onSubmit={handleAddOrUpdateEmployee}
                    editing={editing}
                />
            </div>
        </Layout >
    );
};

export default Employees;
