import React from 'react';
import styled from 'styled-components';

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
    width: 30px;
  }
`
const Link = styled.a`
  margin-left: auto;
  transition: 0.2s;
  &:hover {
    filter: brightness(0.8)
  }
`

class Filterer extends React.Component { 
  render() {  	
    return (
    	<FooterContainer>
      <p>Created by &nbsp;<a href="https://gitlab.com/cxss">@cxss</a></p>
      <Link href="https://gitlab.com/cxss/moisture.track">
        <img alt="git" src="git.png" />
      </Link>
    	</FooterContainer>
    );
  }
}

export default Filterer;
