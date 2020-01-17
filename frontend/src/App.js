import React from 'react';
import styled from 'styled-components';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route} from "react-router-dom";

import store from "./store";
import "./index.css"

import Navbar from "./components/Navbar"
import ModalConductor from './components/ModalConductor'
// import Plant from "./components/Plant";
// import Garden from "./components/Garden";
import Overview from "./components/Overview";

class App extends React.Component {  
  // constructor(props) {
  //   super(props);
  // }

  // componentDidMount() {
    
  // }

  render() {
    return (
      <Provider store={store}>
        <Router>
        <Container>
          <Navbar />
          <Content className="container">
            <ModalConductor />
            <Route exact={true} path="/" component={Overview} />
            {/*
            <Route path="/plant/:plant_id" component={Plant} />
            <Route path="/garden/:garden_id" component={Garden} />
            */}
          </Content>
        </Container>
      </Router>
      </Provider>
    );    
  }
}

const Container = styled.div`
  display: flex;
  flex-flow: row;
`

const Content = styled.div`
  padding: 10px 20px;
  padding-top: 5vh;
  background-color: #fff;
  width: 100%;
  max-height: 100vh;
  overflow: scroll;
  overflow-x: hidden;
`

export default App;
