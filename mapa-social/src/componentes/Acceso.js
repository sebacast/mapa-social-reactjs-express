import React, { Component } from 'react';
import Principal from './Principal';
import Login from './Login';
import { getToken, apiPath } from './funciones';
class Acceso extends Component {
	constructor(props) {
		super(props)
		this.state = {
			acceso: false,
		};
		this.controlPorApi = this.controlPorApi.bind(this);
	}
	componentDidMount(){
		this.controlAcceso();
		this.interval = setInterval(() => {
			this.controlAcceso();
		  }, 30000);
	}
	componentWillUnmount() {
		clearInterval(this.interval);
	  }
	controlAcceso(){
		if(JSON.parse(localStorage.getItem('acc'))){
				this.controlPorApi()
			}
	}
	controlPorApi() {
		let url = apiPath() + '/users';
		fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': getToken(),
			}
		})
			.then(res => res.json())
			.then((data,error) => {this.setAcceso(data,error)});
			//.catch(() => this.negarAcceso());
	}
	negarAcceso(){
		localStorage.clear();
        window.location.reload();
	}
	setAcceso(data,error){
		if(error || typeof data.conectado === 'undefined' || data.conectado === false){
			this.negarAcceso();
		}
	}
	autorizacion() {
		try{
			let valido = JSON.parse(localStorage.getItem('acc')).valido
			if(valido === true){
				return <Principal/>
			}
			else{
				return <Login />
			}
			
		}
		catch(err){
			return <Login />
		}
	}
	render() {
		return this.autorizacion()
	}
}
export default Acceso;
