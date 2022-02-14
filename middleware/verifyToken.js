const jwt = require("jsonwebtoken");

/*en los token viene codificado la informacion del usuario, 
id, isadmin,fecha que expira-- puede vernir nombre, username etc */
const verifyToken = (req, res, next) => {
  const authHeaders = req.headers.token;
  if (authHeaders) {
    /*se pone un espacio ya que se manda Bearer 51fsre7hshs 
    el Bearer ya viene por defecto, el [1] es el token*/
    const token = authHeaders.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
      if (error) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You're not authenticated!");
  }
};

//Verificara el token y lo autorizara
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    /*ya que en verifyToken solicitamos un user y dentro del token viene el id-- req.user.id,
    req.params es lo que viene en la url y en este caso es el :id-- req.params.id ,
    nota los params son /params/
    y el query es despues de ?esto-es-un-query*/
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You're not alowed to do that!");
    }
  });
};

//Verificara el token y el administrador
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    /*verifiquemos si es un administrador*/
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("You're not alowed to do that!");
    }
  });
};

module.exports = { verifyTokenAndAuthorization, verifyTokenAndAdmin,verifyToken };
