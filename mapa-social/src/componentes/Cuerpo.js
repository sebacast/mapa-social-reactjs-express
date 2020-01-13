
import React, { Component } from 'react'
import PerfilUsuarios from './PerfilUsuarios';
import Mapa from './Mapa';
class MenuPerfil extends Component {
	desplegarContenido() {
		switch (Number(this.props.menu)) {
			/* eslint-disable no-unreachable */
			case 1: return < Mapa/>; break;
			default: return <PerfilUsuarios />; break;
			/* eslint-enable no-unreachable */
		}
	}
	render() {
		return (
			<section role="main" class="content-body">
				{this.desplegarContenido()}

			</section>
		);
	}
}
export default MenuPerfil;
