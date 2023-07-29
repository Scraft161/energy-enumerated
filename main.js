// precalculated list of fibonacci numbers.
const fib = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987];

let Energy = 0;
let Matter = 0;
let Antimatter = 0;
let Light = 0;
let AnnihilationMultiplier = 1;
let AnnihilationMultiplierCount = 1;
let AnnihilationSpeed = 1;

let VisibleEnumerator = false;
let VisibleMatter = false
let VisibleAnnihilation = false;
let VisibleLight = false;
let VisibleUpgrades = false;

let UpgradeUnlockAntimatter = false;
let VisibleUpgradeEnergyCap1 = false;
let VisibleUpgradeAntimatterCap1 = false;
let VisibleUpgradeAnnihilationSpeed1 = false;

// Resource caps, note that these are *100 compared to what is shown in the UI thanks to floating point math.
let EnergyCap = 10000;
let MatterCap = 1000;
let AntimatterCap = 100;
let AnnihilationMultiplierCap = 10;

let EnumaratorCount = 0;

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
	EnergyDisplay.innerText = (Energy / 100).toString();
	MatterDisplay.innerText = (Matter / 100).toString();
	AntimatterDisplay.innerText = (Antimatter / 100).toString();
	LightDisplay.innerText = (Light / 10000).toString();
	AnnihilationSpeedDisplay.innerText = (AnnihilationSpeed / 100).toString();
	AnnihilationMultiplierDisplay.innerText = AnnihilationMultiplier.toString();

	EnumaratorCountDisplay.innerText = EnumaratorCount.toString();

	// Caps
	EnergyCapDisplay.innerText = (EnergyCap / 100).toString();
	MatterCapDisplay.innerText = (MatterCap / 100).toString();
	AntimatterCapDisplay.innerText = (AntimatterCap / 100).toString();

	// Resource-based unlocks
	if (Energy >= 2000 && VisibleEnumerator == false) {
		let shop = document.getElementById("shop");
		ShopEnumerator.style.display = "block";
		VisibleEnumerator = true;
	}
	if (Energy >= 10000 && VisibleMatter == false) {
		let divMatter = document.getElementById("div_matter");
		divMatter.style.display = "block";
		VisibleMatter = true;
	}
	if (Matter >= 100 && UpgradeUnlockAntimatter == false) {
		document.getElementById("upgrade_antimatter_unlock").style.display = "block";
		UpgradeUnlockAntimatter = true;
	}
	if (Light >= 100 && VisibleUpgradeEnergyCap1 == false) {
		document.getElementById("upgrade_energy_cap_1").style.display = "block";
		VisibleUpgradeEnergyCap1 = true;
	}
	if (Light >= 200 && VisibleUpgradeAntimatterCap1 == false) {
		document.getElementById("upgrade_antimatter_cap_1").style.display = "block";
		VisibleUpgradeAntimatterCap1 = true;
	}
	if (Light >= 300 && VisibleUpgradeAnnihilationSpeed1 == false) {
		document.getElementById("upgrade_annihilation_speed_1").style.display = "block";
		VisibleUpgradeAnnihilationSpeed1 = true;
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
	Energy += amount;
	if (Energy >= EnergyCap) {
		Energy = EnergyCap;
	}
	updateDisplay();
}

const buyEnumerator = () => {
	let enumeratorCost = document.getElementById("enumerator_cost");
	let cost = enumeratorCost.innerText * 100;

	if (Energy >= cost) {
		EnumaratorCount += 1;	
		Energy -= cost;
		enumeratorCost.innerText = (EnumaratorCount * EnumaratorCount) + 20;
		updateDisplay();
	}
}

// Matter & Antimatter

const energyToMatter = (amount) => {
	if (Matter >= MatterCap) {
		return;
	}

	if (Energy >= amount * 100) {
		Matter += amount;
		Energy -= amount * 100;

		if (Matter > MatterCap) {
			Matter = MatterCap;
		}
	}
	updateDisplay();
}

const energyToAntimatter = (amount) => {
	if (Antimatter >= AntimatterCap) {
		return;
	}

	if (Energy >= amount * 100) {
		Antimatter += amount;
		Energy -= amount * 100;

		if (Antimatter > AntimatterCap) {
			Antimatter = AntimatterCap;
		}
	}

	if (VisibleAnnihilation == false) {
		document.getElementById("div_annihilation").style.display = "block";
		VisibleAnnihilation = true;
	}
	updateDisplay();
}

// Game loop stuffs

const tick = () => {
	if (Energy < EnergyCap) {
		let incrementAmount = EnumaratorCount * 10;
		// Annihilation
		if (Matter >= AnnihilationSpeed && Antimatter >= AnnihilationSpeed) {
			Matter -= AnnihilationSpeed;
			Antimatter -= AnnihilationSpeed;
			incrementAmount += AnnihilationSpeed * AnnihilationMultiplier;
			Light += AnnihilationSpeed;
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
setInterval(tick, 1000);
