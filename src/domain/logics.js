import { ACTIONS, ACTORS, DASHBOX_TYPES, DASHBOX_TYPES_ACTIONS, DEFAULT_BOARD_LAYOUT, DICE_KINDS, TARGETS, getDiceName } from './constants';

export const generateBoardDashboxs = (seed) => {
	const dashboxs = [];
	for (let i = 0; i < seed.length; i++) {
		dashboxs.push({
			id: i,
			value: Object.values(DASHBOX_TYPES).filter((value) => value === seed[i])[0],
			isClicked: false,
			src: `${Object.keys(DASHBOX_TYPES).filter((value) => DASHBOX_TYPES[value] === seed[i])}.png`
		});
	}
	return dashboxs;
}

export const generateDefaultRandomSeed = (size, goose_skip = 5) => {
	let seed = "";
	for (let i = 0; i < size; i++) {
		let value = 0
		if (i === 0) {
			value = DASHBOX_TYPES.start
		} else if (i === size - 1) {
			value = DASHBOX_TYPES.end
		} else if (i % goose_skip === 0) {
			value = DASHBOX_TYPES.goose_to_goose
		} else {
			value = Object.values(DASHBOX_TYPES)[4 + Math.floor(Math.random() * 12)]
		}
		seed += value;
	}
	return seed;
}

export const getStartPosition = (size) => {
	return { top: size.height / 14 * 7, left: 0 }
}

export const getDashboxSize = (size) => {
	return size.width / 25
}

export const generateDashboxPositions = (size, index = 0) => {
	const dashbox_size = size.width / 25;
	const board_vertical_size = size.height / 14;
	const DEFAULT_POSITION = { top: board_vertical_size * 7 - board_vertical_size * 1 / 8, left: 0 }

	let top = DEFAULT_POSITION.top, left = DEFAULT_POSITION.left;

	const segmentsArray = DEFAULT_BOARD_LAYOUT.split('_');

	let positions = []

	segmentsArray.forEach((segment) => {
		const segmentType = segment[0];
		const segmentLenght = segment.substring(1);
		switch (segmentType) {
			case "R":
				for (let i = 1; i <= parseInt(segmentLenght); i++) {
					left += dashbox_size;
					positions.push({ top: top, left: left })
				}
				break;
			case "L":
				for (let i = 1; i <= parseInt(segmentLenght); i++) {
					left -= dashbox_size;
					positions.push({ top: top, left: left })
				}
				break;
			case "U":
				for (let i = 1; i <= parseInt(segmentLenght); i++) {
					top -= dashbox_size;
					positions.push({ top: top, left: left })
				}
				break;
			case "D":
				for (let i = 1; i <= parseInt(segmentLenght); i++) {
					top += dashbox_size;
					positions.push({ top: top, left: left })
				}
				break;
			default:
				break;
		}
	});
	if (index > 0)
		return positions[index]
	return positions;
}

export function getDashboxDescription(action_text) {
	if (!action_text.includes('->')) return action_text;
	const predicates = action_text.split('->');
	let sentence = '';
	let ignore = false;
	predicates.forEach((predicate, index) => {
		if (!ignore) {
			switch (predicate) {
				case ACTORS.self:
					sentence += 'You';
					break;
				case ACTORS.all:
					sentence += 'All players';
					break;
				case ACTIONS.move:
					sentence += 'move';
					break;
				case ACTIONS.skip:
					sentence += 'skip';
					break;
				case ACTIONS.remove:
					sentence += 'lose';
					break;
				case ACTIONS.give:
					sentence += 'get';
					break;
				default:
					break;
			}
			sentence += ' ';
			ignore = Object.keys(ACTIONS).includes(predicate)
		} else {
			switch (predicates[index - 1]) {
				case ACTIONS.move:
					if (isNaN(predicate)) {
						switch (predicate) {
							case TARGETS.start:
								sentence += 'to the start';
								break;
							case TARGETS.end:
								sentence += 'to the end';
								break;
							case TARGETS.goose:
								sentence += 'to the next goose';
								break;
							default:
								if (predicate.includes('/')) {
									const probabilities = predicate.split('/');
									sentence += `${probabilities} step/s`;
								}
								break;
						}
					} else {
						sentence += `${predicate} step/s`;
					}
					break;
				case ACTIONS.skip:
					sentence += `${predicate} turn/s`;
					break;
				case ACTIONS.remove:
					sentence += `all ${predicate}`;
					break;
				case ACTIONS.give:
					sentence += `a ${getDiceName(predicate)}`;
					break;
				default:
					break;
			}
			ignore = false;
		}
	});
	return sentence;
}

export function getDashboxEffect(dashbox) {
	const dashbox_type = getKeyByValue(DASHBOX_TYPES, dashbox.value);
	const action_text = DASHBOX_TYPES_ACTIONS[dashbox_type];
	const actor = action_text.split('->')[0];
	const action = action_text.split('->')[1];
	const value = action_text.split('->')[2];
	console.log('effect return', { actor, action, value });

	return { actor, action, value };
}

export function getKeyByValue(object, value) {
	return Object.keys(object).find(key => object[key] === value);
}

export function throwDiceAndGetValue(dice_name) {
	switch (dice_name) {
		case DICE_KINDS.normal:
			// 1 to 6
			return Math.floor(Math.random() * 6) + 1;
		case DICE_KINDS.lightned:
			// 1 to 3
			return Math.floor(Math.random() * 3) + 1;
		case DICE_KINDS.weighted:
			// 4 to 6
			return Math.floor(Math.random() * 3) + 4;
		case DICE_KINDS.boolean:
			// 1 or 6
			return Math.random() < 0.5 ? 1 : 6;
		case DICE_KINDS.evens:
			// 2, 4 or 6
			return Math.floor(Math.random() * 3) * 2 + 2;
		case DICE_KINDS.odds:
			// 1, 3 or 5
			return Math.floor(Math.random() * 3) * 2 + 1;
		default:
			// 1 to 6
			return Math.floor(Math.random() * 6) + 1;
	}
}

export function getDiceNameByIndex(index) {
	return Object.values(DICE_KINDS)[index];
}