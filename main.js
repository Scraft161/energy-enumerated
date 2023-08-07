// precalculated list of fibonacci numbers.
const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

var data

//sets default data or retrieves it from localstorage
if((JSON.parse(localStorage.getItem("data")) === undefined || JSON.parse(localStorage.getItem("data")) === null)) {
	console.log("data not found; creating")
	data = {
		Energy: 0,
		EnergyCap: 100,
		VisibleUpgradeEnergyCap: false,
		Matter: 0,
		MatterCap: 10,
		VisibleMatter: false,
		Antimatter: 0,
		AntimatterCap: 1,
		UpgradeUnlockAntimatter: false,
		VisibleUpgradeAntimatterCap: false,
		Light: 0,
		VisibleLight: false,
		AnnihilationMultiplier: 1,
		AnnihilationMultiplierCount: 1,
		AnnihilationSpeed: 0.0001,
		AnnihilationMultiplierCap: 10,
		VisibleUpgradeAnnihilationSpeed: false,
		VisibleAnnihilation: false, 
		EnumaratorCount: 0,
		VisibleEnumerator: false,
		VisibleUpgrades: false
	};
} else {
	console.log ("data imported")
	data = JSON.parse(localStorage.getItem("data"))
}

//saves data to localstorage
const saveData = () => {
	localStorage.setItem("data", JSON.stringify(data))
}

