
import { Fragment, useState } from "react";
import DashboxContent from "../../dialogs/DashboxContent";


const Dashbox = props => {
	const [open, setOpen] = useState(false);
	const [preventOpen, setPreventOpen] = useState(false);

	const handleOpen = () => { if (preventOpen) setOpen(!open) };
	const mouseDownCoords = e => {
		window.checkForDrag = e.clientX;
	};
	const clickOrDrag = e => {
		const mouseUp = e.clientX;
		if (
			mouseUp < window.checkForDrag + 5 &&
			mouseUp > window.checkForDrag - 5
		) {
			setPreventOpen(true);
		} else {
			setPreventOpen(false)
		}
	};
	return (<>
		{props.positions && props.size && <Fragment>
			<div id={`dashbox_${props.index}`} className={`absolute aspect-square border-[1px] border-black rounded-md`}
				style={{
					backgroundImage: `url("${props.src}")`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: 'cover',
					backgroundPosition: 'center',
					top: props.positions.top,
					left: props.positions.left,
					width: props.size.width / 25,
					boxShadow: '',
				}}
				onClick={handleOpen}
				onMouseDown={e => mouseDownCoords(e)}
				onMouseUp={e => clickOrDrag(e)}
			/>
			<DashboxContent open={open} handleOpen={handleOpen} info={{ index: props.index, value: props.value, src: props.src }} />
		</Fragment>}
	</>
	)
}

export default Dashbox