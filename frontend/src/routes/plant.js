import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux";
import { getSelf } from "../actions/PageActions"
import PropTypes from "prop-types";

import Page from "../components/Page"

class Plant extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			measurements: []
		}
	}

	componentDidMount() {
		this.props.getSelf(this.props.match.params.plant_id)
	}

	render() {
		return (
			<Page title={this.props.match.params.plant_id}>
				<h2>{this.props.message}</h2>
				{this.props.self &&
					<p>{this.props.self.name}</p>
				}
			</Page>
		)
	}
} 

Plant.propTypes = {
  getSelf: PropTypes.func.isRequired,
}

const MapStateToProps = store => ({
	self: store.page.self,
	message: store.page.message
})

export default connect(MapStateToProps, { getSelf })(Plant);