// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
import Divider from '@mui/material/Divider'
import authorizeAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT, TAB_URLS } from '~/utils/constants'
import Button from '@mui/material/Button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { handleLogoutAPI } from '~/apis'
import BackgroundCover from '~/assets/anime-landscape-for-desktop.jpg'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'

function Dashboard() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchData = async () => {
      const res = await authorizeAxiosInstance.get(
        `${API_ROOT}/v1/dashboards/access`
      )
      console.log('Data from API', res.data)
      console.log(
        'Data from localStorage',
        JSON.parse(localStorage.getItem('userInfo'))
      )
      setUser(res.data)
    }
    fetchData()
  }, [])
  useEffect(() => {
    const fetchData = async () => {
      await authorizeAxiosInstance.get(`${API_ROOT}/v1/dashboards/access`)
    }
    fetchData()
  }, [])

  const handleLogout = async () => {
    await handleLogoutAPI()

    // Xóa userInfo khỏi localStorage
    localStorage.removeItem('userInfo')

    // Chuyển hướng về trang Login
    navigate('/login')
  }

  const getDefaultTab = () => {
    let activeTab = TAB_URLS.DASHBOARD
    Object.values(TAB_URLS).forEach((tab) => {
      if (location.pathname.includes(tab)) {
        activeTab = tab
      }
    })
    return activeTab
  }

  const [tab, setTab] = useState(getDefaultTab())

  const handleChange = (event, newTab) => {
    setTab(newTab)
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography>Loading dashboard user...</Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        maxWidth: '1200px',
        // marginTop: '1em',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        padding: '0 1em',
        gap: 2
      }}
    >
      <Box
        as={Link}
        to="https://github.com/luonggialuan/rbac-permissions"
        target="blank"
      >
        <Box
          component="img"
          sx={{
            width: '100%',
            height: '180px',
            borderRadius: '6px',
            objectFit: 'cover'
          }}
          src={BackgroundCover}
          alt="anime-landscape-for-desktop"
        />
      </Box>
      <Alert
        severity="info"
        sx={{
          '.MuiAlert-message': { overflow: 'hidden' },
          width: { md: 'max-content' }
        }}
      >
        Đây là trang Dashboard sau khi user:&nbsp;
        <Typography
          variant="span"
          sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}
        >
          {user?.email}
        </Typography>
        &nbsp; đăng nhập thành công thì mới cho truy cập vào.
      </Alert>
      <Alert
        severity="success"
        variant="outlined"
        sx={{
          '.MuiAlert-message': { overflow: 'hidden' },
          width: { md: 'max-content' }
        }}
      >
        Role hiện tại của User đang đăng nhập là:&nbsp;
        <Typography
          variant="span"
          sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}
        >
          {user?.role}
        </Typography>
      </Alert>

      <TabContext value={tab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              label="Dashboard"
              value={TAB_URLS.DASHBOARD}
              component={Link}
              to="/dashboard"
            />
            <Tab
              label="Support"
              value={TAB_URLS.SUPPORT}
              component={Link}
              to="/support"
            />
            <Tab
              label="Messages"
              value={TAB_URLS.MESSAGES}
              component={Link}
              to="/messages"
            />
            <Tab
              label="Revenue"
              value={TAB_URLS.REVENUE}
              component={Link}
              to="/revenue"
            />
            <Tab
              label="Admin Tools"
              value={TAB_URLS.ADMIN_TOOLS}
              component={Link}
              to="/admin-tools"
            />
          </TabList>
        </Box>
        <TabPanel value={TAB_URLS.DASHBOARD}>
          <Alert severity="success" sx={{ width: { md: 'max-content' } }}>
            Nội dung trang Dashboard chung cho tất cả các Roles!
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.SUPPORT}>
          <Alert severity="success" sx={{ width: { md: 'max-content' } }}>
            Nội dung trang Support!
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.MESSAGES}>
          <Alert severity="info" sx={{ width: { md: 'max-content' } }}>
            Nội dung trang Messages chỉ dành cho Role Admin!
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.REVENUE}>
          <Alert severity="warning" sx={{ width: { md: 'max-content' } }}>
            Nội dung trang Revenue chỉ dành cho Role Admin!
          </Alert>
        </TabPanel>
        <TabPanel value={TAB_URLS.ADMIN_TOOLS}>
          <Alert severity="error" sx={{ width: { md: 'max-content' } }}>
            Nội dung trang Admin Tools chỉ dành cho Role Admin!
          </Alert>
        </TabPanel>
      </TabContext>
      <Divider />

      <Button
        type="button"
        variant="contained"
        color="info"
        size="large"
        sx={{ mt: 2, maxWidth: 'min-content', alignSelf: 'flex-end' }}
        onClick={handleLogout}
      >
        Logout
      </Button>

      <Box
        as={Link}
        to="https://github.com/luonggialuan/rbac-permissions"
        target="blank"
      >
        <Box
          component="img"
          sx={{
            width: '80%'
          }}
          src={BackgroundCover}
          alt="anime-landscape-for-desktop"
        />
      </Box>
    </Box>
  )
}

export default Dashboard
