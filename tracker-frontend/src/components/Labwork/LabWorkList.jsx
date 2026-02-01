import React, { useEffect, useState } from 'react';
import { getLabWorks } from '../../api/labwork';
import { format } from 'date-fns';

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Received: 'bg-green-100 text-green-800',
  Delayed: 'bg-red-100 text-red-800',
  Completed: 'bg-emerald-100 text-emerald-800',
};

const LabWorkList = ({ onView }) => {
  const [labWorks, setLabWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    caseType: '',
    patientId: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    fetchLabWorks();
    fetchPatients();
  }, [filters, pagination.page]);

  const fetchLabWorks = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      const { data } = await getLabWorks(params);
      setLabWorks(data.data || data); // Handle both new and old response format
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (err) {
      console.error('Error fetching labwork:', err);
      setLabWorks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/patients');
      const data = await response.json();
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getStatusBadge = (status) => (
    <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-xl shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
        <h2 className="text-xl font-bold">Lab Work List</h2>
        <div className="flex flex-wrap gap-2">
          <select
            className="border rounded p-2 text-sm"
            value={filters.status}
            onChange={e => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Received">Received</option>
            <option value="Delayed">Delayed</option>
            <option value="Completed">Completed</option>
          </select>
          
          <select
            className="border rounded p-2 text-sm"
            value={filters.caseType}
            onChange={e => handleFilterChange('caseType', e.target.value)}
          >
            <option value="">All Case Types</option>
            <option value="Crown">Crown</option>
            <option value="Denture">Denture</option>
            <option value="Bridge">Bridge</option>
            <option value="Veneer">Veneer</option>
            <option value="Implant">Implant</option>
            <option value="Inlay">Inlay</option>
            <option value="Onlay">Onlay</option>
            <option value="Partial">Partial</option>
            <option value="Other">Other</option>
          </select>
          
          <select
            className="border rounded p-2 text-sm"
            value={filters.patientId}
            onChange={e => handleFilterChange('patientId', e.target.value)}
          >
            <option value="">All Patients</option>
            {patients.map(patient => (
              <option key={patient._id} value={patient._id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {labWorks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No lab work entries found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left">Patient Name</th>
                  <th className="px-4 py-2 text-left">Case Type</th>
                  <th className="px-4 py-2 text-left">Date Sent</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Priority</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {labWorks.map(lw => (
                  <tr key={lw._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{lw.patientId?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{lw.patientId?.contactNumber || ''}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{lw.caseType}</span>
                    </td>
                    <td className="px-4 py-3">
                      {lw.dateSent ? format(new Date(lw.dateSent), 'MMM dd, yyyy') : '-'}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(lw.status)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        lw.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                        lw.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        lw.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {lw.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        className="text-blue-600 hover:text-blue-800 font-medium"
                        onClick={() => onView(lw._id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="px-3 py-1">
                Page {pagination.page} of {pagination.pages}
              </span>
              
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LabWorkList; 