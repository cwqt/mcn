import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createRecordable } from "../../actions/RecordableActions";

class CreateRecordableForm extends React.Component { 
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      image: "",
      plant_count: 0,
      type: ""
    };
  }

  componentDidMount() {
    this.setState({type: this.props.plant ? "plant" : "garden"})
  }

  onChange = (e) => {
    this.setState({[e.target.name]: e.target.value})
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.createRecordable({...this.state})
  }

 render() {
  return (
    <div>
      <h1> Add {this.state.type} </h1>
      <hr />

      <form onSubmit={this.onSubmit}>
        <label>name</label>
        <input
          type="text"
          name="name"
          placeholder={this.state.type + "s cool name"}
          onChange={this.onChange}
          value={this.state.plant_name}
        />
        <br />
        <br />
        <label>image</label>
        <input
          type="text"
          name="image"
          placeholder="https://url.com/image.jpg"
          onChange={this.onChange}
          value={this.state.image}
        />

        {this.props.garden &&
          <div>
            <br />
            <label>plants</label>
            <input
              type="number"
              name="plant_count"
              onChange={this.onChange}
              min="0"
              value={this.state.plant_count}
            />
          </div>
        }

        <br />
        <br />
        <button type="submit">Submit</button>
        <span>&nbsp;&nbsp;{this.props.message}</span>
      </form>
    </div>
  );
 }
}

CreateRecordableForm.propTypes = {
  createRecordable: PropTypes.func.isRequired,
}

const MapStateToProps = store => ({
  token: store.auth.currentToken,
  message: store.recordable.message
});

export default connect(MapStateToProps, { createRecordable })(CreateRecordableForm);
