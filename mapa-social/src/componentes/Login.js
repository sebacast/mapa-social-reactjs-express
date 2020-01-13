import React from 'react';
//import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { apiPath } from './funciones';

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mensaje: <div></div>,
      email: '',
      pass: ''
    };
    this.pass = this.pass.bind(this);
  }
  tokenApi = (response, tipo) => {
    var login;
    var url;
    switch (tipo) {
      case 1: //google
        //login = response.profileObj.imageUrl;
        login = { token: response.accessToken, tipo: tipo, perfil: { googleId: response.profileObj.googleId, email: response.profileObj.email, nombre: response.profileObj.givenName, apellido: response.profileObj.familyName } };
        url = apiPath() + '/login';
        break;
      /*case 2: //facebook
        login = { id: response.userID, token: response.accessToken, tipo: tipo };
        url = apiPath() + '/login/facebook';
        break;
      case 3: //form
        login = { email: response.email, clave: response.pass };
        break;*/
      default:
        break;
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'appication/json'
      },
      body: JSON.stringify(login),
    })
      .then(res => res.json())
      .then(data => localStorage.setItem('acc', JSON.stringify(data)))
      .then(() => this.comprobarInicio());
  }
  falloJson() {
    localStorage.clear();
    this.setState({ mensaje: <div class="alert alert-danger">No se pudo iniciar sesión</div> });
  }
  comprobarInicio() {
    let mensaje = <div></div>;
    if (JSON.parse(localStorage.getItem('acc')).valido) {
      mensaje = <div class="alert alert-success">Iniciando sesión</div>;
      window.location.reload();
    }
    else {
      mensaje = <div class="alert alert-danger">No se pudo iniciar sesión</div>;
    }
    this.setState({ mensaje: mensaje });
  }
  pass(event) {
    this.setState({ pass: event.target.value });
    event.preventDefault();
  }
  email(event) {
    this.setState({ email: event.target.value });
    event.preventDefault();
  }

  validarEmail(valor) {
    // eslint-disable-next-line no-useless-escape
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(valor).toLowerCase());
  }
  render() {
    const responseGoogle = (response) => {
      this.tokenApi(response, 1);
    }
    /*const responseFacebook = (response) => {
      this.tokenApi(response, 2);
    }*/

    return (
      <section class="body-sign">
        <div class="center-sign">

          <div class="panel panel-sign">
            {this.state.mensaje}
            <div class="panel-body" >
              <div id="tcabio">
                <div class="mb-xs text-center">
                  <GoogleLogin
                    clientId="ID CLIENTE OAUTH"
                    buttonText="Inicia sesión con Google"
                    onSuccess={responseGoogle}
                    //onFailure={responseGoogle}
                    cookiePolicy={'single_host_origin'}
                    className={"btn btn-primary btn-user btn-block"}
                    render={renderProps => (
                      <button className={"btn btn-info btn-user btn-block"} onClick={renderProps.onClick} disabled={renderProps.disabled}>Ingresa con google</button>
                    )}
                  />
                </div>
              </div>
              {/*<div class="mb-xs text-center">
                <FacebookLogin
                  appId="ID"
                  autoLoad={false}
                  fields="name,email,picture"
                  scope="public_profile"
                  callback={responseFacebook}
                  cssClass={"btn btn-primary btn-user btn-block"}
                  textButton={"Inicia sesión con Facebook"}
                />
                    </div>*/}
            </div>
          </div>
        </div>
      </section>
    );
  }
}
export default Login;