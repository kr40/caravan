/**
 * Encounter System
 * Handles random encounters during travel
 */

class EncounterSystem {
	constructor(gameState) {
		this.gameState = gameState;
		this.currentEncounter = null;
		this.encounterCheckDistance = 100; // Check for encounters every 100 units traveled
		this.lastCheckPosition = null;
	}

	// Check if an encounter should occur based on distance traveled
	checkForEncounter(currentPosition, terrain) {
		// Initialize last check position if first check
		if (!this.lastCheckPosition) {
			this.lastCheckPosition = currentPosition.clone();
			return null;
		}

		// Calculate distance traveled since last check
		const distanceTraveled = currentPosition.distanceTo(this.lastCheckPosition);

		// Check if we've traveled far enough
		if (distanceTraveled >= this.encounterCheckDistance) {
			this.lastCheckPosition = currentPosition.clone();

			// Roll for encounter
			const encounter = this.rollEncounter(terrain);
			if (encounter) {
				this.currentEncounter = encounter;
				return encounter;
			}
		}

		return null;
	}

	// Roll for a random encounter based on terrain
	rollEncounter(terrain) {
		// Get encounters for this terrain type
		const terrainEncounters = EncountersData[terrain];
		if (!terrainEncounters) {
			// If no specific terrain, use plains
			return this.rollEncounter('plains');
		}

		// Calculate total encounter chance
		let roll = Math.random();

		// Check each encounter
		for (const encounter of terrainEncounters) {
			if (roll < encounter.chance) {
				return this.createEncounterInstance(encounter);
			}
		}

		return null; // No encounter this time
	}

	// Create an instance of an encounter with randomized effects
	createEncounterInstance(encounterTemplate) {
		const instance = {
			...encounterTemplate,
			appliedEffects: {},
		};

		// Randomize gold gain
		if (encounterTemplate.effects.goldMin !== undefined) {
			const gold = Math.floor(
				Math.random() * (encounterTemplate.effects.goldMax - encounterTemplate.effects.goldMin + 1) +
					encounterTemplate.effects.goldMin
			);
			instance.appliedEffects.gold = gold;
		}

		// Randomize gold loss
		if (encounterTemplate.effects.goldLossMin !== undefined) {
			const goldLoss = Math.floor(
				Math.random() * (encounterTemplate.effects.goldLossMax - encounterTemplate.effects.goldLossMin + 1) +
					encounterTemplate.effects.goldLossMin
			);
			instance.appliedEffects.goldLoss = goldLoss;
		}

		// Randomize food gain
		if (encounterTemplate.effects.foodMin !== undefined) {
			const food = Math.floor(
				Math.random() * (encounterTemplate.effects.foodMax - encounterTemplate.effects.foodMin + 1) +
					encounterTemplate.effects.foodMin
			);
			instance.appliedEffects.food = food;
		}

		// Randomize food loss
		if (encounterTemplate.effects.foodLossMin !== undefined) {
			const foodLoss = Math.floor(
				Math.random() * (encounterTemplate.effects.foodLossMax - encounterTemplate.effects.foodLossMin + 1) +
					encounterTemplate.effects.foodLossMin
			);
			instance.appliedEffects.foodLoss = foodLoss;
		}

		return instance;
	}

	// Apply encounter effects to game state
	applyEncounter(encounter) {
		const effects = encounter.appliedEffects;
		let message = encounter.effects.message;

		// Apply gold gain
		if (effects.gold) {
			this.gameState.playerCaravan.gold += effects.gold;
			message = message.replace('{gold}', effects.gold);
		}

		// Apply gold loss
		if (effects.goldLoss) {
			this.gameState.playerCaravan.gold = Math.max(0, this.gameState.playerCaravan.gold - effects.goldLoss);
			message = message.replace('{gold}', effects.goldLoss);
		}

		// Apply food gain
		if (effects.food) {
			this.gameState.playerCaravan.food += effects.food;
			message = message.replace('{food}', effects.food);
		}

		// Apply food loss
		if (effects.foodLoss) {
			this.gameState.playerCaravan.food = Math.max(0, this.gameState.playerCaravan.food - effects.foodLoss);
			message = message.replace('{food}', effects.foodLoss);
		}

		return message;
	}

	// Reset encounter tracking when starting a new journey
	resetForJourney() {
		this.lastCheckPosition = null;
		this.currentEncounter = null;
	}

	// Get terrain from city data or nearby terrain
	getTerrainForPosition(cityId) {
		if (cityId && CitiesData[cityId]) {
			const cityData = CitiesData[cityId];

			// Use nearby terrain if traveling through it
			if (cityData.nearbyTerrain && cityData.nearbyTerrain.length > 0) {
				// Randomly pick one of the nearby terrains
				const randomIndex = Math.floor(Math.random() * cityData.nearbyTerrain.length);
				return cityData.nearbyTerrain[randomIndex];
			}

			return cityData.terrain;
		}
		return 'plains'; // Default
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = EncounterSystem;
}
