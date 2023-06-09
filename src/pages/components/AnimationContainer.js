const AnimationContainer = () => {
	return (
		<div id="animation_container" className='absolute w-full h-full'>
			<div id='dice_container' className="hidden absolute w-1/3 z-20 flex justify-center items-center top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
				<img id="dice_animation_container" alt="dice_animation" />
			</div>
		</div>
	)
}
export default AnimationContainer;