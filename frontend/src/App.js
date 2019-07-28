import React from 'react';
import PlantForm from "./components/PlantForm";
import Plants from './components/Plants';
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Provider } from "react-redux";
import store from "./store";
import "./index.css"
import styled from 'styled-components';

const Container = styled.div`
  width: 60%;
  margin: auto;
  margin-top: 10vh;
`

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Provider store={store}>
        <Container>
          <Header />
          <Plants />
          <Footer />
        </Container>
      </Provider>
    );    
  }
}

export default App;
