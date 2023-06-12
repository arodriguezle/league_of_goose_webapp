import { Link } from "react-router-dom";
import { getImage } from "../ImageFactory";
import { IMAGE_ROUTES } from "../domain/constants";

const Shop = () => {
	const bg_image = getImage(IMAGE_ROUTES.backgrounds, 'home_transparent.png').props

	return <div className='relative w-screen h-screen align-webkit-center' style={{
		backgroundImage: `url("${bg_image.src}")`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	}}>
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
			<div className="text-white text-xl">COMING SOON</div>
			<Link className="text-white border border-white rounded-full px-2 py-1" to="/">Home</Link>
		</div>
	</div>;
};

export default Shop;