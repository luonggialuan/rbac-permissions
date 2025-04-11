// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'
import NotFound from './pages/404/NotFound'
import AccessDenied from './pages/AccessDenied'
import RbacRoute from './components/core/RbacRoute'
import { permissions } from './config/rbacConfig'

const ProtectedRoute = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  return userInfo ? <Outlet /> : <Navigate to="/login" replace={true} />
}
const UnauthorizedRoutes = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  return userInfo ? <Navigate to="/dashboard" replace={true} /> : <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace={true} />} />

      <Route element={<UnauthorizedRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        {/* Đùng <Outlet/> cho dự án mới react-router-dom ^6.x.x*/}
        <Route
          element={
            <RbacRoute requiredPermission={permissions.VIEW_DASHBOARD} />
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route
          element={<RbacRoute requiredPermission={permissions.VIEW_SUPPORT} />}
        >
          <Route path="/support" element={<Dashboard />} />
        </Route>
        <Route
          element={<RbacRoute requiredPermission={permissions.VIEW_MESSAGES} />}
        >
          <Route path="/messages" element={<Dashboard />} />
        </Route>
        <Route
          element={<RbacRoute requiredPermission={permissions.VIEW_REVENUE} />}
        >
          <Route path="/revenue" element={<Dashboard />} />
        </Route>
        <Route
          element={
            <RbacRoute requiredPermission={permissions.VIEW_ADMIN_TOOLS} />
          }
        >
          <Route path="/admin-tools" element={<Dashboard />} />
        </Route>

        {/* Dùng children cho dự án cũ */}
        {/* <Route
          path="/dashboard"
          element={
            <RbacRoute requiredPermission={permissions.VIEW_DASHBOARD}>
              <Dashboard />
            </RbacRoute>
          }
        /> */}

        {/*  */}
        {/* <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/support" element={<Dashboard />} />
        <Route path="/messages" element={<Dashboard />} />
        <Route path="/revenue" element={<Dashboard />} />
        <Route path="/admin-tools" element={<Dashboard />} /> */}
      </Route>

      {/* 404 Not Found */}
      <Route path="/access-denied" element={<AccessDenied />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
