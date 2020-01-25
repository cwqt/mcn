import React from 'react';
import { deleteRecordable } from "../../actions/RecordableActions"
import PropTypes from "prop-types";
import { connect } from "react-redux";

class DeleteForm extends React.Component {
	onClick = (e) => {
		e.preventDefault()
		console.log("hello")
		console.log(this)
		this.props.deleteRecordable();
		// this.props.deleteRecordable(this.props.page.self);
	} 

	render() {
		return (
			<div>
				<h1>Delete {this.props.page.self.type}</h1>
				<hr />
				<p>Are you sure you want to delete <b>{this.props.page.self.name}</b></p>
				<br />
				<form>
				<button onClick={this.onClick}>Yes</button>&nbsp;&nbsp;
				</form>
				<span>{this.props.message}</span>
			</div>
		);
	}
}

DeleteForm.propTypes = {
	deleteRecordable: PropTypes.func.isRequired
}

const MapStateToProps = store => ({
	page: store.page,
	message: store.recordable.message
})

export default connect(MapStateToProps, { deleteRecordable })(DeleteForm);