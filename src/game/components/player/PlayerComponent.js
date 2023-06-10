import React, { useEffect, useState } from 'react';
import { getDashboxSize, generateDashboxPositions } from '../../../domain/logics';
import { getImage } from '../../../ImageFactory';
import { IMAGE_ROUTES } from '../../../domain/constants';

const PlayerComponent = (props) => {
	const playerImage = getImage(IMAGE_ROUTES.skins, 'goose_default.gif', { alt: 'player' }).props

	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [skin, setSkin] = useState(playerImage);
	const [size, setSize] = useState(0);

	const name = props.name;

	useEffect(() => {
		if (props.size) {
			// use generateDashboxPositions
			const dashbox_positions = generateDashboxPositions(props.boardSize);
			const newPosition = dashbox_positions[props.position];
			setPosition({ x: newPosition.left, y: newPosition.top });
		}
	}, [props.size, props.position]);

	useEffect(() => {
		if (props.size) {
			setSize(getDashboxSize(props.size))
		}
	}, [props.size]);

	useEffect(() => {
		if (props.skin) {
			const new_skin = getImage(IMAGE_ROUTES.skins, props.skin + '.gif', { alt: 'player' }).props
			setSkin(new_skin);
		}
	}, [props.skin]);

	return (
		<div id={name} position={props.position} className='absolute'
			style={
				{
					width: size,
					height: size,
					backgroundImage: `url("${skin.src}")`,
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					backgroundRepeat: 'no-repeat',
					transition: 'all 0.1s',
					top: position.y + "px",
					left: position.x + "px",
				}
			}>
			<div className="w-full h-full"></div>
			<div className='text-[0.5rem] text-[white] drop-shadow-outline'>{name}</div>
		</div>
	);
};

export default PlayerComponent;