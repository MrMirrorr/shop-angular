import express from 'express';
import { checkAuth } from '../middlewares/index.js';
import * as OrderController from '../controllers/order.js';

const router = express.Router();

router.post('/', checkAuth, OrderController.create);
router.get('/', checkAuth, OrderController.getAll);

export default router;
