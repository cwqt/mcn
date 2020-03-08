import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment       from "moment";
import { createApiKey, getApiKeys, revokeApiKey } from "../../actions/AuthActions";
import styled from 'styled-components';
import LoadSpinner from "../LoadSpinner";

const ApiKeyListWrapper = styled.div`
  textarea {
    width: 100%;
    font-size: 18px;
    padding: 10px;
  }

  table tbody {
    tr {
      height: 60px !important;
    }
    a {
      background-color: #f3f3f3;
      padding: 10px 20px;
      border: 2px solid transparent;
      border-radius: 24px;
      transition: 0.2s;
      &:hover {
        cursor: pointer;
        border-color: #ff726f;
      }
    }
  }
`

class ApiKeyList extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      token_name: "",
      password: "",
      clicked_id: ""
    }
  }

  componentDidMount() {
    this.props.getApiKeys()
  }

  revokeKey = (_id) => {
    this.setState({clicked_id:_id})
    this.props.revokeApiKey(_id)
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.createApiKey(this.state.token_name, this.state.password)
  }

 render() {
  return (
    <ApiKeyListWrapper>
      <h1>Create an API key</h1>
      <hr />
      <form onSubmit={this.onSubmit}>
        <fieldset>
          <p>
            <label>Token name</label>
            <input
              type="text"
              name="token_name"
              placeholder="my_device"
              onChange={this.onChange}
              value={this.state.token_name}
            />
          </p>

          <p>
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder=""
              onChange={this.onChange}
              value={this.state.password}
            />
          </p>
        </fieldset>

        <button type="submit">Submit</button>&nbsp;&nbsp;
        <span>{this.props.message}</span>
      </form>

      {Object.keys(this.props.auth.key).length != 0 &&
        <div>
          <br />
          <textarea value={this.props.auth.key.key}></textarea>
        </div>
      }

      <hr />

      {(this.props.auth.isFetching && this.props.keys.length == 0) ? (
        <LoadSpinner />
        ) : (

      <table>
        <thead>
          <tr>
            <th>Device</th>
            <th>Created</th>
            <th>Identifier</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            Object.keys(this.props.keys).map(key => {
              var keys = this.props.keys
              return (
                <tr key={keys[key]._id}>
                  <td>{keys[key].for}</td>
                  <td>{moment.unix(keys[key].created_at).format("LLLL")}</td>
                  <td>{keys[key]._id}</td>
                  <td>{(this.props.auth.isFetching == true && this.state.clicked_id == keys[key]._id) ? (
                      <LoadSpinner />
                    ) : (
                      <a onClick={() => this.revokeKey(keys[key]._id)}>Revoke</a>
                    )
                  }
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>



      )}
    </ApiKeyListWrapper>
  );
 }
}

ApiKeyList.propTypes = {
  getApiKeys: PropTypes.func.isRequired,
  createApiKey: PropTypes.func.isRequired,
  revokeApiKey: PropTypes.func.isRequired,
}

const MapStateToProps = store => ({
  token: store.auth.currentToken,
  keys: store.auth.keys,
  message: store.auth.message,
  auth: store.auth
});

export default connect(MapStateToProps, { getApiKeys, revokeApiKey, createApiKey })(ApiKeyList);
