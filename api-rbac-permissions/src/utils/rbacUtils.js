import { MOCK_ROLES_LEVEL_3 } from '~/models/mockDatabase-Level-3'

// Lấy tất cả permissions của một role của user, bao gồm cả quyền kế thừa
export const getPermissionsFromRole = async (roleName) => {
  // await vào DB
  const role = MOCK_ROLES_LEVEL_3.find((i) => i.name === roleName)
  if (!role) return [] // -> nghĩa là user ko có quyền gì cả

  // Đối với thao tác cần hiệu suất cao khi duyệt qua các phần tử thì dùng Set object để tối ưu hiệu năng xử lý (tìm kiếm/ thêm/ xóa) hơn xử lý array thông thường
  // Ví dụ: Array.includes() sẽ chậm: O(n) nếu so với Set.has() có độ phức tạp O(1)
  let permissions = new Set(role.permissions)

  // Xử lý kế thừa quyền nếu như role có tồn tại field inherits với dữ liệu
  if (Array.isArray(role.inherits) && role.inherits.length > 0) {
    for (const inheritedRoleName of role.inherits) {
      // Đệ quy lại chính hàm này để lấy toàn bộ quyền kế thừa của role hiện tại
      const inheritedPermissions = await getPermissionsFromRole(
        inheritedRoleName
      )
      inheritedPermissions.forEach((i) => permissions.add(i))
    }
    // console.log('🐾 ~ getPermissionsFromRole ~ permissions:', permissions)
  }

  // Trả về kết quả là một mảng các permissions nên sẽ dùng Array.from() vì permissions đang ở dạng Set object

  return Array.from(permissions)
}
