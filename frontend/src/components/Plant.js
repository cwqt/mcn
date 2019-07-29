import React from 'react';
import PropTypes from "prop-types";
//connects component to redux provider store
import { connect } from "react-redux";
import { deletePlant } from "../actions/PlantActions.js"
import { Line } from "react-chartjs-2"
import _ from 'lodash';
import styled from 'styled-components';
import { lighten } from "polished";

const PlantContainer = styled.div`
  display: flex;
  margin: 10px 0;
  height: 300px;
  div:nth-child(2) {
    flex: 1;
    h2 {
      margin: 0;
    }
  }
  div:nth-child(1) {
    width: 300px;
    margin-right: 20px;
    overflow: hidden;
    img {
      height: 100%;
      border-radius: 4px;
    }
  }
`

const Button = styled.a`
  margin-left: auto;
  background-color: rgba(255,255,255,0.05);
  padding: 10px;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: 0.2s;
  &:hover {
    cursor: pointer;
    background-color: ${lighten(0.03, '#18181b')};
  }
`

const Info = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`

class Plant extends React.Component { 
	onClick = () => {
		this.props.deletePlant(this.props._id)
	}

  render() {
    //1 update every 30 minutes
    //24*2 = 48
    //48*3 = 144 data points for 3 days of history

    //convert unix epoch to Date object
    const converted_time_data = _.takeRight(Object.keys(this.props.moisture_levels), 144)
    for (var i=0; i < converted_time_data.length; i++) {
      converted_time_data[i] = new Date(converted_time_data[i]*1000)
    } 

  	//return last 31 days 
  	const chart_data = {
  		labels: converted_time_data,
  		datasets: [{
  			label: this.props.plant_name,
        borderColor: "#3cba9f",
        backgroundColor: "#3cba9f2f",
        pointBackgroundColor: "#fff",
        pointStyle: "circle",
        pointRadius: 6,
        pointHitRadius: 15,
        pointBorderWidth: 3,
  			data: _.takeRight(Object.values(this.props.moisture_levels), 144),
  		}],
  	}
    const chart_options = {
      legend: {
        display: false          
      },
      scales: {
            xAxes: [{
              type: 'time',
            }],
            yAxes: [{
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 2000
                }
            }]
        }
    }

    // console.log(chart_data.labels)
  	
    return (
    	<PlantContainer>
        <div>
          <img src={this.props.image_url}/>
        </div>
        <div>
          <Info>
    	  		<h2>{this.props.plant_name}</h2>
    	  		<Button onClick={this.onClick}>Delete</Button>
          </Info>
  	  		<Line
            data={chart_data}
            options={chart_options}
            height={120}
            width={400}
          />
        </div>
    	</PlantContainer>
    );
  }
}

Plant.propTypes = {
	deletePlant: PropTypes.func.isRequired
}

export default connect(null, { deletePlant })(Plant);
