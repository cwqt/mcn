import React from 'react';
import styled from 'styled-components';

import Page from "../components/Page"

class NotFound extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Page title="404">
				<h2>Page not found</h2>
			</Page>
		)
	}
} 


export default NotFound;