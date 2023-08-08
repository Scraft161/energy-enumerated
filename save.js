/* Save & Load functions
 * manages everything related to saving/loading
*/

/**
 * Creates a new default save
*/
const newSave = () => {
	console.log("Creating new save data");

	data = {
		format: 1,
		resources: {
			energy: 0,
			matter: 0,
			antimatter: 0,
			light: 0,
		},
		caps: {
			energy: 100,
			matter: 10,
			antimatter: 1,
			light: 1,
		},
		enumerators: {
			count: 0,
			multiplier: 1,
		},
		annihilation: {
			multiplier: 1,
			multiplierCap: 10,
			speed: 0.01,
			speedCap: 0.1,
		},
		visible: {},
		upgrades: {}
	};

	writeSave();
}

const loadSave = () => {
	data = JSON.parse(localStorage.getItem("data"));

	// Handle broken save
	/*
	if (data = JSON.parse("{}")) {
		newSave();
	}
	*/
}

const writeSave = () => {
	localStorage.setItem("data", JSON.stringify(data));
	console.log("Saved game")
}

/**
 * Clears the existing save
*/
const clearSave = () => {
	clearInterval(ticker);
	data = {};
	localStorage.setItem("data", JSON.stringify(null));
	location.reload();
}
