import express from 'express'
import { authenticate } from '../middlewares/auth.js'
import { getMonthlyCalendar } from '../controllers/history.js'

const router=express.Router()
router.get("/calendar",authenticate,getMonthlyCalendar)

export default router