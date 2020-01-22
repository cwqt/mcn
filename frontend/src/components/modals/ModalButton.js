import React from 'react';
import styled from 'styled-components';

const ModalButtonContainer = styled.a`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #f3f3f3;
  border-radius: 24px;
  padding: 15px 25px;
  &:hover {
    cursor: pointer;
    i {
      opacity: 1
    }
  }

  i {
    margin-right: 10px;
    opacity: 0.5;
    transition: 0.2s
  }
  p {
    margin: 0;
    color: #333;
  }
`

class ModalButton extends React.Component { 
  openModal = () => {
    console.log(this.props.icon)
  }

  render() {  	
    return (
    	<ModalButtonContainer onClick={this.openModal}>
        <i className="material-icons">{this.props.icon}</i>
        <p>{this.props.desc}</p>
    	</ModalButtonContainer>
    );
  }
}

export default ModalButton;
