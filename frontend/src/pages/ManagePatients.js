import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { patientsAPI } from '../services/api';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    fetchPatients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, page, sortBy, order]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientsAPI.getAll({
        search,
        page,
        sortBy,
        order,
      });
      const { data, totalPages: apiTotalPages } = response.data;
      setPatients(data);
      setTotalPages(apiTotalPages);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
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
          <h1>Manage Patients</h1>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search patients by name, email, or disease..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="data-table">
          <table>
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Disease</th>
                <th>Doctor</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{patient.email}</td>
                  <td>{patient.phone}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>{patient.disease}</td>
                  <td>{patient.doctor_name || 'Not assigned'}</td>
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

export default ManagePatients;
