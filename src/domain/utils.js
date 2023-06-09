import axios from "axios";
import { AXIOS_DEFAULT_HEADERS } from "./constants";

export async function getData(url, headers = AXIOS_DEFAULT_HEADERS) {
	return axios.get(url, {
		headers: headers,
		withCredentials: true,
	}).then((response) => {
		return response
	}).catch(function (error) {
		return error
	});
}

export async function postData(url, body, headers = AXIOS_DEFAULT_HEADERS) {
	return axios.post(url, body, {
		headers: headers,
		withCredentials: true,
	}).then((response) => {
		return response
	}).catch(function (error) {
		return error
	});
}