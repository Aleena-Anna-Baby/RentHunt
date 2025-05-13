import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosInstance';
import './userManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');

  const token = localStorage.getItem('adminToken');

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/api/admin/users?search=${search}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const toggleBanStatus = async (userId, currentStatus) => {
    try {
      const response = await axiosInstance.post('/api/admin/users/ban', {
        userId,
        isBanned: !currentStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = response.data.user;
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? updatedUser : user
        )
      );
    } catch (error) {
      console.error('Error banning/unbanning user:', error);
    }
  };

  return (
    <div className="user-management-page">
      <h2>User Management</h2>
      <input
        type="text"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-box"
      />

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="4">No users found.</td></tr>
          ) : (
            users.map(user => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.isBanned ? 'Banned' : 'Active'}</td>
                <td>
                  <button
                    className={user.isBanned ? 'unban-btn' : 'ban-btn'}
                    onClick={() => toggleBanStatus(user._id, user.isBanned)}
                  >
                    {user.isBanned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
