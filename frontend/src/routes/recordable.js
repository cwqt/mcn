import React 				from 'react';
import styled 			from 'styled-components';
import { connect } 	from "react-redux";
import { Line } 		from 'react-chartjs-2';
import { Link } 		from "react-router-dom";
import PropTypes 		from "prop-types";
import moment 			from "moment";

import Image 				from "../components/OverviewComponents/Image";
import ModalButton 	from "../components/modals/ModalButton";
import { getSelf } 	from "../actions/PageActions"


const ChartsContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	& > div:nth-child(odd) {
		margin-right: 10px;
		width: calc(50% - 10px);
	}
	& > div:nth-child(even) {
		margin-left: 10px;
		width: calc(50% - 10px);
	}
`

const ChartItem = styled.div`
	background-color: white;
	padding: 20px;
	border-radius: 20px;
	margin-bottom: 20px;
`

const InfoSection = styled.div`
	display: flex;
	background: white;
	padding: 20px;
	border-radius: 20px;
	& > div:first-child {
		margin-right: 20px;
		width: 30%;
		overflow: hidden;
		img {
			object-fit: scale-down;
		}
	}
	& > div:last-child {
		width: 70%;
		.flex {
			display: flex;
			div:last-child {
				margin-left: 20px;
			}
		}

	}
	.content {
		position: relative;
		.modal_buttons {
			position: absolute;
			right: 0;
			top: 0;
			a {
				margin-left: 10px;
			}
		}
	}
`

class RecordableRoute extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			measurements: {}
		}
	}

	componentDidMount() {
		this.props.getSelf(this.props.match.params._id)
		this.getMeasurements(this.props.self.plant ? "plant" : "garden")
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps)
		this.getMeasurements(nextProps.plant ? "plant" : "garden")
	}

	getMeasurements(type) {
		//api returns object with object `measurements`
		//convert into sorted list with mapping, sorted = [
			// measurement_type = {timestamp: value, timestamp:value ...}
			// "  "
		// ] for use with chart.js graphs

		fetch(`/api/${type}s/${this.props.match.params._id}/measurements?last=100`)
			.then(res => res.json())
			.then(data => {
				if(!data.data) {
					data.data = [{measurements:{}}]
				}

				var sorted = {};
				//use first obj to set keys
				Object.keys(data.data[0].measurements).forEach(key => sorted[key] = {})

				// map onto sorted
				data.data.forEach(doc => {
					for(const [type, value] of Object.entries(doc.measurements)) {
						sorted[type][doc.timestamp] = value;
					}
				})

				this.setState({measurements: sorted})
			})
	}

	generateChart(data_type, idx) {
		const data = {
			labels: Object.keys(this.state.measurements[data_type]).map(x => new Date(x * 1000)),
			datasets: [{
				data: Object.values(this.state.measurements[data_type]),
				label: data_type,
			}]
		}
		const options = {
			scales: {
				xAxes: [{
          type: 'time',
          ticks: {
	          scaleLabel: {
	            display: true,
	            labelString: 'Date',
	          },
          }
				}]
			}
		}

		return <Line data={data} options={options} key={idx} height={125}/>
	}

	render() {
		if (Object.keys(this.props.self).length == 0) {
			return (
				<InfoSection>
					<div>
					<h1>Error</h1>
					<hr />
					<p>{this.props.message}</p>
					</div>
				</InfoSection>
			)			
		}

		return (
			<div>
				<InfoSection>
					<div>
						<Image src={this.props.self.image} />
					</div>

					<div className="content">
						<div className="modal_buttons">
							<ModalButton openModal="EDIT_RECORDABLE" desc="Edit" icon="edit" requiresAuth/>
							<ModalButton openModal="DELETE_RECORDABLE" desc={"Delete "+this.props.self.type} icon="delete" requiresAuth/>
						</div>

						<h1>{this.props.self._id} </h1>
						<p>
							<i>{this.props.self.name}</i> &mdash;&nbsp;
							<b>Created:</b> {moment.unix(this.props.self.created_at).fromNow()},
							<b>&nbsp;Last updated:</b> {moment.unix(this.props.self.most_recent.timestamp).fromNow()}
						</p>
						<hr />

						<div className="flex">
							<div>
								<table>
									<thead>
										<tr>
											<th>measurement</th>
											<th>current value</th>
											<th>average value</th>
										</tr>
									</thead>
									<tbody>
										{
											Object.keys(this.state.measurements).map((type, idx) => {
												const arr = this.state.measurements[type];
												const arrLen = Object.values(arr).length;

												const currentValue 	= Object.values(arr)[arrLen - 1];
												const sum = Object.values(arr).reduce((a, b) => a + b, 0);
												const avg = Math.round((sum / arrLen)) || 0;

												return <tr key={idx}><td>{type}</td><td>{currentValue}</td><td>{avg}</td></tr>
											})
										}
									</tbody>
								</table>
							</div>

							{this.props.garden &&
								<div>
									<p><i>{this.props.self.name}</i> has <b>{(this.props.self.plants || []).length}</b> plants.</p>
									<ul>
											{(this.props.self.plants || []).map(plant => {
												return <li>{plant._id}</li>
											})}
									</ul>
								</div>
							}
						</div>					
					</div>
				</InfoSection>


				<br />
				<ChartsContainer>
					{Object.keys(this.state.measurements) !== 0 &&
						Object.keys(this.state.measurements).map((data_type, idx) => {
							return <ChartItem key={idx}>{this.generateChart(data_type, idx)}</ChartItem>;
						})
					}
				</ChartsContainer>
			</div>
		)
	}
} 

RecordableRoute.propTypes = {
   getSelf: PropTypes.func.isRequired,
}

const MapStateToProps = store => ({
	 self: store.page.self,
	 message: store.page.message
})

export default connect(MapStateToProps, { getSelf })(RecordableRoute);