import React, { useEffect, useState } from "react";
import api from "../services/api";
import Layout from "../components/Layout";

const LogsPage = () => {

    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch logs
    const fetchLogs = async () => {
        try {
            // Make the API request
            setLoading(true)
            const response = await api.get("/logs");
            setLogs(response.data.logs);
        } catch (error) {
            console.error("Error fetching logs:", error);
            setLoading(false)
        }
        finally {
            setTimeout(() => {
                setLoading(false)
            }, 1000)
        }

    };


    useEffect(() => {
        fetchLogs();
    }, []);
    // Badge colors based on action
    const getBadgeColor = (action) => {
        switch (action) {
            case "user_logged_in":
                return "bg-blue-500";
            case "employee_created":
            case "team_created":
                return "bg-green-500";
            case "employee_deleted":
            case "team_deleted":
                return "bg-red-500";
            case "employee_updated":
                return "bg-yellow-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <Layout>

            <div className="p-2">
                <h1 className="text-2xl font-semibold mb-4">Activity Logs</h1>

                {loading ? (
                    <div className="flex justify-center items-center h-50">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="p-2 border font-semibold border-gray-300">#</th>
                                    <th className="p-2 border font-semibold border-gray-300">Action</th>
                                    <th className="p-2 border font-semibold border-gray-300">Meta</th>
                                    <th className="p-2 border font-semibold border-gray-300">Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {logs.map((log, index) => (
                                    <tr key={log.id} className="border-t">
                                        <td className="p-2 border border-gray-200 text-center">{index + 1}</td>

                                        <td className="p-2 border border-gray-200">
                                            <span
                                                className={`text-white px-3 py-1 rounded ${getBadgeColor(
                                                    log.action
                                                )}`}
                                            >
                                                {log.action}
                                            </span>
                                        </td>

                                        <td className="p-2 border border-gray-200 text-sm">
                                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                                {JSON.stringify(log.meta, null, 2)}
                                            </pre>
                                        </td>

                                        <td className="p-2 border text-center border-gray-200">
                                            <span className="bg-red-50 text-sm px-1 py-2">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}


            </div>

        </Layout>
    );
};

export default LogsPage;
