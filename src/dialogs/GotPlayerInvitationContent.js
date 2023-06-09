import {
	Dialog,
	Button
} from "@material-tailwind/react";
import { IMAGE_ROUTES } from "../domain/constants";

import { getImage } from "../ImageFactory";
const GotPlayerInvitationContent = props => {
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
				<div className="text-2xl font-bold text-white space-y-4 mt-4">
					<div className="text-sm">{props.invitor} invited you to play!</div>
					<div className="inline-grid space-y-3">
						<Button color="green" className="hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => props.handleAccept(true)}>Accept</Button>
						<Button color="red" className="hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={() => props.handleAccept(false)}>Decline</Button>
					</div>
				</div>
			</div>
		</Dialog>
	);
}

export default GotPlayerInvitationContent;