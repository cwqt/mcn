import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createPlant } from "../../actions/PlantActions";

class PlantForm extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {
            plant_name: "",
            show: false
        };
    }

    onChange = (e) => {
        this.setState({[e.target.name]: e.target.value})
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.props.createPlant(this.state.plant_name, this.props.token)
    }

  render() {
    return (
        <div>
            <h1> Add plant </h1>
            <br />
            <form onSubmit={this.onSubmit}>
                <label>plant_name</label>
                <input
                    type="text"
                    name="plant_name"
                    onChange={this.onChange}
                    value={this.state.plant_name}
                />
                <br />
                <br />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
  }
}

PlantForm.propTypes = {
    createPlant: PropTypes.func.isRequired
}

const MapStateToProps = store => ({
    token: store.auth.currentToken
});

export default connect(MapStateToProps, { createPlant })(PlantForm);
