import React from 'react';
import styled from 'styled-components';
import { Provider } from "react-redux";
import { Route, Switch} from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router'
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor, history } from "./store";

import "./index.css"
import "toasted-notes/src/styles.css"; // optional styles

import Navbar from "./components/Navbar"
import Header from "./components/Header"
import ModalConductor from './components/ModalConductor'

import Overview from "./routes/index";
import Recordable from "./routes/recordable";
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
          <ConnectedRouter history={history}>
            <Header />
            <Container>
              <Navbar />
              <Content className="container">
                <ModalConductor />
                <Switch>
                  <Route exact={true} path="/" component={Overview} />
                  <Route path="/plant/:_id" render={(props) => (
                    <Recordable plant key={props.match.params._id} {...props} />
                  )}/>
                  <Route path="/garden/:_id" render={(props) => (
                    <Recordable garden key={props.match.params._id} {...props} />
                  )}/>
                  <Route component={NotFound} />
                </Switch>
              </Content>
            </Container>
          </ConnectedRouter>
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
