let model = class {
  
  constructor (login, password, authorization) {
    this.userLogin = login
    this.userPassword = password
    this.authorization = authorization
  }

  get login () {
    return this.userLogin
  }

  get password () {
    return this.userPassword
  }

  get authorization () {
    return this.authorization
  }

  get toString () {
    return `Apikey ${this.userLogin}:${this.authorization}`
  }
}

export default model