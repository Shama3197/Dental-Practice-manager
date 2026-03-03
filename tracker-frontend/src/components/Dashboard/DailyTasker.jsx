import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../services/api";
import { appointmentService } from "../../services/appointmentService";
import { getLabWorks } from "../../api/labwork";
import { useThemeStore } from "../../store/theme";
import { useUserStore } from "../../store/user";
import { getCircadianState, getCurrentHour } from "../../utils/themeEngine";

export default function DailyTasker() {
  const [tasks, setTasks] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [labWorks, setLabWorks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const { isDynamicEnvironment } = useThemeStore();
  const { user } = useUserStore();
  const circadianState = getCircadianState(user.gender);

  // Get today's date range (start and end of day)
  const getTodayRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);
    return { start: today, end: endOfDay };
  };

  // Fetch all data for today
  useEffect(() => {
    fetchAllData();
  }, []);

  // Listen for appointment creation events
  useEffect(() => {
    const handleAppointmentCreated = () => {
      fetchAllData();
    };
    window.addEventListener('appointmentCreated', handleAppointmentCreated);
    return () => {
      window.removeEventListener('appointmentCreated', handleAppointmentCreated);
    };
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const { start, end } = getTodayRange();
      
      // Fetch manual tasks
      const tasksRes = await axios.get(`${API_BASE_URL}/tasks`);
      setTasks(tasksRes.data || []);

      // Fetch appointments for today
      try {
        const appointmentsData = await appointmentService.getAllAppointments();
        const todayAppointments = appointmentsData.filter(apt => {
          if (!apt.date) return false;
          const aptDate = new Date(apt.date);
          // Normalize dates to compare only date part (ignore time)
          const aptDateOnly = new Date(aptDate.getFullYear(), aptDate.getMonth(), aptDate.getDate());
          const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
          const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
          
          return aptDateOnly >= startDateOnly && aptDateOnly <= endDateOnly && 
                 apt.status !== 'Completed' && 
                 apt.status !== 'Cancelled';
        });
        setAppointments(todayAppointments);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        // Use dummy data if API fails
        setAppointments(getDummyAppointments());
      }

      // Fetch lab work for today
      try {
        const labRes = await getLabWorks({ 
          status: 'Pending',
          page: 1,
          limit: 100 
        });
        const labData = labRes.data?.data || labRes.data || [];
        const todayLabWork = labData.filter(lab => {
          if (!lab.sentDate && !lab.createdAt) return false;
          const labDate = lab.sentDate ? new Date(lab.sentDate) : new Date(lab.createdAt);
          // Normalize dates to compare only date part (ignore time)
          const labDateOnly = new Date(labDate.getFullYear(), labDate.getMonth(), labDate.getDate());
          const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
          const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
          
          return labDateOnly >= startDateOnly && labDateOnly <= endDateOnly && 
                 lab.status !== 'Completed' && lab.status !== 'Delivered';
        });
        setLabWorks(todayLabWork);
      } catch (err) {
        console.error('Error fetching lab work:', err);
        // Use dummy data if API fails
        setLabWorks(getDummyLabWork());
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Dummy data fallback
  const getDummyAppointments = () => {
    const today = new Date();
    return [
      {
        _id: 'apt-1',
        patient: { name: 'John Doe' },
        date: today,
        time: '10:00',
        treatmentDetails: ['Cleaning', 'Checkup'],
        status: 'Scheduled',
        type: 'appointment'
      },
      {
        _id: 'apt-2',
        patient: { name: 'Sarah Wilson' },
        date: today,
        time: '14:30',
        treatmentDetails: ['Crown Fitting'],
        status: 'Confirmed',
        type: 'appointment'
      }
    ];
  };

  const getDummyLabWork = () => {
    const today = new Date();
    return [
      {
        _id: 'lab-1',
        patientId: { name: 'Mike Johnson' },
        type: 'Crown',
        sentDate: today,
        status: 'Pending',
        labName: 'Dental Lab Pro'
      },
      {
        _id: 'lab-2',
        patientId: { name: 'Emily Davis' },
        type: 'Denture',
        sentDate: today,
        status: 'In Progress',
        labName: 'Precision Dental'
      }
    ];
  };

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(`${API_BASE_URL}/tasks`, { text: newTask });
      setTasks([...tasks, res.data]);
      setNewTask("");
    } catch (error) {
      console.error('Error adding task:', error);
      // Add locally if API fails
      const newTaskObj = {
        _id: `temp-${Date.now()}`,
        text: newTask,
        completed: false,
        createdAt: new Date()
      };
      setTasks([...tasks, newTaskObj]);
      setNewTask("");
    }
  };

  const toggleTaskDone = async (id) => {
    try {
      const updated = await axios.put(`${API_BASE_URL}/tasks/${id}/toggle`);
      setTasks(tasks.map(t => (t._id === id ? updated.data : t)));
    } catch (error) {
      console.error('Error toggling task:', error);
      // Toggle locally if API fails
      setTasks(tasks.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
    }
  };

  const toggleAppointmentDone = async (id) => {
    try {
      await appointmentService.updateAppointment(id, { status: 'Completed' });
      setAppointments(appointments.filter(apt => apt._id !== id));
    } catch (error) {
      console.error('Error updating appointment:', error);
      // Remove locally if API fails
      setAppointments(appointments.filter(apt => apt._id !== id));
    }
  };

  const toggleLabWorkDone = async (id) => {
    try {
      const { updateLabWorkStatus } = await import('../../api/labwork');
      await updateLabWorkStatus(id, 'Completed', 'Marked as completed from checklist');
      setLabWorks(labWorks.filter(lab => lab._id !== id));
    } catch (error) {
      console.error('Error updating lab work:', error);
      // Update locally if API fails
      setLabWorks(labWorks.map(lab => 
        lab._id === id ? { ...lab, status: 'Completed' } : lab
      ));
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      // Remove locally if API fails
      setTasks(tasks.filter(t => t._id !== id));
    }
  };

  // Get adaptive text colors based on hour
  const getTextColors = () => {
    if (!isDynamicEnvironment) {
      return {
        title: 'text-gray-800',
        text: 'text-gray-700',
        completed: 'text-gray-400',
        placeholder: 'text-gray-400',
        border: 'border-gray-200',
        bg: 'bg-gray-50'
      };
    }
    
    // Dynamic text color based on recordingHour (or current hour)
    const currentHour = getCurrentHour();
    const isNight = currentHour >= 18 || currentHour < 6; // Night: 18:00 - 05:59
    
    if (isNight) {
      // Night Mode (18:00 - 05:59): white text for readability
      return {
        title: 'text-white',
        text: 'text-white/90',
        completed: 'text-white/50',
        placeholder: 'text-white/60',
        border: 'border-white/20',
        bg: 'bg-white/10'
      };
    }
    
    // Day Mode (06:00 - 17:59): black text for high contrast
    return {
      title: 'text-gray-900',
      text: 'text-gray-800',
      completed: 'text-gray-500',
      placeholder: 'text-gray-500',
      border: 'border-gray-300',
      bg: 'bg-gray-50'
    };
  };

  const textColors = getTextColors();

  // Combine all items into a single list
  const allItems = [
    ...appointments.map(apt => ({
      id: apt._id,
      text: `Appointment: ${apt.patient?.name || 'Patient'} - ${apt.time} (${apt.treatmentDetails?.join(', ') || apt.treatmentType || 'Treatment'})`,
      completed: apt.status === 'Completed',
      type: 'appointment',
      time: apt.time,
      original: apt
    })),
    ...labWorks.map(lab => {
      const patientName = lab.patient?.name || lab.patientId?.name || 'Patient';
      const labType = lab.type || lab.caseType || 'Lab Work';
      const labName = lab.labName || 'Lab';
      return {
        id: lab._id,
        text: `Lab Work: ${patientName} - ${labType} (${labName})`,
        completed: lab.status === 'Completed' || lab.status === 'Delivered',
        type: 'labwork',
        original: lab
      };
    }),
    ...tasks.map(task => ({
      id: task._id,
      text: task.text,
      completed: task.completed,
      type: 'task',
      original: task
    }))
  ].sort((a, b) => {
    // Sort by time if available, then by type
    if (a.time && b.time) return a.time.localeCompare(b.time);
    if (a.time) return -1;
    if (b.time) return 1;
    return 0;
  });

  const handleToggle = (item) => {
    if (item.type === 'appointment') {
      toggleAppointmentDone(item.id);
    } else if (item.type === 'labwork') {
      toggleLabWorkDone(item.id);
    } else {
      toggleTaskDone(item.id);
    }
  };

  const handleDelete = (item) => {
    if (item.type === 'task') {
      deleteTask(item.id);
    }
    // Appointments and lab work are not deletable from checklist
  };

  return (
    <div className="rounded-xl bg-white/20 backdrop-blur-xl p-4 md:p-5 border border-white/20 flex flex-col min-h-[320px] shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-300 hover:border-[#d4af37]/50 hover:shadow-[0_0_28px_rgba(242,212,114,0.4)] hover:-translate-y-1">
      <h2 className={`text-lg font-semibold ${textColors.title} mb-2`}>Today's Checklist</h2>
      <div className="flex gap-2 mb-3">
        <input
          className={`flex-1 px-3 py-1.5 border ${textColors.border} rounded text-sm focus:ring-2 focus:ring-blue-100 ${textColors.text} bg-white/50`}
          placeholder="Add new task (e.g., Crown Trial, Send Lab)"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && addTask()}
        />
        <button 
          className="px-4 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 shadow-sm transition-colors" 
          onClick={addTask}
        >
          Add
        </button>
      </div>
      <ul className="space-y-1 text-sm flex-1 overflow-y-auto">
        {loading ? (
          <li className={`${textColors.placeholder} italic`}>Loading tasks...</li>
        ) : allItems.length === 0 ? (
          <li className={`${textColors.placeholder} italic`}>No tasks for today.</li>
        ) : (
          allItems.map((item) => (
            <li 
              key={item.id} 
              className={`flex items-center justify-between p-2 ${textColors.bg} rounded border ${textColors.border}`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input 
                  type="checkbox" 
                  checked={item.completed} 
                  onChange={() => handleToggle(item)} 
                  className="accent-blue-600 w-4 h-4 flex-shrink-0 cursor-pointer" 
                />
                <span 
                  className={`flex-1 ${item.completed ? `line-through ${textColors.completed}` : textColors.text}`}
                >
                  {item.text}
                </span>
              </div>
              {item.type === 'task' && (
                <button 
                  className={`text-red-400 hover:text-red-600 text-base px-2 flex-shrink-0 ${textColors.text}`}
                  onClick={() => handleDelete(item)} 
                  title="Delete"
                >
                  ✕
                </button>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
