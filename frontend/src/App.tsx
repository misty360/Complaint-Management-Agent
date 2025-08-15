import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface Complaint {
  id: string;
  name: string;
  email: string;
  complaint: string;
  status: string;
  created_at: string;
}

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [complaint, setComplaint] = useState("");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState<"form" | "dashboard">("form");

  //Fetch all complaints
  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_URL}/complaints`);
      setComplaints(res.data);
    } catch (err) {
      console.error("Failed to fetch complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  //Submit a complaint
  const submitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/complaints`, { name, email, complaint });
      setName("");
      setEmail("");
      setComplaint("");
      fetchComplaints();
      alert("Complaint submitted!");
    } catch (err) {
      console.error("Error submitting complaint:", err);
      alert("Failed to submit complaint");
    }
  };

  //Determing toggle status
  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "Pending" ? "Resolved" : "Pending";
    try {
      await axios.patch(`${API_URL}/complaints/${id}`, { status: newStatus });
      fetchComplaints();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  //Delete a complaint
  const deleteComplaint = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/complaints/${id}`);
      fetchComplaints();
    } catch (err) {
      console.error("Error deleting complaint:", err);
      alert("Failed to delete complaint");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      {/* Page Header */}
      <div className="w-full text-center mb-10">
        <h1 className="text-5xl font-bold text-purple-700">
          Complaint Management System
        </h1>
        <p className="text-gray-600 italic text-lg mt-2">
          Have something to share? Submit your complaints here! 📩
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10 w-full space-x-4">
        <button
          className={`px-8 py-3 font-semibold transition-all duration-300 rounded-full ${
            activeTab === "form"
              ? "bg-purple-500 text-white shadow-lg transform scale-105"
              : "bg-white text-purple-700 shadow hover:shadow-lg hover:scale-105"
          }`}
          onClick={() => setActiveTab("form")}
        >
          Submit Complaint
        </button>
        <button
          className={`px-8 py-3 font-semibold transition-all duration-300 rounded-full ${
            activeTab === "dashboard"
              ? "bg-purple-500 text-white shadow-lg transform scale-105"
              : "bg-white text-purple-700 shadow hover:shadow-lg hover:scale-105"
          }`}
          onClick={() => setActiveTab("dashboard")}
        >
          Internal Dashboard
        </button>
      </div>

      {/* Form */}
      {activeTab === "form" && (
        <form
          onSubmit={submitComplaint}
          className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-auto space-y-6 hover:shadow-purple-300 transition-shadow"
        >
          <input
            className="border p-4 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="border p-4 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <textarea
            className="border p-4 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm"
            placeholder="Write your complaint here..."
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
            required
            rows={5}
          />
          <button
            type="submit"
            className="bg-purple-500 text-white font-bold p-4 rounded-full w-full hover:bg-purple-600 transition-colors shadow-md"
          >
            Submit Complaint ✨
          </button>
        </form>
      )}

      {/* Complaint System Dashboard */}
      {activeTab === "dashboard" && (
        <div className="overflow-x-auto w-full mt-4">
          <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden text-sm">
            <thead className="bg-purple-200 text-purple-800 uppercase tracking-wide">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Complaint</th>
                <th className="p-4 text-left">Created At</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No complaints submitted yet!
                  </td>
                </tr>
              )}
              {complaints.map((c, idx) => (
                <tr
                  key={c.id}
                  className={`border-b last:border-b-0 ${
                    idx % 2 === 0 ? "bg-purple-50" : "bg-white"
                  } hover:bg-purple-100 transition-colors`}
                >
                  <td className="p-4">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4">{c.complaint}</td>
                  <td className="p-4">
                    {c.created_at ? new Date(c.created_at).toLocaleString() : "N/A"}
                  </td>
                  {/* Status Box Toggle */}
                  <td
                    className={`p-4 text-center font-bold cursor-pointer ${
                      c.status === "Pending"
                        ? "text-yellow-700 bg-yellow-100 hover:bg-yellow-200"
                        : "text-green-700 bg-green-100 hover:bg-green-200"
                    }`}
                    onClick={() => toggleStatus(c.id, c.status)}
                  >
                    {c.status}
                  </td>
                  <td className="p-4 text-center space-x-2">
                    <button
                      onClick={() => deleteComplaint(c.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors shadow-sm"
                    >
                      Delete 🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
