import { Router } from 'express';
import Auth from '../controllers/auth.controller';
import Product from '../controllers/product.controller';
import { uploadSingle } from '../middlewares/formidable';

const router = Router();

// router.use(Auth.protect);

router.post('/register-product', uploadSingle, Product.register);
export default router;
