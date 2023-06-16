import { getImage } from "../../ImageFactory"
import { IMAGE_ROUTES, getSpecialDicesDescriptionByName, getSpecialDicesNicenameByName } from "../../domain/constants"
import { useEffect, useState, useRef } from "react"
import { SocketController } from "../../domain/socket_controller"
import { AnimationController } from "../animation_controller"
import { API_ENDPOINTS, USE_API_ENDPOINT } from "../../domain/api"
import { postData } from "../../domain/utils"
const PlayerUI = (props) => {
	const { playersAssets, playersPositions, setPlayersPositions, setPlayersAssets, board } = props

	const sides_bg_image = getImage(IMAGE_ROUTES.backgrounds, 'ui_sides.png', { alt: 'background' }).props
	const center_bg_image = getImage(IMAGE_ROUTES.backgrounds, 'dice_selector.png', { alt: 'background' }).props
	const arrow = getImage(IMAGE_ROUTES.icons, 'dice_arrow.png', { alt: 'border' }).props
	const dice = getImage(IMAGE_ROUTES.icons, 'dice_selector_cube.png', { alt: 'border' }).props
	const [selectedDice, setSelectedDice] = useState(null)
	const [gameState, setGameState] = useState(null)
	const previousState = usePreviousState(gameState);

	const minigoose_default = getImage(IMAGE_ROUTES.minigeese, "goose_default.png", { alt: 'minigoose_default' }).props
	const minigoose_earth = getImage(IMAGE_ROUTES.minigeese, "goose_earth.png", { alt: 'minigoose_earth' }).props
	const minigoose_fire = getImage(IMAGE_ROUTES.minigeese, "goose_fire.png", { alt: 'minigoose_fire' }).props
	const minigoose_water = getImage(IMAGE_ROUTES.minigeese, "goose_water.png", { alt: 'minigoose_water' }).props
	const minigoose_ice = getImage(IMAGE_ROUTES.minigeese, "goose_ice.png", { alt: 'minigoose_ice' }).props
	const minigoose_wind = getImage(IMAGE_ROUTES.minigeese, "goose_wind.png", { alt: 'minigoose_wind' }).props
	const minigoose_plant = getImage(IMAGE_ROUTES.minigeese, "goose_plant.png", { alt: 'minigoose_plant' }).props

	const [player_name, setPlayerName] = useState(null)

	const movePlayerCallback = (player_name, position) => {
		const updatedPlayersPositions = { ...playersPositions }
		updatedPlayersPositions[player_name] = position
		setPlayersPositions(updatedPlayersPositions)
	}

	function usePreviousState(state) {
		const ref = useRef();
		useEffect(() => {
			ref.current = state;
		});
		return ref.current;
	}

	const compareStates = (prev, next, open_dashbox) => {
		// check player postion changes
		if (prev && next && prev.players_positions && next.players_positions) {
			let moved = false;
			Object.keys(prev.players_positions).forEach((player_name) => {
				if (prev.players_positions[player_name] !== next.players_positions[player_name]) {
					// player position changed
					if (open_dashbox && !moved) {
						const dashbox = board.dashboxs[next.players_positions[player_name]]
						if (dashbox) {
							AnimationController.showEffectToast(player_name, dashbox)
							moved = true;
						}
					}
					AnimationController.movePlayerAnimation(player_name, prev.players_positions[player_name], next.players_positions[player_name], movePlayerCallback)
				}
			})
		}

		if (prev && next && prev.players_assets && next.players_assets) {
			// check new default goose in inventory
			if (prev.players_assets[player_name] && next.players_assets[player_name] && prev.players_assets[player_name].inventory.default < next.players_assets[player_name].inventory.default) {
				AnimationController.showFriendToast()
			}
			// check the dices 
			if (next.players_assets[player_name] && next.players_assets[player_name].dices && next.players_assets[player_name].dices.length > 0) {
				setSelectedDice(next.players_assets[player_name].dices[0])
			}

			setPlayersAssets(next.players_assets)
		}
	}

	const throwDiceHandler = () => {
		SocketController.emit('send_throw_dice', selectedDice)
	}

	useEffect(() => {
		if (previousState && gameState && (gameState.round > previousState.round || gameState.effect_round > previousState.effect_round)) {
			compareStates(previousState, gameState, gameState.round > previousState.round)
		}
		const player_name = SocketController.player.username
		if (player_name) {
			setPlayerName(player_name)
		}
	}, [gameState])

	const selectDiceHandler = (inc) => {
		let dice_index = 0
		if (playersAssets && playersAssets[player_name] && playersAssets[player_name].dices) {
			const dices = playersAssets[player_name].dices
			if (dices.length > 0) {

				dice_index = dices.indexOf(selectedDice)
				dice_index += inc

				if (dice_index < 0) {
					dice_index = dices.length - 1
				} else if (dice_index >= dices.length) {
					dice_index = 0
				}

				const new_value = dices[dice_index]
				setSelectedDice(new_value)
			}
		}
	}

	useEffect(() => {
		// prepare socket listeners
		if (SocketController.socket) {
			SocketController.emit('get_game_state', true)
			SocketController.on('get_game_state', (data) => {
				if (!gameState) { setGameState(data.game_state) }
			})
			SocketController.on('throw_dice', (data) => {
				if (data.result && data.player_in_turn) {
					if (playersAssets && playersAssets[data.player_in_turn] && playersAssets[data.player_in_turn].diceSkin) {
						AnimationController.throwDiceAnimation(data.player_in_turn, playersAssets[data.player_in_turn].diceSkin, data.result)
					} else {
						AnimationController.throwDiceAnimation(data.player_in_turn, 'dice_default', data.result)
					}
				}
			})
			SocketController.on('game_update', (data) => {
				setGameState(data.game_state)
			})
			SocketController.on('game_end', (data) => {
				// update currency inventory in the db using the API
				Object.keys(playersAssets).forEach((player_name) => {
					const bodyFormData = new FormData();
					bodyFormData.append('default', playersAssets[player_name].inventory.default + 1);
					bodyFormData.append('fire', playersAssets[player_name].inventory.fire);
					bodyFormData.append('water', playersAssets[player_name].inventory.water);
					bodyFormData.append('earth', playersAssets[player_name].inventory.earth);
					bodyFormData.append('wind', playersAssets[player_name].inventory.wind);
					bodyFormData.append('plant', playersAssets[player_name].inventory.plant);
					bodyFormData.append('ice', playersAssets[player_name].inventory.ice);
					postData(USE_API_ENDPOINT(API_ENDPOINTS.updateInventory), bodyFormData, { 'Content-Type': 'multipart/form-data' })
						.then((data) => {
							console.log(data);
						});
				})
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
				<div className="flex justify-left items-center h-full space-x-2">
					<div className="pl-8 z-10 aspect-square flex justify-center h-[9vh] items-center" style={{
						backgroundImage: `url("${minigoose_default.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
						{playersAssets && player_name && playersAssets[player_name].inventory.default}
					</div>
					<div className="pl-8 z-10 aspect-square flex justify-center h-[9vh] items-center text-amber-700" style={{
						backgroundImage: `url("${minigoose_earth.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
						{playersAssets && player_name && playersAssets[player_name].inventory.earth}
					</div>
					<div className="pl-8 z-10 aspect-square flex justify-center h-[9vh] items-center text-blue-50" style={{
						backgroundImage: `url("${minigoose_wind.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
						{playersAssets && player_name && playersAssets[player_name].inventory.wind}
					</div>
					<div className="pl-8 z-10 aspect-square flex justify-center h-[9vh] items-center text-lime-500" style={{
						backgroundImage: `url("${minigoose_plant.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
						{playersAssets && player_name && playersAssets[player_name].inventory.plant}
					</div>
					<div className="pl-8 z-10 aspect-square flex justify-center h-[9vh] items-center text-red-500" style={{
						backgroundImage: `url("${minigoose_fire.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
						{playersAssets && player_name && playersAssets[player_name].inventory.fire}
					</div>
					<div className="pl-8 z-10 aspect-square flex justify-center h-[9vh] items-center text-blue-300" style={{
						backgroundImage: `url("${minigoose_ice.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
						{playersAssets && player_name && playersAssets[player_name].inventory.ice}
					</div>
					<div className="pl-8 z-10 aspect-square flex justify-center h-[9vh] items-center text-cyan-400" style={{
						backgroundImage: `url("${minigoose_water.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'contain',
						backgroundPosition: 'center',
					}}>
						{playersAssets && player_name && playersAssets[player_name].inventory.water}
					</div>
				</div>

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
						// FIXME: flip
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
				<div className="absolute w-[100%] h-[100%] flex justify-center items-center">
					<div className="inline-flex justify-center items-center gap-x-3">
						<div className="text-white text-center text-sm font-bold">
							{getSpecialDicesNicenameByName(selectedDice)}
						</div>
						<div className="text-white text-center text-xs">
							{`(${getSpecialDicesDescriptionByName(selectedDice)})`}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default PlayerUI
