import { Router } from 'express';
import {
  getMapBySlug,
  getMapByEditKey,
  createMap,
  updateMap,
} from '../controllers/mapsController.js';

const router = Router();

router.get('/edit/:editKey', getMapByEditKey);
router.get('/:slug', getMapBySlug);
router.post('/', createMap);
router.put('/edit/:editKey', updateMap);

export default router;

