import { useEffect, useState } from "react";
import { Button, Chip, Popover, PopoverHandler, PopoverContent } from "@material-tailwind/react";
import GotPlayerInvitationContent from "../../dialogs/GotPlayerInvitationContent";
import PlayerInvitationsContent from "../../dialogs/PlayerInvitationsContent";
import { SocketController } from "../../domain/socket_controller";

const RoomManager = (props) => {
	const [roomPlayers, setRoomPlayers] = useState([{}, {}, {}])
	const [player, setPlayer] = useState(null)
	const [open, setOpen] = useState(false);
	const [openInvitation, setOpenInvitation] = useState(false);
	const [invitor, setInvitor] = useState(null)
	const [available_players, setAvailablePlayers] = useState([])
	const [socket, setSocket] = useState(null)
	const handleInvite = (player_username) => {
		SocketController.emit("invite_player", player_username)
	}
	const [loadingPopover, setLoadingPopover] = useState(false)

	const handleAccept = (accepted) => {
		if (accepted) {
			SocketController.emit("accept_invitation", invitor)
		}
		setInvitor(null)
		setOpenInvitation(false)
	}

	const handleOpen = () => {
		setOpen(!open)
	};

	const handleOpenInvitation = () => {
		setOpenInvitation(!openInvitation)
	};

	const startGame = () => {
		let dice_skin = props.skins.dice_skins[0]
		if (props.diceSkin !== 'goose_default') {
			dice_skin = props.skins.dice_skins[props.diceSkin]
		}
		let goose_skin = props.skins.goose_skins[0]
		if (props.gooseSkin !== 'goose_default') {
			goose_skin = props.skins.goose_skins[props.gooseSkin]
		}

		setLoadingPopover(true)

		SocketController.emit("set_player_game_assets", {
			dices: props.dices,
			diceSkin: dice_skin,
			gooseSkin: goose_skin,
			inventory: { default: 0, fire: 0, ice: 0, wind: 0, earth: 0, water: 0, plant: 0 }
		})
		SocketController.on("start_game", (data) => {
			window.location.href = "/game"
		})
	}

	useEffect(() => {
		SocketController.join(setSocket, setPlayer)
	}, []);

	useEffect(() => {
		if (socket) {
			SocketController.on("room_update", (data) => {
				// check if player is in the room
				const player_in_room = data.players.filter((p) => {
					return p.email === player.email
				})
				if (player_in_room.length === 0) {
					setRoomPlayers([{}, {}, {}])
				} else {
					const other_players = data.players.filter((p) => {
						return p.email !== player.email
					})
					if (other_players.length < 3) {
						for (let i = other_players.length; i < 3; i++) {
							other_players.push({})
						}
					}
					setRoomPlayers(other_players)
				}
			});
			SocketController.on("available_players", (data) => {
				setAvailablePlayers(data)
				setOpen(true)
			})
			SocketController.on("invite_player", (data) => {
				setInvitor(data.invitor)
				setOpenInvitation(true)
			});
		}
	}, [socket]);

	const checkPlayersInRoom = () => {
		let number_of_players = 0
		roomPlayers.forEach((p) => {
			if (p.email) {
				number_of_players++
			}
		})
		return number_of_players
	}

	useEffect(() => {
		if (available_players.length > 0) {
			setOpen(true)
		}
	}, [available_players])

	const handleInvitations = () => {
		SocketController.emit("available_players", true)
	}

	return (
		<div>
			<div className="bg-[#faf3e0] border-black border-2 mx-8 py-2 pb-2">
				{SocketController.getSocket() && player ? player.username : ""}
			</div>
			{roomPlayers.map((other_player, index) => {
				return <div key={index} className="bg-[#faf3e0] border-black border-2 mx-8 py-2 cursor-pointer pb-2" onClick={() => handleInvitations()}>
					{other_player.username ? other_player.username : "+"}
				</div>
			})}
			{SocketController.getSocket() ?
				<div className="text-[#4caf50] pb-2">
					Connected
				</div> :
				<div className="text-[#f44336] pb-2">
					Connected
				</div>
			}
			{checkPlayersInRoom() >= 1 ? <div className="block space-y-2">
				<div className="w-full">
					<Chip color="green" value="START" className="hover:bg-green-700" onClick={() => startGame()}>START</Chip>
				</div>
				<div className="w-full">
					<Chip color="orange" value="LEAVE ROOM" className="hover:bg-orange-700" onClick={() => {
						SocketController.emit("leave_room", player)
						window.location.reload()
					}}>LEAVE ROOM</Chip>
				</div>
			</div>
				:
				<Popover>
					<PopoverHandler>
						<Button color="orange" className="hover:bg-orange-700">START</Button>
					</PopoverHandler>
					<PopoverContent>
						The room is not ready yet...
						<Chip color="green" value="CONTINUE" className="hover:bg-green-700" onClick={() => startGame()}>CONTINUE</Chip>
					</PopoverContent>
				</Popover>
			}
			{loadingPopover &&
				// loading component with animated spinner
				<div className="fixed top-0 left-0 w-screen h-screen z-50 items-center justify-center block" style={
					{ background: "rgba(0,0,0,.7)" }
				}>
					<div className=" -translate-y-1/2 -translate-x-1/2 absolute top-1/2 left-1/2 text-center">
						<div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white-900"></div>
						<div className="text-white">
							<br></br>
							Waiting for
							<br></br>
							other players...
						</div>
					</div>
				</div>
			}
			<PlayerInvitationsContent open={open} handleOpen={handleOpen} handleInvite={handleInvite} available_players={available_players} />
			<GotPlayerInvitationContent open={openInvitation} handleOpen={handleOpenInvitation} handleAccept={handleAccept} invitor={invitor} />
		</div>
	);
}

export default RoomManager;