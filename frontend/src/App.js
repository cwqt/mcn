import React from 'react';
import './App.css';
import PlantForm from "./components/PlantForm";
import Plants from './components/Plants';
import { Provider } from "react-redux";
import store from "./store";

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Plants />
          <hr />
          <PlantForm />
        </div>
      </Provider>
    );    
  }
}

export default App;
