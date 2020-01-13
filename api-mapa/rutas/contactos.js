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
var url = 'mongodb://'+usr+pass+host+db;
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

router.get('/', function (req, res, next) {
    try {
        let token = validarToken(JSON.parse(req.headers.authorization).token)
        let email = token.perfil.email
        email = email.split(',')
        mongc.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
            let solicitudes = client.db(db).collection('contactos')
            solicitudes.aggregate(
                [
                    { $sort: { _id: 1 } },
                    { $match: { usuario: { $in: email } } },
                    {
                        $group:
                        {
                            _id: "$email",
                            email: { $last: "$email" },
                            nombre: { $last: "$nombre" },
                            imagen: { $last: "$imagen" },
                        }
                    }
                ]
            ).toArray((error, data) => {
                if (error) {
                    res.json({ valido: false })
                }
                else {
                    res.json(data)
                }

            });
        })
    }
    catch (errorGetMenu) {
        res.json({ valido: false })
    }

}),
router.put('/', function (req, res, next) {
    try {

        let token = validarToken(JSON.parse(req.headers.authorization).token);
        let email = token.perfil.email;
        var solicitud;
        var body = req.body;
        for (var key in body) {
            solicitud = key;
        }
        solicitud = JSON.parse(solicitud);
        let perfilEmisor = fs.readFileSync('perfiles/' + solicitud.emisor + '.json', { encoding: 'utf8' });
        perfilEmisor = JSON.parse(perfilEmisor);
        let perfilReceptor = fs.readFileSync('perfiles/' + email + '.json', { encoding: 'utf8' });
        perfilReceptor = JSON.parse(perfilReceptor);
        perfilEmisor.usuario = email;
        perfilReceptor.usuario = solicitud.emisor;
        mongc.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
            let contactos = client.db(db).collection('contactos')
            contactos.insertOne(perfilEmisor);
            contactos.insertOne(perfilReceptor);
            client.close();
            res.json({ mensaje: 'contacto agregado', valido: true })
        })
    }
    catch (errorSol) {
        res.json({ mensaje: 'no se puedo agregar al contacto', valido: false })
    }
}),
router.post('/eliminar', function (req, res, next) {
    try {

        let token = validarToken(JSON.parse(req.headers.authorization).token);
        let email = token.perfil.email;
        var solicitud;
        var body = req.body;
        for (var key in body) {
            solicitud = key;
        }
        solicitud = JSON.parse(solicitud);
        mongc.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
            let solicitudesContactos = client.db(db).collection('contactos')

            solicitudesContactos.deleteMany({ usuario: email, email: solicitud.usuario });
            solicitudesContactos.deleteMany({ usuario: solicitud.usuario, email: email });
            client.close();
            res.json({ mensaje: 'solicitud rechazada', valido: true })
        })
    }
    catch (errorSol) {
        res.json({ mensaje: 'error', valido: false })
    }
}),
router.get('/perfil-sugerido', function (req, res, next) {

    try {
        let token = validarToken(JSON.parse(req.headers.authorization).token)
        let perfil = token.perfil
        let params = req.query;
        let email = params.bus.toLowerCase();
        let jsonContactos = fs.readFileSync('perfiles/' + email + '.json', { encoding: 'utf8' });
        jsonContactos = JSON.parse(jsonContactos);
        res.json(jsonContactos)

    }
    catch (errorGetMenu) {
        res.json({ valido: false })
    }

})
router.put('/solicitud', function (req, res, next) {
    try {

        let token = validarToken(JSON.parse(req.headers.authorization).token);
        let email = token.perfil.email;
        var solicitud;
        var body = req.body;
        for (var key in body) {
            solicitud = key;
        }
        solicitud = JSON.parse(solicitud);
        mongc.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
            let solicitudesContactos = client.db(db).collection('solicitudes')
            let fyh = new Date();
            solicitudesContactos.insertOne({ emisor: email, nombre: token.perfil.name, imagen: token.perfil.picture, receptor: solicitud.receptor, estado: solicitud.estado, fyh: fyh })
            client.close();
            res.json({ mensaje: 'solicitud enviada', valido: true })
        })
    }
    catch (errorSol) {
        res.json({ mensaje: 'no se puedo enviar la solicitud', valido: false })
    }
}),
router.get('/solicitudes', function (req, res, next) {

    try {
        let token = validarToken(JSON.parse(req.headers.authorization).token)
        let email = token.perfil.email
        email = email.split(',')
        mongc.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
            let solicitudes = client.db(db).collection('solicitudes')
            solicitudes.aggregate(
                [
                    { $sort: { _id: 1, fyh: 1 } },
                    { $match: { receptor: { $in: email } } },
                    {
                        $group:
                        {
                            _id: "$emisor",
                            fyh: { $last: "$fyh" },
                            nombre: { $last: "$nombre" },
                            imagen: { $last: "$imagen" },
                        }
                    }
                ]
            ).toArray((error, data) => {
                //console.log(data)
                res.json(data)
            });
        })

    }
    catch (errorGetMenu) {
        res.json({ valido: false })
    }
})
router.post('/solicitud/rechazar', function (req, res, next) {
    try {

        let token = validarToken(JSON.parse(req.headers.authorization).token);
        let email = token.perfil.email;
        var solicitud;
        var body = req.body;
        for (var key in body) {
            solicitud = key;
        }
        solicitud = JSON.parse(solicitud);
        mongc.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
            let solicitudesContactos = client.db(db).collection('solicitudes')

            solicitudesContactos.deleteMany({ emisor: solicitud.emisor, receptor: email })
            client.close();
            res.json({ mensaje: 'solicitud rechazada', valido: true })
        })
    }
    catch (errorSol) {
        res.json({ mensaje: 'error', valido: false })
    }
})


module.exports = router;