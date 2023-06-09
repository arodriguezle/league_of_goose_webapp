import { cloneElement } from "react";
export function createImageFromAssets(route, image_url, props = { width: 'auto', height: 'auto', alt: 'image' }) {
	try {
		return <img src={require("./assets/" + route + image_url)} alt={image_url} height={props.height} width={props.width}></img>;
	} catch (error) {
		return <img src={require("./assets/not_found.png")} alt="404" height={props.height} width={props.width}></img>;
	}
}

export function queueAllImagesFromAssets() {
	const images = require.context('./assets', true);
	for (let i = 0; i < images.keys().length; i++) {
		const src = images.keys()[i].substring(2, images.keys()[i].length);
		ALL_IMAGES[src] = createImageFromAssets("", src);
	}
	return images;
}

const ALL_IMAGES = {}

export function getImage(route, image_name, props = { width: 'auto', height: 'auto', alt: 'image' }) {
	if (Object.keys(ALL_IMAGES).length === 0) {
		queueAllImagesFromAssets();
	}
	try {
		const selected_image = cloneElement(ALL_IMAGES[route + "/" + image_name], props);
		return selected_image;
	} catch (error) {
		const selected_image = cloneElement(ALL_IMAGES['not_found.png'], props);
		return selected_image;
	}

}