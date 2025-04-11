import { StatusCodes } from 'http-status-codes'
import { getPermissionsFromRole } from '~/utils/rbacUtils'

const isValidPermission = (requiedPermissions) => async (req, res, next) => {
  try {
    // chạy sau authMiddleware
    const userRoles = req.jwtDecoded?.role // lấy ra role từ jwtDecoded

    // kiểm tra role (user có ít nhất một role)
    if (!Array.isArray(userRoles) || userRoles.length === 0) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Forbiden: Có vấn đề với role của bạn' })
      return
    }

    // kiểm tra userRoles
    // Đối với thao tác cần hiệu suất cao khi duyệt qua các phần tử thì dùng Set object để tối ưu hiệu năng xử lý (tìm kiếm/ thêm/ xóa) hơn xử lý array thông thường
    // Ví dụ: Array.includes() sẽ chậm: O(n) nếu so với Set.has() có độ phức tạp O(1)
    let userPermissions = new Set()
    for (const roleName of userRoles) {
      const rolePermission = await getPermissionsFromRole(roleName)
      rolePermission.forEach((i) => userPermissions.add(i))
    }
    // console.log('🐾 ~ isValidPermission ~ userPermissions:', userPermissions)
    // console.log(
    //   '🐾 ~ isValidPermission ~ Array.from(userPermissions):',
    //   Array.from(userPermissions)
    // )

    const hasPermission = requiedPermissions?.every((i) =>
      userPermissions.has(i)
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

export const rbacMiddleware_Level_3 = {
  isValidPermission
}
