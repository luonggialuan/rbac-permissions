import { StatusCodes } from 'http-status-codes'
import {
  ACCESS_TOKEN_SECRET_SIGNATURE,
  JwtProvider
} from '~/providers/JwtProvider'

const isAuthorized = async (req, res, next) => {
  // Cách 1: Lấy accessToken nằm trong request cookies phía client - withCredentials trong file authorizeAxios và credentials trong CORS
  const accessTokenFromCookie = req.cookies?.accessToken
  if (!accessTokenFromCookie) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized! (Token not found)' })
  }
  // console.log(
  //   '🐾 ~ isAuthorized ~ accessTokenFromCookie:',
  //   accessTokenFromCookie
  // )
  // console.log('--------------------------')

  // Cách 2: Lấy accessToken trong trường hợp phía FE lưu trong localStorage và gửi lên thông qua header Authorization
  // const accessTokenFromHeader = req.headers.authorization
  // if (!accessTokenFromHeader) {
  //   return res
  //   .status(StatusCodes.UNAUTHORIZED)
  //   .json({ message: 'Unauthorized! (Token not found)' })
  // }
  // console.log(
  //   '🐾 ~ isAuthorized ~ accessTokenFromHeader:',
  //   accessTokenFromHeader
  // )
  // console.log('--------------------------')

  try {
    // Bước 1: Kiểm tra token có hợp lệ không
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenFromCookie, // Cách 1 - Cookie
      // accessTokenFromHeader.substring('Bearer '.length), // Cách 2 - Header
      ACCESS_TOKEN_SECRET_SIGNATURE
    )
    // Bước 2: Lấy thông tin user từ token. Gán thông tin user vào req.user
    req.jwtDecoded = accessTokenDecoded
    // Bước 4: next()
    next()
  } catch (error) {
    // console.log('🐾 ~ isAuthorized ~ error:', error)
    // Trường hợp 1: token hết hạn
    if (error.message?.includes('jwt expired')) {
      return res
        .status(StatusCodes.GONE)
        .json({ message: 'Unauthorized! (Token expired)' })
    }

    // Trường hợp 2: token không hợp lệ
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'Unauthorized! (Token invalid)' })
  }
}

export const authMiddleware = {
  isAuthorized
}
