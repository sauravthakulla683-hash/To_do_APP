import { useEffect, useState } from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", body: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const BASE_URL = "http://localhost:1000/api/list";

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ Get all tasks (by user email)
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/gettasks?email=${user.email}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTasks(data.tasks || []);
      console.log("Fetched tasks:", data.tasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setMsg("⚠️ Could not load tasks");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new task
  const handleCreate = async () => {
    if (!newTask.title) return setMsg("⚠️ Title cannot be empty!");
    try {
      const res = await fetch(`${BASE_URL}/addtask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTask.title,
          body: newTask.body,
          email: user.email, // ✅ backend uses email
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg("✅ Task added successfully!");
      setNewTask({ title: "", body: "" });
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task:", err);
      setMsg("❌ Failed to create task");
    }
  };

  // ✅ Update task
  const handleUpdate = async (id, oldTitle, oldBody) => {
    const title = prompt("Edit Title:", oldTitle);
    const body = prompt("Edit Description:", oldBody);
    if (title === null || body === null) return;

    try {
      const res = await fetch(`${BASE_URL}/updatetask/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg("✅ Task updated successfully!");
      fetchTasks();
    } catch (err) {
      console.error("Update error:", err);
      setMsg("❌ Failed to update task");
    }
  };

  // ✅ Delete task
  const handleDelete = async (id) => {
    if (!confirm("Delete this task?")) return;
    try {
      const res = await fetch(`${BASE_URL}/delete/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMsg("🗑️ Task deleted successfully!");
      fetchTasks();
    } catch (err) {
      console.error("Delete error:", err);
      setMsg("❌ Failed to delete task");
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-gray-400 text-lg">
        Loading your dashboard...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 sm:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-semibold tracking-wide">
          Welcome, <span className="text-blue-500">{user?.username}</span> 👋
        </h1>
        <button
          onClick={handleLogout}
          className="mt-3 sm:mt-0 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-all"
        >
          Logout
        </button>
      </header>

      {/* Add Task */}
      <div className="bg-gray-900/60 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 shadow-xl mb-8">
        <h2 className="text-xl font-semibold mb-4 text-blue-400">
          Add New Task
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            className="bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-lg p-3 outline-none flex-1 text-sm"
          />
          <input
            type="text"
            placeholder="Task description"
            value={newTask.body}
            onChange={(e) => setNewTask({ ...newTask, body: e.target.value })}
            className="bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-lg p-3 outline-none flex-1 text-sm"
          />
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition-all text-sm"
          >
            Add Task
          </button>
        </div>
        {msg && (
          <p className="text-center mt-4 text-sm text-green-400 font-medium">
            {msg}
          </p>
        )}
      </div>

      {/* Task List */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-blue-400">Your Tasks</h2>

        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            No tasks yet. ✨ Try adding one!
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-gray-900/70 backdrop-blur-lg border border-gray-800 rounded-xl p-5 shadow-lg hover:shadow-blue-500/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-400">{task.body}</p>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() =>
                      handleUpdate(task._id, task.title, task.body)
                    }
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-3 py-1 rounded-md text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-3 py-1 rounded-md text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        Made by ❤️ @sauravthakulla
      </footer>
    </div>
  );
}
