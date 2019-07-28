import React from 'react';
import PropTypes from "prop-types";
//connects component to redux provider store
import { connect } from "react-redux";
import { deletePlant } from "../actions/PlantActions.js"

class Plant extends React.Component { 
	onClick = () => {
		this.props.deletePlant(this.props._id)
	}

  render() {
    return (
    	<div key={this.props._id}>
	  		<p>{this.props.plant_name}</p>
	  		<button onClick={this.onClick}>Delete</button>
    	</div>
    );
  }
}

Plant.propTypes = {
	deletePlant: PropTypes.func.isRequired
}

export default connect(null, { deletePlant })(Plant);
