import React from 'react';
import styled from 'styled-components';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from "./store";

import "./index.css"

import Navbar from "./components/Navbar"
import Header from "./components/Header"
import ModalConductor from './components/ModalConductor'

import Overview from "./routes/index";
import Plant from "./routes/plant";
import Garden from "./routes/garden";
import NotFound from "./routes/404";

class App extends React.Component {  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router>
            <Header />
            <Container>
              <Navbar />
              <Content className="container">
                <ModalConductor />
                <Switch>
                  <Route exact={true} path="/" component={Overview} />
                  <Route path="/plant/:plant_id" render={(props) => (
                    <Plant key={props.match.params.plant_id} {...props} />
                  )}/>
                  <Route path="/garden/:garden_id" render={(props) => (
                    <Garden key={props.match.params.garden_id} {...props} />
                  )}/>
                  <Route component={NotFound} />
                </Switch>
              </Content>
            </Container>
          </Router>
        </PersistGate>
      </Provider>
    );    
  }
}

const Container = styled.div`
  display: flex;
  flex-flow: row;
`

const Content = styled.div`
  padding: 10px;
  padding-top: 5vh;
  padding-bottom: 15vh;
  width: 100%;
  max-height: 100vh;
  overflow: scroll;
  overflow-x: hidden;
`

export default App;
