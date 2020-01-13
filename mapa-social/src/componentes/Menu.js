
import React, { Component } from 'react';
import { getToken, apiPath } from './funciones';
class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            menu: []
        };
        this.salir = this.salir.bind(this);
    }
    componentDidMount() {
        this.fetchData();
        var timer = 30000;
        this.interval = setInterval(() => {
            this.fetchData();
        }, timer);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    salir(e) {
        localStorage.clear();
        window.location.reload(true);
        e.stopPropagation();
    }

    fetchData() {
        fetch(apiPath() + '/users/menu', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getToken()
            },
        })
            .then(response => response.json())
            .then(data => this.comprobacion(data));
    }

    comprobacion(data) {
        if (data !== null && data.aut !== false) {
            this.setState({ menu: data })
        }
        else {
            //salir();
        }
    }
    /* eslint-disable array-callback-return */
    desplegarMenu() {
        return (this.state.menu.map(m => {
            return (
                <li >
                    <a href data-m={m.id} onClick={this.props.onClick} >
                        <i className={m.icono} data-m={m.id} onClick={this.props.onClick}></i>
                        <span data-m={m.id} onClick={this.props.onClick}>{m.des}</span>
                    </a>
                </li>)
        }))
    }
    /* eslint-enable array-callback-return */
    render() {
        return (
            <aside id="sidebar-left" className="sidebar-left">
                <div className="sidebar-header">
                    <div className="sidebar-title">
                        Menu
						</div>
                    <div className="sidebar-toggle hidden-xs" data-toggle-class="sidebar-left-collapsed" data-target="html" data-fire-event="sidebar-left-toggle" id="menusbl" >
                        <i className="fa fa-bars" aria-label="Toggle sidebar"></i>
                    </div>
                </div>
                <div className="nano">
                    <div className="nano-content">
                        <nav id="menu" className="nav-main" role="navigation">
                            <ul className="nav nav-main">
                                <li >
                                    <a href onClick={this.salir} >
                                        <i className="fa fa-power-off" onClick={this.salir} aria-hidden="true"></i>
                                        <span onClick={this.salir}>Salir</span>
                                    </a>
                                </li>
                                <li >
                                    <a href data-m="0" onClick={this.props.onClick}>
                                        <i className="fa fa-home" data-m="0" onClick={this.props.onClick} aria-hidden="true"></i>
                                        <span data-m="0" onClick={this.props.onClick}>Inicio</span>
                                    </a>
                                </li>
                                {this.desplegarMenu()}
                            </ul>
                        </nav>
                        <hr className="separator" />
                    </div>
                </div>
            </aside>
        );
    }
}
export default Menu;
