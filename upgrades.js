/* Main JS file to deal with all the upgrade code.
*/

/// Unlock for buying Antimatter
const upgradeAntimatterUnlock = () => {
	let unlockElement = document.getElementById("upgrade_antimatter_unlock");
	let buyAntimatterButton = document.getElementById("div_antimatter");
	
	if (data["resources"]["matter"] >= 5) {
		data["resources"]["matter"] -= 5;
		data["visible"]["antimatter"] = true;
		data["upgrades"]["unlockAntimatter"] = true;
		buyAntimatterButton.style.display = "block";
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

/// Energy cap increases
const upgradeEnergyCap1 = () => {
	let unlockElement = document.getElementById("upgrade_energy_cap_1");

	if (data["resources"]["light"] >= 0.02) {
		data["caps"]["energy"] = 200;
		data["resources"]["light"] -= 0.02;
		data["upgrades"]["energyCap1"] = true;
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

const upgradeEnergyCap2 = () => {
	let unlockElement = document.getElementById("upgrade_energy_cap_2");

	if (data["resources"]["light"] >= 0.05) {
		data["caps"]["energy"] = 500;
		data["resources"]["light"] -= 0.05;
		data["upgrades"]["energyCap2"] = true;
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

/// Antimatter cap increases
const upgradeAntimatterCap1 = () => {
	let unlockElement = document.getElementById("upgrade_antimatter_cap_1");

	if (data["resources"]["light"] >= 0.02) {
		data["caps"]["antimatter"] = 2;
		data["resources"]["light"] -= 0.02;
		data["upgrades"]["antimatterCap1"] = true;
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

const upgradeAntimatterCap2 = () => {
	let unlockElement = document.getElementById("upgrade_antimatter_cap_2");

	if (data["resources"]["light"] >= 0.07) {
		data["caps"]["antimatter"] = 5;
		data["resources"]["light"] -= 0.07;
		data["upgrades"]["antimatterCap2"] = true;
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

/// Annihilation
const upgradeAnnihilationSpeed1 = () => {
	let unlockElement = document.getElementById("upgrade_annihilation_speed_1");

	if (data["resources"]["light"] >= 0.05) {
		data["annihilation"]["speed"] = 0.02;
		data["resources"]["light"] -= 0.05;
		data["upgrades"]["annihilationSpeed1"] = true;
		unlockElement.style.display = "none";
	}

	// Unlock multiplier button
	document.getElementById("upgrade_annihilation_multiplier").style.display = "block";
	data["visible"]["annihilationMultiplier"] = true;
	updateDisplay();
}

/// Multiplier stuff
const upgradeAnnihilationMultiplier = () => {
	const cost = fib[data["annihilation"]["multiplier"]];

	if (data["resources"]["light"] >= cost) {
		data["annihilation"]["multiplier"] = data["annihilation"]["multiplier"] * 2;
	}
	updateDisplay();
}
