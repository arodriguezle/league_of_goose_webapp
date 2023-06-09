import { getImage } from "../../ImageFactory";
import { IMAGE_ROUTES } from "../../domain/constants";

const SkinSlide = (props) => {
	let image = null
	if (props.is_dice) {
		image = getImage(IMAGE_ROUTES.dice_portraits, `${props.skin}.png`, { alt: `dice-${props.skin}` }).props
	} else {
		image = getImage(IMAGE_ROUTES.portraits, `${props.skin}.png`, { alt: `portrait-${props.skin}` }).props
	}

	const bg_image = getImage(IMAGE_ROUTES.backgrounds, 'dice_selector.png', { alt: 'background' }).props

	const cleanSkinName = (skin) => {
		if (typeof skin !== 'string') return skin
		return skin.replace('_', ' ')
	}

	return (
		<div className='flex flex-col justify-center items-center'>
			<div className='text-xl h-[40vh] w-full'
				style={
					{
						backgroundImage: `url("${bg_image.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}
				}>
				<div className={`relative text-center w-full h-full`}
					style={{
						backgroundImage: `url("${image.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						backgroundPositionY: 'bottom',
					}}
				></div>
			</div>
			<div className='text-2xl uppercase font-bold text-white'>{cleanSkinName(props.skin)}</div>
		</div>
	);
};
export default SkinSlide;
