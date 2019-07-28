import React from 'react';

class PlantForm extends React.Component { 
	constructor(props) {
		super(props);
		this.state = {
			plant_name: ""
		};
	}

	onChange = (e) => {
		this.setState({[e.target.name]: e.target.value})
	}

	onSubmit = (e) => {
		e.preventDefault();

		const payload = {
			name: this.state.plant_name
		}

		fetch("/plants/", {
			method: "POST",
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
		.then(res => res.json())
		.then(data => console.log(data))
	}

  render() {
    return (
    	<div className="plants">
    		<h1> Add plant </h1>
    		<form onSubmit={this.onSubmit}>
    			<label>plant_name</label>
    			<input
    				type="text"
    				name="plant_name"
    				onChange={this.onChange}
    				value={this.state.plant_name}
    			/>
    			<br />
    			<button type="submit">Submit</button>
    		</form>
    	</div>
    );
  }
}

export default PlantForm;
