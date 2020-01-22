import React from 'react';
import styled from 'styled-components';


const PageContainer = styled.div``

class RecordablePage extends React.Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {

	}

	render() {
		return (
			<RecordablePageContainer>
				<h1>{this.props.title}</h1>
				<hr />
				{ this.props.children }
			</RecordablePageContainer>
		)
	}
} 


export default RecordablePage;