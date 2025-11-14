/**
 * Game State Manager
 * Manages the central game state and provides methods to interact with it
 */

class GameState {
	constructor() {
		this.playerCaravan = {
			gold: GameConfig.caravan.startingGold,
			food: GameConfig.caravan.startingFood,
			speed: GameConfig.caravan.baseSpeed,
			position: new THREE.Vector3(0, 0, 0),
			targetPosition: new THREE.Vector3(0, 0, 0),
			isMoving: false,
			cargo: [],
			maxCargo: GameConfig.caravan.startingCargo,
			soldiers: GameConfig.caravan.startingSoldiers,
			protection: this.calculateProtection(GameConfig.caravan.startingSoldiers),
			dailyFoodCost: this.calculateFoodCost(GameConfig.caravan.startingSoldiers),
			dailyWageCost: this.calculateWageCost(GameConfig.caravan.startingSoldiers),
			currentCity: null,
		};

		this.gameDay = 1;
		this.selectedCity = null;
		this.globalEvents = [];
		this.currentPath = null; // Current pathfinding route

		// History tracking
		this.journeyHistory = [];
		this.tradingHistory = [];
		this.encounterHistory = [];
		this.totalTrades = 0;
		this.totalProfit = 0;
		this.startingGold = GameConfig.caravan.startingGold;
	}

	// Calculate protection based on soldiers
	calculateProtection(soldiers) {
		return soldiers * 2; // Simple formula: 2 protection per soldier
	}

	// Calculate daily food cost
	calculateFoodCost(soldiers) {
		return GameConfig.caravan.baseFoodCost + soldiers * GameConfig.caravan.soldierFoodCost;
	}

	// Calculate daily wage cost
	calculateWageCost(soldiers) {
		return soldiers * GameConfig.caravan.soldierWageCost;
	}

	// Get total cargo count
	getTotalCargoCount() {
		return this.playerCaravan.cargo.reduce((sum, item) => sum + item.quantity, 0);
	}

	// Get cargo item by good ID
	getCargoItem(goodId) {
		return this.playerCaravan.cargo.find((c) => c.goodId === goodId);
	}

	// Add cargo
	addCargo(goodId, quantity, price) {
		const cargoItem = this.getCargoItem(goodId);
		if (cargoItem) {
			// Update average cost
			const totalQuantity = cargoItem.quantity + quantity;
			const totalValue = cargoItem.avgCost * cargoItem.quantity + price * quantity;
			cargoItem.avgCost = totalValue / totalQuantity;
			cargoItem.quantity = totalQuantity;
		} else {
			this.playerCaravan.cargo.push({
				goodId: goodId,
				quantity: quantity,
				avgCost: price,
			});
		}
	}

	// Remove cargo
	removeCargo(goodId, quantity) {
		const cargoItem = this.getCargoItem(goodId);
		if (!cargoItem) return false;

		if (cargoItem.quantity < quantity) return false;

		cargoItem.quantity -= quantity;
		if (cargoItem.quantity === 0) {
			const index = this.playerCaravan.cargo.indexOf(cargoItem);
			this.playerCaravan.cargo.splice(index, 1);
		}
		return true;
	}

	// Modify gold
	addGold(amount) {
		this.playerCaravan.gold += amount;
	}

	removeGold(amount) {
		if (this.playerCaravan.gold < amount) return false;
		this.playerCaravan.gold -= amount;
		return true;
	}

	// Modify food
	addFood(amount) {
		this.playerCaravan.food += amount;
	}

	removeFood(amount) {
		if (this.playerCaravan.food < amount) return false;
		this.playerCaravan.food -= amount;
		return true;
	}

	// Hire soldiers
	hireSoldiers(count) {
		this.playerCaravan.soldiers += count;
		this.playerCaravan.protection = this.calculateProtection(this.playerCaravan.soldiers);
		this.playerCaravan.dailyFoodCost = this.calculateFoodCost(this.playerCaravan.soldiers);
		this.playerCaravan.dailyWageCost = this.calculateWageCost(this.playerCaravan.soldiers);
	}

