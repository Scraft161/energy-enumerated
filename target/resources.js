"use strict";
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
};
const incrementEnergyButton = () => {
    incrementEnergy(1 /* * ClickMultiplier*/);
    updateDisplay();
};
// Matter
/**
 * Increment the matter counter
 * @param {number} amount The amount to increment with
*/
const incrementMatter = (amount) => {
    data["resources"]["matter"] += amount;
    // Enforce cap
    if (data["resources"]["matter"] >= data["caps"]["matter"]) {
        data["resources"]["matter"] = data["caps"]["matter"];
    }
};
// Antimatter
/**
 * Increment the antimatter counter
 * @param {number} amount The amount to increment with
*/
const incrementAntimatter = (amount) => {
    data["resources"]["antimatter"] += amount;
    // Enforce cap
    if (data["resources"]["antimatter"] >= data["caps"]["antimatter"]) {
        data["resources"]["antimatter"] = data["caps"]["antimatter"];
    }
};
// Light
/**
 * Increment the light counter
 * @param {number} amount The amount to increment with
*/
const incrementLight = (amount) => {
    data["resources"]["light"] += amount;
    // Enforce cap
    if (data["resources"]["light"] >= data["caps"]["light"]) {
        data["resources"]["light"] = data["caps"]["light"];
    }
};
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
        document.getElementById("upgrade_annihilation_speed_1").style.display = "block";
    }
    if (resources["light"] >= 0.04 && !upgrades["energyCap2"] === true) {
        document.getElementById("upgrade_energy_cap_2").style.display = "block";
    }
    if (resources["light"] >= 0.05 && !upgrades["antimatterCap2"] === true) {
        document.getElementById("upgrade_antimatter_cap_2").style.display = "block";
    }
    if (resources["light"] >= 0.075 && !upgrades["annihilationSpeed2"] === true) {
        document.getElementById("upgrade_annihilation_speed_2").style.display = "block";
    }
    if (resources["light"] >= 0.12 && !upgrades["energyCap3"] === true) {
        document.getElementById("upgrade_energy_cap_3").style.display = "block";
    }
};
