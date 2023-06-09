import io from "socket.io-client";
import { getData } from "./utils";
import { USE_API_ENDPOINT, API_ENDPOINTS } from "./api";
export class SocketController {
	static socket = null;
	static player = null;
	static setSocket(socket) {
		this.socket = socket
	}

	static async getSocket() {
		return this.socket
	}

	static on(event, callback) {
		this.socket.on(event, callback)
	}

	static emit(event, data) {
		this.socket.emit(event, data)
	}

	static join(setSocket_callback, setPlayer_callback = null) {
		const socket = io(process.env.REACT_APP_NODE_HOST, {
			transports: ["websocket"],
			cors: {
				origin: process.env.REACT_APP_DOMAIN,
			},
		});
		socket.on("connect", (data) => {
			getData(USE_API_ENDPOINT(API_ENDPOINTS.get) + "/myself", null).then((response) => {
				SocketController.setSocket(socket);
				SocketController.emit("login", response.data)
				setSocket_callback(socket)
				if (setPlayer_callback) {
					setPlayer_callback(response.data)
				}
				this.player = response.data
			})
		})
	}
}