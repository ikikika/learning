Bootstrap Superadmin
====================

Usage:

1. Ensure your database env vars are set (see existing project README).
2. Run the migration + seed (optional):

```bash
npm run db:migrate
npm run db:seed
```

3. Bootstrap (create or update) the platform superadmin:

```bash
npm run bootstrap:superadmin -- --email admin@platform.local --password "YourP@ssw0rd" --name "Admin Name"
```

Notes:
- The script creates a user with `tenant_id = NULL` and a `superadmin` role at platform scope.
- Passwords are hashed using bcrypt.
- If a user with the provided email exists at platform scope, the script updates the password and name.
