import axios from "axios"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
})

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem("refresh_token")
      if (refreshToken) {
        try {
          const tokenResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/refresh`,
            {
              refresh_token: refreshToken,
            },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          )
          const newAccessToken = tokenResponse.data.access_token
          localStorage.setItem("access_token", newAccessToken)
          axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`
          return axiosInstance(originalRequest)
        } catch (refreshError) {
          console.error("Failed to refresh token:", refreshError)
          localStorage.removeItem("access_token")
          localStorage.removeItem("refresh_token")
          window.location.href = "/auth/login"
          return Promise.reject(refreshError)
        }
      } else {
        window.location.href = "/auth/login"
      }
    }
    return Promise.reject(error)
  },
)

export default axiosInstance
