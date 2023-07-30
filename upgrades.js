/* Main JS file to deal with all the upgrade code.
*/

/// Unlock for buying Antimatter
const upgradeAntimatterUnlock = () => {
	let unlockElement = document.getElementById("upgrade_antimatter_unlock");
	let buyAntimatterButton = document.getElementById("div_antimatter");
	
	if (data["Matter"] >= 5) {
		data["Matter"] -= 5;
		buyAntimatterButton.style.display = "block";
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

/// Energy cap increases
const upgradeEnergyCap1 = () => {
	let unlockElement = document.getElementById("upgrade_energy_cap_1");

	if (data["Light"] >= .02) {
		data["EnergyCap"] = data["EnergyCap"] * 2;
		data["Light"] -= .02;
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

/// Antimatter cap increases
const upgradeAntimatterCap1 = () => {
	let unlockElement = document.getElementById("upgrade_antimatter_cap_1");

	if (data["Light"] >= .02) {
		data["AntimatterCap"] = data["AntimatterCap"] * 5;
		data["Light"] -= .02;
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

/// Annihilation
const upgradeAnnihilationSpeed1 = () => {
	let unlockElement = document.getElementById("upgrade_annihilation_speed_1");

	if (data["Light"] >= .05) {
		data["AnnihilationSpeed"] = 2;
		data["Light"] -= .05;
		unlockElement.style.display = "none";
	}

	// Unlock multiplier button
	document.getElementById("upgrade_annihilation_multiplier").style.display = "block";
	updateDisplay();
}

/// Multiplier stuff
const upgradeAnnihilationMultiplier = () => {
	console.log(data["AnnihilationMultiplierCount"]);

	const cost = fib[data["AnnihilationMultiplierCount"]] * 1;

	console.log(cost);

	if (data["Light"] >= cost) {
		data["AnnihilationMultiplier"] = data["AnnihilationMultiplier"] * 2;
		data["AnnihilationMultiplierCount"] += 1;
	}
	updateDisplay();
}
