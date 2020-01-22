import { OverviewConsts } from "./types";

export const fetchAllPlantsAndGardens = () => dispatch => {
	dispatch({
		type: OverviewConsts.GET_ALL,
		payload: { status:"loading" }
	})

	fetch("/api/")
		.then(res => res.json())
		.then(data => {
			let promises = [];
			Object.values(data.data).forEach(item => {
				promises.push(fetch(`/api/${item.type}s/${item._id}/measurements?last=1`).then(res => res.json()))
			})
			Promise.all(promises).then(most_recent_measurements => {
				most_recent_measurements.forEach((measurement, idx) => {
					data.data[idx].most_recent = measurement.data[0]
				})
				dispatch({
					type: OverviewConsts.GET_ALL,
					payload: {
						status: "success",
						data: data.data
					}
				})
			})
		})
}
