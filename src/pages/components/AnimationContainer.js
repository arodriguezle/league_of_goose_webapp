import { getImage } from "../../ImageFactory";
import { IMAGE_ROUTES } from "../../domain/constants";

const AnimationContainer = () => {
	const friendToastImg = getImage(IMAGE_ROUTES.icons, 'new_friend_toast.png', { alt: 'friend_toast' }).props

	return (
		<div id="animation_container" className='absolute w-full h-full'>
			<div id='dice_container' className="hidden absolute w-1/3 z-20 flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<img id="dice_animation_container" alt="dice_animation" />
			</div>
			<div id="new_friend_toast_container" className="w-[20%] h-[15vh] absolute bottom-[10vh] z-20 flex left-[-20%]"
				style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
			>
				<div style={{
					zIndex: '20',
					width: '50%',
					height: '100%',
					backgroundRepeat: 'no-repeat',
					backgroundPosition: 'center center',
					backgroundSize: 'contain',
					backgroundImage: `url(${friendToastImg.src})`,
				}}>
				</div>
				<div className="w-1/2 pl-1/2 text-white text-[8px] self-center font-bold">
					YOU MADE A NEW FRIEND!
				</div>
			</div>
			<div id="toast_effect_container" className="w-[20%] h-[15vh] absolute bottom-[10vh] z-20 flex right-0 hidden"
				style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
			>
				<div id="toast_effect_img" className="pr-2"></div>
				<div id="toast_effect_text" className="w-1/2 pl-1/2 text-white text-[8px] self-center font-bold">
				</div>
			</div>
		</div >
	)
}
export default AnimationContainer;