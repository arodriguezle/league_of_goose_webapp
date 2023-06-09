import LoginForm from "./components/LoginForm";
import { getImage } from "../ImageFactory";
import { IMAGE_ROUTES } from "../domain/constants";

const Login = () => {
	const bg_image = getImage(IMAGE_ROUTES.backgrounds, 'home_transparent.png').props
	return (<>
		<div className="h-screen w-screen" style={{
			backgroundImage: `url("${bg_image.src}")`,
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundPositionY: 'bottom',
		}}>
			<LoginForm />
		</div>
	</>
	);
}

export default Login;
