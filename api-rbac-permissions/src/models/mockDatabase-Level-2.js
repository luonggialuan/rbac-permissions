// 1 user chỉ được gắn 1 role
export const MOCK_ROLES_LEVEL_2 = [
  {
    _id: 'role-client-sample-id-123456',
    name: 'client',
    permissions: [
      'create-support',
      'read_support',
      'update_support',
      'delete_support'
    ]
  },
  {
    _id: 'role-moderator-sample-id-123456',
    name: 'moderator',
    permissions: [
      // support
      'create-support',
      'read_support',
      'update_support',
      'delete_support',
      // messages
      'create-messages',
      'read_messages',
      'update_messages',
      'delete_messages'
    ]
  },
  {
    _id: 'role-admin-sample-id-123456',
    name: 'admin',
    permissions: [
      // support
      'create-support',
      'read_support',
      'update_support',
      'delete_support',
      // messages
      'create-messages',
      'read_messages',
      'update_messages',
      'delete_messages',
      // admin-tools
      'create-admin_tools',
      'read_admin_tools',
      'update_admin_tools',
      'delete_admin_tools'
    ]
  }
]

export const MOCK_USER_LEVEL_2 = {
  ID: 'luonggialuan-sample-id-12345678',
  EMAIL: 'luan@gmail.com',
  PASSWORD: 'Luan@123',
  // ROLE: 'admin'
  ROLE: 'moderator'
  // ROLE: 'client'
}
