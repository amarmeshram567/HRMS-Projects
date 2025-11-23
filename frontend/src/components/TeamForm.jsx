import { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";

const TeamForm = ({ open, onOpenChange, onSubmit, editing }) => {
    const [formData, setFormData] = useState({
        name: "",
        lead: "",
        description: "",
        memberCount: "",
    });

    // Initial form state
    const initialFormData = useMemo(() => {
        return editing ? {
            name: editing.name || "",
            lead: editing.lead || "",
            description: editing.description || "",
            memberCount: editing.memberCount || "",
        } : {
            name: "",
            lead: "",
            description: "",
            memberCount: "",
        };
    }, [editing])


    // Update form state
    useEffect(() => {
        setFormData(initialFormData)
    }, [initialFormData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData); // Parent handles whether it's create or update
        toast.success(editing ? "Team updated successfully!" : "Team created successfully!");
        setFormData({ name: "", lead: "", description: "", memberCount: "" });
        onOpenChange(false);
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-1">
                        {editing ? "Edit Team" : "Create New Team"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        {editing
                            ? "Update team details and lead."
                            : "Set up a new team with details and assign a team lead."}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">

                    <div className="space-y-1">
                        <label className="text-sm font-medium" htmlFor="name">Team Name</label>
                        <input
                            id="name"
                            name="name"
                            placeholder="Product Development"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium" htmlFor="lead">Team Lead</label>
                        <input
                            id="lead"
                            name="lead"
                            placeholder="Sarah Johnson"
                            value={formData.lead}
                            onChange={handleChange}
                            required
                            className="w-full border rounded-lg border-gray-200 p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium" htmlFor="memberCount">Initial Members</label>
                        <input
                            id="memberCount"
                            name="memberCount"
                            type="number"
                            placeholder="5"
                            value={formData.memberCount}
                            onChange={handleChange}
                            required
                            className="w-full border border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            placeholder="Brief description of the team's focus and goals..."
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg p-2 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-3">
                        <button
                            type="button"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition"
                        >
                            {editing ? "Update Team" : "Create Team"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default TeamForm;


