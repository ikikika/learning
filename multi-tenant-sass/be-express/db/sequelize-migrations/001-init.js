module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, TEXT, BOOLEAN, INTEGER, BIGINT, JSON, DATE, TINYINT } = Sequelize;

    await queryInterface.createTable('tenants', {
      id: { type: STRING(50), primaryKey: true },
      name: { type: STRING(255), allowNull: false },
      created_at: { type: DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      settings: { type: JSON, allowNull: true },
    }, { charset: 'utf8mb4' });

    await queryInterface.createTable('users', {
      id: { type: STRING(50), primaryKey: true },
      tenant_id: { type: STRING(50), allowNull: false },
      email: { type: STRING(255), allowNull: false },
      name: { type: STRING(255), allowNull: true },
      password_hash: { type: STRING(255), allowNull: true },
      is_active: { type: TINYINT, allowNull: false, defaultValue: 1 },
      created_at: { type: DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    }, { charset: 'utf8mb4' });

    await queryInterface.addIndex('users', ['tenant_id'], { name: 'idx_users_tenant' });
    await queryInterface.addConstraint('users', {
      fields: ['tenant_id'],
      type: 'foreign key',
      name: 'fk_users_tenant',
      references: { table: 'tenants', field: 'id' },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('users', {
      fields: ['email'],
      type: 'unique',
      name: 'uq_users_email',
    });

    await queryInterface.createTable('roles', {
      id: { type: STRING(50), primaryKey: true },
      tenant_id: { type: STRING(50), allowNull: false },
      name: { type: STRING(100), allowNull: false },
      description: { type: TEXT, allowNull: true },
      created_at: { type: DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    }, { charset: 'utf8mb4' });

    await queryInterface.addIndex('roles', ['tenant_id'], { name: 'idx_roles_tenant' });
    await queryInterface.addConstraint('roles', {
      fields: ['tenant_id'],
      type: 'foreign key',
      name: 'fk_roles_tenant',
      references: { table: 'tenants', field: 'id' },
      onDelete: 'CASCADE',
    });

    await queryInterface.createTable('user_roles', {
      user_id: { type: STRING(50), allowNull: false },
      role_id: { type: STRING(50), allowNull: false },
      assigned_at: { type: DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    }, { charset: 'utf8mb4' });

    await queryInterface.addConstraint('user_roles', {
      fields: ['user_id', 'role_id'],
      type: 'primary key',
      name: 'pk_user_roles'
    });

    await queryInterface.addConstraint('user_roles', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_userroles_user',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('user_roles', {
      fields: ['role_id'],
      type: 'foreign key',
      name: 'fk_userroles_role',
      references: { table: 'roles', field: 'id' },
      onDelete: 'CASCADE',
    });

    await queryInterface.createTable('projects', {
      id: { type: STRING(50), primaryKey: true },
      tenant_id: { type: STRING(50), allowNull: false },
      name: { type: STRING(255), allowNull: false },
      description: { type: TEXT, allowNull: true },
      owner_id: { type: STRING(50), allowNull: true },
      created_at: { type: DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DATE, allowNull: true },
    }, { charset: 'utf8mb4' });

    await queryInterface.addIndex('projects', ['tenant_id'], { name: 'idx_projects_tenant' });
    await queryInterface.addConstraint('projects', {
      fields: ['tenant_id'],
      type: 'foreign key',
      name: 'fk_projects_tenant',
      references: { table: 'tenants', field: 'id' },
      onDelete: 'CASCADE',
    });

    await queryInterface.addConstraint('projects', {
      fields: ['owner_id'],
      type: 'foreign key',
      name: 'fk_projects_owner',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL',
    });

    await queryInterface.createTable('items', {
      id: { type: STRING(50), primaryKey: true },
      tenant_id: { type: STRING(50), allowNull: false },
      project_id: { type: STRING(50), allowNull: false },
      parent_id: { type: STRING(50), allowNull: true },
      title: { type: STRING(255), allowNull: false },
      description: { type: TEXT, allowNull: true },
      status: { type: STRING(50), allowNull: false, defaultValue: 'open' },
      priority: { type: INTEGER, allowNull: false, defaultValue: 0 },
      assignee_id: { type: STRING(50), allowNull: true },
      created_at: { type: DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: DATE, allowNull: true },
    }, { charset: 'utf8mb4' });

    await queryInterface.addIndex('items', ['project_id'], { name: 'idx_items_project' });
    await queryInterface.addIndex('items', ['tenant_id'], { name: 'idx_items_tenant' });

    await queryInterface.addConstraint('items', {
      fields: ['project_id'],
      type: 'foreign key',
      name: 'fk_items_project',
      references: { table: 'projects', field: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('items', {
      fields: ['parent_id'],
      type: 'foreign key',
      name: 'fk_items_parent',
      references: { table: 'items', field: 'id' },
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('items', {
      fields: ['assignee_id'],
      type: 'foreign key',
      name: 'fk_items_assignee',
      references: { table: 'users', field: 'id' },
      onDelete: 'SET NULL'
    });

    await queryInterface.addConstraint('items', {
      fields: ['tenant_id'],
      type: 'foreign key',
      name: 'fk_items_tenant',
      references: { table: 'tenants', field: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.createTable('files', {
      id: { type: STRING(50), primaryKey: true },
      tenant_id: { type: STRING(50), allowNull: false },
      item_id: { type: STRING(50), allowNull: true },
      filename: { type: STRING(1024), allowNull: false },
      content_type: { type: STRING(255), allowNull: true },
      size: { type: BIGINT, allowNull: true },
      storage_key: { type: STRING(1024), allowNull: true },
      created_at: { type: DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    }, { charset: 'utf8mb4' });

    await queryInterface.addIndex('files', ['tenant_id'], { name: 'idx_files_tenant' });
    await queryInterface.addConstraint('files', {
      fields: ['tenant_id'],
      type: 'foreign key',
      name: 'fk_files_tenant',
      references: { table: 'tenants', field: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('files', {
      fields: ['item_id'],
      type: 'foreign key',
      name: 'fk_files_item',
      references: { table: 'items', field: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.createTable('notifications', {
      id: { type: STRING(50), primaryKey: true },
      tenant_id: { type: STRING(50), allowNull: false },
      user_id: { type: STRING(50), allowNull: false },
      type: { type: STRING(100), allowNull: false },
      payload: { type: JSON, allowNull: true },
      is_read: { type: TINYINT, allowNull: false, defaultValue: 0 },
      created_at: { type: DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    }, { charset: 'utf8mb4' });

    await queryInterface.addIndex('notifications', ['user_id'], { name: 'idx_notifications_user' });
    await queryInterface.addConstraint('notifications', {
      fields: ['tenant_id'],
      type: 'foreign key',
      name: 'fk_notifications_tenant',
      references: { table: 'tenants', field: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('notifications', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'fk_notifications_user',
      references: { table: 'users', field: 'id' },
      onDelete: 'CASCADE'
    });

    await queryInterface.createTable('audit_logs', {
      id: { type: BIGINT, allowNull: false, autoIncrement: true, primaryKey: true },
      tenant_id: { type: STRING(50), allowNull: true },
      user_id: { type: STRING(50), allowNull: true },
      action: { type: STRING(255), allowNull: false },
      object_type: { type: STRING(100), allowNull: true },
      object_id: { type: STRING(255), allowNull: true },
      data: { type: JSON, allowNull: true },
      created_at: { type: DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    }, { charset: 'utf8mb4' });

    await queryInterface.addIndex('audit_logs', ['tenant_id'], { name: 'idx_audit_tenant' });
    await queryInterface.addIndex('audit_logs', ['user_id'], { name: 'idx_audit_user' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('files');
    await queryInterface.dropTable('items');
    await queryInterface.dropTable('projects');
    await queryInterface.dropTable('user_roles');
    await queryInterface.dropTable('roles');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('tenants');
  }
};
