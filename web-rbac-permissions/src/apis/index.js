import authorizeAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const handleLogoutAPI = async () => {
  // Trường hợp 1: dùng cookie
  await authorizeAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)

  // Trường hợp 2: dùng localStorage
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')

  return
}

export const handleRefreshTokenAPI = async (refreshToken) => {
  return await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/users/refresh_token`,
    {
      refreshToken
    }
  )
}
