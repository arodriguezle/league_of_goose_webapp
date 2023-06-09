import React, { useState, useEffect } from 'react';
import { getData } from '../domain/utils';
import { API_ENDPOINTS, USE_API_ENDPOINT } from '../domain/api';
import SkinSelector from './components/SkinSelector';
import RoomManager from './components/RoomManager';
import { Button, Select, Option } from "@material-tailwind/react";
import { getImage } from "../ImageFactory";
import { IMAGE_ROUTES } from "../domain/constants";
import { Link } from 'react-router-dom';

const Hub = () => {
	const bg_image = getImage(IMAGE_ROUTES.backgrounds, 'home_transparent.png').props
	const [inventory, setInventory] = useState(null);
	const [connectionStatus, setConnectionStatus] = useState('connecting'); // [connected, connecting, disconnected]
	const [error, setError] = useState(null);

	const [dice_1, setDice1] = useState('odds');
	const [dice_2, setDice2] = useState('evens');
	const [dice_3, setDice3] = useState('bolean');

	const [openOptions1, setOpenOptions1] = useState(['odds', 'evens', 'bolean', 'weighted', 'lightned']);
	const [openOptions2, setOpenOptions2] = useState(['odds', 'evens', 'bolean', 'weighted', 'lightned']);
	const [openOptions3, setOpenOptions3] = useState(['odds', 'evens', 'bolean', 'weighted', 'lightned']);

	const [selecteDiceSkin, setSelectedDiceSkin] = useState('default');
	const [selectedGooseSkin, setSelectedGooseSkin] = useState('default');

	// TODO: dosn't work properly
	const handleDiceSelected = (index, new_val) => {
		if (index === 1) {
			setDice1(new_val);
			setOpenOptions2(openOptions2.filter((option) => option !== new_val));
			setOpenOptions3(openOptions3.filter((option) => option !== new_val));
		} else if (index === 2) {
			setDice2(new_val);
			setOpenOptions1(openOptions1.filter((option) => option !== new_val));
			setOpenOptions3(openOptions3.filter((option) => option !== new_val));
		} else if (index === 3) {
			setDice3(new_val);
			setOpenOptions1(openOptions1.filter((option) => option !== new_val));
			setOpenOptions2(openOptions2.filter((option) => option !== new_val));
		}
	}
	useEffect(() => {
		getData(USE_API_ENDPOINT(API_ENDPOINTS.get) + "/inventory", null).then((response) => {
			if (response.name === "AxiosError") {
				setError("Goose! Seems like you are not logged in,\n please go back to the home page and log in.");
				setConnectionStatus('disconnected');
				return;
			}
			const data = response.data;
			setConnectionStatus('connected');
			setInventory(data);
		});
	}, []);

	const render = () => {
		if (connectionStatus === 'connected') {
			return (<div className='w-full h-fill-available flex divide-x-2 divide-black'>
				<Link className="fixed right-2 bottom-2 text-white border border-white rounded-full px-2 py-1" to="/">Home</Link>
				<div className='w-1/3 h-full'>
					<div className="my-8">
						<div className='uppercase font-bold text-white'>DICES</div>
						{/* TODO: remove test skins */}
						<SkinSelector skins={[inventory.dice_skins, "dice_aqua", "dice_froggy", "dice_nature"]} setSelectedDiceSkin={setSelectedDiceSkin} />
						<Select label="Select First Custom Dice" value={dice_1} defaultValue={dice_1} onChange={(new_val) => handleDiceSelected(1, new_val)}>
							{openOptions1.map((option, index) => {
								return <Option key={index} value={option}>{option}</Option>
							})}
						</Select>
						<Select label="Select Second Custom Dice" value={dice_2} defaultValue={dice_2} onChange={(new_val) => handleDiceSelected(2, new_val)}>
							{openOptions2.map((option, index) => {
								return <Option key={index} value={option}>{option}</Option>
							})}
						</Select>
						<Select label="Select Third Custom Dice" value={dice_3} defaultValue={dice_3} onChange={(new_val) => handleDiceSelected(3, new_val)}>
							{openOptions3.map((option, index) => {
								return <Option key={index} value={option}>{option}</Option>
							})}
						</Select>
					</div>
				</div>
				<div className='w-1/3 h-full'>
					<div className="my-8">
						<div className='uppercase font-bold text-white'>GOOSE</div>
						{/* TODO: remove test skins */}
						<SkinSelector skins={[inventory.goose_skins, "agent_g", "goose_spring", "goose_suits"]} setSelectedGooseSkin={setSelectedGooseSkin} />
					</div>
				</div>
				<div className='w-1/3 h-full'>
					<div className="my-8">
						<div className='uppercase font-bold text-white'>ROOM</div>
						{/* TODO: remove test skins */}
						<RoomManager dices={[dice_1, dice_2, dice_3]} gooseSkin={selectedGooseSkin} diceSkin={selecteDiceSkin} skins={{ dice_skins: inventory.dice_skins.concat("test dice"), goose_skins: inventory.goose_skins.concat("agent_g", "goose_spring", "goose_suits") }} />
					</div>
				</div>

			</div>
			);
		} else if (connectionStatus === 'connecting') {
			return <div>loading...</div>
		} else {
			return <div className='flex h-screen'>
				<div className='m-auto'>
					<div className='text-white' dangerouslySetInnerHTML={{ __html: error.replace(/\n/g, "<br />") }}></div>
					<Button className="mt-6" onClick={() => window.location.href = "/"}>
						Homepage
					</Button>
				</div>
			</div>
		}
	}

	return <div className='relative w-screen h-screen align-webkit-center' style={{
		backgroundImage: `url("${bg_image.src}")`,
		backgroundSize: 'cover',
		backgroundPosition: 'center',
		backgroundRepeat: 'no-repeat',
	}}>
		{render()}
	</div>;
};

export default Hub;