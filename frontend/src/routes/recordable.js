import React 				from 'react';
import styled 			from 'styled-components';
import { connect } 	from "react-redux";
import { Line } 		from 'react-chartjs-2';
import { Link } 		from "react-router-dom";
import PropTypes 		from "prop-types";
import moment 			from "moment";

import Image 				from "../components/OverviewComponents/Image";
import ModalButton 	from "../components/modals/ModalButton";
import { getSelf, getMeasurements } 	from "../actions/PageActions"


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
			width: 100%;
			display: flex;
			div:last-child {
				margin-left: 20px;
			}
		}

	}
	.content {
		position: relative;
		.plant_list {
			ul {
				list-style: none;
				padding-left: 0;
				a {
					text-decoration: none;
					padding: 15px;
					border-radius: 20px;
					color: #333;
					background: #f3f3f3;
					&:hover {
						background: 
					}
					margin-bottom: 5px;
					display: inline-block;
					margin-left: 10px;
					li {
						display: inline;
					}
				}
			}
		}
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
		 
		// this.getMeasurements(this.props.self.plant ? "plant" : "garden")
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps)
		// this.getMeasurements(nextProps.plant ? "plant" : "garden")
	}

	generateChart(data_type, idx) {
		const data = {
			labels: Object.keys(this.props.measurements[data_type]).map(x => new Date(x * 1000)),
			datasets: [{
				data: Object.values(this.props.measurements[data_type]),
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
					<Image src={this.props.self.image} />

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

						{this.props.page.isFetching &&
							<p>Getting data...</p>
						}
						{(this.props.page.isFetching == false && Object.keys(this.props.measurements).length > 0) &&
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
												Object.keys(this.props.measurements).map((type, idx) => {
													const arr = this.props.measurements[type];
													const arrLen = Object.values(arr).length;

													const currentValue 	= Object.values(arr)[arrLen - 1];
													const sum = Object.values(arr).reduce((a, b) => a + b, 0);
													const avg = (sum / arrLen).toFixed(1) || 0;

													return <tr key={idx}><td>{type}</td><td>{currentValue}</td><td>{avg}</td></tr>
												})
											}
										</tbody>
									</table>
								</div>

								{this.props.garden &&
									<div class="plant_list">
										<p><i>{this.props.self.name}</i> has <b>{(this.props.self.plants || []).length}</b> plants.</p>
										<ul>
												{(this.props.self.plants || []).map(plant => {
													return <Link to={"/plant/"+plant._id}><li>{plant._id}</li></Link>
												})}
										</ul>
									</div>
								}
							</div>	
						}

					</div>
				</InfoSection>


				<br />
				<ChartsContainer>
					{Object.keys(this.props.measurements) !== 0 &&
						Object.keys(this.props.measurements).map((data_type, idx) => {
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
   getMeasurements: PropTypes.func.isRequired
}

const MapStateToProps = store => ({
	page: store.page,
	self: store.page.self,
	measurements: store.page.measurements,
	message: store.page.message
})

export default connect(MapStateToProps, { getSelf, getMeasurements })(RecordableRoute);