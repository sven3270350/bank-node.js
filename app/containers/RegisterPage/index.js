import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import NavigateNext from '@material-ui/icons/NavigateNext';
import NavigateBefore from '@material-ui/icons/NavigateBefore';
import ErrorOutline from '@material-ui/icons/ErrorOutline';
import AuthService from '../../services/AuthService';

import Header from '../../components/Header';
import HeaderSubheading from '../../components/HeaderSubheading';

const styles = {
  formItem: {
    padding: 10,
    height: 36,
    width: '17rem',
    border: '1px solid grey',
    display: 'block',
    margin: '0 auto',
    backgroundColor: 'white',
    fontSize: 14,
    borderRadius: 2,
  },
  formSubmit: {
    width: '17rem',
    display: 'block',
    margin: '20px auto 0',
    padding: 5,
    height: 36,
    backgroundColor: '#0098db',
    borderRadius: 2,
    color: 'white',
  },
  formContainer: {
    textAlign: 'center',
    margin: '15px 0',
    width: '100%',
    backgroundColor: '#f2f4f7',
    padding: '15px 0',
  },
  formError: {
    border: '1px solid red',
    borderRadius: 2,
  },
  pageContainer: {
    textAlign: 'center',
  },
  alertContainer: {
    maxWidth: '1024px',
    padding: '10px 3%',
    margin: '10px auto 0',
    borderRadius: 2,
    backgroundColor: '#0098db',
    color: 'white',
  },
  messageContainer: {
    textAlign: 'left',
    padding: '0 130px',
  },
  footerContainer: {
    maxWidth: 550,
    margin: '15px auto',
  },
  textField: {
    margin: '10px auto 0',
    width: '17rem',
    textAlign: 'left',
    fontSize: '18px',
    letterSpacing: 0.3,
  },
  textError: {
    color: 'red',
    textAlign: 'left',
    width: '17rem',
    margin: '0 auto',
    fontSize: 14.5,
  },
  footerText: {
    textAlign: 'left',
    padding: '0 15px',
    margin: '10px -4px',
  },
  footerInfoText: {
    position: 'relative',
    top: 1,
    fontSize: 13,
  },
  footerAlertText: {
    color: 'red',
    fontSize: 13,
  },
  errorIcon: {
    fontSize: 35,
  },
  footerLink: {
    color: '#0098db',
  },
  buttonText: {
    position: 'relative',
  },
};
class RegisterPage extends Component {
  constructor() {
    super();

    this.state = {
      login: '',
      password: '',
      name: '',
      surname: '',
      address: '',
      loginExist: false,
      loginError: '',
      error: '',
    };

    this.goToLogin = this.goToLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleFormSubmitLogin = this.handleFormSubmitLogin.bind(this);
    this.Auth = new AuthService();
  }

  componentWillMount() {
    if (this.Auth.loggedIn()) this.props.history.replace('/dashboard');
  }

  goToLogin() {
    this.props.history.replace('/login');
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  handleFormSubmitLogin(e) {
    e.preventDefault();

    if (this.state.login === '') {
      this.setState({
        loginError: 'Proszę wprowadzić identyfikator',
      });
      return;
    }

    this.Auth.checkLoginExist(this.state.login)
      .then(res => {
        if (!res) {
          this.setState({
            loginExist: true,
            loginError: '',
            password: '',
          });
        } else {
          document.getElementsByTagName('input').login.value = '';
          this.setState({
            login: '',
            loginError: 'Istnieje juz taki identyfikator',
          });
        }
      })
      .catch(err => {
        this.setState({
          loginError: 'Error catch',
        });
      });
  }

  handleFormSubmit(e) {
    e.preventDefault();

    this.Auth.register(
      this.state.login,
      this.state.password,
      this.state.name,
      this.state.surname,
      this.state.address,
    )
      .then(res => {
        if (res) {
          this.props.history.replace('/login');
        } else {
          this.setState({
            error: 'Error',
          });
        }
      })
      .catch(err => {
        this.setState({
          error: 'Error catch',
        });
      });
  }

  render() {
    const { classes } = this.props;
    const { loginError } = this.state;
    return (
      <Fragment>
        <Header />
        <HeaderSubheading headerText="Rejestracja" />

        <div className={classes.pageContainer}>
          <div className={classes.alertContainer}>
            <div className={classes.messageContainer}>
              Jeśli skorzystasz z naszej promocji i zarejestrujesz swoje konto
              do końca stycznia w naszym banku,
              <b>otrzymasz bonus w postaci 10 PLN</b>.<br />
              <br />
              Utworzone konta równie podlegają dla tej promocji.
            </div>
          </div>
          <div className={classes.formContainer}>
            <form noValidate onSubmit={this.handleFormSubmit}>
              <div className={classes.textField}>Numer identyfikacyjny</div>
              <input
                className={classNames(classes.formItem, {
                  [classes.formError]: loginError,
                })}
                placeholder="Wpisz numer"
                name="login"
                type="text"
                onChange={this.handleChange}
              />
              {loginError ? (
                <div className={classes.textError}>{loginError}</div>
              ) : null}

              <button
                className={classes.formSubmit}
                onClick={this.handleFormSubmitLogin}
              >
                <span className={classes.buttonText}>Dalej</span>
                <NavigateNext />
              </button>

              {/* <button className={classes.formSubmit} type="submit">
                <span className={classes.buttonText}>Zarejestruj</span>
              </button> */}
            </form>
          </div>
          <div className={classes.footerContainer}>
            <div className={classes.footerText}>
              <b>
                Jeśli posiadasz juz konto w naszym banku, mozesz się zalogować
                przechodząc do{' '}
                <span onClick={this.goToLogin} className={classes.footerLink}>
                  Logowania
                </span>
              </b>
            </div>
          </div>

          <div className={classes.footerContainer}>
            <div className={classes.footerText}>
              <ErrorOutline className={classes.errorIcon} />{' '}
              <span className={classes.footerInfoText}>
                Pamiętaj o podstawowych zasadach bezpieczeństwa.
              </span>
            </div>

            <div className={classes.footerText}>
              <span className={classes.footerInfoText}>
                Zanim wprowadzisz na stronie swój numer identyfikacyjny i hasło
                dostępu, upewnij się, ze:
                <ul>
                  <li>
                    twoje hasło jest bezpieczne. Zawiera conajmniej 8 znaków
                    oraz składa się z wielkich i małych liter
                  </li>
                  <li>
                    w pasku adresu lub na pasku stanu w dolnej części ekranu
                    przeglądarki widoczna jest zamknięta kłódka
                  </li>
                </ul>
              </span>
            </div>

            <div className={classes.footerText}>
              <span className={classes.footerAlertText}>
                Pamiętaj: Bank nie wymaga potwierdzania żadnych danych,
                poprawnego logowania bądź odczytania komunikatów Banku za pomocą
                kodu SMS, TAN i/lub mailem, ani też instalacji jakichkolwiek
                aplikacji na telefonach bądź komputerach użytkowników.
              </span>
            </div>

            <div className={classes.footerText}>
              <span className={classes.footerInfoText}>
                Więcej informacji na temat bezpieczeństwa znajdziesz na stronie:
                Zasady bezpieczeństwa
              </span>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(withRouter(RegisterPage));
