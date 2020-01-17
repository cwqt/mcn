import React from 'react';
import styled from 'styled-components';
import moment from 'moment';

const HeaderContainer = styled.div`
	h1, h4 {
		width: 100%;
		display: flex;
		flex-flow: row;
	}
	h1 span, h4 span {
		margin-left: auto;
		opacity: 0.8;
	}
`

class Header extends React.Component {
	render() {
		return (
			<HeaderContainer>
				<h1>{this.props.name} <span>{this.props.type.toUpperCase()}</span></h1>
				<h4>Created:&nbsp;<b>{moment.unix(this.props.created_at).fromNow()}</b> <span>{this.props._id}</span></h4>
				<hr />
			</HeaderContainer>
		)
	}
}


export default Header;