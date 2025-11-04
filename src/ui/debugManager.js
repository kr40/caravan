/**
 * Debug Manager
 * Handles debug/cheat menu functionality for testing
 */

class DebugManager {
	constructor(gameState, uiManager) {
		this.gameState = gameState;
		this.uiManager = uiManager;
		this.elements = this.cacheElements();
		this.onTeleport = null; // Callback for teleporting
		this.onReset = null; // Callback for game reset
		this.onResetCamera = null; // Callback for camera reset
	}

	// Cache DOM elements
	cacheElements() {
		return {
			debugMenu: document.getElementById('debug-menu'),
			closeDebugBtn: document.getElementById('close-debug'),

			// Resource controls
			debugGoldInput: document.getElementById('debug-gold'),
			debugFoodInput: document.getElementById('debug-food'),
			setGoldBtn: document.getElementById('set-gold-btn'),
			setFoodBtn: document.getElementById('set-food-btn'),

			// Quick actions
			addGoldBtn: document.getElementById('add-gold-btn'),
			addFoodBtn: document.getElementById('add-food-btn'),
			clearCargoBtn: document.getElementById('clear-cargo-btn'),
			fillCargoBtn: document.getElementById('fill-cargo-btn'),

			// Game state
			resetGameBtn: document.getElementById('reset-game-btn'),
			advanceDayBtn: document.getElementById('advance-day-btn'),
			resetCameraBtn: document.getElementById('reset-camera-btn'),

			// Teleport
			teleportCitySelect: document.getElementById('teleport-city'),
			teleportBtn: document.getElementById('teleport-btn'),
		};
	}

	// Initialize event listeners
	initialize() {
		// Menu toggle with ~ key
		document.addEventListener('keydown', (e) => {
			if (e.key === '`' || e.key === '~') {
				e.preventDefault();
				this.toggleDebugMenu();
			}
			// ESC to close
			if (e.key === 'Escape' && !this.elements.debugMenu.classList.contains('hidden')) {
				this.closeDebugMenu();
			}
		});

		this.elements.closeDebugBtn.addEventListener('click', () => this.closeDebugMenu());

		// Resource controls
		this.elements.setGoldBtn.addEventListener('click', () => this.setGold());
		this.elements.setFoodBtn.addEventListener('click', () => this.setFood());

		// Quick actions
		this.elements.addGoldBtn.addEventListener('click', () => this.addGold(1000));
		this.elements.addFoodBtn.addEventListener('click', () => this.addFood(100));
		this.elements.clearCargoBtn.addEventListener('click', () => this.clearCargo());
		this.elements.fillCargoBtn.addEventListener('click', () => this.fillCargo());

		// Game state
		this.elements.resetGameBtn.addEventListener('click', () => this.resetGame());
		this.elements.advanceDayBtn.addEventListener('click', () => this.advanceDays(10));
		this.elements.resetCameraBtn.addEventListener('click', () => this.resetCamera());

		// Teleport
		this.elements.teleportBtn.addEventListener('click', () => this.teleport());
	}

	// Toggle debug menu
	toggleDebugMenu() {
		if (this.elements.debugMenu.classList.contains('hidden')) {
			this.openDebugMenu();
		} else {
			this.closeDebugMenu();
		}
	}

	// Open debug menu
	openDebugMenu() {
		// Update inputs with current values
		this.elements.debugGoldInput.value = this.gameState.playerCaravan.gold;
		this.elements.debugFoodInput.value = Math.floor(this.gameState.playerCaravan.food);
		this.elements.debugMenu.classList.remove('hidden');
	}

	// Close debug menu
	closeDebugMenu() {
		this.elements.debugMenu.classList.add('hidden');
	}

	// Set gold to specific value
	setGold() {
		const value = parseInt(this.elements.debugGoldInput.value);
		if (!isNaN(value) && value >= 0) {
			this.gameState.playerCaravan.gold = value;
			this.uiManager.updateHUD();
			console.log(`[DEBUG] Gold set to ${value}`);
		}
	}

	// Set food to specific value
	setFood() {
		const value = parseInt(this.elements.debugFoodInput.value);
		if (!isNaN(value) && value >= 0) {
			this.gameState.playerCaravan.food = value;
			this.uiManager.updateHUD();
			console.log(`[DEBUG] Food set to ${value}`);
		}
	}

	// Add gold
	addGold(amount) {
		this.gameState.playerCaravan.gold += amount;
		this.elements.debugGoldInput.value = this.gameState.playerCaravan.gold;
		this.uiManager.updateHUD();
		console.log(`[DEBUG] Added ${amount} gold`);
	}

	// Add food
	addFood(amount) {
		this.gameState.playerCaravan.food += amount;
		this.elements.debugFoodInput.value = Math.floor(this.gameState.playerCaravan.food);
		this.uiManager.updateHUD();
		console.log(`[DEBUG] Added ${amount} food`);
	}

	// Clear all cargo
	clearCargo() {
		this.gameState.playerCaravan.cargo = [];
		this.uiManager.updateHUD();
		console.log('[DEBUG] Cargo cleared');
	}

	// Fill cargo with test goods
	fillCargo() {
		const goods = ['grain', 'wool', 'iron', 'tools', 'wine', 'spices'];
		this.gameState.playerCaravan.cargo = [];

		// Add a variety of goods
		goods.forEach((good, index) => {
			this.gameState.addCargo(good, 10 + index * 5, 10);
		});

		this.uiManager.updateHUD();
		console.log('[DEBUG] Cargo filled with test goods');
	}

	// Reset game to initial state
	resetGame() {
		if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
			// Reset game state
			this.gameState.playerCaravan.gold = 1000;
			this.gameState.playerCaravan.food = 50;
			this.gameState.playerCaravan.cargo = [];
			this.gameState.gameDay = 1;
			this.gameState.clearCurrentCity();

			// Clear history
			this.gameState.journeyHistory = [];
			this.gameState.tradingHistory = [];
			this.gameState.totalTrades = 0;
			this.gameState.totalProfit = 0;

			this.uiManager.updateHUD();
			this.closeDebugMenu();

			// Call reset callback if set
			if (this.onReset) {
				this.onReset();
			}

			console.log('[DEBUG] Game reset to initial state');
		}
	}

	// Advance game days
	advanceDays(days) {
		this.gameState.gameDay += days;
		this.uiManager.updateHUD();
		console.log(`[DEBUG] Advanced ${days} days`);
	}

	// Teleport to selected city
	teleport() {
		const cityId = this.elements.teleportCitySelect.value;
		if (cityId && CitiesData[cityId]) {
			this.closeDebugMenu();

			// Call teleport callback if set
			if (this.onTeleport) {
				this.onTeleport(cityId);
			}

			console.log(`[DEBUG] Teleported to ${CitiesData[cityId].name}`);
		}
	}

	// Reset camera to default position
	resetCamera() {
		if (this.onResetCamera) {
			this.onResetCamera();
		}
		console.log('[DEBUG] Camera reset to default position');
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = DebugManager;
}
