import { rolePermissions } from '~/config/rbacConfig'

// Custom hook to check user permissions
export const usePermission = (userRole) => {
  const hasPermission = (permission) => {
    const allowedPermissions = rolePermissions[userRole] || []

    return allowedPermissions.includes(permission)
  }

  return { hasPermission }
}
