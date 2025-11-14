/**
 * Save Manager
 * Handles saving and loading game state to/from localStorage
 */

class SaveManager {
	constructor() {
		this.SAVE_KEY_PREFIX = 'caravan_adventures_save_';
		this.AUTO_SAVE_INTERVAL = 60000; // Auto-save every 60 seconds
		this.autoSaveTimer = null;
		this.currentSlot = null; // Track which slot is currently being used
	}

	/**
	 * Set the current save slot
	 */
	setCurrentSlot(slotNumber) {
		this.currentSlot = slotNumber;
		console.log('[SaveManager] Current slot set to:', slotNumber);
	}

	/**
	 * Get the save key for a specific slot
	 */
	getSaveKey(slotNumber) {
		return this.SAVE_KEY_PREFIX + slotNumber;
	}

	/**
	 * Save the current game state to localStorage
	 */
	saveGame(gameState, citiesData, mercenarySystem, slotNumber = null) {
		const slot = slotNumber || this.currentSlot;
		if (!slot) {
			console.error('[SaveManager] No slot selected for saving');
			return false;
		}

		try {
			const saveData = {
				version: '1.0',
				timestamp: Date.now(),
				gameState: this.serializeGameState(gameState),
				cities: this.serializeCities(citiesData),
				mercenaries: this.serializeMercenaries(mercenarySystem),
			};

			localStorage.setItem(this.getSaveKey(slot), JSON.stringify(saveData));
			console.log('[SaveManager] Game saved successfully to slot:', slot);
			return true;
		} catch (error) {
			console.error('[SaveManager] Failed to save game:', error);
			return false;
		}
	}

	/**
	 * Load game state from localStorage
	 */
	loadGame(slotNumber = null) {
		const slot = slotNumber || this.currentSlot;
		if (!slot) {
			console.error('[SaveManager] No slot selected for loading');
			return null;
		}

		try {
			const savedData = localStorage.getItem(this.getSaveKey(slot));
			if (!savedData) {
				console.log('[SaveManager] No save data found in slot:', slot);
				return null;
			}

			const saveData = JSON.parse(savedData);
			console.log('[SaveManager] Save data loaded from slot:', slot, saveData.timestamp);
			return saveData;
		} catch (error) {
			console.error('[SaveManager] Failed to load game:', error);
			return null;
		}
	}

	/**
	 * Check if a save file exists in a specific slot
	 */
	hasSaveData(slotNumber) {
		const hasSave = localStorage.getItem(this.getSaveKey(slotNumber)) !== null;
		console.log('[SaveManager] Checking slot', slotNumber, '| Has save:', hasSave);
		return hasSave;
	}

	/**
	 * Get save info for a specific slot
	 */
	getSaveInfo(slotNumber) {
		try {
			const savedData = localStorage.getItem(this.getSaveKey(slotNumber));
			if (!savedData) return null;

			const saveData = JSON.parse(savedData);
			return {
				slot: slotNumber,
				timestamp: saveData.timestamp,
				gold: saveData.gameState.playerCaravan.gold,
				day: saveData.gameState.gameDay,
			};
		} catch (error) {
			console.error('[SaveManager] Failed to get save info for slot', slotNumber, error);
			return null;
		}
	}

	/**
	 * Get all save slots info
	 */
	getAllSavesInfo() {
		const saves = [];
		for (let i = 1; i <= 3; i++) {
			const info = this.getSaveInfo(i);
			if (info) {
				saves.push(info);
			}
		}
		return saves;
	}

	/**
	 * Delete the save file from a specific slot
	 */
	deleteSave(slotNumber) {
		localStorage.removeItem(this.getSaveKey(slotNumber));
		console.log('[SaveManager] Save deleted from slot:', slotNumber);
	}

	/**
	 * Serialize game state for saving
	 */
	serializeGameState(gameState) {
		return {
			playerCaravan: {
				gold: gameState.playerCaravan.gold,
				food: gameState.playerCaravan.food,
				speed: gameState.playerCaravan.speed,
				position: {
					x: gameState.playerCaravan.position.x,
					y: gameState.playerCaravan.position.y,
					z: gameState.playerCaravan.position.z,
				},
				targetPosition: {
					x: gameState.playerCaravan.targetPosition.x,
					y: gameState.playerCaravan.targetPosition.y,
					z: gameState.playerCaravan.targetPosition.z,
				},
				isMoving: gameState.playerCaravan.isMoving,
				cargo: gameState.playerCaravan.cargo,
				maxCargo: gameState.playerCaravan.maxCargo,
				soldiers: gameState.playerCaravan.soldiers,
				protection: gameState.playerCaravan.protection,
				dailyFoodCost: gameState.playerCaravan.dailyFoodCost,
				dailyWageCost: gameState.playerCaravan.dailyWageCost,
				currentCity: gameState.playerCaravan.currentCity,
			},
			gameDay: gameState.gameDay,
			selectedCity: gameState.selectedCity,
			journeyHistory: gameState.journeyHistory,
			tradingHistory: gameState.tradingHistory,
			encounterHistory: gameState.encounterHistory,
			totalTrades: gameState.totalTrades,
			totalProfit: gameState.totalProfit,
			startingGold: gameState.startingGold,
		};
	}

