import React from 'react';
import { deletePlant } from "../../actions/PlantActions.js"
import PropTypes from "prop-types";
import { connect } from "react-redux";

class DeleteForm extends React.Component {
	onClick = () => {
		this.props.deletePlant(this.props.selected_plant, this.props.token);
	} 

	render() {
		return (
			<div>
				<h3>Are you sure you want to delete {this.props.selected_plant}</h3>
				<br />
				<button onClick={this.onClick}><h3>Yes</h3></button>
			</div>
		);
	}
}

DeleteForm.propTypes = {
	deletePlant: PropTypes.func.isRequired
}

const MapStateToProps = store => ({
  token: store.auth.currentToken,
  selected_plant: store.plants.selected_plant,
  items: store.plants.items
})

export default connect(MapStateToProps, { deletePlant })(DeleteForm);