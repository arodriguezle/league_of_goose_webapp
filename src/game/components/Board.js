
import React, { useState, useEffect } from 'react'
import { getImage } from '../../ImageFactory';
import DashboxCollection from './DashboxCollection';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import PlayerComponent from './player/PlayerComponent';
import { IMAGE_ROUTES } from '../../domain/constants';
import { SocketController } from '../../domain/socket_controller';
import PlayerUI from './PlayerUI';
import { generateDashboxPositions, generateDefaultRandomSeed, generateBoardDashboxs } from '../../domain/logics'
import { Button } from '@material-tailwind/react';

const Board = props => {
	const background = getImage(IMAGE_ROUTES.maps, 'map_default.png', { alt: 'board' }).props
	const bg_image_transparent = getImage(IMAGE_ROUTES.backgrounds, 'home_transparent.png').props
	const [socket, setSocket] = useState(null);
	const boardRef = React.useRef(null)
	const [boardWidth, setBoardWidth] = React.useState(0)
	const [boardHeight, setBoardHeight] = React.useState(0)
	const [board, setBoard] = useState(null);

	const [screenMSG, setScreenMSG] = useState(<div className='fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center  bg-[rgb(0,0,0,0.5)]'>
		<div className='text-white'>Loading...</div>
	</div>);

	const [playersAssets, setPlayersAssets] = useState({});
	const [playersPositions, setPlayersPositions] = useState({})

	useEffect(() => {
		const width = boardRef.current.getBoundingClientRect().width;
		const height = boardRef.current.getBoundingClientRect().height;
		setBoardWidth(width);
		setBoardHeight(height);
	}, [boardRef]);

	useEffect(() => {
		SocketController.join(setSocket)
		setTimeout(() => {
			setScreenMSG(<div className='fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center  bg-[rgb(0,0,0,0.5)]'>
				<div className='text-white'>THIS ROOM NO LONGER EXISTS OR IS NOT READY YET!</div>
				<Button className='w-32 mt-6' color="blue" onClick={() => window.location.reload()}>REFRESH</Button>
				<Button className='w-32 mt-6' color="blue" onClick={() => window.location.href = '/hub'}>HUB</Button>
				<Button className='w-32 mt-6' color="blue" onClick={() => window.location.href = '/home'}>HOME</Button>
			</div>)
		}, 3000)
	}, []);

	useEffect(() => {
		if (socket) {
			SocketController.on("room_state", (data) => {
				console.log(data.room_state.game_state)
				if (Object.keys(data.room_state.game_state.players_positions).length > 0) {
					setPlayersPositions(data.room_state.game_state.players_positions)
				}
				let seed = ''
				if (data.room_state.waiting && boardHeight && boardWidth) {
					seed = generateDefaultRandomSeed(63)
					SocketController.emit("save_seed", seed)
				} else {
					seed = data.room_state.game_state.seed
				}
				const dashboxs = generateBoardDashboxs(seed)
				const size = { width: boardWidth, height: boardHeight }
				const positions = generateDashboxPositions(size)
				setBoard({ dashboxs: dashboxs, positions: positions })
				setPlayersAssets(data.room_state.game_state.players_assets)
				// check for a new player
				console.log(playersAssets)
				console.log('->')
				console.log(data.room_state.game_state.players_assets)
				if (Object.keys(playersAssets).length > 0 && Object.keys(playersAssets).length < Object.keys(data.room_state.game_state.players_assets).length) {
					// refresh the board
					window.location.reload()
				}
			});
		}
	}, [socket]);


	return (<>
		<div id="board" style={{
			backgroundImage: `url("${bg_image_transparent.src}")`,
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
			backgroundPosition: 'top center',
		}}>
			<TransformWrapper
				initialScale={1}
				initialPositionX={0}
				initialPositionY={0}
			>
				{({ zoomIn, zoomOut, resetTransform, ...rest }) => (
					<React.Fragment>
						<TransformComponent>
							<div className="aspect-video h-screen">
								<div id="board" ref={boardRef} className='w-full h-full relative'
									style={{
										backgroundImage: `url("${background.src}")`,
										backgroundRepeat: 'no-repeat',
										backgroundSize: 'contain',
										backgroundPosition: 'top center',
									}}></div>
								{Object.keys(playersPositions).length > 0 && <DashboxCollection board={board} size={{ width: boardWidth, height: boardHeight }} />}
								{playersPositions && Object.keys(playersPositions).map((key, index) => {
									const key_position = playersAssets[key]
									let player_position = playersPositions[key]
									if (player_position < 0) {
										player_position = 0
									}
									let goose_skin = 'goose_default'
									if (key_position) {
										goose_skin = key_position.gooseSkin
									}
									return <PlayerComponent boardSize={{ height: boardHeight, width: boardWidth }} skin={goose_skin} key={index} name={key} size={{ width: boardWidth, height: boardHeight - 20 }} position={player_position}></PlayerComponent>
								})}
								{Object.keys(playersPositions).length <= 0 && screenMSG}
							</div>
						</TransformComponent>
					</React.Fragment>
				)}
			</TransformWrapper>
		</div>
		{Object.keys(playersPositions).length > 0 &&
			<PlayerUI board={board} playersPositions={playersPositions} setPlayersPositions={setPlayersPositions} playersAssets={playersAssets} setPlayersAssets={setPlayersAssets} />
		}
	</>)
}

export default Board