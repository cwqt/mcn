import React from 'react';
import './App.css';
import PlantForm from "./components/PlantForm"
import Plants from './components/Plants'


function App() {
  return (
    <div className="App">
      <Plants />
      <hr />
      <PlantForm />
    </div>
  );
}

export default App;
