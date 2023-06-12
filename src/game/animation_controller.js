import { getImage } from "../ImageFactory";
import DashboxContent from "../dialogs/DashboxContent";
import { DASHBOX_TYPES, DASHBOX_TYPES_ACTIONS, DASHBOX_TYPES_NICENAMES, IMAGE_ROUTES, getDiceSrcName } from "../domain/constants";
import { getDashboxDescription, getKeyByValue } from "../domain/logics";
import { SocketController } from "../domain/socket_controller";
import Dashbox from "./components/Dashbox";

export class AnimationController {
	static async throwDiceAnimation(player_name, dice_skin, final_value) {
		// disable throw dice div
		const throw_dice_button = document.getElementById('throw_dice_button');
		throw_dice_button.classList.add('pointer-events-none');

		// get animation container
		const animation_container = document.getElementById('animation_container');
		// blur board
		const board = document.getElementById('board');
		board.classList.add('blur');

		// create background, only one dice can be thrown at a time
		let background = document.getElementById('background_animation')
		if (!background) {
			background = document.createElement('div');
			background.classList.add('absolute', 'w-full', 'h-full', 'bg-black', 'opacity-50', 'z-10');
			background.id = 'background_animation';
			animation_container.appendChild(background);
		}

		// create player_name container
		const player_name_container = document.createElement('div');
		player_name_container.id = 'player_name_container';
		player_name_container.classList.add('absolute', 'w-1/3', 'h-1/3', 'z-20', 'flex', 'justify-center', 'items-center', 'top-1/6', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/6', 'text-white');
		player_name_container.innerText = "Currently playing: " + player_name;
		animation_container.appendChild(player_name_container);

		// get and set dice animation container
		const dice_image_src = getImage(IMAGE_ROUTES.dices, `${dice_skin}.gif`, { alt: 'dice' }).props.src + "?a=" + Math.random();
		const dice_container = document.getElementById('dice_container');
		dice_container.classList.remove('hidden');
		const dice = document.getElementById('dice_animation_container');
		dice.classList.remove('hidden');

		if (dice) {
			dice.src = dice_image_src;
		}

		// create dice value
		const dice_result_image_src = getImage(IMAGE_ROUTES.dices_results, `${dice_skin}-${final_value}.png`, { alt: 'result' }).props.src;
		const dice_value = document.createElement('div');
		dice_value.id = 'dice_value';
		dice_value.classList.add('absolute', 'w-1/3', 'h-1/2', 'z-20', 'flex', 'justify-center', 'items-center', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');
		dice_value.style = `background-image: url("${dice_result_image_src}"); background-repeat: no-repeat; background-size: cover; background-position: center;`;
		dice_value.classList.add('hidden');
		// add dice to animation container
		animation_container.appendChild(dice_value);


		// wait for dice animation to finish
		await new Promise(resolve => setTimeout(resolve, 6000));

		// show dice value
		dice_value.classList.remove('scale-150');
		dice_value.classList.add('transition', 'ease-in-out', 'duration-1000');
		dice_value.classList.remove('hidden');

		await new Promise(resolve => setTimeout(resolve, 100));

		dice.classList.add('hidden');

		await new Promise(resolve => setTimeout(resolve, 10));

		// transform dice value size
		dice_value.classList.add('transform', 'scale-110');

		// wait for dice value to be shown
		await new Promise(resolve => setTimeout(resolve, 3500));

		SocketController.emit('throw_dice', final_value);


		// remove player_name container
		player_name_container.remove();

		dice.src = '';

		// remove dice value
		dice_value.remove();

		// remove background blur
		board.classList.remove('blur');

		// remove background
		background.remove();

		// enable throw dice div
		throw_dice_button.classList.remove('pointer-events-none');

		console.log('throw dice animation finished');
	}

	static async movePlayerAnimation(player_name, initial_position, final_position, movePlayerCallback) {
		// disable throw dice div
		const throw_dice_button = document.getElementById('throw_dice_button');
		throw_dice_button.classList.add('pointer-events-none');

		// find player
		const player = document.getElementById(player_name)

		// check if the difference between initial and final position is negative


		if (initial_position < final_position) {
			for (let i = initial_position; i <= final_position; i++) {
				player.position = i;
				console.log('move player animation', player_name, i);

				movePlayerCallback(player_name, i);
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		} else {
			for (let i = initial_position; i >= final_position; i--) {
				player.position = i;
				console.log('move player animation', player_name, i);
				movePlayerCallback(player_name, i);
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}


		// enable throw dice div
		throw_dice_button.classList.remove('pointer-events-none');
	}

	static async triggerDashboxAnimation(player_name, dash_position, effectCallback) {

		// disable throw dice div
		const throw_dice_button = document.getElementById('throw_dice_button');
		throw_dice_button.classList.add('pointer-events-none');

		// find player
		const player = document.getElementById(player_name)

		player.position = dash_position;
		console.log('trigger dash animation', player_name, dash_position);

		effectCallback(player_name, dash_position);
		await new Promise(resolve => setTimeout(resolve, 1000));

		// enable throw dice div
		throw_dice_button.classList.remove('pointer-events-none');
	}

	static async giveDiceAnimation(target, value, giveDiceCallback) {
		console.log('give dice animation', target, value);

		// disable throw dice div
		const throw_dice_button = document.getElementById('throw_dice_button');
		throw_dice_button.classList.add('pointer-events-none');

		// get animation container
		const animation_container = document.getElementById('animation_container');
		// blur board
		const board = document.getElementById('board');
		board.classList.add('blur');
		// create image with the dice image
		const dice_image_src = getImage(IMAGE_ROUTES.dashboxs, `${getDiceSrcName(value)}.png`, { alt: 'dice' }).props.src;
		const dice = document.createElement('img');
		dice.id = 'dice';
		dice.classList.add('absolute', 'w-1/3', 'h-1/3', 'z-20', 'flex', 'justify-center', 'items-center', 'top-1/2', 'left-1/2', 'transform', '-translate-x-1/2', '-translate-y-1/2');
		dice.src = dice_image_src;
		// add dice to animation container
		animation_container.appendChild(dice);

		giveDiceCallback(target, value);

		// wait for dice animation to finish
		await new Promise(resolve => setTimeout(resolve, 3000));

		// remove dice
		dice.remove();

		// remove background blur
		board.classList.remove('blur');

		// enable throw dice div
		throw_dice_button.classList.remove('pointer-events-none');
	}

	static async removeDiceAnimation(target, value, removeDiceCallback) {
		console.log('remove dice animation', target, value);
		// disable throw dice div
		const throw_dice_button = document.getElementById('throw_dice_button');
		throw_dice_button.classList.add('pointer-events-none');

		// get animation container
		const animation_container = document.getElementById('animation_container');

		// blur board
		const board = document.getElementById('board');
		board.classList.add('blur');

		// remove dice animation
		console.log('remove dice animation', target, value);

		removeDiceCallback(target);

		// wait for dice animation to finish
		await new Promise(resolve => setTimeout(resolve, 3000));

		// remove background blur
		board.classList.remove('blur');

		// enable throw dice div
		throw_dice_button.classList.remove('pointer-events-none');
	}

	static async showTextAnimation(target, value, showTextCallback) {
		console.log('show text animation', target, value);
		// disable throw dice div
		const throw_dice_button = document.getElementById('throw_dice_button');
		throw_dice_button.classList.add('pointer-events-none');

		// get animation container
		const animation_container = document.getElementById('animation_container');
		// blur board
		const board = document.getElementById('board');
		board.classList.add('blur');

		// remove dice animation
		console.log('showTextC animation', target, value);

		showTextCallback(target);

		// wait for dice animation to finish
		await new Promise(resolve => setTimeout(resolve, 3000));

		// remove background blur
		board.classList.remove('blur');

		// enable throw dice div
		throw_dice_button.classList.remove('pointer-events-none');
	}

	static async showFriendToast() {
		const toast = document.getElementById('new_friend_toast_container');

		// FIXME: toast does not animate properly
		toast.classList.add('ease-in-out', 'duration-500', 'transition');
		toast.classList.remove('hidden', 'left-[-20%]');
		await new Promise(resolve => setTimeout(resolve, 500));
		toast.classList.add('left-0');
		await new Promise(resolve => setTimeout(resolve, 2000));
		toast.classList.remove('left-0');
		await new Promise(resolve => setTimeout(resolve, 500));
		toast.classList.add('hidden', 'left-[-20%]');
	}

	static async showEffectToast(dashbox) {
		const { value, src } = dashbox;

		console.log('asdadsasdad', value, src);
		console.log('aaaaaaaaaaaaaaaaaaaaaaaaa', getKeyByValue(DASHBOX_TYPES, value));
		const title = getKeyByValue(DASHBOX_TYPES, value);
		const desc = getDashboxDescription(DASHBOX_TYPES_ACTIONS[title])

		console.log('showEffectToast', title, desc);

		const toast_effect_container = document.getElementById('toast_effect_container');
		const toast_effect_img = document.getElementById('toast_effect_img');
		const toast_effect_text = document.getElementById('toast_effect_text');

		const image = getImage(IMAGE_ROUTES.dashboxs, src, { alt: 'dashbox' }).props;

		const image_element = document.createElement('img');
		image_element.src = image.src;
		image_element.style.zIndex = '20';
		image_element.style.width = '100%';
		image_element.style.height = '100%';
		image_element.style.backgroundRepeat = 'no-repeat';
		image_element.style.backgroundPosition = 'center center';
		image_element.style.backgroundSize = 'contain';
		image_element.style.backgroundImage = `url(${image.src})`;

		// set image
		toast_effect_img.append(image_element);

		const text_element_container = document.createElement('div');
		text_element_container.classList.add('text-left', 'align-left');
		const text_element_title = document.createElement('div');
		text_element_title.classList.add('text-normal', 'font-bold');
		text_element_title.innerText = `${DASHBOX_TYPES_NICENAMES[title]}`;
		text_element_container.append(text_element_title);
		const text_element_desc = document.createElement('div');
		text_element_desc.classList.add('text-xs', 'font-bold', 'leading-none');
		text_element_desc.innerText = `${desc}`;
		text_element_container.append(text_element_desc);

		// set text
		toast_effect_text.append(text_element_container);

		toast_effect_container.classList.add('ease-in-out', 'duration-500', 'transition');

		await new Promise(resolve => setTimeout(resolve, 2000));
		toast_effect_container.classList.remove('hidden');
		await new Promise(resolve => setTimeout(resolve, 3000));
		toast_effect_container.classList.add('hidden');

	}
}
