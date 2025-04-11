import { Navigate, Outlet } from 'react-router-dom'
import { roles } from '~/config/rbacConfig'
import { usePermission } from '~/hooks/usePermission'

function RbacRoute({
  requiredPermission,
  redirectTo = '/access-denied',
  children
}) {
  const user = JSON.parse(localStorage.getItem('userInfo'))
  const userRole = user?.role || roles.CLIENT

  const { hasPermission } = usePermission(userRole)

  if (!hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace={true} />
  }

  // react-router-dom v6.4+ requires to use <Outlet /> to render child routes
  return <Outlet />

  // dung cho react-router-dom ver cũ
  //   return children
}

export default RbacRoute
