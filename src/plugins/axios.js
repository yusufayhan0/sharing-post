import axios from "axios"

// Request interceptor
const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

http.interceptors.request.use(
  async (config) => {
    
    //header add token
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response || {}

    if (status >= 500) {
      console.log("server-error")
    }

    if (status === 401) {
      console.log("authorized-error")
    }

    // Handle Forbidden
    if (status === 403) {
      console.log("permission-error")
    }

    // Handle Token Timeouts
    if (status === 419) {
      console.log("token-error")
    }

    return Promise.reject(error)
  }
)

export default http