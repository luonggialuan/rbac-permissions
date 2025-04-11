// 1 user chỉ được gắn 1 role
export const MOCK_ROLES_LEVEL_1 = {
  CLIENT: 'client',
  MODERATOR: 'moderator',
  ADMIN: 'admin'
}

export const MOCK_USER_LEVEL_1 = {
  ID: 'luonggialuan-sample-id-12345678',
  EMAIL: 'luan@gmail.com',
  PASSWORD: 'Luan@123',
  ROLE: MOCK_ROLES_LEVEL_1.CLIENT
  // ROLE: MOCK_ROLES_LEVEL_1.MODERATOR
  // ROLE: MOCK_ROLES_LEVEL_1.ADMIN
}
