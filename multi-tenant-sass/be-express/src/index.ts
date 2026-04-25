import dotenv from "dotenv";
dotenv.config();

import express from "express";
import tenantRoutes from "./routes/tenants";
import { requireTenant, attachTenantIfPresent } from "./middleware/tenant";
import sequelize from "./db/sequelize";

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello Express + TypeScript 123 456");
});

// Tenant management (create/list tenants) — no tenant header required
app.use("/tenants", tenantRoutes);

// Example protected route that requires a tenant id
app.get("/projects", requireTenant, (req, res) => {
  // Example response demonstrating tenant is enforced and available
  res.json({ message: `Projects for tenant ${req.tenant?.id}`, tenant: req.tenant });
});

// Example public route that will attach tenant if present but won't enforce
app.get("/info", attachTenantIfPresent, (req, res) => {
  res.json({ message: "Public info", tenant: req.tenant });
});

(async () => {
  try {
    await sequelize.authenticate();
    // Do not force sync in production; this is convenient for development.
    await sequelize.sync();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start app:', err);
    process.exit(1);
  }
})();
