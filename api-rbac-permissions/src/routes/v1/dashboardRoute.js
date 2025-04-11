// Author: TrungQuanDev: https://youtube.com/@trungquandev
import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { dashboardController } from '~/controllers/dashboardController'
import { authMiddleware } from '~/middlewares/authMiddleware'
// import { MOCK_ROLES_LEVEL_1 } from '~/models/mockDatabase-Level-1'
// import { rbacMiddleware_Level_1 } from '~/middlewares/rbacMiddleware-Level-1'
import { rbacMiddleware_Level_2 } from '~/middlewares/rbacMiddleware-Level-2'

const Router = express.Router()

Router.route('/access').get(
  authMiddleware.isAuthorized,
  dashboardController.access
)

Router.route('/messages').get(
  authMiddleware.isAuthorized,
  // rbacMiddleware_Level_1.isValidPermission([
  //   MOCK_ROLES_LEVEL_1.ADMIN,
  //   MOCK_ROLES_LEVEL_1.MODERATOR
  // ]),
  rbacMiddleware_Level_2.isValidPermission(['read_messages']),
  (req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ message: 'Truy cập API GET: /messages thành công!' })
  }
)

Router.route('/admin-tools').get(
  authMiddleware.isAuthorized,
  // rbacMiddleware_Level_1.isValidPermission([MOCK_ROLES_LEVEL_1.ADMIN]),
  rbacMiddleware_Level_2.isValidPermission(['read_admin_tools']),
  (req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ message: 'Truy cập API GET: /admin-tools thành công!' })
  }
)

export const dashboardRoute = Router
