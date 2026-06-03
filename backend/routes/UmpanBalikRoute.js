import express from "express";
import { createUmpanBalik, getUmpanBalik } from "../controllers/UmpanBalikController.js";

const router = express.Router();

router.get('/umpanbalik', getUmpanBalik);
router.post('/umpanbalik', createUmpanBalik);

export default router;