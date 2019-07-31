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
  .chartjs {
    flex: 1;
    h2 {
      margin: 0;
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

const PlantImage = styled.div`
  width: 300px;
  margin-right: 20px;
  overflow: hidden;
  background: ${props => `url(${props.img})`};
  background-size: cover;
  background-position: center center;
  border-radius: 4px;
`

class Plant extends React.Component { 
	onClick = () => {
		this.props.deletePlant(this.props._id)
	}

  render() {
    //1 update every 30 minutes, get last 3 days of updates = 144 data points
    //epoch = {moisture_level, temperature}

    const converted_time_data = _.takeRight(Object.keys(this.props.updates), 144)
    for (var i=0; i < converted_time_data.length; i++) {
      //convert unix epoch to Date object
      converted_time_data[i] = new Date(converted_time_data[i]*1000)
    } 

    const updates = Object.values(this.props.updates)
    //return list with [n]th value in each sublist, updates[0][1], updates[1][1] etc.
    const moisture_levels    = _.takeRight(_.map(updates, e => e[0]), 144);
    const temperature_levels = _.takeRight(_.map(updates, e => e[1]), 144);

  	const chart_data = {
  		labels: converted_time_data,
  		datasets: [{
  			label: "Moisture Level",
        borderColor: "#3cba9f",
        backgroundColor: "#3cba9f2f",
        pointBackgroundColor: "#fff",
        pointStyle: "circle",
        pointRadius: 6,
        pointHitRadius: 15,
        pointBorderWidth: 3,
  			data: moisture_levels,
        yAxisID: "A"
  		},
      {
        label: "Temperature",
        borderColor: "#FFA500",
        backgroundColor: "#FFA5002f",
        pointBackgroundColor: "#fff",
        pointStyle: "circle",
        pointRadius: 6,
        pointHitRadius: 15,
        pointBorderWidth: 3,
        data: temperature_levels,
        yAxisID: "B"
      }],
  	}
    const chart_options = {
      scales: {
            xAxes: [{
              type: 'time',
            }],
            yAxes: [{
              id: "A",
              ticks: {
                    min: 0,
                    max: 2000
                }
            },
            {
              id: "B",
              position: "right",
              ticks: {
                    min: 0,
                    max: 30
                }

            }]
        }
    }

    // console.log(chart_data.labels)
  	
    return (
    	<PlantContainer>
        <PlantImage img={this.props.image_url}/>
        <div className="chartjs">
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
