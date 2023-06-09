import { getImage } from "../ImageFactory";
import { IMAGE_ROUTES } from "../domain/constants";

const Home = () => {
	const bg_image = getImage(IMAGE_ROUTES.backgrounds, 'home.png').props
	const play_button = getImage(IMAGE_ROUTES.backgrounds, 'play_button.png').props
	const login_button = getImage(IMAGE_ROUTES.backgrounds, 'login_button.png').props
	const register_button = getImage(IMAGE_ROUTES.backgrounds, 'register_button.png').props
	const shop_button = getImage(IMAGE_ROUTES.backgrounds, 'shop_button.png').props
	const logo = getImage(IMAGE_ROUTES.leagueofgoose, 'logo.png').props

	return <div className="h-screen w-screen">
		<div className='w-full h-full relative'
			style={{
				backgroundImage: `url("${bg_image.src}")`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
				backgroundPositionY: 'bottom',
			}}>
			<div className="absolute top-0 left-0 right-0 mx-auto text-center h-1/3" onClick={() => { window.location.href = "/" }}
				style={{
					backgroundImage: `url("${logo.src}")`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'contain',
					backgroundPosition: 'center',
				}}>
			</div>
			<div className="absolute flex top-1/3 w-full h-1/3 h-1/6">
				<div className="absolute left-0 right-0 mx-auto text-center h-12 lg:h-24 w-full" onClick={() => { window.location.href = "/hub" }}
					style={{
						backgroundImage: `url("${play_button.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
				</div>
			</div>

			<div className="absolute flex top-1/2 w-full">
				<div className="absolute left-0 right-0 mx-auto text-center h-12 lg:h-24 w-full" onClick={() => { window.location.href = "/shop" }}
					style={{
						backgroundImage: `url("${shop_button.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
				</div>
			</div>
			<div className="absolute flex top-2/3 w-full h-1/3 h-1/6">
				<div className="relative left-0 right-0 mx-auto text-center h-12 lg:h-24 w-full" onClick={() => { window.location.href = "/login" }}
					style={{
						backgroundImage: `url("${login_button.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
				</div>
				<div className="relative left-0 right-0 mx-auto text-center h-12 lg:h-24 w-full" onClick={() => { window.location.href = "/register" }}
					style={{
						backgroundImage: `url("${register_button.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
				</div>
			</div>
		</div>
	</div>;
};

export default Home;