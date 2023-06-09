import {
	Button,
	Dialog,
} from "@material-tailwind/react";
import { IMAGE_ROUTES } from "../domain/constants";
import { getImage } from "../ImageFactory";

const PlayerInvitationsContent = props => {
	const border = getImage(IMAGE_ROUTES.backgrounds, 'dice_selector.png', { alt: 'border' }).props

	return (
		<Dialog
			className="absolute top-[12%] left-[35vw] right-[35vw]"
			open={props.open}
			handler={props.handleOpen}
			animate={{
				mount: { scale: 1, y: 0 },
				unmount: { scale: 0.9, y: -100 },
			}}
		>
			<div className={`absolute text-center h-[75vh] aspect-[3/4] m-1 space-y-4 pt-8`}
				style={{
					backgroundImage: `url("${border.src}")`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				{props.available_players && props.available_players.map((player_usernme, index) => {
					return (
						<div key={index} className="flex justify-center items-center">
							<div className="font-bold text-white w-1/2 text-left ml-4">
								{player_usernme}
							</div>
							<div className="w-1/2">
								<Button color="orange" className="hover:bg-orange-700 text-white font-bold rounded" onClick={() => props.handleInvite(player_usernme)}>Invite</Button>
							</div>
						</div>
					)
				})
				}
			</div>
		</Dialog>
	);
}

export default PlayerInvitationsContent;