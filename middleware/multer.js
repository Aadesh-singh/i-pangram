
const multer = require('multer');
const util      =   require("util");
const path = require('path');
const UPLOAD_PATH = path.join('/uploads');

// multer storage 
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        
        cb(null, path.join(__dirname, '../', UPLOAD_PATH));
    },
    filename: function(req, file, cb){
        
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const file_type = file.mimetype.split("/")[1];
        cb(null, file.fieldname + '-' + `${uniqueSuffix}.${file_type}`);
    }
});

// multiple upload 
const upload = multer({ storage: storage }).fields([{ name: 'documents' }, {name: 'docs'}]);

var uploadFiles = upload;
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;