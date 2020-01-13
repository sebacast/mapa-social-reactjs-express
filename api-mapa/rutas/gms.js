var express = require('express');
var router = express.Router();
var cors = require('cors')
var jwt = require('jsonwebtoken');
const fs = require('fs');
var mongc = require('mongodb').MongoClient;
var usr = '';// agregar : despues del usuario
var pass = '';
var host = '127.0.0.1:27017/';
var db = 'mapa'
var url = 'mongodb://' + usr + pass + host + db;
router.use(cors())
function validarToken(token) {
  try {
    var secretPublico = 'secretPublico';
    let tokenPublico = jwt.verify(token, secretPublico)
    let secretPrivado = fs.readFileSync('llaves/' + tokenPublico.email + '.json', { encoding: 'utf8' });
    secretPrivado = JSON.parse(secretPrivado).secret
    let tokenPrivado = jwt.verify(tokenPublico.token, secretPrivado)
    return tokenPrivado
  }
  catch (err) {
    return null
  }
}
router.post('/', function (req, res, next) {
  try {
    let token = validarToken(JSON.parse(req.headers.authorization).token);
    let email = token.perfil.email;
    var body = req.body;
    mongc.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
      if (error) {
        res.json({ mensaje: 'error1', valido: false })
      }
      let geoloc = client.db('mapa').collection('geoloc')
      let fyh = new Date();
      let jsonPerfil = fs.readFileSync('perfiles/' + email + '.json', { encoding: 'utf8' });
      jsonPerfil = JSON.parse(jsonPerfil);
      geoloc.insertOne({ user_id: email, email: email, geoloc: { lat: body.ubicacion.lat, lon: body.ubicacion.lng }, perfil: jsonPerfil, fyh: fyh });
      let b = body.bus + ',' + email
      let bus = b.split(',')
      geoloc.aggregate(
        [
          { $sort: { _id: 1, fyh: 1 } },
          { $match: { email: { $in: bus } } },
          {
            $group:
            {
              _id: "$email",
              fyh: { $last: "$fyh" },
              geoloc: { $last: "$geoloc" },
              email: { $last: "$email" },
              perfil: { $last: "$perfil" },
            }
          }
        ]
      ).toArray((error, data) => {
        if (error) {
          res.json({ mensaje: 'error', valido: false })
        }
        else {
          res.json(data)
        }

      });
      client.close();
    })

  }
  catch (errorMenu) {
    res.json({ mensaje: 'te cabio', valido: false })
  }
})
module.exports = router;