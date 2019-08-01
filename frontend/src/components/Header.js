import React from 'react';
import styled from 'styled-components';
import { lighten } from "polished";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { setCurrentModal, setModalVisibility } from "../actions/ModalActions";

const HeaderContainer = styled.header`
  background-color: rgba(255,255,255,0.1);
  height: 80px;
  display: flex;
  flex-flow: row;
  align-items: center;
  border-radius: 4px;
  padding: 20px;
  margin-bottom: 20px;
`

const Logo = styled.img`
  max-height: 100%;
  margin-right: 20px;
`

const Button = styled.a`
  margin-left: auto;
  background-color: #18181b;
  padding: 20px;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: 0.2s;
  &:hover {
    background-color: ${lighten(0.03, '#18181b')};
    cursor: pointer;
  }
`

class Header extends React.Component { 

  tryAuth = e => {
    e.preventDefault()
    this.props.setCurrentModal("AUTH");
    this.props.setModalVisibility(true);
  }

  render() {  	
    return (
    	<HeaderContainer>
        <Logo src="leaf.png"/>
        <h1>moisture.track</h1>
        {this.props.isAuthorised ? (
            <Button href="">Add plant</Button>
          ) : (
            <Button onClick={this.tryAuth}>Log in</Button>
        )}
    	</HeaderContainer>
    );
  }
}

Header.propTypes = {
  setCurrentModal: PropTypes.func.isRequired,
  setModalVisibility: PropTypes.func.isRequired
}


const MapStateToProps = state => ({
  isAuthorised: state.auth.isAuthorised,
})

export default connect(MapStateToProps, { setCurrentModal, setModalVisibility})(Header);
