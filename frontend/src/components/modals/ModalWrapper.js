import React from 'react';
import styled from 'styled-components';
import { setModalVisibility } from "../../actions/ModalActions";
import PropTypes from "prop-types";
import { connect } from "react-redux";


const Wrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0; bottom: 0;
  left: 0; right: 0;
  background-color: rgba(0,0,0,0.5);
  z-index: 9999;
`

const Content = styled.div`
  position: relative;
  margin-top: -30vh;
  height: auto
  background-color: #303031;
  box-shadow: 0 9px 30px 0 rgba(35,39,42,.1);
  padding: 20px;
  padding-right: 150px;
  border-radius: 4px;
`

const CloseModal = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0; right:0;
  height: 40px; width: 40px;
  margin: 20px;
  color: white;
  font-size: 35px;
  font-weight: bold;
  &:hover {
    cursor: pointer
  }
`

class ModalWrapper extends React.Component { 
  closeModal = () => {
    this.props.setModalVisibility(false)
  }

  render() {  	
    return (
      <Wrapper>
        <Content>
          <CloseModal onClick={this.closeModal}>&#x2715;</CloseModal>
          { this.props.children }
        </Content>
      </Wrapper>
    );
  }
}


ModalWrapper.propTypes = {
  setModalVisibility: PropTypes.func.isRequired
}

export default connect(null, { setModalVisibility })(ModalWrapper);