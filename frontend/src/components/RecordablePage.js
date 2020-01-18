import React from 'react';
import styled from 'styled-components';

import Page from "./Page";

const PageContainer = styled.div``

class RecordablePage extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {

	}

	render() {
		return (
			<Page title={this.props.name}>
				<RecordablePageContainer>
					<h1>{this.props.title}</h1>
					<hr />
					{ this.props.children }
				</RecordablePageContainer>
			</Page>
		)
	}
} 


export default RecordablePage;