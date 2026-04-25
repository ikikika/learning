-- Seed data for development

INSERT INTO tenants (id, name) VALUES ('tenant_1', 'Demo Tenant')
  ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO users (id, tenant_id, email, name, password_hash, is_active)
VALUES
  ('user_admin', 'tenant_1', 'admin@tenant.local', 'Admin User', 'password', 1)
ON DUPLICATE KEY UPDATE email=VALUES(email), name=VALUES(name);

INSERT INTO roles (id, tenant_id, name, description)
VALUES ('role_admin', 'tenant_1', 'admin', 'Tenant administrator')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT IGNORE INTO user_roles (user_id, role_id)
VALUES ('user_admin', 'role_admin');

INSERT INTO projects (id, tenant_id, name, description, owner_id)
VALUES ('project_demo', 'tenant_1', 'Demo Project', 'A demo project for local development', 'user_admin')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO items (id, tenant_id, project_id, title, description, status, priority, assignee_id)
VALUES ('item_1', 'tenant_1', 'project_demo', 'Setup project', 'Initial setup task', 'open', 1, 'user_admin')
ON DUPLICATE KEY UPDATE title=VALUES(title);
