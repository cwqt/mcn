import React from 'react';
import styled from 'styled-components';
import { lighten } from "polished";

const FooterContainer = styled.header`
  background-color: rgba(255,255,255,0.1);
  display: flex;
  flex-flow: row;
  align-items: center;
  border-radius: 4px;
  padding: 20px;
  p {
    margin: 0;
    color: #fff;
    a {
      color: white;
      text-decoration: none;
      font-weight: bold;
      font-size: 1.1rem;
    }
  }
  img {
    margin-left: auto;
    width: 30px;
  }
`

class Footer extends React.Component { 
  render() {  	
    return (
    	<FooterContainer>
      <p>Created by &nbsp;<a href="https://gitlab.com/cxss">@cxss</a></p>
      <img src="git.png" />
    	</FooterContainer>
    );
  }
}

export default Footer;
