import express from "express";
import cors from "cors";
import helmet from "helmet";
import tenantRoutes from "./api/tenants";
import authRoutes from "./api/auth";
import { requireTenant, attachTenantIfPresent } from "./middleware/tenant";

const app = express();

const envAllowedOrigins = (process.env.CORS_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = envAllowedOrigins.length
  ? envAllowedOrigins
  : [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ];

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, !origin || allowedOrigins.includes(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-tenant-id"],
  }),
);
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

app.get("/profile", (_req, res) => {
  res.json({
    basic: {
      name: 'Ye Wenjie',
      email: 'yewenjie@eto.com',
      phone: '+1 11111111',
    },
    work: {
      company: 'Acme Corporation',
      linkedinLink: 'https://linkedin.com/in/john-doe',
      githubLink: 'https://github.com/johndoe',
    },
    interests: [
      'Frontend architecture',
      'Design systems',
      'Accessibility',
      'Open source',
    ],
  });
});

export default app;
