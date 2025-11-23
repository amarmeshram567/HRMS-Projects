import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import TeamForm from "../components/TeamForm";
import { Plus, Users, Trash, Pencil, UsersRound, UserStar, UserIcon, UserCheck2Icon, UserRoundPlusIcon } from "lucide-react";
import api from "../services/api";
import { toast } from "react-hot-toast";

const Teams = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);

    // fetch teams
    const fetchTeams = async () => {
        try {
            setLoading(true);
            const res = await api.get("/teams");
            setTeams(res.data.teams || res.data);
        } catch (err) {
            toast.error("Failed to load teams", err);
            setLoading(false);
        }
        finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000)
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);


    // Create Team
    const handleCreateTeam = async (teamData) => {
        try {
            const payload = {
                name: teamData.name,
                description: teamData.description,
                lead: teamData.lead,
                member_count: parseInt(teamData.memberCount)
            };

            const res = await api.post("/teams", payload);

            setTeams((prev) => [...prev, res.data.team]);
            toast.success("Team created successfully!");
        } catch (err) {
            toast.error("Failed to create team", err);
        }
    };

    // update team 
    const handleUpdateTeam = async (teamData) => {
        try {
            const payload = {
                name: teamData.name,
                description: teamData.description,
                lead: teamData.lead,
                member_count: parseInt(teamData.memberCount)
            };

            const res = await api.put(`/teams/${editingTeam.id}`, payload);

            setTeams((prev) =>
                prev.map((t) => (t.id === editingTeam.id ? res.data.team : t))
            );

            toast.success("Team updated successfully!");
        } catch (err) {
            toast.error("Failed to update team", err);
        } finally {
            setEditingTeam(null);
        }
    };

    // delete team
    const handleDeleteTeam = async (id) => {
        if (!confirm("Are you sure you want to delete this team?")) return;

        try {
            await api.delete(`/teams/${id}`);
            setTeams((prev) => prev.filter((t) => t.id !== id));
            toast.success("Team deleted");
        } catch (err) {
            toast.error("Failed to delete", err);
        }
    };

    // const handleAssign = async (teamId, employeeId) => {
    //     try {
    //         await api.post(`/teams/${teamId}/assign`, { employeeId });
    //         toast.success("Assigned to team");
    //     } catch (err) {
    //         toast.error("Failed to assign", err);
    //     }
    // };

    // const handleUnassign = async (teamId, employeeId) => {
    //     try {
    //         await api.post(`/teams/${teamId}/unassign`, { employeeId });
    //         toast.success("Removed from team");
    //     } catch (err) {
    //         toast.error("Failed to unassign", err);
    //     }
    // };


    return (
        <Layout>
            <div className="p-4 space-y-6">

                {/* -------- HEADER -------- */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Teams</h1>
                        <p className="text-gray-600">Manage your company teams</p>
                    </div>

                    <button
                        onClick={() => {
                            setEditingTeam(null);
                            setShowForm(true);
                        }}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
                    >
                        <Plus className="w-4 h-4" />
                        Create Team
                    </button>
                </div>

                {
                    loading ? (
                        <div className="flex justify-center items-center h-50">
                            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : teams.length === 0 ? (
                        <div className="py-6 text-center text-gray-500">
                            No teams found
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {teams.map((team) => (
                                <div
                                    key={team.id}
                                    className="p-5 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition-all"
                                >
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-3">
                                            <UserRoundPlusIcon className="text-blue-500 w-8 h-8" />
                                            <div>
                                                <h3 className="text-lg font-semibold">{team.name}</h3>
                                                <p className="text-gray-500 text-sm">
                                                    Lead: {team.lead}
                                                </p>
                                            </div>
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingTeam(team);
                                                    setShowForm(true);
                                                }}
                                                className="p-2 bg-yellow-100 rounded-lg cursor-pointer"
                                            >
                                                <Pencil className="w-4 h-4 text-yellow-600 hover:text-yellow-800" />
                                            </button>

                                            <button
                                                onClick={() => handleDeleteTeam(team.id)}
                                                className="p-2 bg-red-100 rounded-lg cursor-pointer"
                                            >
                                                <Trash className="w-4 h-4 text-red-600 hover:text-red-800" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 mt-3 text-sm">{team.description}</p>

                                    <p className="mt-4 text-sm font-medium">
                                        Members: {team.member_count}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )
                }

                {/* Form Modal */}
                <TeamForm
                    open={showForm}
                    editing={editingTeam}
                    onOpenChange={setShowForm}
                    onSubmit={editingTeam ? handleUpdateTeam : handleCreateTeam}
                />
            </div>
        </Layout>
    );
};

export default Teams;
