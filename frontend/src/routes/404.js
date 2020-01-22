import React from 'react';
import styled from 'styled-components';

class NotFound extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div>
				<h1>404</h1>
				<hr />
				<p>Page not found</p>
			</div>
		)
	}
} 


export default NotFound;