export const API_ENDPOINTS = {
	register: '/register',
	login: '/login',
	get: '/get',
	buy: '/buy',
}

export function USE_API_ENDPOINT(endpoint) {
	return process.env.REACT_APP_API_HOST + process.env.REACT_APP_API_PREFIX + endpoint
}