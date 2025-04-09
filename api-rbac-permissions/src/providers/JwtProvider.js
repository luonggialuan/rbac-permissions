// Author: TrungQuanDev: https://youtube.com/@trungquandev
import JWT from 'jsonwebtoken'

export const ACCESS_TOKEN_SECRET_SIGNATURE = '538I0WGnZU1HehbeUMIOhWPeYQmPii'
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'CEHsXRXx8K7gymK14HSECNBMmUEyrh'

const generateToken = async (userInfo, secretSignature, tokenLife) => {
  try {
    return JWT.sign(userInfo, secretSignature, {
      algorithm: 'HS256',
      expiresIn: tokenLife
    })
  } catch (error) {
    throw new Error(error)
  }
}

const verifyToken = async (token, secretSignature) => {
  try {
    return JWT.verify(token, secretSignature)
  } catch (error) {
    throw new Error(error)
  }
}

export const JwtProvider = {
  generateToken,
  verifyToken
}
