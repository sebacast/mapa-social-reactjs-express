import React, { Component } from 'react';
import { getToken, apiPath } from './funciones';
class NotiContactos extends Component {
    constructor() {
        super();
        this.state = {
            solicitudes: [],
            redibujo: false,
        };
        this.getSolicitudesContactos = this.getSolicitudesContactos.bind(this);
        this.responderSolicitud = this.responderSolicitud.bind(this)
    }
    componentDidMount() {

        this.getSolicitudesContactos();
    }
    renderContSolicitudes() {
        let solicitudes = this.state.solicitudes;
        if (solicitudes.length > 0) {
            return solicitudes.length
        }
        else {
            return 0
        }
    }
    getSolicitudesContactos() {
        let url = apiPath() + '/contactos/solicitudes';
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken()
            },
        })
            .then(response => response.json())
            .then(data => this.comprobarGetSol(data));
    }
    comprobarGetSol(data) {
        if (data !== null && data.valido !== false) {
            this.setState({ solicitudes: data })
        }
    }
    renderNotificaciones() {
        let solicitudes = this.state.solicitudes;
        if (solicitudes !== null && solicitudes.length > 0) {
            return <ul>
                {this.recorrerNoti(solicitudes)}
            </ul>
        }
    }
    recorrerNoti(solicitudes) {
        return (solicitudes.map(c => {
            return (
                <li >
                    <a href class="clearfix"  >

                        <img src={c.imagen} alt={c.nombre} className="img-circle" style={{ width: '10%', margin: '1%' }} />
                        <i class="fa fa-check" style={{ 'color': 'green' }} data-e={c._id} data-r={true} onClick={this.responderSolicitud.bind(this)} >Aceptar</i>  <i class="fa fa-times" style={{ 'color': 'red' }} data-e={c._id} data-r={false} onClick={this.responderSolicitud.bind(this)} >Rechazar</i>
                        <span class="title" >{c.nombre} te envió una solicitud de contacto</span>
                        <span class="message" >{c._id}</span>
                    </a>
                    <hr />
                </li>)
        }))
    }
    responderSolicitud(event) {
        try {
            let email = event.target.getAttribute('data-e');
            let respuesta = event.target.getAttribute('data-r');
            let url;
            let metodo;
            if (respuesta === 'false') {
                metodo = 'POST';
                url = apiPath() + '/contactos/solicitud/rechazar';
                this.resSol(url, metodo, email);
                this.setState({ redibujo: !this.state.redibujo })
            }
            else if (respuesta === 'true') {

                url = apiPath() + '/contactos';
                metodo = 'PUT'
                this.resSol(url, metodo, email);
                metodo = 'POST';
                url = apiPath() + '/contactos/solicitud/rechazar';
                this.resSol(url, metodo, email);


            }
            else {
                return null;
            }
        } catch (error) {
            alert('error')
        }
    }
    resSol(url, metodo, email) {
        fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': getToken(),
            },
            body: JSON.stringify({ emisor: email })

        })
            .then(res => res.json())
            .then(data => this.comprobarResSol(data))
            .then(() => window.location.reload())
    }
    comprobarResSol(data) {
        if (data === null || data.valido === false) {
            alert("Error")
        }
    }

    render() {
        return (
            <ul class="notifications"  >
                <li>
                    <a href class="dropdown-toggle notification-icon" data-toggle="dropdown">
                        <i class="fa fa-users"></i>
                        <span class="badge"> {this.renderContSolicitudes()}</span>
                    </a>
                    <div class="dropdown-menu notification-menu">
                        <div class="notification-title">
                            <span class="pull-right label label-default">{this.renderContSolicitudes()}</span>
                            Solicitudes
								</div>
                        <div class="content">
                            {this.renderNotificaciones()}
                        </div>
                    </div>
                </li>

            </ul>
        );
    }
}
export default NotiContactos;
