// Level 3: Group Role & Hierarchical RBAC
// Group Roles: Một user có nhiều vai trò
// Hierarchical RBAC: Vai trò có thể kế thừa lại từ vai trò khác
export const MOCK_ROLES_LEVEL_3 = [
  {
    _id: 'role-client-sample-id-123456',
    name: 'client',
    permissions: [
      'create-support',
      'read_support',
      'update_support',
      'delete_support'
    ],
    inherits: [] // client ko kế thừa từ role nào cả
  },
  {
    _id: 'role-moderator-sample-id-123456',
    name: 'moderator',
    permissions: [
      // support
      // 'create-support',
      // 'read_support',
      // 'update_support',
      // 'delete_support',
      // messages
      'create-messages',
      'read_messages',
      'update_messages',
      'delete_messages'
    ],
    inherits: ['client'] // moderator kế thừa permissions từ client
  },
  {
    _id: 'role-admin-sample-id-123456',
    name: 'admin',
    permissions: [
      // support
      // 'create-support',
      // 'read_support',
      // 'update_support',
      // 'delete_support',
      // messages
      // 'create-messages',
      // 'read_messages',
      // 'update_messages',
      // 'delete_messages',
      // admin-tools
      'create-admin_tools',
      'read_admin_tools',
      'update_admin_tools',
      'delete_admin_tools'
    ],
    inherits: ['client', 'moderator'] // admin kế thừa permissions từ client và moderator
  }
]

export const MOCK_USER_LEVEL_3 = {
  ID: 'luonggialuan-sample-id-12345678',
  EMAIL: 'luan@gmail.com',
  PASSWORD: 'Luan@123',
  // ROLES: ['client']
  // ROLES: ['moderator']
  ROLES: ['admin']
  // ROLES: ['client', 'moderator', 'admin']
}
