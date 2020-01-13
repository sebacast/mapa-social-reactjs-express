var express = require('express');
var router = express.Router();
var cors = require('cors');
var jwt = require('jsonwebtoken');
router.use(cors());
const fs = require('fs');
function validarToken(token) {
  try {
    var secretPublico = 'secretPublico';
    let tokenPublico = jwt.verify(token, secretPublico);
    let secretPrivado = fs.readFileSync('llaves/' + tokenPublico.email + '.json', { encoding: 'utf8' });
    secretPrivado = JSON.parse(secretPrivado).secret;
    let tokenPrivado = jwt.verify(tokenPublico.token, secretPrivado);
    
    return tokenPrivado;
  }
  catch (err) {
    return null;
  }
}
function getMenu(email) {
  let jsonMenu;
  try {
    jsonMenu = fs.readFileSync('menus/' + email + '.json', { encoding: 'utf8' });
    jsonMenu = JSON.parse(jsonMenu);
    return jsonMenu;
  }
  catch (errorMenu) {
    jsonMenu = false; 
    return jsonMenu;
  }
}
router.get('/', function (req, res, next) {
  try {
    let token = validarToken(JSON.parse(req.headers.authorization).token);
    if (typeof token.perfil !== "undefined") {
      res.json({ conectado: true });
    }
    else {
      res.json({ conectado: false });
    }
  }
  catch (err) {
    res.json({ conectado: false });
  }
}),
router.get('/perfil', function (req, res, next) {
  try {
    let token = validarToken(JSON.parse(req.headers.authorization).token);
    let menu = getMenu(token.perfil.email);
    let jsonPerfil = { email: token.perfil.email, nombre: token.perfil.given_name, apellido: token.perfil.family_name, imagen: token.perfil.picture, menu: menu };
    
    res.json(jsonPerfil);
  }
  catch (err) {
    res.send('error');
  }
}),
router.get('/menu', function (req, res, next) {
  try {
    let token = validarToken(JSON.parse(req.headers.authorization).token);
    let email = token.perfil.email;
    let jsonMenu = fs.readFileSync('menus/' + email + '.json', { encoding: 'utf8' });
    jsonMenu = JSON.parse(jsonMenu);
    res.json(jsonMenu);

  }
  catch (errorGetMenu) {
    res.json({ aut: false });
  }
}),
router.post('/menu', function (req, res, next) {
  try {
    let token = validarToken(JSON.parse(req.headers.authorization).token);
    var menu;
    var body = req.body;
    for (var key in body) {
      menu = key;
    }
    menu = '['+menu+']';
    menu = JSON.parse(menu);
    let email = token.perfil.email;
    fs.writeFileSync('menus/' + email + '.json', JSON.stringify(menu));
    res.json({ aut: true });
  }
  catch (errorMenu) {
    console.log(errorMenu);
    res.json({ aut: false });
  }
});
module.exports = router;
