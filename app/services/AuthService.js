import decode from 'jwt-decode';

export default class AuthService {
  constructor(domain) {
    this.domain = domain || 'http://localhost:3000/api';
    this.fetch = this.fetch.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.register = this.register.bind(this);
    this.isLogin = this.isLogin.bind(this);
    this.isEmail = this.isEmail.bind(this);
    this.isAccountBill = this.isAccountBill.bind(this);
    this.isAmountMoney = this.isAmountMoney.bind(this);
    this.getUserdata = this.getUserdata.bind(this);
    this.availableFunds = this.availableFunds.bind(this);
    this.accountBills = this.accountBills.bind(this);
    this.createPayment = this.createPayment.bind(this);
    this.getUsersData = this.getUsersData.bind(this);
    this.recentTransactionsSender = this.recentTransactionsSender.bind(this);
    this.recentTransactionsRecipient = this.recentTransactionsRecipient.bind(
      this,
    );
  }

  // Check Login Exist Action
  isLogin(id) {
    return this.fetch(`${this.domain}/users/isLogin/${id}`, {
      method: 'GET',
    })
      .then(res => {
        if (!res.error) {
          return 1;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  // Check Email Exist Action
  isEmail(email) {
    return this.fetch(`${this.domain}/users/isEmail/${email}`, {
      method: 'GET',
    })
      .then(res => {
        if (!res.error) {
          return 1;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  // Login Action
  login(login, password) {
    return this.fetch(`${this.domain}/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        login,
        password,
      }),
    })
      .then(res => {
        if (res.token) {
          this.setToken(res.token);
          return 1;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  // Register Action
  register(login, password, name, surname, email) {
    return this.fetch(`${this.domain}/users/register`, {
      method: 'POST',
      body: JSON.stringify({
        login,
        password,
        name,
        surname,
        email,
      }),
    })
      .then(res => {
        if (!res.error) {
          return 1;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  // Logout Action
  logout(id) {
    return this.fetch(`${this.domain}/users/logout/${id}`, {
      method: 'PUT',
    })
      .then(res => {
        if (!res.error) {
          localStorage.removeItem('id_token');
          return 1;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  // GreetingHeadline Action
  getUserdata(id) {
    return this.fetch(`${this.domain}/users/${id}`, {
      method: 'GET',
    })
      .then(res => {
        if (!res.error) {
          return res;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  // AvailableFunds Action
  availableFunds(id) {
    return this.fetch(`${this.domain}/bills/${id}`, {
      method: 'GET',
    })
      .then(res => {
        if (!res.error) {
          return res;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  // AccountBills Action
  accountBills(id) {
    return this.fetch(`${this.domain}/bills/${id}`, {
      method: 'GET',
    })
      .then(res => {
        if (!res.error) {
          return res;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  // RecentTransactions Action
  recentTransactionsRecipient(id) {
    return this.fetch(`${this.domain}/transactions/recipient/${id}`, {
      method: 'GET',
    })
      .then(res => {
        if (!res.error) {
          return res;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  recentTransactionsSender(id) {
    return this.fetch(`${this.domain}/transactions/sender/${id}`, {
      method: 'GET',
    })
      .then(res => {
        if (!res.error) {
          return res;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  isAccountBill(account_bill) {
    return this.fetch(`${this.domain}/bills/isAccountBill/${account_bill}`, {
      method: 'GET',
    })
      .then(res => {
        if (!res.error) {
          return 1;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  isAmountMoney(id_sender, amount_money) {
    return this.fetch(`${this.domain}/bills/isAmountMoney`, {
      method: 'POST',
      body: JSON.stringify({
        id_sender,
        amount_money,
      }),
    })
      .then(res => {
        if (!res.error) {
          return 1;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  // Payment Action
  createPayment(id_sender, account_bill, amount_money, transfer_title) {
    return this.fetch(`${this.domain}/transactions`, {
      method: 'POST',
      body: JSON.stringify({
        id_sender,
        account_bill,
        amount_money,
        transfer_title,
      }),
    });
  }

  getUsersData() {
    return this.fetch(`${this.domain}/bills/`, {
      method: 'GET',
    })
      .then(res => {
        if (!res.error) {
          return res;
        }
      })
      .catch(err => {
        /* just ignore */
      });
  }

  // TODO: updateLastSuccessfulLoggedDate(id) when isTokenExpired
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  setToken(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
  }

  unsetToken() {
    // Delete the user token from localStorage
    return localStorage.removeItem('id_token');
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  getUserId() {
    return decode(this.getToken());
  }

  fetch(url, options) {
    // performs api calls sending the required authentication headers
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.loggedIn()) {
      headers.Authorization = `Bearer ${this.getToken()}`;
    }

    return fetch(url, {
      headers,
      ...options,
    })
      .then(this.checkStatus)
      .then(response => response.json());
  }

  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
