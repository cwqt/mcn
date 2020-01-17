import React from 'react';
import styled from 'styled-components';

const PageContainer = styled.div``

class Page extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<PageContainer>
				<h1>{this.props.title}</h1>
				<hr />
				{ this.props.children }
			</PageContainer>
		)
	}
} 


export default Page;