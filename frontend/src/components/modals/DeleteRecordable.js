import React from 'react';
import { deleteRecordable } from "../../actions/RecordableActions"
import PropTypes from "prop-types";
import { connect } from "react-redux";

class DeleteForm extends React.Component {
	onClick = () => {
		this.props.deleteRecordable({...this.props});
	} 

	render() {
		return (
			<div>
				<h3>Are you sure you want to delete <b>{this.props.name}</b></h3>
				<br />
				<button onClick={this.onClick}><h3>Yes</h3></button>
			</div>
		);
	}
}

DeleteForm.propTypes = {
	deleteRecordable: PropTypes.func.isRequired
}

const MapStateToProps = store => ({
})

export default connect(MapStateToProps, { deleteRecordable })(DeleteForm);