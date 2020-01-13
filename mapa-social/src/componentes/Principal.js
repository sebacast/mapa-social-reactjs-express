import React, { Component } from 'react';
import Cab from './Cab'
import Menu from './Menu';
import Cuerpo from './Cuerpo';

class Principal extends Component {
  constructor(props) {
    super(props)
    this.state = {
        menu: 0,
        tipoAccion:0,
        accion:0,
    };
    this.capturarMenu = this.capturarMenu.bind(this);
}
capturarMenu(event){
  if(event.target.getAttribute('data-accion') && event.target.getAttribute('data-tipo')){
    this.setState({ menu: event.target.getAttribute('data-m'), tipoAccion:event.target.getAttribute('data-tipo'), accion:event.target.getAttribute('data-accion')})
  }
  else{
    this.setState({ menu: event.target.getAttribute('data-m')})
  }
}

  render() {
    return (
      <section class="body">
        <Cab onClick={this.capturarMenu}/>
        <div class="inner-wrapper">
          <Menu onClick={this.capturarMenu}/>
          <Cuerpo menu={this.state.menu} tipoAccion={this.state.tipoAccion} accion={this.state.accion}  />
        </div>
         
      </section>
    );
  }

}
export default Principal;