//clears localstorage data
const clearData = () => {
	clearInterval(ticker)
	data = {}
	localStorage.setItem("data", JSON.stringify(null))
	location.reload()
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

let ShopEnumerator = document.getElementById("shop_enumerator");

// Hide shop items
ShopEnumerator.style.display = "none";

// Hide upgrades
document.getElementById("upgrade_antimatter_unlock").style.display = "";
document.getElementById("upgrade_energy_cap_1").style.display = "";

/// Update all displays, we modify the DOM directly because screw VirtualDOM
const updateDisplay = () => {
	EnergyDisplay.innerText = roundOff(data["Energy"], 2).toString();
	MatterDisplay.innerText = roundOff(data["Matter"], 2).toString();
	AntimatterDisplay.innerText = roundOff(data["Antimatter"], 2).toString();
	LightDisplay.innerText = roundOff(data["Light"], 4).toString();
	AnnihilationSpeedDisplay.innerText = (data["AnnihilationSpeed"]).toString();
	AnnihilationMultiplierDisplay.innerText = data["AnnihilationMultiplier"].toString();
	EnumaratorCountDisplay.innerText = data["EnumaratorCount"].toString();

	// Caps
	EnergyCapDisplay.innerText = (data["EnergyCap"]).toString();
	MatterCapDisplay.innerText = (data["MatterCap"]).toString();
	AntimatterCapDisplay.innerText = (data["AntimatterCap"]).toString();

	// Resource-based unlocks
	if (ShopEnumerator.style.display == "none" && (data["Energy"] >= 20 || data["VisibleEnumerator"] == true)) {
		//let shop = document.getElementById("shop");
		ShopEnumerator.style.display = "block";
		data["VisibleEnumerator"] = true;
	}
	if (document.getElementById("div_matter").style.display == "" && (data["Energy"] >= 100 || data["VisibleMatter"] == true)) {
		document.getElementById("div_matter").style.display = "block";
		data["VisibleMatter"] = true;
	}
	if (document.getElementById("upgrade_antimatter_unlock").style.display == "" && (data["Matter"] >= 1 || data["UpgradeUnlockAntimatter"] == true)) {
		document.getElementById("upgrade_antimatter_unlock").style.display = "block";
		data["UpgradeUnlockAntimatter"] = true;
	}
	if (document.getElementById("upgrade_energy_cap_1").style.display == "" && (data["Light"] >= 0.01 || data["VisibleUpgradeEnergyCap"] == true)) {
		document.getElementById("upgrade_energy_cap_1").style.display = "block";
		data["VisibleUpgradeEnergyCap"] = true;
	}
	if (document.getElementById("upgrade_antimatter_cap_1").style.display == "" && (data["Light"] >= 0.02 || data["VisibleUpgradeAntimatterCap"] == true)) {
		document.getElementById("upgrade_antimatter_cap_1").style.display = "block";
		data["VisibleUpgradeAntimatterCap"] = true;
	}
	if (document.getElementById("upgrade_annihilation_speed_1").style.display == "" && (data["Light"] >= 0.03 || data["VisibleUpgradeAnnihilationSpeed"] == false)) {
		document.getElementById("upgrade_annihilation_speed_1").style.display = "block";
		data["VisibleUpgradeAnnihilationSpeed"] = true;
	}
	if (document.getElementById("div_annihilation").style.display == "" && data["VisibleAnnihilation"]) {
		document.getElementById("div_annihilation").style.display = "block";
	}
}

/* FOR MODDERS: DO NOT USE THIS, it was written early on in development as a
 * means to increment the energy count before the updateDisplay function was
 * created.
 * it now sits here in it's current state until it is no longer of use when it
 * will be deleted.
 * Manually increment the global `Energy` variable and call `updateDisplay()`
 * instead.
*/
const incrementEnergy = (amount) => {
	data["Energy"] += amount;
	if (data["Energy"] >= data["EnergyCap"]) {
		data["Energy"] = data["EnergyCap"];
	}
	updateDisplay();
}

const buyEnumerator = () => {
	let enumeratorCost = document.getElementById("enumerator_cost");
	let cost = enumeratorCost.innerText;

	if (data["Energy"] >= cost) {
		data["EnumaratorCount"] += 1;	
		data["Energy"] -= cost;
		enumeratorCost.innerText = (data["EnumaratorCount"] * data["EnumaratorCount"]) + 20;
		updateDisplay();
	}
}

// Matter & Antimatter

const energyToMatter = (amount) => {
	if (data["Matter"] >= data["MatterCap"]) {
		return;
	}

	if (data["Energy"] >= amount) {
		data["Matter"] += amount / 100;
		data["Energy"] -= amount;

		if (data["Matter"] > data["MatterCap"]) {
			data["Matter"] = data["MatterCap"];
		}
	}
	updateDisplay();
}

const energyToAntimatter = (amount) => {
	if (data["Antimatter"] >= data["AntimatterCap"]) {
		return;
	}
	if (data["Energy"] >= amount) {
		data["Antimatter"] += amount / 100;
		data["Energy"] -= amount;

		if (data["Antimatter"] > data["AntimatterCap"]) {
			data["Antimatter"] = data["AntimatterCap"];
		}
	}
	/*
	if (data["VisibleAnnihilation"] == false) {
		document.getElementById("div_annihilation").style.display = "block";
		data["VisibleAnnihilation"] = true;
	}
	*/
	data["VisibleAnnihilation"] = true;
	updateDisplay();
}

/** 
 * rounds off numbers to a certain amount of digits
 * @param num number to be rounded
 * @param digits how many decimals to round off too
 * @returns rounded number
*/

const roundOff = (num, digits) => {
	return (Math.round(num*Math.pow(10, digits)))/Math.pow(10, digits)
}

// Game loop stuffs

const tick = () => {
	if (data["Energy"] < data["EnergyCap"]) {
		let incrementAmount = data["EnumaratorCount"] * 0.1;
		// Annihilation
		if (data["Matter"] >= data["AnnihilationSpeed"] && data["Antimatter"] >= data["AnnihilationSpeed"]) {
			data["Matter"] -= data["AnnihilationSpeed"]*100;
			data["Antimatter"] -= data["AnnihilationSpeed"]*100;
			incrementAmount += data["AnnihilationSpeed"] * data["AnnihilationMultiplier"]*10000;
			data["Light"] += data["AnnihilationSpeed"];
		}
		incrementEnergy(incrementAmount);
	}
	saveData()
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
tick()
updateDisplay()
const ticker = setInterval(tick, 1000);


