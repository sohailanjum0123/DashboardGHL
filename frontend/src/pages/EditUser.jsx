import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetail, updateUser } from "../services/api";


export default function EditUser() {



  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
  });

      const updatedUser = () => {
    navigate(`/dashboard/users`); 
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserDetail(id);
        setFormData({
          fullName: res.data.data.fullName,
          userName: res.data.data.userName,
          email: res.data.data.email,
        });
      } catch (error) {
        console.error(error);
        alert("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, formData);
      alert("User updated successfully");
      navigate("/users");
    } catch (error) {
      console.error(error);
      alert("Failed to update user");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="Username"
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded"
          required
        />
        <button
         onClick={() => updatedUser()}
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
        >
          Update User
        </button>
      </form>
    </div>
  );
}
