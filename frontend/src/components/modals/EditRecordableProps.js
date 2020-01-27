import React from 'react';
import { editRecordable } from "../../actions/RecordableActions"
import PropTypes from "prop-types";
import { connect } from "react-redux";

class EditForm extends React.Component {
	onClick = (e) => {
		e.preventDefault()
		this.props.editRecordable(this.props.page.self);
	} 

	render() {
		let BANNED_FIELDS = ["_id", "most_recent", "created_at", "type"]

		return (
			<div>
				<h1>Edit {this.props.page.self.type}</h1>
				<hr />
				<form>
				{Object.keys(this.props.page.self).map(p => {
					return <div><label>{p}</label><input placeholder={this.props.page.self[p]}/></div>	
				})}
				<br />
				<button onClick={this.onClick}>Update fields</button>&nbsp;&nbsp;
				<span>{this.props.message}</span>
 				</form>
			</div>
		);
	}
}

EditForm.propTypes = {
	editRecordable: PropTypes.func.isRequired
}

const MapStateToProps = store => ({
	page: store.page,
	message: store.recordable.message
})

export default connect(MapStateToProps, { editRecordable })(EditForm);