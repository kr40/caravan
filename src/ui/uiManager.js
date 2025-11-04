/**
 * UI Manager
 * Handles all UI elements and interactions
 */

class UIManager {
	constructor(gameState, marketSystem) {
		this.gameState = gameState;
		this.marketSystem = marketSystem;
		this.elements = this.cacheElements();
		this.onCityExit = null; // Callback for when player exits city
	}

	// Cache DOM elements
	cacheElements() {
		return {
			// HUD elements
			hudPanel: document.getElementById('hud-panel'),
			goldDisplay: document.getElementById('gold-display'),
			foodDisplay: document.getElementById('food-display'),
			cargoDisplay: document.getElementById('cargo-display'),
			dateDisplay: document.getElementById('date-display'),

			// Caravan modal elements
			caravanModal: document.getElementById('caravan-modal'),
			closeCaravanModal: document.getElementById('close-caravan-modal'),
			currentLocation: document.getElementById('current-location'),
			detailGold: document.getElementById('detail-gold'),
			detailFood: document.getElementById('detail-food'),
			detailCargo: document.getElementById('detail-cargo'),
			detailDate: document.getElementById('detail-date'),
			daysTraveled: document.getElementById('days-traveled'),
			totalTrades: document.getElementById('total-trades'),
			totalProfit: document.getElementById('total-profit'),
			currentCargoList: document.getElementById('current-cargo-list'),
			journeyHistory: document.getElementById('journey-history'),
			tradingHistory: document.getElementById('trading-history'),

			// Modal elements
			cityModal: document.getElementById('city-modal'),
			cityName: document.getElementById('city-name'),
			cityBackstory: document.getElementById('city-backstory'),
			closeModalBtn: document.getElementById('close-modal'),
			leaveCityBtn: document.getElementById('leave-city-btn'),

			// City menu
			cityMenu: document.getElementById('city-menu'),
			marketBtn: document.getElementById('market-btn'),
			buyFoodBtn: document.getElementById('buy-food-btn'),
			foodQtyInput: document.getElementById('food-qty'),

			// Market view
			marketView: document.getElementById('market-view'),
			goodsList: document.getElementById('goods-list'),
			backToCityBtn: document.getElementById('back-to-city-btn'),
		};
	}

	// Initialize event listeners
	initialize() {
		// HUD click to open caravan details
		this.elements.hudPanel.addEventListener('click', (e) => {
			console.log('[UI] HUD panel clicked');
			this.openCaravanModal();
		});

		// Caravan modal
		this.elements.closeCaravanModal.addEventListener('click', () => this.closeCaravanModal());

		// City modal
		this.elements.closeModalBtn.addEventListener('click', () => this.closeCityModal());
		this.elements.leaveCityBtn.addEventListener('click', () => this.closeCityModal());
		this.elements.marketBtn.addEventListener('click', () => this.openMarket());
		this.elements.backToCityBtn.addEventListener('click', () => this.backToCity());
		this.elements.buyFoodBtn.addEventListener('click', () => this.buyFood());
	}

	// Update HUD displays
	updateHUD() {
		this.elements.goldDisplay.textContent = this.gameState.playerCaravan.gold;
		this.elements.foodDisplay.textContent = Math.floor(this.gameState.playerCaravan.food);
		this.elements.cargoDisplay.textContent = `${this.gameState.getTotalCargoCount()}/${
			this.gameState.playerCaravan.maxCargo
		}`;
		this.elements.dateDisplay.textContent = this.gameState.getMedievalDate();
	}

	// Open caravan details modal
	openCaravanModal() {
		this.updateCaravanDetails();
		this.elements.caravanModal.classList.remove('hidden');
	}

	// Close caravan details modal
	closeCaravanModal() {
		this.elements.caravanModal.classList.add('hidden');
	}

