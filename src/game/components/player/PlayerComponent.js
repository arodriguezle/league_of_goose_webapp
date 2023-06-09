import React, { useEffect, useState } from 'react';
import { getDashboxSize, generateDashboardPositions } from '../../../domain/logics';
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
			// use generateDashboardPositions
			const dashboard_positions = generateDashboardPositions(props.boardSize);
			const newPosition = dashboard_positions[props.position];
			console.log('dashboard_positions', newPosition);

			setPosition({ x: newPosition.left, y: newPosition.top });
			console.log('updating position', props.position)
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