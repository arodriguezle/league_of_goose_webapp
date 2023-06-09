import { getImage } from "../ImageFactory";
import { IMAGE_ROUTES } from "../domain/constants";
import RegisterForm from "./components/RegisterForm";

const Register = () => {
	const bg_image = getImage(IMAGE_ROUTES.backgrounds, 'home_transparent.png').props
	return (
		<div className="h-screen w-screen" style={{
			backgroundImage: `url("${bg_image.src}")`,
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundPositionY: 'bottom',
		}}>
			<RegisterForm />
		</div>
	);
}

export default Register;
