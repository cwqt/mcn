import React from 'react';
import styled from 'styled-components';

const Wrapper404 = styled.div`
	display: flex;
	flex-flow: column;
	background: white;
	padding: 20px;
	border-radius: 20px;
`


class NotFound extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Wrapper404>
				<h1>404</h1>
				<hr />
				<p>Page not found</p>
			</Wrapper404>
		)
	}
} 


export default NotFound;