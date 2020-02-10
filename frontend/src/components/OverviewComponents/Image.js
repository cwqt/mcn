import React from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  border-radius: 20px;
  background-color: #eceaea;
  overflow: hidden;
  flex: 1;
  max-height: 500px;
  img {
    height: 100%;
  }
`

class Image extends React.Component { 
  render() {  	
    return (
    	<ImageContainer>
        <img src={this.props.src} />
    	</ImageContainer>
    );
  }
}

export default Image;
