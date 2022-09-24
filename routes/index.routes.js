const express = require('express');
const router = express.Router();
const homeContoller = require('../controller/home');

const userRoutes = require('./userRouter.routes');
const techRoutes = require('./techRouter.routes');
const projectRoutes = require('./projectRouter.routes');

router.get('/', homeContoller.home);
router.use('/api/user', userRoutes);
router.use('/api/tech', techRoutes); 
router.use('/api/project', projectRoutes); 

module.exports = router;