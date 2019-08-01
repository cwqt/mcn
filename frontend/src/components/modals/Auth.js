import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { authUser } from "../../actions/AuthActions";
import { setModalVisibility } from "../../actions/ModalActions";


class AuthForm extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      token: "",
      show: false
    };
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.authUser(this.state.token);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isAuthorised === true) {
      this.props.setModalVisibility(false)
    }
  }

  render() {
  	return (
      <div>
        <h1>Authenticate</h1>
        <h3>Enter token</h3>
        <br />
        <form onSubmit={this.onSubmit}>
          <label>Token</label>
          <input
            type="password"
            name="token"
            onChange={this.onChange}
            value={this.state.token}
            autoComplete="off"
          />
          <br />
          <br />
          <button type="submit">Submit</button>
          <label>&nbsp;&nbsp; {this.props.response}</label>
        </form>
      </div>
  	);
  }
}

AuthForm.propTypes = {
  authUser: PropTypes.func.isRequired,
  setModalVisibility: PropTypes.func.isRequired
}

const MapStateToProps = state => ({
  isAuthorised: state.auth.isAuthorised,
  token: state.auth.currentToken,
  response: state.auth.response
})

export default connect(MapStateToProps, { authUser, setModalVisibility })(AuthForm);
