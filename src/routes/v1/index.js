const express=require('express');
const userRoute= require('./user.route');
const expenseRoute= require('./expense.route');
const router=express.Router();

router.use('/user',userRoute);

// recipe routes
router.use('/expense',expenseRoute);

module.exports=router;