import {
	Dialog,
} from "@material-tailwind/react";
import { DASHBOX_TYPES, DASHBOX_TYPES_NICENAMES, DASHBOX_TYPES_ACTIONS, IMAGE_ROUTES } from "../domain/constants";
import { getKeyByValue, getDashboxDescription } from "../domain/logics";

import { getImage } from "../ImageFactory";

const DashboxContent = props => {
	const border = getImage(IMAGE_ROUTES.backgrounds, 'dashbox_border.png', { alt: 'border' }).props

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
			<div className={`absolute text-center h-[75vh] aspect-[3/4] m-1`}
				style={{
					backgroundImage: `url("${border.src}")`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
				}}
			>
				<div className="relative top-[3%] left-[15%] w-[65%] h-[20%] flex justify-center items-center text-[black] text-normal font-bold uppercase leading-none">
					{DASHBOX_TYPES_NICENAMES[getKeyByValue(DASHBOX_TYPES, props.info.value)]}
				</div>
				<div className={`text-center aspect-square w-[70%] absolute top-[20%] left-[15%] border-[1px] border-black rounded-md`}
					style={{
						backgroundImage: `url("${props.info.src}")`,
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}

				></div>
				<div className="absolute bottom-[7%] left-[15%] w-[70%] h-[20%] flex justify-center items-center text-[black] text-sm font-bold uppercase">
					{getDashboxDescription(DASHBOX_TYPES_ACTIONS[getKeyByValue(DASHBOX_TYPES, props.info.value)])}
				</div>
			</div>
		</Dialog>
	);
}

export default DashboxContent;