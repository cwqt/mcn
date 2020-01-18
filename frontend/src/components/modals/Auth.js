import React from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { generateAccessToken } from "../../actions/AuthActions";
import { setModalVisibility } from "../../actions/ModalActions";


class AuthForm extends React.Component { 
  constructor(props) {
    super(props);
    this.state = { password: "" };
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.generateAccessToken(this.state.password);
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
        <hr />
        <form onSubmit={this.onSubmit}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            onChange={this.onChange}
            value={this.state.password}
            autoComplete="off"
          />
          <br />
          <br />
          <button type="submit">Submit</button>
          <label>&nbsp;&nbsp; {this.props.message}</label>
        </form>
      </div>
  	);
  }
}

AuthForm.propTypes = {
  generateAccessToken: PropTypes.func.isRequired,
  setModalVisibility: PropTypes.func.isRequired
}

const MapStateToProps = store => ({
  isAuthorised: store.auth.isAuthorised,
  message: store.auth.message
})

export default connect(MapStateToProps, { generateAccessToken, setModalVisibility })(AuthForm);
