import { StatusCodes } from 'http-status-codes'

const isValidPermission = (allowedRoles) => async (req, res, next) => {
  try {
    // chạy sau authMiddleware
    const userRole = req.jwtDecoded?.role // lấy ra role từ jwtDecoded

    // kiểm tra role
    if (!userRole || !allowedRoles.includes(userRole)) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'You are not allowed to access this API' })
      return
    }

    // role hợp lệ => cho phép truy cập API
    next()
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Oops! Something went wrong.' })
  }
}

export const rbacMiddleware_Level_1 = {
  isValidPermission
}
