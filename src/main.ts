//import { incrementEnergy } from './resources.js';
//import { newSave, loadSave, writeSave } from './save.js';

var data: any;

let data_raw = localStorage.getItem("data");

// Either retrieve data from localStrorage, or fall back to default.
if (data_raw != null) {
	if (JSON.parse(data_raw) == null) {
		newSave();
	} else {
		loadSave();
	}
} else {
	newSave();
}

// Dom elements linked to game variables.
const EnergyDisplay     = document.getElementById("main_number"      )!;
const MatterDisplay     = document.getElementById("matter_number"    )!;
const AntimatterDisplay = document.getElementById("antimatter_number")!;
const LightDisplay      = document.getElementById("light_number"     )!;
// Caps
const EnergyCapDisplay     = document.getElementById("energy_cap"    )!;
const MatterCapDisplay     = document.getElementById("matter_cap"    )!;
const AntimatterCapDisplay = document.getElementById("antimatter_cap")!;
// Generators
const EnumeratorCountDisplay        = document.getElementById("enumerator_count"       )!;
const EnumeratorCostDisplay         = document.getElementById("enumerator_cost"        )!;
const AnnihilationSpeedDisplay      = document.getElementById("annihilation_speed"     )!;
const AnnihilationMultiplierDisplay = document.getElementById("annihilation_multiplier")!;
// Statistics
const StatEnergyTick      = document.getElementById("stat_energy_tick"     )!;
const GenEnumeratorTick   = document.getElementById("gen_enumerator_tick"  )!;
const GenAnnihilationTick = document.getElementById("gen_annihilation_tick")!;
// Progress bar elements
const EnergyProgress     = document.getElementById("energy_progress"    )!;
const MatterProgress     = document.getElementById("matter_progress"    )!;
const AntimatterProgress = document.getElementById("antimatter_progress")!;

// Hide shop items
document.getElementById("shop_enumerator")!.style.display = "none";

// Hide upgrades
document.getElementById("upgrade_antimatter_unlock")!.style.display = "";
document.getElementById("upgrade_energy_cap_1")!.style.display = "";

function updateDisplay() {
	EnergyDisplay.innerText          = data.resources.energy;
	MatterDisplay.innerText          = data.resources.matter;
	AntimatterDisplay.innerText      = data.resources.antimatter;
	LightDisplay.innerText           = data.resources.light;

	EnumeratorCountDisplay.innerText = data.enumerators.count;
	AnnihilationSpeedDisplay.innerText = data.annihilation.speed;
	AnnihilationMultiplierDisplay.innerText = data.annihilation.multiplier;

	EnergyProgress.setAttribute("value", data.resources.energy);
	MatterProgress.setAttribute("value", data.resources.matter);
	AntimatterProgress.setAttribute("value", data.resources.antimatter);

	if (data.visible.annihilationMultiplier === true) {
		document.getElementById("upgrade_annihilation_multiplier")!.style.display = "block";
	}

	resourceUnlocks(data.resources, data.upgrades, data.visible);

	// Enumerator cost
	EnumeratorCostDisplay.innerText = ((data.enumerators.count * data.enumerators.count) + 20).toString();

	// Statistics
	let genEnumeratorTick = data.enumerators.count * 0.1;
	let genAnnihilationTick = data.annihilation.speed * data.annihilation.multiplier;

	StatEnergyTick.innerText = roundOff(genEnumeratorTick + genAnnihilationTick, 2).toString();
	GenEnumeratorTick.innerText = roundOff(genEnumeratorTick, 2).toString();
	GenAnnihilationTick.innerText = roundOff(genAnnihilationTick, 2).toString();
}

function buyEnumerator() {
	const cost = (data.enumerators.count * data.enumerators.count) + 20;

	if (data.resources.energy >= cost) {
		data.enumerators.count += 1;
		data.resources.energy -= cost;
		fixResourceDrift();
		updateDisplay();
	}
}

// Matter & Antimatter
function energyToMatter(amount: number) {
	if (data.resources.matter >= data.caps.matter) {
		return;
	}

	if (data.resources.energy >= amount) {
		data.resources.matter += amount / 100;
		data.resources.energy -= amount;

		// Clamp matter to the cap
		if (data.resources.matter > data.caps.matter) {
			data.resources.matter = data.caps.matter;
		}
	}
	fixResourceDrift();
	updateDisplay();
}

function energyToAntimatter(amount: number) {
	if (data.resources.antimatter >= data.caps.antimatter) {
		return;
	}

	if (data.resources.energy >= amount) {
		data.resources.antimatter += amount / 100;
		data.resources.energy -= amount;
	}

	data.visible.annihilation = true;
	fixResourceDrift();
	updateDisplay();
}

/** 
 * rounds off numbers to a certain amount of digits
 * @param {number} num The number to be rounded
 * @param {number} digits How many decimals to round off too
 * @returns {number} Rounded number
*/
const roundOff = (num: number, digits: number): number => {
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

/// Game tick loop
function tick() {
	fixResourceDrift();
	// Only tick generators if we haven't capped yet
	if (data.resources.energy < data.caps.energy) {
		// Enumerators
		let incrementAmount = data.enumerators.count * 0.1;

		// Annihilation
		if (data.resources.matter >= data.annihilation.speed && data.resources.antimatter >= data.annihilation.speed) {
			data.resources.matter -= data.annihilation.speed;
			data.resources.antimatter -= data.annihilation.speed;
			incrementAmount += data.annihilation.speed * data.annihilation.multiplier;
			data.resources.light += data.annihilation.speed / 100;
		}

		incrementEnergy(incrementAmount);
		fixResourceDrift();
		updateDisplay()
	}
}

/// Utility function to sleep for a specified amount of time
function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize the game
updateDisplay()
tick()
const ticker = setInterval(tick, 1000);
const saveLoop = setInterval(writeSave, 1000 * 10);
