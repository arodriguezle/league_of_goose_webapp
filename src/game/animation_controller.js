import { getImage } from "../ImageFactory";
import { DASHBOX_TYPES, DASHBOX_TYPES_ACTIONS, DASHBOX_TYPES_NICENAMES, IMAGE_ROUTES } from "../domain/constants";
import { getDashboxDescription, getKeyByValue } from "../domain/logics";
import { SocketController } from "../domain/socket_controller";

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
	}

	static async movePlayerAnimation(player_name, initial_position, final_position, movePlayerCallback) {
		// disable throw dice div
		const throw_dice_button = document.getElementById('throw_dice_button');
		throw_dice_button.classList.add('pointer-events-none');

		// find player
		const player = document.getElementById(player_name)

		if (initial_position < final_position) {

			let excedent = 0;
			if (final_position >= 62) {
				excedent = final_position - 62;
				final_position = 62;
			}
			for (let i = initial_position; i <= final_position; i++) {
				player.position = i;
				movePlayerCallback(player_name, i);
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
			if (excedent > 0) {
				// move player from the end backwords
				for (let i = 0; i < excedent; i++) {
					player.position = 62 - i;
					movePlayerCallback(player_name, i);
					await new Promise(resolve => setTimeout(resolve, 1000));
				}
			}
		} else {
			for (let i = initial_position; i >= final_position; i--) {
				player.position = i;
				movePlayerCallback(player_name, i);
				await new Promise(resolve => setTimeout(resolve, 1000));
			}
		}

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

	static async showEffectToast(player_name, dashbox) {
		const { value, src } = dashbox;

		const title = getKeyByValue(DASHBOX_TYPES, value);
		let desc = getDashboxDescription(DASHBOX_TYPES_ACTIONS[title])

		// TODO: override description
		// desc.replace('You', player_name).replace('get', 'gets').replace('go', 'goes').replace('move', 'moves');

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

		// clear previous elements
		toast_effect_img.innerHTML = '';

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

		// clear previous elements
		toast_effect_text.innerHTML = '';

		// set text
		toast_effect_text.append(text_element_container);

		toast_effect_container.classList.add('ease-in-out', 'duration-500', 'transition');

		await new Promise(resolve => setTimeout(resolve, 2000));
		toast_effect_container.classList.remove('hidden');
		await new Promise(resolve => setTimeout(resolve, 3000));
		toast_effect_container.classList.add('hidden');
	}


	static async showEndingAnimation(players_assets, players_positions) {
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

		// create ending container
		let ending_container = document.createElement('div');
		ending_container.classList.add('absolute', 'w-full', 'h-full', 'flex', 'flex-col', 'justify-center', 'items-center', 'z-20');
		ending_container.id = 'ending_container';

		// create ending bg
		const image = getImage(IMAGE_ROUTES.backgrounds, 'ending_bg.png', { alt: 'ending_bg' }).props;
		let ending_bg = document.createElement('div');
		ending_bg.classList.add('absolute', 'w-1/2', 'h-full', 'bg-black', 'z-10', 'left-0');
		ending_bg.id = 'ending_bg';
		ending_bg.style.backgroundRepeat = 'no-repeat';
		ending_bg.style.backgroundPosition = 'center center';
		ending_bg.style.backgroundSize = 'contain';
		ending_bg.style.backgroundImage = `url(${image.src})`;
		ending_container.appendChild(ending_bg);

		// create ending bg ranking
		const image_ranking = getImage(IMAGE_ROUTES.backgrounds, 'ending_ranking_bg.png', { alt: 'ending_ranking_bg' }).props;
		let ending_ranking_bg = document.createElement('div');
		ending_ranking_bg.classList.add('absolute', 'w-1/2', 'h-full', 'bg-black', 'z-10', 'left-1/2');
		ending_ranking_bg.id = 'ending_ranking_bg';
		ending_ranking_bg.style.backgroundRepeat = 'no-repeat';
		ending_ranking_bg.style.backgroundPosition = 'center center';
		ending_ranking_bg.style.backgroundSize = 'contain';
		ending_ranking_bg.style.backgroundImage = `url(${image_ranking.src})`;

		// create ending content
		let ending_content = document.createElement('div');
		ending_content.classList.add('absolute', 'w-full', 'h-full', 'flex', 'flex-col', 'justify-center', 'items-center', 'z-20');
		ending_content.id = 'ending_content';
		ending_container.appendChild(ending_content);

		// create ending ranking
		let ending_ranking = document.createElement('div');
		ending_ranking.classList.add('flex', 'flex-col', 'justify-center', 'items-center', 'text-white', 'mb-4');
		ending_ranking.id = 'ending_ranking';
		ending_content.appendChild(ending_ranking);

		// create ending ranking title
		let ending_ranking_title = document.createElement('div');
		ending_ranking_title.classList.add('text-xl', 'font-bold', 'text-white', 'mb-2', 'mt-8');
		ending_ranking_title.innerText = 'Ranking';

		// create winner ranking ending title
		let ending_ranking_winner_title = document.createElement('div');
		ending_ranking_winner_title.classList.add('text-xl', 'font-bold', 'text-white', 'mb-2', 'mt-8');
		ending_ranking_winner_title.innerText = 'Winner';


		// create ending ranking list
		let ending_ranking_list = document.createElement('div');
		ending_ranking_list.classList.add('flex', 'flex-col', 'justify-center', 'items-center', 'text-white', 'mb-4');
		ending_ranking_list.id = 'ending_ranking_list';
		// scroll if needed
		ending_ranking_list.style.overflowY = 'scroll';
		ending_ranking_list.style.maxHeight = '80vh';

		// create ending ranking list items
		const players_in_order = this.getPlayersInOrder(players_positions);

		// get the winner
		const winner = players_in_order.shift();

		for (const player of players_in_order) {
			const player_name = player.name;
			const player_asset = players_assets[player_name];
			const player_currency = player_asset.inventory;
			const player_ranking = document.createElement('div');
			player_ranking.classList.add('block', 'justify-center', 'items-center', 'text-white', 'mb-1');
			player_ranking.id = 'ending_ranking_list_item';
			const player_ranking_name = document.createElement('div');
			player_ranking_name.classList.add('text-xl', 'font-bold', 'text-white');
			player_ranking_name.innerText = `${player_name}`;
			player_ranking.appendChild(player_ranking_name);
			const player_ranking_currency = document.createElement('div');
			player_ranking_currency.classList.add('text-xl', 'font-bold', 'text-white');
			let index = 0;
			const row1 = document.createElement('div');
			row1.classList.add('flex', 'flex-row', 'justify-center', 'items-center', 'text-white');
			const row2 = document.createElement('div');
			row2.classList.add('flex', 'flex-row', 'justify-center', 'items-center', 'text-white');

			Object.entries(player_currency).forEach((minigoose, value) => {
				if (index < 4) {
					const currency_name = minigoose[0];
					const currency_value = minigoose[1];
					const currency = document.createElement('div');
					currency.classList.add('inline-flex', 'justify-center', 'items-center', 'text-white', 'mb-1');
					const currency_image = getImage(IMAGE_ROUTES.minigeese, `goose_${currency_name}.png`, { alt: currency_name }).props;
					const currency_image_tag = document.createElement('img');
					currency_image_tag.classList.add('w-8', 'h-8', 'mr-2');
					currency_image_tag.src = currency_image.src;
					currency_image_tag.alt = currency_name;
					currency.appendChild(currency_image_tag);
					const currency_value_tag = document.createElement('div');
					currency_value_tag.classList.add('text-xl', 'font-bold', 'text-white', 'mb-1', 'inline-flex');
					currency_value_tag.innerText = `${currency_value}`;
					currency.appendChild(currency_value_tag);
					row1.appendChild(currency);
				} else {
					const currency_name = minigoose[0];
					const currency_value = minigoose[1];
					const currency = document.createElement('div');
					currency.classList.add('inline-flex', 'justify-center', 'items-center', 'text-white', 'mb-1');
					const currency_image = getImage(IMAGE_ROUTES.minigeese, `goose_${currency_name}.png`, { alt: currency_name }).props;
					const currency_image_tag = document.createElement('img');
					currency_image_tag.classList.add('w-8', 'h-8', 'mr-2');
					currency_image_tag.src = currency_image.src;
					currency_image_tag.alt = currency_name;
					currency.appendChild(currency_image_tag);
					const currency_value_tag = document.createElement('div');
					currency_value_tag.classList.add('text-xl', 'font-bold', 'text-white', 'mb-1', 'inline-flex');
					currency_value_tag.innerText = `${currency_value}`;
					currency.appendChild(currency_value_tag);
					row2.appendChild(currency);
				}
				index++;
			});
			player_ranking_currency.appendChild(row1);
			player_ranking_currency.appendChild(row2);
			player_ranking.appendChild(player_ranking_currency);
			ending_ranking_list.appendChild(player_ranking);
		}

		ending_ranking_bg.appendChild(ending_ranking_title);
		ending_ranking_bg.appendChild(ending_ranking_list);

		ending_container.appendChild(ending_ranking_bg);

		// add the winner stats into the ending container
		const winner_name = winner.name;
		const winner_asset = players_assets[winner_name];
		const winner_currency = winner_asset.inventory;
		const winner_ranking = document.createElement('div');
		winner_ranking.classList.add('block', 'justify-center', 'items-center', 'text-white', 'mb-1');
		winner_ranking.id = 'ending_ranking_list_item';
		const winner_ranking_name = document.createElement('div');
		winner_ranking_name.classList.add('text-xl', 'font-bold', 'text-white');
		winner_ranking_name.innerText = `${winner_name}`;
		winner_ranking.appendChild(winner_ranking_name);
		const winner_ranking_currency = document.createElement('div');
		winner_ranking_currency.classList.add('text-xl', 'font-bold', 'text-white');
		let index = 0;
		const row1 = document.createElement('div');
		row1.classList.add('flex', 'flex-row', 'justify-center', 'items-center', 'text-white');
		const row2 = document.createElement('div');
		row2.classList.add('flex', 'flex-row', 'justify-center', 'items-center', 'text-white');

		Object.entries(winner_currency).forEach((minigoose, value) => {
			if (index < 4) {
				const currency_name = minigoose[0];
				const currency_value = minigoose[1];
				const currency = document.createElement('div');
				currency.classList.add('inline-flex', 'justify-center', 'items-center', 'text-white', 'mb-1');
				const currency_image = getImage(IMAGE_ROUTES.minigeese, `goose_${currency_name}.png`, { alt: currency_name }).props;
				const currency_image_tag = document.createElement('img');
				currency_image_tag.classList.add('w-8', 'h-8', 'mr-2');
				currency_image_tag.src = currency_image.src;
				currency_image_tag.alt = currency_name;
				currency.appendChild(currency_image_tag);
				const currency_value_tag = document.createElement('div');
				currency_value_tag.classList.add('text-xl', 'font-bold', 'text-white', 'mb-1', 'inline-flex');
				currency_value_tag.innerText = `${currency_value}`;
				currency.appendChild(currency_value_tag);
				row1.appendChild(currency);
			} else {
				const currency_name = minigoose[0];
				const currency_value = minigoose[1];
				const currency = document.createElement('div');
				currency.classList.add('inline-flex', 'justify-center', 'items-center', 'text-white', 'mb-1');
				const currency_image = getImage(IMAGE_ROUTES.minigeese, `goose_${currency_name}.png`, { alt: currency_name }).props;
				const currency_image_tag = document.createElement('img');
				currency_image_tag.classList.add('w-8', 'h-8', 'mr-2');
				currency_image_tag.src = currency_image.src;
				currency_image_tag.alt = currency_name;
				currency.appendChild(currency_image_tag);
				const currency_value_tag = document.createElement('div');
				currency_value_tag.classList.add('text-xl', 'font-bold', 'text-white', 'mb-1', 'inline-flex');
				currency_value_tag.innerText = `${currency_value}`;
				currency.appendChild(currency_value_tag);
				row2.appendChild(currency);
			}
			index++;
		});

		ending_bg.appendChild(ending_ranking_winner_title);

		winner_ranking_currency.appendChild(row1);
		winner_ranking_currency.appendChild(row2);
		winner_ranking.appendChild(winner_ranking_currency);
		ending_bg.appendChild(winner_ranking);



		// create ending button
		let ending_button = document.createElement('div');
		ending_button.classList.add('text-xl', 'font-bold', 'text-white', 'mb-4', 'cursor-pointer');
		ending_button.innerText = 'Play Again';
		ending_button.addEventListener('click', () => {
			window.location = '/hub';
		});
		ending_content.appendChild(ending_button);

		// append ending container
		animation_container.appendChild(ending_container);

		// animate ending container
		ending_container.classList.add('animate__animated', 'animate__fadeIn');

		// animate ending bg
		ending_bg.classList.add('animate__animated', 'animate__fadeIn');
	}

	static getPlayersInOrder(players_positions) {
		const players_in_order = [];
		for (const player_name in players_positions) {
			const player_position = players_positions[player_name];
			players_in_order.push({ name: player_name, position: player_position });
		}
		players_in_order.sort((a, b) => b.position - a.position);
		return players_in_order;
	}
}
