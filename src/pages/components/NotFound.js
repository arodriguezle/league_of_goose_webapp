import { getImage } from "../../ImageFactory";
import { IMAGE_ROUTES } from "../../domain/constants";

const NotFound = () => {
	const bg_image = getImage(IMAGE_ROUTES.backgrounds, 'home_transparent.png').props
	const not_found = getImage("", 'not_found.png').props
	return (
		<div className="h-screen w-screen" style={{
			backgroundImage: `url("${bg_image.src}")`,
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
			backgroundPosition: 'center',
			backgroundPositionY: 'bottom',
		}}>
			<div className="absolute top-1/4 left-0 right-0 mx-auto text-center h-1/2" onClick={() => { window.location.href = "/" }}
				style={{
					backgroundImage: `url("${not_found.src}")`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'contain',
					backgroundPosition: 'center',
				}}>
				GO BACK HOME
			</div>
		</div>
	);
}

export default NotFound;