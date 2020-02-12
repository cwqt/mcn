import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment       from "moment";
import { getApiKeys, revokeApiKey } from "../../actions/AuthActions";

class ApiKeyList extends React.Component { 
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.getApiKeys()
  }

  revokeKey = (_id) => {
    console.log(_id)
  }

 render() {
  return (
    <div>
      <h1>API keys </h1>
      <hr />
      <table>
        <tr>
          <th>Device</th>
          <th>Created</th>
          <th>Identifier</th>
          <th></th>
        </tr>
        {
          Object.keys(this.props.keys).map(key => {
            var keys = this.props.keys
            return (
              <tr>
                <td>{keys[key].for}</td>
                <td>{moment.unix(keys[key].created_at).format("LLLL")}</td>
                <td>{keys[key]._id}</td>
                <td><a onClick={this.revokeKey(keys[key]._id)}>Revoke</a></td>
              </tr>
            )
          })
        }
      </table>
    </div>
  );
 }
}

ApiKeyList.propTypes = {
  getApiKeys: PropTypes.func.isRequired,
  revokeApiKey: PropTypes.func.isRequired,
}

const MapStateToProps = store => ({
  token: store.auth.currentToken,
  keys: store.auth.keys,
});

export default connect(MapStateToProps, { getApiKeys, revokeApiKey })(ApiKeyList);
