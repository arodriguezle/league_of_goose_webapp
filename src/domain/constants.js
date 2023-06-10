export const AXIOS_DEFAULT_HEADERS = { 'Content-Type': 'application/json' }
export const DEFAULT_BOARD_LAYOUT = `R5_D4_R4_U9_R4_D5_L2_D4_R5_U3_L1_U5_R2_D3_R2_D2_R4`
export const DASHBOX_TYPES = {
	empty: "0",
	start: "1",
	end: "2",
	goose_to_goose: "3",
	fire: "a",
	fire_dice: "b",
	ice: "c",
	ice_dice: "d",
	wind: "e",
	wind_dice: "f",
	earth: "g",
	earth_dice: "h",
	water: "i",
	water_dice: "j",
	plant: "k",
	plant_dice: "l",
}

export const IMAGE_ROUTES = {
	dashboxs: "dashboxs",
	dices: "dices",
	dices_results: "dices_results",
	maps: "maps",
	skins: "skins",
	minigooses: "minigooses",
	backgrounds: "backgrounds",
	icons: "icons",
	portraits: "portraits",
	dice_portraits: "dice_portraits",
	leagueofgoose: "leagueofgoose",
}

export const DASHBOX_TYPES_NICENAMES = {
	empty: "Empty",
	start: "Start",
	end: "End",
	goose_to_goose: "Goose to Goose",
	fire: "Fire",
	fire_dice: "Fire Dice",
	ice: "Ice",
	ice_dice: "Ice Dice",
	wind: "Storm",
	wind_dice: "Wind Dice",
	earth: "Earth",
	earth_dice: "Earth Dice",
	water: "Water",
	water_dice: "Water Dice",
	plant: "Plant",
	plant_dice: "Plant Dice",
}

export const DASHBOX_TYPES_ACTIONS = {
	empty: "empty",
	start: "\"Were the journey begins\"",
	end: "\"Where the journey ends\"",
	goose_to_goose: "self->move->goose",
	fire: "self->move->start",
	fire_dice: "self->give->dice2",
	ice: "all->move->-2",
	ice_dice: "self->give->dice5",
	wind: "self->skip->1",
	wind_dice: "self->give->dice4",
	earth: "all->move->+1/-1",
	earth_dice: "self->give->dice1",
	water: "all->move->+2",
	water_dice: "self->give->dice6",
	plant: "self->remove->dices",
	plant_dice: "self->give->dice3",
}

export const ACTORS = {
	self: "self",
	all: "all",
}

export const TARGETS = {
	start: "start",
	goose: "goose",
	end: "end",
}

export const ACTIONS = {
	move: "move",
	skip: "skip",
	give: "give",
	remove: "remove",
}

export const MODIFIERS = {
	plus: "+",
	minus: "-",
}

export function getDiceName(dice) {
	let dice_name = '';
	switch (dice.charAt(dice.length - 1)) {
		case '1':
			dice_name = 'Earth';
			break;
		case '2':
			dice_name = 'Fire';
			break;
		case '3':
			dice_name = 'Plant';
			break;
		case '4':
			dice_name = 'Wind';
			break;
		case '5':
			dice_name = 'Ice';
			break;
		case '6':
			dice_name = 'Water';
			break;
		default:
			dice_name = '???';
			break;
	}
	return dice_name + ' Dice (' + dice.charAt(dice.length - 1) + ')';
}

export function getDiceSrcName(dice) {
	let dice_name = '';
	switch (dice.charAt(dice.length - 1)) {
		case '1':
			dice_name = 'earth';
			break;
		case '2':
			dice_name = 'fire';
			break;
		case '3':
			dice_name = 'plant';
			break;
		case '4':
			dice_name = 'wind';
			break;
		case '5':
			dice_name = 'ice';
			break;
		case '6':
			dice_name = 'water';
			break;
		default:
			dice_name = '???';
			break;
	}
	return dice_name + '_dice';
}
export const DICE_KINDS = {
	normal: "normal",
	boolean: "boolean",
	weighted: "weighted",
	odds: "odds",
	evens: "evens",
	lightned: "lightned",
}

export const DICE_KINDS_NICENAMES = {
	normal: "Normal",
	boolean: "Boolean",
	weighted: "Weighted",
	odds: "Odds",
	evens: "Evens",
	lightned: "Lightned",
}

export const DICE_KINDS_DESCRIPTIONS = {
	normal: "1 to 6",
	boolean: "1 or 6",
	weighted: "4, 5 or 6",
	odds: "1, 3 or 5",
	evens: "2, 4 or 6",
	lightned: "1, 2 or 3",
}

export const getSpecialDices = () => {
	return [
		DICE_KINDS.boolean,
		DICE_KINDS.weighted,
		DICE_KINDS.odds,
		DICE_KINDS.evens,
		DICE_KINDS.lightned,
	]
}

export const getSpecialDicesNicenameByName = (dice_name) => {
	switch (dice_name) {
		case DICE_KINDS.boolean:
			return DICE_KINDS_NICENAMES.boolean;
		case DICE_KINDS.weighted:
			return DICE_KINDS_NICENAMES.weighted;
		case DICE_KINDS.odds:
			return DICE_KINDS_NICENAMES.odds;
		case DICE_KINDS.evens:
			return DICE_KINDS_NICENAMES.evens;
		case DICE_KINDS.lightned:
			return DICE_KINDS_NICENAMES.lightned;
		default:
			return DICE_KINDS_NICENAMES.normal;
	}
}

export const getSpecialDicesDescriptionByName = (dice_name) => {
	switch (dice_name) {
		case DICE_KINDS.boolean:
			return DICE_KINDS_DESCRIPTIONS.boolean;
		case DICE_KINDS.weighted:
			return DICE_KINDS_DESCRIPTIONS.weighted;
		case DICE_KINDS.odds:
			return DICE_KINDS_DESCRIPTIONS.odds;
		case DICE_KINDS.evens:
			return DICE_KINDS_DESCRIPTIONS.evens;
		case DICE_KINDS.lightned:
			return DICE_KINDS_DESCRIPTIONS.lightned;
		default:
			return DICE_KINDS_DESCRIPTIONS.normal;
	}
}

// DEPRECATED, not efficient enough
// export const GALLERY_URL = "https://raw.githubusercontent.com/arodriguezle/league_of_goose_gallery";