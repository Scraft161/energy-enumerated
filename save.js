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
			multiplierCount: 1,
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

	// Add possibly missing data to the save
	if (data["annihilation"]["multiplierCount"] == undefined) {
		data["annihilation"]["multiplierCount"] = 1;
		console.log("Updated save data");
	}

	// Handle broken save
	/*
	if (data = JSON.parse("{}")) {
		newSave();
	}
	*/
}

const writeSave = () => {
	localStorage.setItem("data", JSON.stringify(data));
	//console.log("Saved game")
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

// Taken from https://stackoverflow.com/a/53490958
async function sha256(message) {
	// encode as UTF-8
	const msgBuffer = new TextEncoder().encode(message);

	// hash the message
	const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

	// convert ArrayBuffer to Array
	const hashArray = Array.from(new Uint8Array(hashBuffer));

	// convert bytes to hex string
	const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
	return hashHex;
}

// Very rudimentary export for testing
async function exportSave() {
	// Order our JSON objects
	let save = data;
	let saveKeys = Object.keys(save).sort();
	let output = [], prop;
	for (let i = 0; i < saveKeys.length; i++) {
		prop = saveKeys[i];
		output.push(prop);
		output.push(save[prop]);
	}

	// Stringify & compute hash
	save = JSON.stringify(save);
	
	//sha256(save).then(hash => save = save + hash);

	let saveHash = await sha256(save);
	save += saveHash;

	save = "eeSave" + btoa(save);

	// Copy the save text to clipboard
	navigator.clipboard.writeText(save);

	alert("Save copied to clipboard")
}

async function importSave() {
	let copyText = document.getElementById("save_input")
	copyText.select();
	copyText.setSelectionRange(0, 99999); // Mobile
	let save = copyText.value;

	// Reject data that doesn't start with "eeSave"
	if (save.startsWith("eeSave")) {
		// Trim eeSave
		save = save.replace(/^eeSave/, "");
	} else {
		alert("Save not valid");
		return;
	}

	// Decode B64
	save = atob(save);

	let saveHash = save.slice(-64);
	save = save.slice(0, -64);

	// Validate save data
	let computedSaveHash = await sha256(save);

	console.log(save);
	console.log(saveHash);

	if (saveHash != computedSaveHash) {
		alert("Save not valid");
		console.log("Computed hash " + computedSaveHash + " did not match hash in save " + saveHash);
		return;
	}

	// Decode save data
	save = JSON.parse(save);

	data = save;
	writeSave();
}
