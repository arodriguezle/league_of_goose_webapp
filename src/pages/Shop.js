import { Link } from "react-router-dom";
import { getImage } from "../ImageFactory";
import { useEffect, useState } from "react";
import { API_ENDPOINTS, USE_API_ENDPOINT } from "../domain/api";
import { getData } from "../domain/utils";
import { IMAGE_ROUTES } from "../domain/constants";

const Shop = () => {
	const bg_image = getImage(IMAGE_ROUTES.backgrounds, 'home_transparent.png').props

	const [inventory, setInventory] = useState(null);

	useEffect(() => {
		getData(USE_API_ENDPOINT(API_ENDPOINTS.get) + "/inventory", null).then((response) => {
			if (response) {
				const data = response.data;
				console.log(data);
				setInventory(data);
			}
		});
	}, []);
	return <div className='relative w-screen h-screen align-webkit-center' style={{
		backgroundImage: `url("${bg_image.src}")`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	}}>
		<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
			<div className="text-white text-xl">THE SHOP IS COMING SOON</div>
			<Link className="text-white border border-white rounded-full px-2 py-2" to="/">Home</Link>
			<div className="text-white text-xl mt-4 mb-2">Meanwhile, check out your inventory</div>
			<div id="current_inventory" className="flex w-screen px-24 h-full relative">
				<div className="w-1/3 flex flex-col h-full">
					<div className="text-white text-xl">Current Goose Skins</div>
					<div id="skin_items" className="flex">
						{inventory && inventory.goose_skins.map((item) => {
							return <div className="text-white text-xl">{item}</div>
						})}
					</div>
				</div>

				<div className="w-1/3 flex flex-col h-full">
					<div className="text-white text-xl">Current Dice Skin</div>
					<div id="dice_items" className="flex">
						{inventory && inventory.dice_skins.map((item) => {
							return <div className="text-white text-xl">{item}</div>
						})}
					</div>
				</div>

				<div className="w-1/3 flex flex-col h-full">
					<div className="text-white text-xl">Current Inventory</div>
					<div id="currency_items" className="flex space-x-4">
						<div className="grid">
							{inventory && Object.entries(inventory.currency).map((item, index) => {
								if (index < 4) {
									const title = item[0];
									const currency_image = getImage(IMAGE_ROUTES.minigooses, `goose_${title}.png`, { alt: title }).props;
									return <div className="text-white text-xl inline-flex"><div style={
										{
											backgroundImage: `url("${currency_image.src}")`,
											backgroundSize: 'cover',
											backgroundPosition: 'center',
											backgroundRepeat: 'no-repeat',
											width: '50px',
											height: '50px',
										}
									}></div>{item[1]}</div>
								} else return null
							})}</div>
						<div className="grid">
							{inventory && Object.entries(inventory.currency).map((item, index) => {
								if (index >= 4) {
									const title = item[0];
									const currency_image = getImage(IMAGE_ROUTES.minigooses, `goose_${title}.png`, { alt: title }).props;
									return <div className="text-white text-xl inline-flex"><div style={
										{
											backgroundImage: `url("${currency_image.src}")`,
											backgroundSize: 'cover',
											backgroundPosition: 'center',
											backgroundRepeat: 'no-repeat',
											width: '50px',
											height: '50px',
										}
									}></div>{item[1]}</div>
								} else return null
							})}
						</div>
					</div>
				</div>

			</div>
		</div>
	</div>;
};

export default Shop;