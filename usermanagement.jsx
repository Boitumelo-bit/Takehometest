import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [addUsername, setAddUsername] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [updateUsername, setUpdateUsername] = useState('');
  const [updatePassword, setUpdatePassword] = useState('');
  const [deleteUsername, setDeleteUsername] = useState('');
  const [warningVisible, setWarningVisible] = useState(false);

  const API_URL = 'http://localhost:5000/api/users'; // Backend API URL

  useEffect(() => {
    // Fetch users from the backend when the component mounts
    axios.get(API_URL)
      .then((response) => {
        setUsers(response.data);
        if (response.data.length === 1 && response.data[0].username === 'defaultUser') {
          setWarningVisible(true); // Display warning if only the default user exists
        }
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  const saveUsers = (newUsers) => {
    setUsers(newUsers);
  };

  const addUser = (event) => {
    event.preventDefault();

    // Check if the username already exists
    if (users.find(user => user.username === addUsername)) {
      alert('Username already exists!');
      return;
    }

    const newUser = {
      username: addUsername,
      password: addPassword,
    };

    // Send POST request to backend to add a user
    axios.post(API_URL, newUser)
      .then((response) => {
        saveUsers([...users, response.data]);
        alert('User added successfully!');
        setAddUsername('');
        setAddPassword('');
      })
      .catch((error) => {
        console.error('Error adding user:', error);
        alert('Failed to add user!');
      });
  };

  const updateUser = (event) => {
    event.preventDefault();
    const userIndex = users.findIndex(user => user.username === updateUsername);
    if (userIndex !== -1) {
      const updatedUser = {
        username: updateUsername,
        password: updatePassword || users[userIndex].password,
      };

      // Send PUT request to backend to update user
      axios.put(`${API_URL}/${updateUsername}`, updatedUser)
        .then(() => {
          const newUsers = [...users];
          newUsers[userIndex] = updatedUser;
          saveUsers(newUsers);
          alert('User updated successfully!');
          setUpdateUsername('');
          setUpdatePassword('');
        })
        .catch((error) => {
          console.error('Error updating user:', error);
          alert('Failed to update user!');
        });
    } else {
      alert('User not found');
    }
  };

  const deleteUser = (event) => {
    event.preventDefault();

    // Send DELETE request to backend to delete user
    axios.delete(`${API_URL}/${deleteUsername}`)
      .then(() => {
        const newUsers = users.filter(user => user.username !== deleteUsername);
        saveUsers(newUsers);
        alert('User deleted successfully!');
        setDeleteUsername('');
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete user!');
      });
  };

  return (
    <div>
      {warningVisible && (
        <p className="warningMessage" style={{ color: 'red' }}>
          You must add yourself as a new user before you can log in. Please use the 'Add New User' form to create your account.
        </p>
      )}

      <fieldset>
        <legend>Add New User</legend>
        <form onSubmit={addUser}>
          <input
            type="text"
            value={addUsername}
            onChange={(e) => setAddUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={addPassword}
            onChange={(e) => setAddPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Add User</button>
        </form>
      </fieldset>

      <fieldset>
        <legend>Update User</legend>
        <form onSubmit={updateUser}>
          <input
            type="text"
            value={updateUsername}
            onChange={(e) => setUpdateUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={updatePassword}
            onChange={(e) => setUpdatePassword(e.target.value)}
            placeholder="New Password"
          />
          <button type="submit">Update User</button>
        </form>
      </fieldset>

      <fieldset>
        <legend>Delete User</legend>
        <form onSubmit={deleteUser}>
          <input
            type="text"
            value={deleteUsername}
            onChange={(e) => setDeleteUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <button type="submit">Delete User</button>
        </form>
      </fieldset>

      <fieldset>
        <legend>Users Table</legend>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="2">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </fieldset>
    </div>
  );
};

export default UserManagement;
