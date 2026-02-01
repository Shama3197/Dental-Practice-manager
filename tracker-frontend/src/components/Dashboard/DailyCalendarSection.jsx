import { useState, useEffect } from "react";

export default function DailyCalendarSection() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    // Placeholder: Fetch Google Calendar events for selectedDate
    async function fetchCalendarEvents() {
      // TODO: Replace with real Google Calendar API integration
      try {
        // Dummy fetch
        const res = await fetch("/api/calendar?date=" + selectedDate.toISOString());
        const data = await res.json();
        setTasks(data || []);
      } catch (err) {
        console.error("Error fetching calendar data", err);
      }
    }
    fetchCalendarEvents();
  }, [selectedDate]);

  const handleTaskAdd = async () => {
    // TODO: Replace with real Google Calendar API integration
    try {
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate.toISOString(),
          task: newTask,
        }),
      });
      const data = await res.json();
      setTasks([...tasks, data]);
      setNewTask("");
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  // Dummy Google Auth placeholder
  const handleGoogleAuth = () => {
    alert("Google Auth flow placeholder. Implement OAuth2 here.");
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      {/* Calendar Card */}
      <div className="rounded-xl shadow bg-white p-4 md:p-5 border border-gray-100 flex flex-col min-h-[320px]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Your Calendar</h2>
          <button
            className="px-2.5 py-1.5 rounded bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 border border-blue-100 shadow-sm"
            onClick={handleGoogleAuth}
          >
            Connect Google Calendar
          </button>
        </div>
        <input
          type="date"
          className="border border-gray-200 rounded px-3 py-1.5 w-full mb-3 text-sm focus:ring-2 focus:ring-blue-100"
          value={selectedDate.toISOString().slice(0, 10)}
          onChange={e => setSelectedDate(new Date(e.target.value))}
        />
        {/* Placeholder for embedded Google Calendar view */}
        <div className="h-40 flex items-center justify-center bg-gray-50 rounded border border-dashed border-gray-200 text-gray-400 text-xs">
          [Google Calendar Embed Placeholder]
        </div>
      </div>

      {/* Tasks Card */}
      <div className="rounded-xl shadow bg-white p-4 md:p-5 border border-gray-100 flex flex-col min-h-[320px]">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Tasks for {selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</h2>
        <ul className="mb-2 space-y-1 text-sm">
          {tasks.length === 0 && <li className="text-gray-400 italic">No tasks for this day.</li>}
          {tasks.map((t, i) => (
            <li key={i} className="p-2 bg-gray-50 rounded border border-gray-100 flex items-center text-gray-700">
              <span className="truncate">{t.task}</span>
            </li>
          ))}
        </ul>
        <textarea
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="w-full border border-gray-200 rounded px-3 py-1.5 mb-2 text-sm focus:ring-2 focus:ring-blue-100 resize-none"
          rows={2}
        />
        <button
          onClick={handleTaskAdd}
          className="self-end px-4 py-1.5 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 shadow-sm"
        >
          Add Task
        </button>
      </div>
    </section>
  );
} 