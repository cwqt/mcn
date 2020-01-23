import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom"

import ModalButton from "./modals/ModalButton";

const HeaderContainer = styled.div`
  background: white;
  top: 0; left: 0;
  width: 100%;
  z-index: 9999;
  display: flex;
  padding: 30px;
  align-items: center;
  border-radius: 20px;
  box-shadow: 0 9px 30px 0 rgba(35,39,42,.1);
  a {
    display: flex;
    text-decoration: none;
  }
  img {
    max-height: 40px;
    filter: brightness(0.2);
  }
  h1 {
    margin-left: 20px;
    font-weight: bold;
    color: #333;
    font-size: 40px;
    line-height: .9
  }

  a:nth-last-child(1), a:nth-last-child(1) {
    margin-left: 10px;
  }
  a:nth-last-child(2) {
    margin-left: auto;
  }
`

class Header extends React.Component {
  render() {
    return (
      <HeaderContainer>
        <Link to="/">
          <img src="/leaf.png" />
          <h1>moisture.track</h1>
        </Link>
        <ModalButton desc="Add plant" icon="eco" openModal="CREATE_RECORDABLE_PLANT"/>
        <ModalButton desc="Add garden" icon="group_work" openModal="CREATE_RECORDABLE_GARDEN"/>
      </HeaderContainer>
    )
  }
}


export default Header;

// import { lighten } from "polished";
// import { connect } from "react-redux";
// import PropTypes from "prop-types";
// import { setCurrentModal, setModalVisibility } from "../actions/ModalActions";

// const HeaderContainer = styled.header`
//   background-color: rgba(255,255,255,0.1);
//   height: 80px;
//   display: flex;
//   flex-flow: row;
//   align-items: center;
//   border-radius: 4px;
//   padding: 20px;
//   margin-bottom: 20px;
// `

// const Logo = styled.img`
//   max-height: 100%;
//   margin-right: 20px;
// `

// const Button = styled.a`
//   margin-left: auto;
//   background-color: #18181b;
//   padding: 20px;
//   color: white;
//   text-decoration: none;
//   border-radius: 4px;
//   box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
//   transition: 0.2s;
//   &:hover {
//     background-color: ${lighten(0.03, '#18181b')};
//     cursor: pointer;
//   }
// `

// class Header extends React.Component { 


//   render() {  	
//     return (
//     	<HeaderContainer>
//         <Logo src="leaf.png"/>
//         <h1>moisture.track</h1>
//         {this.props.isAuthorised ? (
//             <Button onClick={this.openPlantCreateModal}>Add plant</Button>
//           ) : (
//             <Button onClick={this.tryAuth}>Log in</Button>
//         )}
//     	</HeaderContainer>
//     );
//   }
// }

// Header.propTypes = {
//   setCurrentModal: PropTypes.func.isRequired,
//   setModalVisibility: PropTypes.func.isRequired
// }

// const MapStateToProps = store => ({
//   isAuthorised: store.auth.isAuthorised,
// })

// export default connect(MapStateToProps, { setCurrentModal, setModalVisibility})(Header);
