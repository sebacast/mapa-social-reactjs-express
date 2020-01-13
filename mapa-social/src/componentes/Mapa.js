import React, { Component } from "react";
import GoogleMapReact from 'google-map-react';
import Popup from 'reactjs-popup';
import { getToken, apiPath } from './funciones';
const divStyle = {
  color: 'white',
  background: 'black',
  padding: '5px',
  textAlign: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '100%',
  position: 'absolute',

};
class Marcador extends Component {
  renderMarcador() {
    if (this.props.perfil !== null && typeof this.props.perfil.imagen !== "undefined") {
      return <Popup
        trigger={<button style={{
          'background-image': 'url(' + this.props.perfil.imagen + ')', width: '15%', margin: '1%', color: 'white',
          padding: '15px',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '100%',
          position: 'absolute',
          'background-size': 'cover',
        }} >  </button>}
        position="bottom center"
        closeOnDocumentClick
      >
        <div class="row">
          <div className="col-6" >Latitud</div><div className="col-4" >{this.props.lat} </div>
          <div className="col-4">Longitud</div><div className="col-6">{this.props.lng} </div>
          <div className="col-4">Fecha y Hora</div><div className="col-6">{this.props.fyh} </div>
          <div className="col-4">email</div><div className="col-6">{this.props.email} </div>
        </div>
      </Popup>
    }
    else {
      return <Popup
        trigger={<button style={divStyle} >X</button>}
        position="bottom center"
        closeOnDocumentClick
      >
        <div class="row">
          <div className="col-6" >Latitud</div><div className="col-4" >{this.props.lat} </div>
          <div className="col-4">Longitud</div><div className="col-6">{this.props.lng} </div>
          <div className="col-4">Fecha y Hora</div><div className="col-6">{this.props.fyh} </div>
          <div className="col-4">email</div><div className="col-6">{this.props.email} </div>
        </div>
      </Popup>
    }
  }
  render() {
    return (
      this.renderMarcador()
    );
  }
}

class Mapa extends Component {
  constructor() {
    super();
    this.state = {
      lat: 0,
      lon: 0,
      loc: [],
      busqueda: '',
      fechaDesde: '',
      fechaHasta: '',
      json: [],
      email: '',
      usuarios: [],
      perfiles: [],
    };
  }
  componentDidMount() {
    this.getContactos();
    this.setState({ email: JSON.parse(localStorage.getItem('acc')).email });
    this.getLoc();

    this.interval = setInterval(() => {
      this.getLoc();
    }, 15000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getLoc() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.setState({ lat: position.coords.latitude, lon: position.coords.longitude });
      this.enviarJsonPos();
    })
  }
  enviarJsonPos() {
    let ubicacion = { lat: this.state.lat, lng: this.state.lon };
    let url = apiPath() + '/gms';
    let jsonPos = { ubicacion: ubicacion, bus: this.state.busqueda };
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getToken()
      },
      body: JSON.stringify(jsonPos),
    })
      .then(res => res.json())
      .then(data => this.setState({ json: data }))
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
      .then(data => this.procesarContactos(data))
    //.then(() => this.send());

  }
  procesarContactos(data) {
    let aux = [];
    if (data && data.length > 0) {
      for (let i in data) {
        aux.push(data[i].email);
      }
      let bus = aux.toString();
      this.setState({ busqueda: bus });
    }
  }
  crearMarcadores() {
    let json = this.state.json;
    var cont = 0;
    var aux = [];
    if (json && json[0]) {
      for (let i in json) {
        aux[cont] = <Marcador
          lat={json[i]["geoloc"]["lat"]}
          lng={json[i]["geoloc"]["lon"]}
          fyh={json[i]["fyh"]}
          email={json[i]['email']}
          perfil={json[i]['perfil']}
        />;
        cont++;
      }
    }
    return aux;
  }
  recorrerJson() {
    let j = this.crearMarcadores().map(js => {
      return js
    })
    return j;
  }
  mostratMapa() {
    let center = {
      lat: Number(this.state.lat),
      lng: Number(this.state.lon)
    };
    if (this.state.lat === 0 && this.state.lon === 0) {
      return <div>Cargando</div>
    }
    else {
      return <GoogleMapReact
        bootstrapURLKeys={{ key: 'API KEY GOOGLE' }}
        defaultCenter={center}
        defaultZoom={11}
      >
        {this.recorrerJson()}
      </GoogleMapReact>;
    }
  }

  render() {
    return (
      <div style={{ height: '90vh', width: '90vw' }}>
        {this.mostratMapa()}
        {JSON.stringify(this.state.usuarios)}
      </div>
    )
  }
}
export default Mapa;