	// Update caravan details content
	updateCaravanDetails() {
		// Update location
		this.elements.currentLocation.textContent = this.gameState.getCurrentLocationName();

		// Update stats
		this.elements.detailGold.textContent = this.gameState.playerCaravan.gold;
		this.elements.detailFood.textContent = `${Math.floor(this.gameState.playerCaravan.food)} units`;
		this.elements.detailCargo.textContent = `${this.gameState.getTotalCargoCount()} / ${
			this.gameState.playerCaravan.maxCargo
		}`;
		this.elements.detailDate.textContent = this.gameState.getMedievalDate();
		this.elements.daysTraveled.textContent = this.gameState.gameDay - 1;
		this.elements.totalTrades.textContent = this.gameState.totalTrades;
		this.elements.totalProfit.textContent = `${this.gameState.totalProfit} gold`;

		// Update current cargo
		this.updateCurrentCargo();

		// Update histories
		this.updateJourneyHistory();
		this.updateTradingHistory();
	}

	// Update current cargo display
	updateCurrentCargo() {
		const container = this.elements.currentCargoList;
		container.innerHTML = '';

		const cargo = this.gameState.playerCaravan.cargo;
		if (!cargo || cargo.length === 0) {
			container.innerHTML = '<p class="empty-message">No cargo currently loaded</p>';
			return;
		}

		cargo.forEach((item) => {
			const goodData = GoodsData[item.goodId];
			if (!goodData) return;

			const cargoItem = document.createElement('div');
			cargoItem.className = 'cargo-item';
			cargoItem.innerHTML = `
				<span class="cargo-item-name">${goodData.name}</span>
				<span class="cargo-item-qty">${item.quantity}</span>
			`;
			container.appendChild(cargoItem);
		});
	}

	// Update journey history display
	updateJourneyHistory() {
		const container = this.elements.journeyHistory;
		container.innerHTML = '';

		if (this.gameState.journeyHistory.length === 0) {
			container.innerHTML = '<p class="empty-message">Your journey begins...</p>';
			return;
		}

		this.gameState.journeyHistory.forEach((entry) => {
			const historyEntry = document.createElement('div');
			historyEntry.className = 'history-entry journey';
			historyEntry.innerHTML = `
				<span class="history-timestamp">Day ${entry.day}</span>
				Traveled from <strong>${entry.from}</strong> to <strong>${entry.to}</strong>
			`;
			container.appendChild(historyEntry);
		});
	}

	// Update trading history display
	updateTradingHistory() {
		const container = this.elements.tradingHistory;
		container.innerHTML = '';

		if (this.gameState.tradingHistory.length === 0) {
			container.innerHTML = '<p class="empty-message">No trades recorded yet</p>';
			return;
		}

		this.gameState.tradingHistory.forEach((entry) => {
			const historyEntry = document.createElement('div');
			historyEntry.className = 'history-entry trade';
			const actionText = entry.action === 'buy' ? 'Bought' : 'Sold';
			const sign = entry.action === 'buy' ? '-' : '+';
			historyEntry.innerHTML = `
				<span class="history-timestamp">Day ${entry.day} - ${entry.city}</span>
				${actionText} <strong>${entry.quantity} ${entry.good}</strong> @ ${entry.price}g each (${sign}${entry.total}g)
			`;
			container.appendChild(historyEntry);
		});
	}

	// Open city modal
	openCityModal(cityId) {
		const cityData = CitiesData[cityId];
		this.elements.cityName.textContent = cityData.name;
		this.elements.cityBackstory.textContent = cityData.backstory || cityData.description;
		this.elements.cityModal.classList.remove('hidden');
		this.elements.cityMenu.classList.remove('hidden');
		this.elements.marketView.classList.add('hidden');
	}

	// Close city modal
	closeCityModal() {
		this.elements.cityModal.classList.add('hidden');
		this.gameState.clearCurrentCity();
		if (this.onCityExit) {
			this.onCityExit();
		}
	}

	// Open market view
	openMarket() {
		this.elements.cityMenu.classList.add('hidden');
		this.elements.marketView.classList.remove('hidden');
		this.renderMarket();
	}

