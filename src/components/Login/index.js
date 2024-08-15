import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {userId: '', pin: '', errorMsg: '', error: false}

  onChangeUserId = event => {
    this.setState({userId: event.target.value})
  }

  onChangePin = event => {
    this.setState({pin: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })
    history.replace('/')
  }

  onUserLogin = async event => {
    event.preventDefault()

    const {userId, pin} = this.state
    const userDetails = {
      user_id: userId,
      pin,
    }

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    console.log(JSON.stringify(userDetails))
    const response = await fetch('https://apis.ccbp.in/ebank/login', options)
    const result = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(result.jwt_token)
    } else {
      this.setState({errorMsg: result.error_msg, error: true})
    }
  }

  render() {
    const {userId, pin, error, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="login-block">
          <img
            src="https://assets.ccbp.in/frontend/react-js/ebank-login-img.png"
            alt="website login"
            className="login-image"
          />
          <div className="login-text-block">
            <h1>Welcome Back!</h1>
            <form className="login-form" onSubmit={this.onUserLogin}>
              <label htmlFor="userId">User ID</label>
              <input
                type="text"
                id="userId"
                onChange={this.onChangeUserId}
                value={userId}
                placeholder="Enter User ID"
              />
              <label htmlFor="pin">PIN</label>
              <input
                type="password"
                id="pin"
                value={pin}
                onChange={this.onChangePin}
                placeholder="Enter Pin"
              />
              <button type="submit">Login</button>
              {error && <p>* {errorMsg}</p>}
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
