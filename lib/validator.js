const jwt = require('jsonwebtoken');
module.exports = {
  verifyToken(req) {
    // var authHeader = req.body.authorization || req.query.authorization || req.headers['x-access-token'] || req.headers['authorization'];
    var authHeader =  req.headers['authorization'];
    console.log('head: ', authHeader);
    var decoded;
    if (authHeader) {
      let token = authHeader.split(' ');
      if (token[1]) {
        decoded = jwt.verify(token[1], "ipangramJsonTopSecret");
        return decoded;
      } else {
        return null;
      }
    }
    else {
      return null;
    }
  }
}
