import React from 'react';

class Plants extends React.Component { 
	constructor(props) {
		super(props);
		this.state = {
			plants: []
		};
	}

	componentDidMount() {
		fetch("/plants/")
			.then(res => res.json())
			.then(data => this.setState({plants: data.message}));
	}

  render() {
    return (
    	<div className="plants">
    		<h1> Plants </h1>
		  	{this.state.plants.map(post => (
		  		<div key={post._id.$oid}>{post.plant_name}</div>
		  	))}
    	</div>
    );
  }
}

export default Plants;
