/* Main JS file to deal with all the upgrade code.
*/

/// Unlock for buying Antimatter
const upgradeAntimatterUnlock = () => {
	let unlockElement = document.getElementById("upgrade_antimatter_unlock");
	let buyAntimatterButton = document.getElementById("div_antimatter");
	
	if (Matter >= 500) {
		Matter -= 500;
		buyAntimatterButton.style.display = "block";
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

/// Energy cap increases
const upgradeEnergyCap1 = () => {
	let unlockElement = document.getElementById("upgrade_energy_cap_1");

	if (Light >= 200) {
		EnergyCap = EnergyCap * 2;
		Light -= 200;
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

/// Antimatter cap increases
const upgradeAntimatterCap1 = () => {
	let unlockElement = document.getElementById("upgrade_antimatter_cap_1");

	if (Light >= 200) {
		AntimatterCap = AntimatterCap * 5;
		Light -= 200;
		unlockElement.style.display = "none";
	}
	updateDisplay();
}

/// Annihilation
const upgradeAnnihilationSpeed1 = () => {
	let unlockElement = document.getElementById("upgrade_annihilation_speed_1");

	if (Light >= 500) {
		AnnihilationSpeed = 2;
		Light -= 500;
		unlockElement.style.display = "none";
	}

	// Unlock multiplier button
	document.getElementById("upgrade_annihilation_multiplier").style.display = "block";
	updateDisplay();
}

/// Multiplier stuff
const upgradeAnnihilationMultiplier = () => {
	console.log(AnnihilationMultiplierCount);

	const cost = fib[AnnihilationMultiplierCount] * 10000;

	console.log(cost);

	if (Light >= cost) {
		AnnihilationMultiplier = AnnihilationMultiplier * 2;
		AnnihilationMultiplierCount += 1;
	}
	updateDisplay();
}
