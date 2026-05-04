import express from "express";
import helmet from "helmet";
import tenantRoutes from "./api/tenants";
import authRoutes from "./api/auth";
import { requireTenant, attachTenantIfPresent } from "./middleware/tenant";

const app = express();

app.use(helmet());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello Express + TypeScript 123 456");
});

// Tenant management (create/list tenants) — no tenant header required
app.use("/tenants", tenantRoutes);

// Auth routes
app.use('/auth', authRoutes);

// Example protected route that requires a tenant id
app.get("/projects", requireTenant, (req, res) => {
  res.json({ message: `Projects for tenant ${req.tenant?.id}`, tenant: req.tenant });
});

// Example public route that will attach tenant if present but won't enforce
app.get("/info", attachTenantIfPresent, (req, res) => {
  res.json({ message: "Public info", tenant: req.tenant });
});

export default app;
