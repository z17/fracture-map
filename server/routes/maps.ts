import { Router } from 'express';
import {
  getMapBySlug,
  getMapByEditKey,
  createMap,
  updateMap,
} from '../controllers/mapsController.js';

const router = Router();

// GET /api/maps/edit/:editKey - must be before /:slug to avoid conflict
router.get('/edit/:editKey', getMapByEditKey);

// GET /api/maps/:slug
router.get('/:slug', getMapBySlug);

// POST /api/maps
router.post('/', createMap);

// PUT /api/maps/edit/:editKey
router.put('/edit/:editKey', updateMap);

export default router;

