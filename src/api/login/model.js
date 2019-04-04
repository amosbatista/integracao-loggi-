let model = class {
  
  constructor (login, password, authorization) {
    this.userLogin = login
    this.userPassword = password
    this.authorization = authorization
  }

  login () {
    return this.userLogin
  }

  password () {
    return this.userPassword
  }

  authorization () {
    return this.authorization
  }

  toString () {
    return `Apikey ${this.userLogin}:${this.authorization}`
  }
}

export default model