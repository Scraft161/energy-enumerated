/* Main game script file
*/

// precalculated list of fibonacci numbers.
const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

var data

//sets default data or retrieves it from localstorage
if((JSON.parse(localStorage.getItem("data")) === undefined || JSON.parse(localStorage.getItem("data")) === null)) {
	newSave();
} else {
	loadSave();
}

// Commonly used DOM elements
let EnergyDisplay = document.getElementById("main_number");
let MatterDisplay = document.getElementById("matter_number");
let AntimatterDisplay = document.getElementById("antimatter_number");
let LightDisplay = document.getElementById("light_number");
let AnnihilationSpeedDisplay = document.getElementById("annihilation_speed");
let AnnihilationMultiplierDisplay = document.getElementById("annihilation_multiplier");

let EnergyCapDisplay = document.getElementById("energy_cap");
let MatterCapDisplay = document.getElementById("matter_cap");
let AntimatterCapDisplay = document.getElementById("antimatter_cap");

let EnumaratorCountDisplay = document.getElementById("enumerator_count");
let enumeratorCostDisplay = document.getElementById("enumerator_cost");

// Hide shop items
document.getElementById("shop_enumerator").style.display = "none";

// Hide upgrades
document.getElementById("upgrade_antimatter_unlock").style.display = "";
document.getElementById("upgrade_energy_cap_1").style.display = "";

/// Update all displays, we modify the DOM directly because screw VirtualDOM
const updateDisplay = () => {
	EnergyDisplay.innerText = roundOff(data["resources"]["energy"], 2).toString();
	MatterDisplay.innerText = roundOff(data["resources"]["matter"], 2).toString();
	AntimatterDisplay.innerText = roundOff(data["resources"]["antimatter"], 2).toString();
	LightDisplay.innerText = roundOff(data["resources"]["light"], 4).toString();
	AnnihilationSpeedDisplay.innerText = (data["annihilation"]["speed"]).toString();
	AnnihilationMultiplierDisplay.innerText = data["annihilation"]["multiplier"].toString();
	EnumaratorCountDisplay.innerText = data["enumerators"]["count"].toString();

	// Caps
	EnergyCapDisplay.innerText = (data["caps"]["energy"]).toString();
	MatterCapDisplay.innerText = (data["caps"]["matter"]).toString();
	AntimatterCapDisplay.innerText = (data["caps"]["antimatter"]).toString();

	if (data["visible"]["annihilationMultiplier"] === true) {
		document.getElementById("upgrade_annihilation_multiplier").style.display = "block";
	}

	resourceUnlocks(data["resources"], data["upgrades"], data["visible"]);

	// Enumerator cost
	enumeratorCostDisplay.innerText = (data["enumerators"]["count"] * data["enumerators"]["count"]) + 20;
}

const buyEnumerator = () => {
	let cost = (data["enumerators"]["count"] * data["enumerators"]["count"]) + 20;

	if (data["resources"]["energy"] >= cost) {
		data["enumerators"]["count"] += 1;	
		data["resources"]["energy"] -= cost;
		updateDisplay();
	}
}

// Matter & Antimatter

const energyToMatter = (amount) => {
	if (data["resources"]["matter"] >= data["caps"]["matter"]) {
		return;
	}

	if (data["resources"]["energy"] >= amount) {
		data["resources"]["matter"] += amount / 100;
		data["resources"]["energy"] -= amount;

		if (data["resources"]["matter"] > data["caps"]["matter"]) {
			data["resources"]["matter"] = data["caps"]["matter"];
		}
	}
	updateDisplay();
}

const energyToAntimatter = (amount) => {
	if (data["resources"]["antimatter"] >= data["caps"]["antimatter"]) {
		return;
	}
	if (data["resources"]["energy"] >= amount) {
		data["resources"]["antimatter"] += amount / 100;
		data["resources"]["energy"] -= amount;

		if (data["resources"]["antimatter"] > data["caps"]["antimatter"]) {
			data["resources"]["antimatter"] = data["caps"]["antimatter"];
		}
	}
	data["visible"]["annihilation"] = true;
	updateDisplay();
}

/** 
 * rounds off numbers to a certain amount of digits
 * @param {number} num The number to be rounded
 * @param {number} digits How many decimals to round off too
 * @returns {number} Rounded number
*/
const roundOff = (num, digits) => {
	return (
		Math.round(num * Math.pow(10, digits))
	) / Math.pow(10, digits)
}

/**
 * Fix drift for all resources
*/
const fixResourceDrift = () => {
	data["resources"]["energy"] = roundOff(data["resources"]["energy"], 2);
	data["resources"]["matter"] = roundOff(data["resources"]["matter"], 2);
	data["resources"]["antimatter"] = roundOff(data["resources"]["antimatter"], 2);
	data["resources"]["light"] = roundOff(data["resources"]["light"], 4);
}

// Game loop stuffs

/**
 * Game tick loop
*/
const tick = () => {
	fixResourceDrift();
	// Only tick energy generators if we haven't hit the cap
	if (data["resources"]["energy"] < data["caps"]["energy"]) {
		let incrementAmount = data["enumerators"]["count"] * 0.1;
		// Annihilation
		if (data["resources"]["matter"] >= data["annihilation"]["speed"] && data["resources"]["antimatter"] >= data["annihilation"]["speed"]) {
			data["resources"]["matter"] -= data["annihilation"]["speed"];
			data["resources"]["antimatter"] -= data["annihilation"]["speed"];
			incrementAmount += data["annihilation"]["speed"] * data["annihilation"]["multiplier"];
			data["resources"]["light"] += data["annihilation"]["speed"] / 100;
		}
		incrementEnergy(incrementAmount);
		updateDisplay();
	}
}

const startLoop = () => {
	while (true) {
		tick();
	}
}

// Utility BS
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Game Loop
updateDisplay()
tick()
const ticker = setInterval(tick, 1000);
const saveLoop = setInterval(writeSave, 1000 * 10);