	/**
	 * Serialize cities for saving
	 */
	serializeCities(citiesData) {
		// Convert CitiesData object to array and serialize each city's market data
		const citiesArray = [];
		for (const cityKey in citiesData) {
			const city = citiesData[cityKey];
			citiesArray.push({
				key: cityKey,
				name: city.name,
				market: city.market,
			});
		}
		return citiesArray;
	}

	/**
	 * Serialize mercenary system for saving
	 */
	serializeMercenaries(mercenarySystem) {
		return {
			hiredMercenaries: mercenarySystem.hiredMercenaries,
			availableMercenaries: mercenarySystem.availableMercenaries,
		};
	}

	/**
	 * Restore game state from saved data
	 */
	restoreGameState(saveData, gameState) {
		const saved = saveData.gameState;

		// Restore caravan
		gameState.playerCaravan.gold = saved.playerCaravan.gold;
		gameState.playerCaravan.food = saved.playerCaravan.food;
		gameState.playerCaravan.speed = saved.playerCaravan.speed;
		gameState.playerCaravan.position.set(
			saved.playerCaravan.position.x,
			saved.playerCaravan.position.y,
			saved.playerCaravan.position.z
		);
		gameState.playerCaravan.targetPosition.set(
			saved.playerCaravan.targetPosition.x,
			saved.playerCaravan.targetPosition.y,
			saved.playerCaravan.targetPosition.z
		);
		gameState.playerCaravan.isMoving = saved.playerCaravan.isMoving;
		gameState.playerCaravan.cargo = saved.playerCaravan.cargo;
		gameState.playerCaravan.maxCargo = saved.playerCaravan.maxCargo;
		gameState.playerCaravan.soldiers = saved.playerCaravan.soldiers;
		gameState.playerCaravan.protection = saved.playerCaravan.protection;
		gameState.playerCaravan.dailyFoodCost = saved.playerCaravan.dailyFoodCost;
		gameState.playerCaravan.dailyWageCost = saved.playerCaravan.dailyWageCost;
		gameState.playerCaravan.currentCity = saved.playerCaravan.currentCity;

		// Restore game state
		gameState.gameDay = saved.gameDay;
		gameState.selectedCity = saved.selectedCity;
		gameState.journeyHistory = saved.journeyHistory || [];
		gameState.tradingHistory = saved.tradingHistory || [];
		gameState.encounterHistory = saved.encounterHistory || [];
		gameState.totalTrades = saved.totalTrades || 0;
		gameState.totalProfit = saved.totalProfit || 0;
		gameState.startingGold = saved.startingGold || GameConfig.caravan.startingGold;

		console.log('[SaveManager] Game state restored');
	}

	/**
	 * Restore cities from saved data
	 */
	restoreCities(saveData, citiesData) {
		const savedCities = saveData.cities;
		savedCities.forEach((savedCity) => {
			if (citiesData[savedCity.key]) {
				citiesData[savedCity.key].market = savedCity.market;
			}
		});
		console.log('[SaveManager] Cities restored');
	}

	/**
	 * Restore mercenary system from saved data
	 */
	restoreMercenaries(saveData, mercenarySystem) {
		const saved = saveData.mercenaries;
		mercenarySystem.hiredMercenaries = saved.hiredMercenaries || [];
		mercenarySystem.availableMercenaries = saved.availableMercenaries || {};
		console.log('[SaveManager] Mercenaries restored');
	}

	/**
	 * Start auto-save timer
	 */
	startAutoSave(gameState, cities, mercenarySystem) {
		if (this.autoSaveTimer) {
			clearInterval(this.autoSaveTimer);
		}

		this.autoSaveTimer = setInterval(() => {
			this.saveGame(gameState, cities, mercenarySystem);
			console.log('[SaveManager] Auto-save triggered');
		}, this.AUTO_SAVE_INTERVAL);

		console.log('[SaveManager] Auto-save enabled (every 60s)');
	}

	/**
	 * Stop auto-save timer
	 */
	stopAutoSave() {
		if (this.autoSaveTimer) {
			clearInterval(this.autoSaveTimer);
			this.autoSaveTimer = null;
			console.log('[SaveManager] Auto-save disabled');
		}
	}
}
