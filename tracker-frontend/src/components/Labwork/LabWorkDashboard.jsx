import React, { useEffect, useState } from 'react';
import { getLabWorkStats } from '../../api/labwork';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Card = ({ title, value, color = 'text-blue-600' }) => (
  <div className="bg-white rounded shadow p-4 flex flex-col items-center">
    <div className="text-lg font-semibold mb-1">{title}</div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
  </div>
);

const LabWorkDashboard = () => {
  const [stats, setStats] = useState({
    statusStats: [],
    total: 0,
    caseTypeStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getLabWorkStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching labwork stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white rounded shadow p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Create status counts object
  const statusCounts = {
    Pending: 0,
    'In Progress': 0,
    Received: 0,
    Delayed: 0,
    Completed: 0
  };

  stats.statusStats.forEach(stat => {
    statusCounts[stat._id] = stat.count;
  });

  const pieData = {
    labels: Object.keys(statusCounts).filter(key => statusCounts[key] > 0),
    datasets: [
      {
        data: Object.values(statusCounts).filter(count => count > 0),
        backgroundColor: [
          '#fde047', // Pending - Yellow
          '#3b82f6', // In Progress - Blue
          '#4ade80', // Received - Green
          '#f87171', // Delayed - Red
          '#10b981'  // Completed - Emerald
        ],
        borderWidth: 1,
      },
    ],
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'text-yellow-600',
      'In Progress': 'text-blue-600',
      Received: 'text-green-600',
      Delayed: 'text-red-600',
      Completed: 'text-emerald-600'
    };
    return colors[status] || 'text-gray-600';
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card title="Total Cases" value={stats.total} color="text-gray-600" />
        <Card title="Pending" value={statusCounts.Pending} color={getStatusColor('Pending')} />
        <Card title="In Progress" value={statusCounts['In Progress']} color={getStatusColor('In Progress')} />
        <Card title="Received" value={statusCounts.Received} color={getStatusColor('Received')} />
        <Card title="Completed" value={statusCounts.Completed} color={getStatusColor('Completed')} />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded shadow p-4 flex flex-col items-center">
          <div className="text-lg font-semibold mb-2">Status Distribution</div>
          <div className="w-48 h-48">
            <Pie data={pieData} options={{
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }} />
          </div>
        </div>
        
        <div className="bg-white rounded shadow p-4">
          <div className="text-lg font-semibold mb-4">Top Case Types</div>
          <div className="space-y-2">
            {stats.caseTypeStats.map((type, index) => (
              <div key={type._id} className="flex justify-between items-center">
                <span className="font-medium">{type._id}</span>
                <span className="text-blue-600 font-bold">{type.count}</span>
              </div>
            ))}
            {stats.caseTypeStats.length === 0 && (
              <p className="text-gray-500 text-center">No case types found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabWorkDashboard; 