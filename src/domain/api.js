export const API_ENDPOINTS = {
	register: '/register',
	login: '/login',
	get: '/get',
	buy: '/buy',
	// this should go on the nodejs server
	updateInventory: '/updateInventory',
}

export function USE_API_ENDPOINT(endpoint) {
	return process.env.REACT_APP_API_HOST + process.env.REACT_APP_API_PREFIX + endpoint
}