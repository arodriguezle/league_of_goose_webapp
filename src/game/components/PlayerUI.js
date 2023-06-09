import { getImage } from "../../ImageFactory"
import { IMAGE_ROUTES, getSpecialDicesDescriptionByName, getSpecialDicesNicenameByName } from "../../domain/constants"
import { useEffect, useState } from "react"
import { SocketController } from "../../domain/socket_controller"
import { getDiceNameByIndex, throwDiceAndGetValue } from "../../domain/logics"
import { AnimationController } from "../animation_controller"
const PlayerUI = (props) => {
	const { playersAssets, playersPositions, setPlayersPositions } = props

	const sides_bg_image = getImage(IMAGE_ROUTES.backgrounds, 'ui_sides.png', { alt: 'background' }).props
	const center_bg_image = getImage(IMAGE_ROUTES.backgrounds, 'dice_selector.png', { alt: 'background' }).props
	const arrow = getImage(IMAGE_ROUTES.icons, 'dice_arrow.png', { alt: 'border' }).props
	const dice = getImage(IMAGE_ROUTES.dices_results, 'dice_default-1.png', { alt: 'border' }).props
	const [selectedDice, setSelectedDice] = useState(1)
	const [gameState, setGameState] = useState(null)


	const movePlayerCallback = (player_name, position, newPosition) => {
		const updatedPlayersPositions = { ...playersPositions }
		updatedPlayersPositions[player_name] = position
		console.log('updatedPlayersPositions', updatedPlayersPositions)
		setPlayersPositions(updatedPlayersPositions)
	}

	const compareStates = (prev, next) => {
		// check player postion changes
		if (prev && next && prev.players_positions && next.players_positions) {
			console.log('compare player positions')
			console.log('prev.players_positions', prev.players_positions)
			console.log('next.players_positions', next.players_positions)

			Object.keys(prev.players_positions).forEach((player_name) => {
				console.log('player_name', player_name)
				console.log('prev.players_positions[player_name] !== next.players_positions[player_name]', prev.players_positions[player_name] !== next.players_positions[player_name])
				if (prev.players_positions[player_name] !== next.players_positions[player_name]) {
					// player position changed
					setTimeout(() => {
						console.log('player position changed', next.players_positions, next.players_positions[player_name])
						AnimationController.movePlayerAnimation(player_name, prev.players_positions[player_name], next.players_positions[player_name], movePlayerCallback)
					}, 3000)
				}
			})
		}
	}

	const throwDiceHandler = () => {
		const value = throwDiceAndGetValue(getDiceNameByIndex(selectedDice))
		SocketController.emit('send_throw_dice', value)
		SocketController.on('game_update', (data) => {
			if (!gameState) {
				compareStates(data.game_state, data.game_state)
			} else {
				compareStates(gameState, data.game_state)
			}
			setGameState(data.game_state)
		})
	}

	const selectDiceHandler = (inc) => {
		let new_value = -1
		// swap dice between 0 and 2
		if (selectedDice === 0 && inc === -1) {
			new_value = 2
		} else if (selectedDice === 2 && inc === 1) {
			new_value = 0
		} else {
			new_value = selectedDice + inc
		}

		setSelectedDice(new_value)
	}

	useEffect(() => {
		// prepare socket listeners
		if (SocketController.socket) {
			SocketController.emit('get_game_state', true)
			SocketController.on('get_game_state', (data) => {
				console.log('get_game_state', data)
				if (!gameState)
					setGameState(data.game_state)
			})
			SocketController.on('throw_dice', (data) => {
				if (data.result) {
					console.log('game_move', data)
					const player_name = SocketController.player.username
					if (playersAssets && playersAssets[player_name] && playersAssets[player_name].diceSkin && false) {
						AnimationController.throwDiceAnimation(data.player_in_turn, playersAssets[player_name].diceSkin, data.result)
					} else {
						AnimationController.throwDiceAnimation(data.player_in_turn, 'dice_froggy', data.result)
					}
				}
			})
		}
	}, [SocketController.socket])


	return (
		<>
			<div className="absolute w-[37%] h-[10%] bottom-0 left-0"
				style={{
					backgroundImage: `url("${sides_bg_image.src}")`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}>
			</div>

			<div className="absolute w-[26%] h-[10%] bottom-0 left-[37%] flex"
				style={{
					backgroundImage: `url("${center_bg_image.src}")`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'contain',
					backgroundPosition: 'center',
				}}>

				<div className="flex justify-end items-center h-full w-1/3">
					<div className="z-10 aspect-square flex justify-center quick_grow_button" style={{
						backgroundImage: `url("${arrow.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						height: '100%',
						// flip
						transform: 'scaleX(-1)',
					}}
						onClick={() => selectDiceHandler(-1)}>
					</div>
				</div>

				<div className="flex justify-center items-center h-full w-1/3">
					<div id="throw_dice_button" className="z-10 rounded-full h-full aspect-square flex justify-center items-center"
						style={{
							backgroundImage: `url("${dice.src}")`,
							backgroundRepeat: 'no-repeat',
							backgroundSize: 'cover',
							backgroundPosition: 'center',
						}}
						onClick={() => throwDiceHandler()}>
					</div>
					{/* show dice name and desctription */}
					{/* remove mt */}
					<div className="absolute w-[100%] h-[100%] flex justify-center items-center mt-[-25%]">
						<div className="flex flex-col justify-center items-center">
							<div className="text-white text-center text-sm font-bold">
								{getSpecialDicesNicenameByName(getDiceNameByIndex(selectedDice))}
							</div>
							<div className="text-white text-center text-xs">
								{getSpecialDicesDescriptionByName(getDiceNameByIndex(selectedDice))}
							</div>
						</div>
					</div>
				</div>

				<div className="flex justify-start items-center h-full w-1/3">
					<div className="z-10 aspect-square flex justify-center quick_grow_button" style={{
						backgroundImage: `url("${arrow.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
						height: '100%',
					}}
						onClick={() => selectDiceHandler(+1)}>
					</div>
				</div>
			</div>

			<div className="absolute w-[37%] h-[10%] bottom-0 right-0"
				style={{
					backgroundImage: `url("${sides_bg_image.src}")`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}>
			</div>
		</>
	)
}

export default PlayerUI
