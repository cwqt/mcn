import React from 'react';
import styled from 'styled-components';
import { lighten } from "polished";

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
  }
`

const Title = styled.h1`
  font-weight: 100;
  color: #fff;
`

class Header extends React.Component { 
  render() {  	
    return (
    	<HeaderContainer>
        <Logo src="leaf.png"/>
        <Title>moisture.track</Title>
        <Button href="">add plant</Button>
    	</HeaderContainer>
    );
  }
}

// <PlantForm />

export default Header;
