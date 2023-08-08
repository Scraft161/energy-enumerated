/* Resources script
 * Here we deal with all the game resources
*/

// Energy

/**
 * Increment the energy counter
 * @param {number} amount The amount to increment with
*/
const incrementEnergy = (amount) => {
	data["resources"]["energy"] += amount;

	// Enforce cap
	if (data["resources"]["energy"] >= data["caps"]["energy"]) {
		data["resources"]["energy"] = data["caps"]["energy"];
	}
}

const incrementEnergyButton = () => {
	incrementEnergy(1/* * ClickMultiplier*/);
	updateDisplay();
}

// Matter

/**
 * Increment the matter counter
 * @param {number} amount The amount to increment with
*/
const incrementMatter = (amount) => {
	data["Matter"] += amount;

	// Enforce cap
	if (data["Matter"] >= data["MatterCap"]) {
		data["Matter"] = data["MatterCap"];
	}
}

// Antimatter

/**
 * Increment the antimatter counter
 * @param {number} amount The amount to increment with
*/
const incrementAntimatter = (amount) => {
	data["Antimatter"] += amount;

	// Enforce cap
	if (data["Antimatter"] >= data["AntimatterCap"]) {
		data["Antimatter"] = data["AntimatterCap"];
	}
}

// Light

/**
 * Increment the light counter
 * @param {number} amount The amount to increment with
*/
const incrementLight = (amount) => {
	data["Light"] += amount

	// Enforce cap
	if (data["Light"] >= data["LightCap"]) {
		data["Light"] = data ["LightCap"];
	}
}

// Unlocks
const resourceUnlocks = (resources, upgrades, visible) => {
	if (resources["energy"] >= 20 || visible["enumerator"] === true) {
		document.getElementById("shop_enumerator").style.display = "block";
		data["visible"]["enumerator"] = true;
	}
	if (resources["energy"] >= 100 || visible["matter"] === true) {
		document.getElementById("div_matter").style.display = "block";
		data["visible"]["matter"] = true;
	}
	if (resources["matter"] >= 1 && !upgrades["unlockAntimatter"] === true) {
		document.getElementById("upgrade_antimatter_unlock").style.display = "block";
	}
	if (visible["antimatter"]) {
		document.getElementById("div_antimatter").style.display = "block";
	}
	if (visible["annihilation"]) {
		document.getElementById("div_annihilation").style.display = "block";
	}
	if (resources["light"] >= 0.01 && !upgrades["energyCap1"] === true) {
		document.getElementById("upgrade_energy_cap_1").style.display = "block";
	}
	if (resources["light"] >= 0.02 && !upgrades["antimatterCap1"] === true) {
		document.getElementById("upgrade_antimatter_cap_1").style.display = "block";
	}
	if (resources["light"] >= 0.03 && !upgrades["annihilationSpeed1"] === true) {
		document.getElementById("upgrade_annihilation_speed_1").style.display = "block"
	}
}
