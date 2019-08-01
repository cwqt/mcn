import React from 'react';
import Plants from './components/Plants';
import Header from "./components/Header";
import Footer from "./components/Footer";
import ModalConductor from './components/ModalConductor'
import { Provider } from "react-redux";
import store from "./store";
import "./index.css"
import styled from 'styled-components';

const Container = styled.div`
  width: 60%;
  margin: auto;
  margin-top: 10vh;
  @media (max-width: 1200px) {
    width: 90%;
  }
`

class App extends React.Component {  
  render() {
    return (
      <Provider store={store}>
        <Container className="container">
          <ModalConductor />
          <Header />
          <Plants />
          <Footer />
        </Container>
      </Provider>
    );    
  }
}

export default App;
