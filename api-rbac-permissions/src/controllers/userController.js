// Author: TrungQuanDev: https://youtube.com/@trungquandev
import { StatusCodes } from 'http-status-codes'
import ms from 'ms'
import {
  JwtProvider,
  ACCESS_TOKEN_SECRET_SIGNATURE,
  REFRESH_TOKEN_SECRET_SIGNATURE
} from '~/providers/JwtProvider'

/**
 * Mock nhanh thông tin user thay vì phải tạo Database rồi query.
 * Nếu muốn học kỹ và chuẩn chỉnh đầy đủ hơn thì xem Playlist này nhé:
 * https://www.youtube.com/playlist?list=PLP6tw4Zpj-RIMgUPYxhLBVCpaBs94D73V
 */
const MOCK_ROLES = {
  CLIENT: 'client',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
}

const MOCK_DATABASE = {
  USER: {
    ID: 'luonggialuan-sample-id-12345678',
    EMAIL: 'luan@gmail.com',
    PASSWORD: 'Luan@123',
    ROLE: MOCK_ROLES.CLIENT
  }
}

/**
 * 2 cái chữ ký bí mật quan trọng trong dự án. Dành cho JWT - Jsonwebtokens
 * Lưu ý phải lưu vào biến môi trường ENV trong thực tế cho bảo mật.
 * Ở đây mình làm Demo thôi nên mới đặt biến const và giá trị random ngẫu nhiên trong code nhé.
 * Xem thêm về biến môi trường: https://youtu.be/Vgr3MWb7aOw
 */
// const ACCESS_TOKEN_SECRET_SIGNATURE = '538I0WGnZU1HehbeUMIOhWPeYQmPii'
// const REFRESH_TOKEN_SECRET_SIGNATURE = 'CEHsXRXx8K7gymK14HSECNBMmUEyrh'

const login = async (req, res) => {
  try {
    if (
      req.body.email !== MOCK_DATABASE.USER.EMAIL ||
      req.body.password !== MOCK_DATABASE.USER.PASSWORD
    ) {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: 'Your email or password is incorrect!' })
      return
    }

    // Trường hợp nhập đúng thông tin tài khoản, tạo token và trả về cho phía Client
    const userInfo = {
      id: MOCK_DATABASE.USER.ID,
      email: MOCK_DATABASE.USER.EMAIL,
      role: MOCK_DATABASE.USER.ROLE
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      '1h'
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      REFRESH_TOKEN_SECRET_SIGNATURE,
      '14 days'
    )

    /**
     * Xử lý trường hợp trả về httponly cookie cho client.
     * Thời gian sống của cookie khác với thời gian sống của token.
     */
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.OK).json({ ...userInfo, accessToken, refreshToken })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const logout = async (req, res) => {
  try {
    // Xóa cookie cũ
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')

    res.status(StatusCodes.OK).json({ message: 'Logout API success!' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

const refreshToken = async (req, res) => {
  try {
    // Cách 1: Lấy refreshToken từ cookie
    const refreshTokenFromCookie = req.cookies?.refreshToken
    // Cách 2: Lấy refreshToken từ localStorage
    const refreshTokenFromBody = req.body?.refreshToken

    // Kiểm tra refreshToken
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      // refreshTokenFromCookie, // Cách 1 - Cookie
      refreshTokenFromBody, // Cách 2 - Body
      REFRESH_TOKEN_SECRET_SIGNATURE
    )

    // Lấy thông tin user từ refreshToken, hạn chế truy vấn vào cơ sở dữ liệu
    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
      role: refreshTokenDecoded.ROLE
    }

    // Tạo accessToken mới
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      // 5
      '1h'
    )

    // Trường hợp cần cập nhật lại cookie mới
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    // Trường hợp cần cập nhật lại localStorage -> FE sẽ lưu lại accessToken mới
    res.status(StatusCodes.OK).json({ accessToken })
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Refresh token API failed.' })
  }
}

export const userController = {
  login,
  logout,
  refreshToken
}
