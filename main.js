// precalculated list of fibonacci numbers.
const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

var data

if(localStorage.getItem("data") === undefined) {
	console.log("data not found; creating")
	data = {
		Energy: 0,
		EnergyCap: 10000,
		VisibleUpgradeEnergyCap: false,
		Matter: 0,
		MatterCap: 1000,
		VisibleMatter: false,
		Antimatter: 0,
		AntimatterCap: 100,
		UpgradeUnlockAntimatter: false,
		VisibleUpgradeAntimatterCap: false,
		Light: 0,
		VisibleLight: false,
		AnnihilationMultiplier: 1,
		AnnihilationMultiplierCount: 1,
		AnnihilationSpeed: 1,
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
//document.getElementById("upgrade_antimatter_unlock").style.display = "none";
//document.getElementById("upgrade_energy_cap_1").style.display = "none";

/// Update all displays, we modify the DOM directly because screw VirtualDOM
const updateDisplay = () => {
	EnergyDisplay.innerText = (data["Energy"] / 100).toString();
	MatterDisplay.innerText = (data["Matter"] / 100).toString();
	AntimatterDisplay.innerText = (data["Antimatter"] / 100).toString();
	LightDisplay.innerText = (data["Light"] / 10000).toString();
	AnnihilationSpeedDisplay.innerText = (data["AnnihilationSpeed"] / 100).toString();
	AnnihilationMultiplierDisplay.innerText = data["AnnihilationMultiplier"].toString();

	EnumaratorCountDisplay.innerText = data["EnumaratorCount"].toString();

	// Caps
	EnergyCapDisplay.innerText = (data["EnergyCap"] / 100).toString();
	MatterCapDisplay.innerText = (data["MatterCap"] / 100).toString();
	AntimatterCapDisplay.innerText = (data["AntimatterCap"] / 100).toString();

	// Resource-based unlocks
	if (data["Energy"] >= 2000 && data["VisibleEnumerator"] == false) {
		let shop = document.getElementById("shop");
		ShopEnumerator.style.display = "block";
		data["VisibleEnumerator"] = true;
	}
	if (data["Energy"] >= 10000 && data["VisibleMatter"] == false) {
		let divMatter = document.getElementById("div_matter");
		divMatter.style.display = "block";
		data["VisibleMatter"] = true;
	}
	if (data["Matter"] >= 100 && data["UpgradeUnlockAntimatter"] == false) {
		document.getElementById("upgrade_antimatter_unlock").style.display = "block";
		data["UpgradeUnlockAntimatter"] = true;
	}
	if (data["Light"] >= 100 && data["VisibleUpgradeEnergyCap"] == false) {
		document.getElementById("upgrade_energy_cap_1").style.display = "block";
		data["VisibleUpgradeEnergyCap"] = true;
	}
	if (data["Light"] >= 200 && data["VisibleUpgradeAntimatterCap"] == false) {
		document.getElementById("upgrade_antimatter_cap_1").style.display = "block";
		data["VisibleUpgradeAntimatterCap"] = true;
	}
	if (data["Light"] >= 300 && data["VisibleUpgradeAnnihilationSpeed"] == false) {
		document.getElementById("upgrade_annihilation_speed_1").style.display = "block";
		data["VisibleUpgradeAnnihilationSpeed"] = true;
	}
	
	localStorage.setItem("data", JSON.stringify(data))
	console.log("data saved")
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
	let cost = enumeratorCost.innerText * 100;

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

	if (data["Energy"] >= amount * 100) {
		data["Matter"] += amount;
		data["Energy"] -= amount * 100;

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

	if (data["Energy"] >= amount * 100) {
		data["Antimatter"] += amount;
		data["Energy"] -= amount * 100;

		if (data["Antimatter"] > data["AntimatterCap"]) {
			data["Antimatter"] = data["AntimatterCap"];
		}
	}

	if (data["VisibleAnnihilation"] == false) {
		document.getElementById("div_annihilation").style.display = "block";
		data["VisibleAnnihilation"] = true;
	}
	updateDisplay();
}

// Game loop stuffs

const tick = () => {
	if (data["Energy"] < data["EnergyCap"]) {
		let incrementAmount = data["EnumaratorCount"] * 10;
		// Annihilation
		if (data["Matter"] >= data["AnnihilationSpeed"] && data["Antimatter"] >= data["AnnihilationSpeed"]) {
			data["Matter"] -= data["AnnihilationSpeed"];
			data["Antimatter"] -= data["AnnihilationSpeed"];
			incrementAmount += data["AnnihilationSpeed"] * data["AnnihilationMultiplier"];
			data["Light"] += data["AnnihilationSpeed"];
		}
		incrementEnergy(incrementAmount);
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
tick()
setInterval(tick, 1000);

