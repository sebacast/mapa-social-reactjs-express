# mapa-social-reactjs-express
App web desarrollada con React js en el front y Express js en el back

## Login
Vista e ingreso usando Google login (la idea es implementar Facebook login en algun momento)
![Login](./imagenes-mapa-social/login1.png)
![Login](./imagenes-mapa-social/login2.png)
- Se envía un post a la ruta '/login'
- Se comprueba el usuario de Google
- Se comprueba el email en Mysql (si no existe se inserta)
- Se comprueba la llave (si no existe se crea)
- Se guarda el perfil de Google (en archivo json)
- Se genera el token (doble llave pública, eventualmente planeo pasarlo a llaves privadas y públicas .pem generados desde un script de Python)
![Login](./imagenes-mapa-social/login3.png)
## Perfil de usuario
Panel de administración donde se pueden agregar contactos y cargar servicios (solo Mapa disponible)
![Perfil](./imagenes-mapa-social/perfil.png)
- Se solicitan los datos del perfil (desde api express, se lee archivo json)
- Se solicita lista de contactos (desde api Express se lee bd Mongodb).

## Contactos
- Para compartir la ubicación hay que agregar contactos. Esto se hace mediante un sistema de solicitudes y gestión de contactos que se almacenan en MongoDb.
- Un usuario envía la solicitud, y el receptor decide si acepta o rechaza la solicitud.
![Contactos](./imagenes-mapa-social/contactos1.png)
![Contactos](./imagenes-mapa-social/contactos2.png)
![Contactos](./imagenes-mapa-social/contactos3.png)
![Contactos](./imagenes-mapa-social/contactos4.png)
![Contactos](./imagenes-mapa-social/contactos5.png)
- Una vez aceptada, ambos usuarios se verán en el cuadro de contactos.


## Mapa
Para poder acceder al componente Mapa, primero hay que cargar el servicio en la pestaña servicios
![Mapa](./imagenes-mapa-social/mapa1.png)
![Mapa](./imagenes-mapa-social/mapa2.png)
Una vez cargado el servicio, se podrá visualizar la ultima ubicación compartida del usuario
![Mapa](./imagenes-mapa-social/mapa3.png)
![Mapa](./imagenes-mapa-social/mapa4.png)

### OJO!
La ubicación solo se comparte cuando se accede al componente Mapa.
Ademas el mapa solo se carga cuando se acepta compartir la ubicación.

Al hacer click en la imagen del usuario en el mapa, aparece un pop-up con el email, la fecha, hora, latitud y longitud de la ultima inserción del usuario.
Los datos se almacenan en una colección de Mongodb

----------------------
## mapa-social (react js)
----------------------
### Modulos internos:
- funciones
#### Componentes:
- Acceso
- Login
- Principal
- Cab
- Menu
- Cuerpo
- PerfilUsuarios
- Mapa
- NotiContactos
- Contactos

### Modulos externos:
- react
- react-google-login
- google-map-react
- reactjs-popup

---------------------- 
## api-mapa (express js)
----------------------
### Rutas
#### login
- post: '/'

#### users
- get: '/'
- get: '/perfil'
- get: '/menu'
- post: '/menu'


#### Contactos
- get: '/'
- put: '/'
- post: '/eliminar'
- get: '/perfil-sugerido'
- put: '/solicitud'
- get: '/solicitudes'
- post: '/solicitud/rechazar'

#### gms
- post: '/'

### Modulos externos:
- http
- http-errors
- express
- cookie-parser
- cors
- jsonwebtoken
- fs
- mongodb
- mysql
- googleapis

## Extra
El modulo fue creado usando create-react-app para la estructura. Ademas use el template HTML5 Octopus
- https://github.com/icdcom/octopus
- https://github.com/facebook/create-react-app




