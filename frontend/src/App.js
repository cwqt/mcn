import React from 'react';
import styled from 'styled-components';
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from "./store";

import "./index.css"

import Navbar from "./components/Navbar"
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
            <Container>
              <Navbar />
              <Content className="container">
                <ModalConductor />
                <Switch>
                  <Route exact={true} path="/" component={Overview} />
                  <Route path="/plant/:plant_id" component={Plant} />
                  <Route path="/garden/:garden_id" component={Garden} />
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
  padding: 10px 20px;
  padding-top: 5vh;
  background-color: #fff;
  width: 100%;
  max-height: 100vh;
  overflow: scroll;
  overflow-x: hidden;
`

export default App;
