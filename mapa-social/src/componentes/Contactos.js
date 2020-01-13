import React, { Component } from 'react';
import { getToken, apiPath } from './funciones';
class Contactos extends Component {
    constructor() {
        super()
        this.state = {
            buscador: '',
            nuevoContacto: false,
            perfilSugerido: []
        };
        this.setBuscador = this.setBuscador.bind(this);
        this.enviarSolicitudContacto = this.enviarSolicitudContacto.bind(this)
    }
    setBuscador(event) {
        this.setState({ buscador: event.target.value, nuevoContacto: false });
    }
    buscarContactos(contactos) {
        let bus = this.state.buscador;
        if (bus !== '' && contactos.length > 0) {
            let contactosFiltrados = contactos.filter(contacto => {
                return (this.filtrarContactos(contacto.nombre) >= 0) || (this.filtrarContactos(contacto.email) >= 0);
            });
            return contactosFiltrados;
        }
        else {
            return contactos;
        }
    }
    filtrarContactos(bus) {
        if (typeof bus !== "undefined") {
            return bus.toLowerCase().search(this.state.buscador.toLowerCase())
        }
        else {
            return -1
        }
    }
    renderContactos() {
        let contactos = this.props.contactos;
        let nuevoContacto = this.state.nuevoContacto
        contactos = this.buscarContactos(contactos);
        if (contactos.length > 0) {
            return <ul className="simple-user-list">
                {this.recorrerContactos(contactos)}
            </ul>
        }
        else if (nuevoContacto === true) {//nuevo contacto
            let c = this.state.perfilSugerido;
            return <ul className="simple-user-list"><li >
                <img src={c.imagen} alt={c.nombre} className="img-circle" style={{ width: '10%', margin: '1%' }} />
                <span className="title">{c.nombre} </span>
                <div><span className="Email">{c.email} </span></div>
                <hr className="dotted short" />
            </li>
                <div className="text-right">
                    <a className="text-uppercase text-muted" href onClick={this.enviarSolicitudContacto.bind(this)} >Agregar contacto</a>
                </div>
            </ul>
        }
        else {
            return <div>Puedes agregar contactos buscando por correo</div>
        }

    }
    validarEmail(valor) {
        // eslint-disable-next-line no-useless-escape
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(valor).toLowerCase());
    }
    recorrerContactos(contactos) {
        return (contactos.map(c => {
            return (
                <li >
                    <img src={c.imagen} alt={c.nombre} className="img-circle" style={{ width: '10%', margin: '1%' }} />
                    <span className="title">{c.nombre} </span>
                    <div><span className="Email">{c.email} </span></div>
                    <div className="text-right"><i class="fa fa-trash-o" style={{ 'color': 'red' }} data-email={c.email} data-respuesta={true} onClick={this.eliminarContacto.bind(this)} >Eliminar</i></div>
                    <hr className="dotted short" />
                </li>)
        }))
    }

    _handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            this.getPerfilSugerido();
        }
    }
    getPerfilSugerido() {

        let email = this.state.buscador;
        if (this.validarEmail(email) === true) {
            let url = new URL(apiPath() + '/contactos/perfil-sugerido');
            const params = { bus: email };
            Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
            const dataRequest = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': getToken(),
                }
            };
            fetch(url, dataRequest)
                .then(response => response.json())
                .then(data => this.setPerfilSugerido(data));
        }
    }

    setPerfilSugerido(data) {
        if (data !== null && data.valido !== false) {
            this.setState({ perfilSugerido: data, nuevoContacto: true });
        }
    }
    enviarSolicitudContacto() {
        let url = apiPath() + '/contactos/solicitud';
        let email = this.state.buscador;
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': getToken(),
                },
                body: JSON.stringify({ receptor: email })

            })
                .then(res => res.json())
                .then(data => this.comprobarSolicitud(data))
    }
    comprobarSolicitud(data) {
        if (data !== "undefined" && data !== null && data.valido !== "undefined" && data.valido === true) {
            alert("Solicitud enviada");
        }
        else {
            alert("No se pudo enviar la solicitud")
        }
    }
    eliminarContacto(event) {
        try {
            let email = event.target.getAttribute('data-email');
            let respuesta = event.target.getAttribute('data-respuesta');
            let url;
        let metodo;
        if (respuesta === 'true') {
            metodo = 'POST';
            url = apiPath() + '/contactos/eliminar';
            this.eliminarCon(url,metodo,email);
        }
        else{
            return null;
        }
        } catch (error) {
            alert('error')
        }

    }
    eliminarCon(url,metodo,email){
        fetch(url, {
            method: metodo,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': getToken(),
            },
            body: JSON.stringify({ usuario: email })

        })
        .then(()=>window.location.reload())
    }
    renderContador() {
        let contactos = this.props.contactos;
        if (contactos.length > 0) {
            return contactos.length
        }
        else {
            return 0
        }
    }
    render() {
        return (
            <section className="panel">
                <header className="panel-heading">
                    <div className="panel-actions">
                    </div>
                    <h2 className="panel-title">
                        <span className="label label-primary label-sm text-normal va-middle mr-sm">{this.renderContador()} </span>
                        <span className="va-middle">Contactos</span>
                    </h2>
                </header>
                <div className="panel-body">
                    <div className="content">
                        {this.renderContactos()}
                    </div>
                </div>
                <div className="panel-footer">
                    <div className="input-group input-search">
                        <input type="text" className="form-control" placeholder="Buscar..." onChange={this.setBuscador} />
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="submit"><i className="fa fa-search" onClick={this.getPerfilSugerido.bind(this)}  ></i>
                            </button>
                        </span>
                    </div>
                </div>
            </section>
        );
    }

}
export default Contactos;