	// Back to city menu
	backToCity() {
		this.elements.marketView.classList.add('hidden');
		this.elements.cityMenu.classList.remove('hidden');
	}

	// Render market goods
	renderMarket() {
		const cityId = this.gameState.playerCaravan.currentCity;
		if (!cityId) return;

		const goodsList = this.elements.goodsList;
		goodsList.innerHTML = '';

		const allGoods = this.marketSystem.getAllGoods();

		Object.keys(allGoods).forEach((goodId) => {
			const good = allGoods[goodId];
			const marketPrice = this.marketSystem.getPrice(cityId, goodId);

			// Skip if city doesn't have this good in market
			if (!marketPrice) return;

			const cargoItem = this.gameState.getCargoItem(goodId);
			const playerQuantity = cargoItem ? cargoItem.quantity : 0;
			const avgCost = cargoItem ? cargoItem.avgCost : 0;

			const goodDiv = document.createElement('div');
			goodDiv.className = 'good-item';
			goodDiv.innerHTML = `
				<div class="good-info">
					<strong>${good.name}</strong>
					<div class="price-info">
						<span>Market Price: ${marketPrice} gold</span>
						${playerQuantity > 0 ? `<span>Your Avg: ${avgCost.toFixed(1)} gold</span>` : ''}
						<span>You have: ${playerQuantity}</span>
					</div>
				</div>
				<div class="good-actions">
					<input type="number" id="qty-${goodId}" value="1" min="1" class="qty-input">
					<button data-good="${goodId}" data-action="buy" class="action-btn buy-btn">Buy</button>
					<button data-good="${goodId}" data-action="sell" class="action-btn sell-btn" ${
				playerQuantity === 0 ? 'disabled' : ''
			}>Sell</button>
				</div>
			`;
			goodsList.appendChild(goodDiv);
		});

		// Add event listeners to buttons
		this.attachMarketListeners();
	}

	// Attach event listeners to market buttons
	attachMarketListeners() {
		const buyButtons = document.querySelectorAll('.buy-btn');
		const sellButtons = document.querySelectorAll('.sell-btn');

		buyButtons.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.stopPropagation();
				this.handleBuy(e.target.dataset.good);
			});
		});

		sellButtons.forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.stopPropagation();
				this.handleSell(e.target.dataset.good);
			});
		});
	}

	// Handle buy action
	handleBuy(goodId) {
		const cityId = this.gameState.playerCaravan.currentCity;
		const quantity = parseInt(document.getElementById(`qty-${goodId}`).value);

		const result = this.marketSystem.buyGoods(cityId, goodId, quantity);

		if (!result.success) {
			alert(result.reason);
			return;
		}

		this.updateHUD();
		this.renderMarket();
	}

	// Handle sell action
	handleSell(goodId) {
		const cityId = this.gameState.playerCaravan.currentCity;
		const quantity = parseInt(document.getElementById(`qty-${goodId}`).value);

		const result = this.marketSystem.sellGoods(cityId, goodId, quantity);

		if (!result.success) {
			alert(result.reason);
			return;
		}

		this.updateHUD();
		this.renderMarket();
	}

	// Buy food at the inn
	buyFood() {
		const quantity = parseInt(this.elements.foodQtyInput.value);
		const pricePerUnit = 2; // 2 gold per food
		const totalCost = quantity * pricePerUnit;

		if (this.gameState.playerCaravan.gold < totalCost) {
			alert(`Not enough gold! Need ${totalCost} gold.`);
			return;
		}

		this.gameState.removeGold(totalCost);
		this.gameState.addFood(quantity);
		this.updateHUD();
		alert(`Purchased ${quantity} food for ${totalCost} gold!`);
	}

	// Set callback for city exit
	setCityExitCallback(callback) {
		this.onCityExit = callback;
	}

	// Show notification (future enhancement)
	showNotification(message, type = 'info') {
		// Placeholder for notification system
		console.log(`[${type}] ${message}`);
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = UIManager;
}
