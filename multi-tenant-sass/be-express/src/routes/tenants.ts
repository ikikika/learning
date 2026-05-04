import { Router } from 'express';
import { requireAuth, requireRole } from '../middleware/auth';
import { createTenant, listTenants, getTenant } from '../controllers/tenantController';

const router = Router();

router.post('/', requireAuth, requireRole('superadmin'), createTenant);
router.get('/', requireAuth, requireRole('superadmin'), listTenants);
router.get('/:id', requireAuth, getTenant);

export default router;
