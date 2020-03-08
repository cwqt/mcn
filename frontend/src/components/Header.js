import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom"

import ModalButton from "./modals/ModalButton";

const HeaderContainer = styled.div`
  background: white;
  top: 0; left: 0;
  width: 100%;
  position: relative;
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
    max-height: 50px;
    filter: brightness(0.2);
  }
  h1 {
    margin-top: -2px;
    margin-left: 20px;
    font-weight: bold;
    color: #333;
    font-size: 30px;
    line-height: .9
    h2 {
      margin-top: 10px;
      font-size: 18px;
    }
  }

  .header_modals {
    display: flex;
    margin-left: auto;
    a {
      margin-left: 10px;
      &:last-child {
        i {
          margin-right: 0;
        }
      }
    }
  }

`

class Header extends React.Component {
  render() {
    return (
      <HeaderContainer>
        <Link to="/">
          <img src="/leaf.png" />
          <h1>hydroponics<h2>IoT garden and plant dashboard</h2></h1>
        </Link>
        <div className="header_modals">
          <ModalButton desc="Add plant" icon="eco" openModal="CREATE_RECORDABLE_PLANT" requiresAuth/>
          <ModalButton desc="Add garden" icon="group_work" openModal="CREATE_RECORDABLE_GARDEN" requiresAuth/>
          <ModalButton desc="" icon="vpn_key" openModal="API_KEY_LIST" requiresAuth/>
        </div>
      </HeaderContainer>
    )
  }
}


export default Header;
