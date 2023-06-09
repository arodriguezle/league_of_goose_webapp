
import React, { useState, useEffect } from 'react'
import Dashbox from './Dashbox'
import { getImage } from '../../ImageFactory';
import { IMAGE_ROUTES } from '../../domain/constants';

const DashboxCollection = props => {
	const [positions, setPositions] = useState([])
	const [dashboxs, setDashboxs] = useState([])
	useEffect(() => {
		if (props.board) {
			setDashboxs(props.board.dashboxes)
			setPositions(props.board.positions)
		}
	}, [props])

	return (
		<>
			{
				dashboxs.map((dashbox, index) => {
					const dashboard = getImage(IMAGE_ROUTES.dashboxs, dashbox.src, { width: 'w-full', height: 'w-full', alt: 'board' }).props
					return <Dashbox key={index} index={index} positions={positions[index]} src={dashboard.src} size={props.size} value={dashbox.value} />
				})
			}
		</>
	)
}

export default DashboxCollection