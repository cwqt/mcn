import { AUTH_USER } from "./types";

export const authUser = token => dispatch => {
	fetch("/api/auth/", {
			headers: new Headers({
				'Content-Type': "application/json",
				'AUTH_TOKEN': token
			})
		})
		.then(res => Promise.all([res.status, res.json()]))
		.then(([status, data]) => {
			var payload = {
				isAuthorised: status !== 200 ? false : true,
				token: token,
				response: data.message || "200"
			}
			dispatch({
					type: AUTH_USER,
					payload: payload,
			})	
	});
}

