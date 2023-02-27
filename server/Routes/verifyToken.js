const jwt = require('jsonwebtoken');

function verifyToken(req,res,next){
    let token = req.headers['authorization'];
    
    if(token){
        //check token is valid or not
        token = token.split(" ")[1];
        jwt.verify(token,process.env.jwtKey, (err,valid)=>{
            if(err){
                res.status(403).json("Token is not Valid");
            }
            else{
                //assign request to my user
                req.user = valid
                next();
            }
        })
    }else{
        res.status(403).json("You are not authorized");
    }
}

//only admin or user add order
function verifyTokenAndAuthorization(req, res, next){
    verifyToken(req, res, () => {
      if (req.user.id === req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };

//only admin add products
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        // console.log(req.user.isAdmin);
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  };

module.exports = {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin}