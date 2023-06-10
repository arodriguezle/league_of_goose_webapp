
import React, { useState, useEffect } from 'react'
import Dashbox from './Dashbox'
import { getImage } from '../../ImageFactory';
import { IMAGE_ROUTES } from '../../domain/constants';

const DashboxCollection = props => {
	const [positions, setPositions] = useState([])
	const [dashboxs, setDashboxs] = useState([])
	useEffect(() => {
		if (props.board) {
			setDashboxs(props.board.dashboxs)
			setPositions(props.board.positions)
		}
	}, [props])

	return (
		<>
			{
				dashboxs.map((_dashbox, index) => {
					const new_dashbox = getImage(IMAGE_ROUTES.dashboxs, _dashbox.src, { width: 'w-full', height: 'w-full', alt: 'board' }).props
					return <Dashbox key={index} index={index} positions={positions[index]} src={new_dashbox.src} size={props.size} value={_dashbox.value} />
				})
			}
		</>
	)
}

export default DashboxCollection