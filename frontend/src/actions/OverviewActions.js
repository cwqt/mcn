import { OverviewConsts } from "./types";

export const fetchAllPlantsAndGardens = () => dispatch => {
	dispatch({
		type: OverviewConsts.GET_ALL,
		payload: { status:"loading" }
	})

	fetch("/api/")
		.then(res => res.json())
		//dispatch data (plants) to reducer
		.then(res => dispatch({
			type: OverviewConsts.GET_ALL,
			payload: {
				status: "success",
				data: res.data
			}
		})
	);
}
