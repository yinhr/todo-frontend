import axios from "axios";

const url = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: `${url}`,
  responseType: 'json',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
});

axiosInstance.interceptors.response.use(null, error => {
  if (error.response && error.response.status === 401) {
    delete localStorage.signedIn
    location.replace('/')
    return Promise.reject(error)
  } else {
    return Promise.reject(error)
  }
})

export default axiosInstance
