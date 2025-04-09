// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Login from '~/pages/Login'
import Dashboard from '~/pages/Dashboard'

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
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  )
}

export default App
