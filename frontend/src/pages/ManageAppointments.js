import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { appointmentsAPI, patientsAPI, doctorsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManageAppointments = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [order, setOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointmentDate: '',
    appointmentTime: '',
    status: 'scheduled',
    notes: ''
  });

  useEffect(() => {
    fetchAppointments();
    if (isAdmin) {
      fetchPatients();
      fetchDoctors();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, page, sortBy, order]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const params = { search, status, page, sortBy, order };
      // Filter by doctor if user is a doctor
      if (user?.role === 'DOCTOR') {
        // You'd need to get doctor_id from user context or API
      }
      const response = await appointmentsAPI.getAll(params);
      const { data, totalPages: apiTotalPages } = response.data;
      setAppointments(data);
      setTotalPages(apiTotalPages);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await patientsAPI.getAll({ limit: 100 });
      setPatients(response.data.data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorsAPI.getAll({ limit: 100 });
      setDoctors(response.data.data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);
    setFormData({
      patient_id: appointment.patient_id,
      doctor_id: appointment.doctor_id,
      appointmentDate: appointment.appointment_date.split('T')[0],
      appointmentTime: appointment.appointment_time,
      status: appointment.status,
      notes: appointment.notes || ''
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await appointmentsAPI.update(editingId, formData);
      } else {
        await appointmentsAPI.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        patient_id: '',
        doctor_id: '',
        appointmentDate: '',
        appointmentTime: '',
        status: 'scheduled',
        notes: ''
      });
      fetchAppointments();
    } catch (error) {
      console.error('Error saving appointment:', error);
      alert(error.response?.data?.message || 'Failed to save appointment');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await appointmentsAPI.delete(id);
        fetchAppointments();
      } catch (error) {
        console.error('Error deleting appointment:', error);
        alert('Failed to delete appointment');
      }
    }
  };

  const isUpcoming = (appointmentDate, appointmentTime) => {
    const now = new Date();
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    return appointmentDateTime > now && appointmentDateTime <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Next 7 days
  };

  if (loading) {
    return (
      <Layout>
        <div className="loading">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="manage-page">
        <div className="page-header">
          <h1>Manage Appointments</h1>
          {isAdmin && (
            <button onClick={() => {
              setShowForm(!showForm);
              if (showForm) {
                setEditingId(null);
                setFormData({
                  patient_id: '',
                  doctor_id: '',
                  appointmentDate: '',
                  appointmentTime: '',
                  status: 'scheduled',
                  notes: ''
                });
              }
            }} className="btn">
              {showForm ? 'Cancel' : 'Add Appointment'}
            </button>
          )}
        </div>

        {showForm && isAdmin && (
          <form className="form-card" onSubmit={handleSubmit}>
            <h3>{editingId ? 'Edit Appointment' : 'Add New Appointment'}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Patient:</label>
                <select
                  value={formData.patient_id}
                  onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  required
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Doctor:</label>
                <select
                  value={formData.doctor_id}
                  onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                  required
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Date:</label>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Time:</label>
                <input
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Notes:</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows="3"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px' }}
              />
            </div>
            <button type="submit" className="btn">{editingId ? 'Update Appointment' : 'Create Appointment'}</button>
          </form>
        )}

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search by patient, doctor, or notes..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th onClick={() => handleSort('date')}>Date</th>
                <th onClick={() => handleSort('time')}>Time</th>
                <th>Status</th>
                <th>Notes</th>
                {isAdmin && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => {
                const appointmentDate = appointment.appointment_date.split('T')[0];
                const upcoming = isUpcoming(appointmentDate, appointment.appointment_time);
                return (
                  <tr 
                    key={appointment.id} 
                    className={upcoming ? 'upcoming-appointment' : ''}
                  >
                    <td>{appointment.patient_name}</td>
                    <td>{appointment.doctor_name}</td>
                    <td>{new Date(appointment.appointment_date).toLocaleDateString()}</td>
                    <td>{appointment.appointment_time}</td>
                    <td>
                      <span className={`status ${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>{appointment.notes}</td>
                    {isAdmin && (
                      <td>
                        <button
                          onClick={() => handleEdit(appointment)}
                          className="btn"
                          style={{ marginRight: '8px', padding: '6px 12px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(appointment.id)}
                          className="btn btn-danger"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
            <button
              key={p}
              className={`page-btn ${p === page ? 'active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ManageAppointments;
