import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { doctorsAPI } from '../services/api';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    experience: '',
    phone: '',
    specialization: '',
  });

  useEffect(() => {
    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, department, page, sortBy, order]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await doctorsAPI.getAll({
        search,
        department,
        page,
        sortBy,
        order,
      });
      const { data, totalPages: apiTotalPages } = response.data;
      setDoctors(data);
      setTotalPages(apiTotalPages);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await doctorsAPI.create(formData);
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        department: '',
        experience: '',
        phone: '',
        specialization: '',
      });
      fetchDoctors();
    } catch (error) {
      console.error('Error creating doctor:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorsAPI.delete(id);
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
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
          <h1>Manage Doctors</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn">
            {showForm ? 'Cancel' : 'Add Doctor'}
          </button>
        </div>

        <div className="filter-bar">
          <input
            type="text"
            placeholder="Search doctors by name, email, specialization..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <input
            type="text"
            placeholder="Filter by department"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {showForm && (
          <form className="form-card" onSubmit={handleSubmit}>
            <h3>Add New Doctor</h3>
            <div className="form-row">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                placeholder="Experience (years)"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <input
              type="text"
              placeholder="Specialization"
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
            <button type="submit" className="btn">
              Add Doctor
            </button>
          </form>
        )}

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Name</th>
                <th>Email</th>
                <th onClick={() => handleSort('experience')}>Experience</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor.id}>
                  <td>{doctor.name}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.experience} years</td>
                  <td>{doctor.department}</td>
                  <td>{doctor.phone}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(doctor.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
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

export default ManageDoctors;