	// Fire soldiers
	fireSoldiers(count) {
		this.playerCaravan.soldiers = Math.max(0, this.playerCaravan.soldiers - count);
		this.playerCaravan.protection = this.calculateProtection(this.playerCaravan.soldiers);
		this.playerCaravan.dailyFoodCost = this.calculateFoodCost(this.playerCaravan.soldiers);
		this.playerCaravan.dailyWageCost = this.calculateWageCost(this.playerCaravan.soldiers);
	}

	// Advance day
	advanceDay() {
		this.gameDay++;
		// Daily costs will be handled by a separate system later
	}

	// Set movement target
	setTarget(x, z) {
		this.playerCaravan.targetPosition.set(x, 0, z);
		this.playerCaravan.isMoving = true;
	}

	// Stop movement
	stopMovement() {
		this.playerCaravan.isMoving = false;
	}

	// Set current city
	setCurrentCity(cityId) {
		this.playerCaravan.currentCity = cityId;
	}

	// Clear current city
	clearCurrentCity() {
		this.playerCaravan.currentCity = null;
	}

	// Add journey history entry
	addJourneyEntry(fromCity, toCity) {
		const entry = {
			day: this.gameDay,
			from: fromCity || 'Open Road',
			to: toCity,
			timestamp: Date.now(),
		};
		this.journeyHistory.unshift(entry); // Add to beginning
		if (this.journeyHistory.length > 20) {
			this.journeyHistory.pop(); // Keep only last 20 entries
		}
	}

	// Add encounter history entry
	addEncounterEntry(encounterName, encounterType, result, mercUsed = null) {
		const entry = {
			day: this.gameDay,
			name: encounterName,
			type: encounterType,
			result: result,
			mercenary: mercUsed,
			timestamp: Date.now(),
		};
		this.encounterHistory.unshift(entry); // Add to beginning
		if (this.encounterHistory.length > 30) {
			this.encounterHistory.pop(); // Keep only last 30 entries
		}
	}

	// Add trading history entry
	addTradeEntry(cityName, action, goodName, quantity, price, total) {
		const profit = action === 'sell' ? total : 0;
		if (action === 'sell') {
			this.totalProfit += total;
		}

		const entry = {
			day: this.gameDay,
			city: cityName,
			action: action,
			good: goodName,
			quantity: quantity,
			price: price,
			total: total,
			timestamp: Date.now(),
		};
		this.tradingHistory.unshift(entry);
		this.totalTrades++;

		if (this.tradingHistory.length > 30) {
			this.tradingHistory.pop(); // Keep only last 30 entries
		}
	}

	// Get current location name
	getCurrentLocationName() {
		if (this.playerCaravan.currentCity) {
			return CitiesData[this.playerCaravan.currentCity]?.name || 'Unknown City';
		}
		if (this.playerCaravan.isMoving && this.selectedCity) {
			return `Traveling to ${CitiesData[this.selectedCity]?.name || 'Unknown'}`;
		}
		return 'Open Road';
	}

	// Convert game day to medieval date
	getMedievalDate() {
		const year = Math.floor((this.gameDay - 1) / 360) + 1;
		const dayOfYear = ((this.gameDay - 1) % 360) + 1;

		const seasons = [
			{ name: 'Spring', days: 90 },
			{ name: 'Summer', days: 90 },
			{ name: 'Autumn', days: 90 },
			{ name: 'Winter', days: 90 },
		];

		let remainingDays = dayOfYear;
		let season = 'Spring';
		let dayOfSeason = 1;

		for (const s of seasons) {
			if (remainingDays <= s.days) {
				season = s.name;
				dayOfSeason = remainingDays;
				break;
			}
			remainingDays -= s.days;
		}

		// Get ordinal suffix
		const getOrdinal = (n) => {
			const s = ['th', 'st', 'nd', 'rd'];
			const v = n % 100;
			return n + (s[(v - 20) % 10] || s[v] || s[0]);
		};

		return `${getOrdinal(dayOfSeason)} Day of ${season}, Year ${year}`;
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = GameState;
}
