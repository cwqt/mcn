import React from 'react';
import styled from 'styled-components';
import { connect } from "react-redux";
import ModalButton from "../modals/ModalButton"


const WelcomeContainer = styled.div`
  display: inline-flex;
  flex-flow: column;
  align-items: flex-start;

  flex: 1 0 calc(66.666% - 10px);
  max-width: calc(66.666% - 10px);
  margin: 0 5px;

  padding: 20px;
  background: white;
  border-radius: 20px;
  height: 30vh;
  position: relative;
  overflow: hidden;
  padding: 40px 20px 20px 40px;

  svg {
    position: absolute;
    bottom: -55px;
    transform: rotate(-10deg) scale(1.2);
  }

  h1 {
    font-size: 50px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  h2 {
    line-height: 1.5;
  }
  a {
    margin-top: auto;
    z-index: 10;
  }

  img {
    position: absolute;
    right: 20px;
    margin: auto;
    top: 0px;
    bottom: 0px;
    z-index: 9;
    height: 85%;
  }
`

class Welcomer extends React.Component { 
  render() {  	
    var total = {
      plants: 0,
      gardens: 0,
      sub_plants: 0,
    }
    this.props.objects.forEach(object => {
      if (object.type == "plant") {
        total.plants++;
        return;
      }
      if (object.type == "garden") {
        total.gardens++;
        total.sub_plants += object.plants.length;
      }
    })

    return (
    	<WelcomeContainer>
        <h1>Hello!</h1>
        {this.props.isFetching &&
          <h2>Fetching data from API...</h2>
        }
        {this.props.isFetching == false && this.props.length == 0 &&
          <h2>No items found in databse</h2>
        }
        {this.props.isFetching == false && this.props.objects.length > 0 &&
          <h2>This monitor manages <b>{total.gardens}</b> gardens <br/>with <b>{total.sub_plants}</b> sub-plants & <b>{total.plants}</b> individual plants.</h2>
        }
        <img src="https://i.imgur.com/0KI01L1.png" />
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#EFE5DB" fillOpacity="1" d="M0,160L48,149.3C96,139,192,117,288,101.3C384,85,480,75,576,58.7C672,43,768,21,864,53.3C960,85,1056,171,1152,208C1248,245,1344,235,1392,229.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>

        {this.props.isAuthorised == false && 
          <ModalButton openModal="AUTH_MODAL" desc="Authenticate" icon="lock" />
        }
        {this.props.isAuthorised && 
          <ModalButton desc="You're authenticated" icon="lock_open" disabled/>
        }
      </WelcomeContainer>
    );
  }
}

const MapStateToProps = store => ({
  objects: store.overview.objects,
  isAuthorised: store.auth.isAuthorised,
  isFetching: store.overview.isFetching
})

export default connect(MapStateToProps, {})(Welcomer);
