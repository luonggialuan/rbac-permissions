import { StatusCodes } from 'http-status-codes'
import { MOCK_ROLES_LEVEL_2 } from '~/models/mockDatabase-Level-2'

const isValidPermission = (requiedPermissions) => async (req, res, next) => {
  try {
    // chạy sau authMiddleware
    const userRole = req.jwtDecoded?.role // lấy ra role từ jwtDecoded

    // kiểm tra role
    if (!userRole) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Forbiden: Có vấn đề với role của bạn' })
      return
    }

    // kiểm tra permissions
    const fullUserRole = MOCK_ROLES_LEVEL_2.find((i) => i.name === userRole)
    if (!fullUserRole) {
      res.status(StatusCodes.FORBIDDEN).json({
        message: 'Forbiden: Không tồn tại role của bạn trong hệ thống!'
      })
      return
    }

    const hasPermission = requiedPermissions?.every((i) =>
      fullUserRole.permissions.includes(i)
    )
    if (!hasPermission) {
      res.status(StatusCodes.FORBIDDEN).json({
        message: 'Forbiden: Bạn không đủ quyền truy cập tới API này!'
      })
      return
    }
    // role và permission hợp lệ => cho phép truy cập API
    next()
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Oops! Something went wrong.' })
  }
}

export const rbacMiddleware_Level_2 = {
  isValidPermission
}
