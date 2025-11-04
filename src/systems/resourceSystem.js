/**
 * Resource System
 * Handles food consumption, daily costs, and resource management during travel
 */

class ResourceSystem {
	constructor(gameState) {
		this.gameState = gameState;
		this.travelStartPosition = null;
		this.totalDistanceTraveled = 0;
		this.currentTerrain = 'plains';
	}

	// Start tracking a journey
	startJourney(startPosition, targetCity) {
		this.travelStartPosition = startPosition.clone();
		this.totalDistanceTraveled = 0;

		// Determine terrain based on target city
		const cityData = CitiesData[targetCity];
		this.currentTerrain = cityData?.terrain || 'plains';
	}

	// Update during travel - called each frame
	updateTravel(currentPosition) {
		if (!this.travelStartPosition) return;

		// Calculate distance traveled this frame
		const distanceThisFrame = currentPosition.distanceTo(this.travelStartPosition);

		if (distanceThisFrame > 0.1) {
			// Only update if meaningful movement
			this.totalDistanceTraveled += distanceThisFrame;
			this.travelStartPosition.copy(currentPosition);

			// Consume food based on distance and terrain
			this.consumeFoodForDistance(distanceThisFrame);
		}
	}

	// Consume food based on distance traveled and terrain
	consumeFoodForDistance(distance) {
		const terrainData = GameConfig.terrain[this.currentTerrain];
		const foodMultiplier = terrainData?.foodMultiplier || 1.0;
		const baseCost = GameConfig.mechanics.baseMovementCost;

		// Calculate food cost: base cost * distance * terrain multiplier
		const foodCost = baseCost * distance * foodMultiplier;

		// Round to avoid floating point issues
		const roundedCost = Math.round(foodCost * 100) / 100;

		if (roundedCost > 0) {
			this.gameState.removeFood(roundedCost);
		}
	}

	// End journey
	endJourney() {
		this.travelStartPosition = null;
		this.totalDistanceTraveled = 0;
	}

	// Get movement speed multiplier for current terrain
	getSpeedMultiplier() {
		const terrainData = GameConfig.terrain[this.currentTerrain];
		return terrainData?.speedMultiplier || 1.0;
	}

	// Calculate estimated food cost for a journey
	estimateFoodCost(startPosition, endPosition, terrain) {
		const distance = startPosition.distanceTo(endPosition);
		const terrainData = GameConfig.terrain[terrain];
		const foodMultiplier = terrainData?.foodMultiplier || 1.0;
		const baseCost = GameConfig.mechanics.baseMovementCost;

		return Math.ceil(baseCost * distance * foodMultiplier);
	}

	// Check if player has enough food for journey
	canAffordJourney(startPosition, endPosition, terrain) {
		const estimatedCost = this.estimateFoodCost(startPosition, endPosition, terrain);
		return this.gameState.playerCaravan.food >= estimatedCost;
	}

	// Daily upkeep costs (when resting at cities)
	applyDailyCosts() {
		const caravan = this.gameState.playerCaravan;

		// Food consumption
		const dailyFoodCost = caravan.dailyFoodCost;
		this.gameState.removeFood(dailyFoodCost);

		// Soldier wages
		const dailyWageCost = caravan.dailyWageCost;
		this.gameState.removeGold(dailyWageCost);

		// Advance day
		this.gameState.advanceDay();

		return {
			foodConsumed: dailyFoodCost,
			goldSpent: dailyWageCost,
		};
	}

	// Check for low resources
	getLowResourceWarnings() {
		const warnings = [];
		const caravan = this.gameState.playerCaravan;

		if (caravan.food < 10) {
			warnings.push({
				type: 'food',
				level: caravan.food < 5 ? 'critical' : 'warning',
				message: caravan.food < 5 ? 'CRITICAL: Food supplies nearly exhausted!' : 'WARNING: Food supplies running low',
			});
		}

		if (caravan.gold < 50) {
			warnings.push({
				type: 'gold',
				level: caravan.gold < 20 ? 'critical' : 'warning',
				message: caravan.gold < 20 ? 'CRITICAL: Almost out of gold!' : 'WARNING: Gold reserves running low',
			});
		}

		return warnings;
	}

	// Get terrain name for display
	getTerrainName() {
		const terrainData = GameConfig.terrain[this.currentTerrain];
		return terrainData?.name || 'Unknown';
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = ResourceSystem;
}
