import {
	Card,
	Input,
	Button,
	Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { API_ENDPOINTS, USE_API_ENDPOINT } from "../../domain/api";
import { postData } from "../../domain/utils";
import { useState } from "react";
import { SocketController } from "../../domain/socket_controller";

const LoginForm = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')

	async function handleSubmit(event) {
		event.preventDefault();
		setErrorMsg("");
		if (!email || !password) {
			setErrorMsg("You need to fill all fields");
			return;
		}
		const bodyFormData = new FormData();
		bodyFormData.append('email', email);
		bodyFormData.append('password', password);
		const response = await postData(USE_API_ENDPOINT(API_ENDPOINTS.login), bodyFormData, { 'Content-Type': 'multipart/form-data' })
		if (response.status === 200) {
			setSuccessMsg("You have successfully logged in!");
			SocketController.join()
			setTimeout(() => {
				window.location.href = "/";
			}, 1500);
		} else if (response.response.status === 401) {
			setErrorMsg("Wrong email or password");
		} else {
			setErrorMsg("Something went wrong");
		}
	}

	return <Card color="transparent" shadow={false} className="items-center">
		<Link className="fixed right-2 bottom-2 text-white border border-white rounded-full px-2 py-1" to="/">Home</Link>
		<Typography variant="h4" color="white">
			Login
		</Typography>
		<Typography color="white" className="mt-1 font-normal">
			Enter your details to login.
		</Typography>
		<form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96" onKeyDown={(event) => { if (event.key === "Enter") handleSubmit(event) }}>
			<div className="mb-4 flex flex-col gap-4">
				<Input className="text-white" size="lg" label="Name" onChange={(new_value) => setEmail(new_value.target.value)} />
				<Input className="text-white" type="password" size="lg" label="Password" onChange={(new_value) => setPassword(new_value.target.value)} />
			</div>
			{(errorMsg && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
				<span className="block sm:inline">{errorMsg}</span>
				<span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setErrorMsg("")}>
					<svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
				</span>
			</div>)}
			{(successMsg && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
				<span className="block sm:inline">{successMsg}</span>
				<span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setSuccessMsg("")}>
					<svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
				</span>
			</div>)}
			<Button className="mt-4" fullWidth onClick={(event) => handleSubmit(event)}>
				Login
			</Button>
			<Typography color="white" className="mt-4 text-center font-normal">
				You don't have an account?{" "}
				<Link to="/register"><Button>Register</Button></Link>
			</Typography>
		</form>
	</Card>
}
export default LoginForm;