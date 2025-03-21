import axios from 'axios';

// Set base URL for all requests
axios.defaults.baseURL = 'http://localhost:5000/api/auth';

// Set token globally for all requests
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default axios; // You can import this if needed
