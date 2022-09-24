const express = require('express');
const router = express.Router();
const {uploadDocument, upload} = require('../middleware/multer');
const { multipleUpload } = require('../middleware/multer2');
const { addProject, addMember, removeMember, displayProjects, individualProject } = require('../controller/projectController');

router.post('/add', multipleUpload , addProject );
router.post("/addMember", addMember);
router.post("/removeMember", removeMember);
router.get("/displayProjects", displayProjects);
router.get("/individualProjects", individualProject);

module.exports = router;