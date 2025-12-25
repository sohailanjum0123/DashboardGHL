import { useEffect, useState } from "react";
import {
  getAllUsers,
  searchUser,
  deleteUser as deleteUserApi,
  getUserDetail,
} from "../services/api";
import { useNavigate } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import { Eye, Edit2, Trash2 } from "lucide-react"; // Trendy Lucide icons

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/");
      } else if (error.response?.status === 403) {
        alert("Access denied. Admin only.");
        navigate("/dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 800);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedTerm) {
      searchUsers(debouncedTerm);
    } else {
      fetchUsers();
    }
  }, [debouncedTerm]);

  const searchUsers = async (keyword) => {
    setLoading(true);
    try {
      const res = await searchUser(keyword);
      setUsers(res.data.data.user || []);
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUserApi(id);
      setUsers(users.filter((user) => user._id !== id));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete user");
    }
  };

  // VIEW USER
  const handleView = async (id) => {
    try {
      const res = await getUserDetail(id);
      const user = res.data.data;
      alert(
        `Name: ${user.fullName}\nUsername: ${user.userName}\nEmail: ${
          user.email
        }\nRole: ${user.role}\nJoined: ${new Date(
          user.createdAt
        ).toLocaleDateString()}`
      );
    } catch (error) {
      console.error("View Error:", error);
      alert("Failed to fetch user details");
    }
  };

  // EDIT USER
  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`); // redirect to edit page
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="">
        <Header />
      </header>

      <div className="flex flex-1 bg-bg">
        <aside className="border-r border-gray-200 sticky flex bg-bg ">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-2 mb-4 bg-gray-100 rounded gap-2">
            <h2 className="text-2xl font-bold">Users</h2>
            <input
              type="text"
              placeholder="Search by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded w-full md:max-w-md"
            />
          </div>

          {loading ? (
            <p>Loading users...</p>
          ) : (
            <div className="overflow-auto border rounded">
              <table className="w-full min-w-max border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2 text-left">Name</th>
                    <th className="border p-2 text-left">Username</th>
                    <th className="border p-2 text-left">Email</th>
                    <th className="border p-2 text-left">Role</th>
                    <th className="border p-2 text-left">Joined</th>
                    <th className="border p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .filter((user) => user.role !== "admin")
                    .map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="border p-2">{user.fullName}</td>
                        <td className="border p-2">{user.userName}</td>
                        <td className="border p-2">{user.email}</td>
                        <td className="border p-2">{user.role}</td>
                        <td className="border p-2">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border p-2 flex gap-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleView(user._id)}
                            title="View User"
                          >
                            <Eye size={20} />
                          </button>
                          <button
                            className="text-green-500 hover:text-green-700"
                            onClick={() => handleEdit(user._id)}
                            title="Edit User"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(user._id)}
                            title="Delete User"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
