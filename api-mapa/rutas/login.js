var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const { google } = require('googleapis');
const fs = require('fs');
const secretPublico = 'secretPublico';
function connMysql() {
  var mysql = require('mysql');
  try {
    var conn = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'mapa'
    });
    return conn;
  }
  catch (error) {
    return null;
  }
}
function googleOAuth2(token) {
  let OAuth2 = google.auth.OAuth2;
  let oauth2Client = new OAuth2();
  oauth2Client.setCredentials({ access_token: token });
  try {
    let oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
    });
    return oauth2;
  }
  catch (error) {
    return null;
  }
}
function generarCodigoAleatorio(longitud) {
  var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789!#$%&/()=?¿¡÷¬∞¢#@|";
  var codigo = "";
  for (var i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}
router.post('/', function (req, res) {
  //res.type('application/json')
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  try {
    var body = req.body;
    //¿porque se envian los datos en la key...?
    var accesoUsuario;
    for (var key in body) {
      accesoUsuario = key;
    }
    accesoUsuario = JSON.parse(accesoUsuario);
    let oauth2 = googleOAuth2(accesoUsuario.token);
    //datos de usuario google
    oauth2.userinfo.v2.me.get(
      function (errorGoogle, resGoogle) {
        if (errorGoogle === null && resGoogle !== null && resGoogle.status !== 'undefined' && resGoogle.status === 200 && resGoogle.data !== 'undefined') {
          accesoUsuario.perfil = resGoogle.data;
          let email = accesoUsuario.perfil.email;
          let conn = connMysql();
          //pasar a store procedure!
          let sql = "SELECT email from usuarios  where email ='" + email + "'";
          //usuario en mysql
          conn.query(sql, (errorSelect, results, fields) => {
            if(errorSelect !== null || results === null){
              res.json({ valido: false }); //peticion rechazada
            }
            //si trae la consulta vacia, hay que crear al usuario
            else if (results.length === 0) {
              conn.query('INSERT INTO usuarios SET ?', { id: 0, email: email, estado: 1 }, function (errorInsert, resultInsert, fields) {
                if (errorInsert === null && resultInsert !== null && typeof resultInsert.insertId !== 'undefined' && resultInsert.insertId > 0) {
                  var fecha = new Date();
                  let codigoAleatorio = generarCodigoAleatorio(10);
                  let secretUsuario = codigoAleatorio + '/' + fecha;
                  secretUsuario = secretUsuario.replace(/ /g, "/")
                  let objectToSave = { secret: secretUsuario };
                  fs.writeFileSync('llaves/' + email + '.json', JSON.stringify(objectToSave));
                   fs.writeFileSync('perfiles/' + email + '.json', JSON.stringify({email: email, nombre: accesoUsuario.perfil.name, imagen: accesoUsuario.perfil.picture}));
                  let tokenPrivado = jwt.sign(accesoUsuario, secretUsuario, { expiresIn: '6h' });
                  let token = jwt.sign({ email: email, token: tokenPrivado }, secretPublico, { expiresIn: '6h' });
                  res.json({ token: token, email: email, valido: true });//peticion aceptada
                }
                else {
                  res.json({ valido: false }); //peticion rechazada
                }
              });
            }
            //si el usuario esta en la bd
            else if (results.length > 0) {
              try {
                let secretPrivado = fs.readFileSync('llaves/' + email + '.json', { encoding: 'utf8' });
                 fs.writeFileSync('perfiles/' + email + '.json', JSON.stringify({email: email, nombre: accesoUsuario.perfil.name, imagen: accesoUsuario.perfil.picture}));
                secretPrivado = JSON.parse(secretPrivado).secret
                let tokenPrivado = jwt.sign(accesoUsuario, secretPrivado, { expiresIn: '6h' });
                let token = jwt.sign({ email: email, token: tokenPrivado }, secretPublico, { expiresIn: '6h' });
                res.json({ token: token, email: email, valido: true }); //peticion aceptada
              }
              //si no tiene secret, lo crea
              catch (errorTryUserDb) {
                var fecha = new Date();
                let codigoAleatorio = generarCodigoAleatorio(10);
                let secretPrivado = codigoAleatorio + '/' + fecha;
                secretPrivado = secretPrivado.replace(/ /g, "/")
                let objectToSave = { secret: secretPrivado };
                fs.writeFileSync('llaves/' + email + '.json', JSON.stringify(objectToSave));
                 fs.writeFileSync('perfiles/' + email + '.json', JSON.stringify({email: email, nombre: accesoUsuario.perfil.name, imagen: accesoUsuario.perfil.picture}));
                let tokenPrivado = jwt.sign(accesoUsuario, secretPrivado, { expiresIn: '6h' });
                let token = jwt.sign({ email: email, token: tokenPrivado }, secretPublico, { expiresIn: '6h' });
                res.json({ token: token, email: email, valido: true }); //peticion aceptada
              }
            }
            else {
              res.json({ valido: false }); //peticion rechazada
            }
          })
        }
        else {
          res.json({ valido: false }); //peticion rechazada 
        }
      });
  }
  catch (errorLogin) {
    res.json({ valido: false }); //peticion rechazada
  }

});
module.exports = router;
