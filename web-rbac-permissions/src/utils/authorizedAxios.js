// Author: TrungQuanDev: https://youtube.com/@trungquandev
import axios from 'axios'
import { toast } from 'react-toastify'
import { handleLogoutAPI, handleRefreshTokenAPI } from '~/apis'

const TIMEOUT = 1000 * 60 * 10 // * 10 phút
let authorizeAxiosInstance = axios.create()

// * Thời gian chờ tối đa của 1 request
authorizeAxiosInstance.defaults.timeout = TIMEOUT

// * withCredentials: cho phép axios tự động gửi cookie trong 1 request lên BE (lưu JWT tokens vào trong httpOnly Cookie của trình duyệt)
authorizeAxiosInstance.defaults.withCredentials = true

/**
 * Cấu hình Interceptors (Bộ đánh chặn giữa request và response)
 * https://axios-http.com/docs/interceptors
 */
// Add a request interceptor
authorizeAxiosInstance.interceptors.request.use(
  (config) => {
    // Lấy accessToken từ localStorage và đính kèm vào header
    // const accessToken = localStorage.getItem('accessToken')
    // if (accessToken) {
    //   // Cần thêm 'Bearer' vì chúng ta nên tuân thủ theo tiêu chuẩn OAuth 2.0 trong việc xác định loại token đang sử dụng
    //   // Bearer là định nghĩa loại token dành cho việc xác thực và ủy quyền, tham khảo các loại token khác như: Basic Token, Digest Token, OAuth Token,...
    //   config.headers.Authorization = `Bearer ${accessToken}`
    // }

    return config
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// Khởi tạo một promise cho việc gọi api refresh token
// Mục đích tạo Promise naỳ để tránh việc gọi api refresh token nhiều lần cùng 1 lúc -> hold lại việc gọi api refresh token cho đến khi nó hoàn thành
let refreshTokenPromise = null

// Add a response interceptor
authorizeAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    /** Xử lý Refresh Token tự động */
    if (error.message?.status === 401) {
      handleLogoutAPI().then(() => {
        // Xóa userInfo khỏi localStorage
        localStorage.removeItem('userInfo')

        // Chuyển hướng về trang Login
        location.href = '/login'
      })
    }

    // Nếu nhận mã 410 từ BE, thì gọi api refresh token và thử lại request
    // Đầu tiên lấy được các requestAPI đang bị lỗi thông qua error.config
    const originalRequest = error.config

    if (error.response?.status === 410 && originalRequest) {
      // Gán thêm biến _retry vào originalRequest để tránh việc gọi lại request vô tận
      // originalRequest._retry = true

      if (!refreshTokenPromise) {
        // Lấy refreshToken từ localStorage
        const refreshToken = localStorage.getItem('refreshToken')

        // Gọi api refresh token
        refreshTokenPromise = handleRefreshTokenAPI(refreshToken)
          .then((res) => {
            // Trường hợp LocalStorage:  Nếu api refresh token thành công, lưu lại accessToken mới vào localStorage
            const { accessToken } = res.data
            localStorage.setItem('accessToken', accessToken)

            authorizeAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`

            // Trường hợp cookie -> đã được cập nhật ở phía BE

            // return lại axios instance với config mới và thực hiện request lại
            // return authorizeAxiosInstance(originalRequest)
          })
          .catch((_error) => {
            // Nếu api refresh token lỗi -> logout
            handleLogoutAPI().then(() => {
              // Xóa userInfo khỏi localStorage
              localStorage.removeItem('userInfo')

              // Chuyển hướng về trang Login
              location.href = '/login'
            })

            return Promise.reject(_error)
          })
          .finally(() => {
            refreshTokenPromise = null
          })
      }

      return refreshTokenPromise.then(() => {
        // Sau khi refreshTokenPromise hoàn thành, thì return lại axios instance với config mới và thực hiện lại các request lỗi
        return authorizeAxiosInstance(originalRequest)
      })
    }

    if (error.response?.status !== 410) {
      // * Dùng toastify để hiển thị lỗi - Trừ mã lỗi 410 - GONE --> status code refresh token
      toast.error(error.response?.data?.message || error?.message)
    }
    return Promise.reject(error)
  }
)

export default authorizeAxiosInstance
