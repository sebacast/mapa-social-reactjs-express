import React, { Component } from 'react';
import { getToken, apiPath } from './funciones';
import Contactos from './Contactos';
class PerfilUsuarios extends Component {
	constructor(props) {
		super(props)
		this.state = {
			perfil: [],
			contactos: [],
			rastreador: false,
			adminUsuarios: false,
			rutas: false,
			mensajeCargaServicio: '',
			mensajePass: '',
			pass: '',
			perfilSugerido: ''
		};
		this.getPerfil = this.getPerfil.bind(this);
		this.setServicio = this.setServicio.bind(this);
		this.cargarServicios = this.cargarServicios.bind(this);
		this.enviarPass = this.enviarPass.bind(this);
	}
	componentDidMount() {
		this.getPerfil();
		this.getContactos();
	}
	getPerfil() {
		let url = apiPath() + '/users/perfil';
		fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': getToken(),
			}
		})
			.then(res => res.json())
			.then(data => {
				this.setState({ perfil: data });
				this.checkBoxServicios();
			});
	}
	getContactos() {
		let url = apiPath() + '/contactos';
		fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': getToken()
			},
		})
			.then(response => response.json())
			.then(data => this.setContactos(data));

	}

	setContactos(data) {
		this.setState({ contactos: data });
	}
	setServicio(event) {
		switch (event.target.value) {
			case "1":
				this.setState({ rastreador: !this.state.rastreador })
				break;
			case "2":
				this.setState({ adminUsuarios: !this.state.adminUsuarios })
				break;
			case "3":
				this.setState({ rutas: !this.state.rutas })
				break;
			default:
				break;
		}
	}
	preCarga() {
		let jsonMenus = [];
		if (this.state.rastreador === true) {
			jsonMenus.push({ id: '1', icono: 'fa fa-map-marker', des: 'Mapa' })
		}
		//agregar if correspondientes a los menues
		return jsonMenus
	}
	cargarServicios() {
		let url = apiPath() + '/users/menu';
		let jsonMenus = this.preCarga();
		fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': getToken(),
			},
			body: JSON.stringify(jsonMenus)

		})
			.then(data => this.cargarServiciosRespuesta(data))
			.then(setTimeout(() => { window.location.reload() }, 10000))
	}
	cargarServiciosRespuesta(data) {
		if (data === "undefined" || data === null || data.aut === "undefined" || data.aut === false) {
			this.setState({ mensajeCargaServicio: <div class="alert alert-danger" role="alert">No se pudo realizar la carga de servicios</div> })
		}
		else {
			this.setState({ mensajeCargaServicio: <div class="alert alert-success" role="alert">Actualizando el menú, un momento por favor... <img src="/imagenes/cargando.gif" alt="" /></div> })
		}
	}
	checkBoxServicios() {
		try {
			let menu = this.state.perfil.menu
			for (const key in menu) {
				const element = menu[key];
				switch (element.id) {
					case '1':
						this.setState({ rastreador: true })
						break;
					case '2':
						this.setState({ adminUsuarios: true })
						break;
					case '3':
						this.setState({ rutas: true })
						break;
					default:
						break;
				}
			}
		}
		catch (error) {
		}
	}
	valProp(val) {
		const st = {
			opacity: 1,
		}
		if (val === 'nombre1') {
			var aux = val;
			val = 'nombre';
		}
		if (this.state.perfil !== null && this.state.perfil.hasOwnProperty(val)) {
			switch (val) {
				/* eslint-disable no-unreachable */
				case 'imagen':
					return <img src={this.state.perfil[val]} className="rounded img-responsive" alt="" />
					break;
				case 'nombre':
					if (typeof (aux) == 'undefined') {
						return <div className="thumb-info-title"><span className="thumb-info-inner">{this.state.perfil[val]}</span></div>
					}
					else {
						return <div className="form-group">
							<label className="col-md-3 control-label" for="profileFirstName" style={st}>{val}</label>
							<div className="col-md-8">
								<label className="form-control" id="idform" style={st}>{this.state.perfil[val]}</label>

							</div>
						</div>
					}
					break;
				default:
					return <div className="form-group">
						<label className="col-md-3 control-label" for="profileFirstName">{val}</label>
						<div className="col-md-8">
							<label className="form-control" id="idform" style={st}>{this.state.perfil[val]}</label>
						</div>
					</div>
					break;
				/* eslint-enable no-unreachable */
			}
		}
		else {
			return '';
		}
	}
	setPass(event) {
		this.setState({ pass: event.target.value });
	}
	enviarPass() {
		let pass = this.state.pass;
		if (pass && pass !== '') {
			let url = apiPath() + '/users/android/password';
			fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': getToken(),
				},
				body: JSON.stringify({ pass: pass }),
			})
				.then(res => res.json())
				.then(data => this.comprobarUpdPass(data));
		}
	}
	comprobarUpdPass(data) {
		if (data !== null && data.valido !== "undefined" && data.valido === true) {
			this.setState({ mensajePass: <div class="alert alert-success" role="alert">Password actualizado</div> })
		}
		else {
			this.setState({ mensajePass: <div class="alert alert-danger" role="alert">No se pudo actualizar el password</div> })
		}
	}
	render() {
		return (
			<div className="row">
				<div className="col-md-4 col-lg-3">
					<section className="panel">
						<div className="panel-body">
							<div className="thumb-info mb-md">
								{this.valProp('imagen')}
								{this.valProp('nombre')}
							</div>
							<div className="widget-toggle-expand mb-md">
								<div className="widget-content-expanded">
									<ul className="simple-todo-list">
										<li></li>
									</ul>
								</div>
							</div>
						</div>
					</section>
					<Contactos contactos={this.state.contactos} />
				</div>
				<div className="col-md-8 col-lg-6">
					<div className="tabs">
						<ul className="nav nav-tabs tabs-primary">
							<li className="active">
								<a href="#edit" data-toggle="tab">Información</a>
							</li>
							<li><a href="#overview" data-toggle="tab">Servicios</a>
							</li>
						</ul>
						<div className="tab-content">
							<div id="edit" className="tab-pane active">
								<form className="form-horizontal" method="get">
									<h4 className="mb-xlg">Información personal</h4>
									<fieldset>
										{this.valProp('nombre1')}
										{/*this.valProp('apellido')*/}

										{this.valProp('email')}
									</fieldset>

								</form>
							</div>
							<div id="overview" className="tab-pane">
								{this.state.mensajeCargaServicio}
								<h3>Servicios</h3>
								<input type="checkbox" value="1" checked={this.state.rastreador} onClick={this.setServicio} /> Mapa
								<br /><button className="btn btn-default" onClick={this.cargarServicios} >Cargar servicios</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default PerfilUsuarios;


