import { useState, useEffect } from "react";
import axios from "axios";

export default function DailyTasker() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    axios.get("/api/tasks").then(res => setTasks(res.data));
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    const res = await axios.post("/api/tasks", { text: newTask });
    setTasks([...tasks, res.data]);
    setNewTask("");
  };

  const toggleDone = async (id) => {
    const updated = await axios.put(`/api/tasks/${id}/toggle`);
    setTasks(tasks.map(t => (t._id === id ? updated.data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`/api/tasks/${id}`);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div className="rounded-xl shadow bg-white p-4 md:p-5 border border-gray-100 flex flex-col min-h-[320px]">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Today's Checklist</h2>
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 px-3 py-1.5 border border-gray-200 rounded text-sm focus:ring-2 focus:ring-blue-100"
          placeholder="Add new task (e.g., Crown Trial, Send Lab)"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />
        <button className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 shadow-sm" onClick={addTask}>Add</button>
      </div>
      <ul className="space-y-1 text-sm">
        {tasks.length === 0 && <li className="text-gray-400 italic">No tasks for today.</li>}
        {tasks.map((task) => (
          <li key={task._id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={task.completed} onChange={() => toggleDone(task._id)} className="accent-blue-600 w-4 h-4" />
              <span className={task.completed ? "line-through text-gray-400" : "text-gray-700"}>{task.text}</span>
            </div>
            <button className="text-red-400 hover:text-red-600 text-base px-2" onClick={() => deleteTask(task._id)} title="Delete">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
} 