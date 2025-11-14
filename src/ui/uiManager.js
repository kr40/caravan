/**
 * UI Manager
 * Handles all UI elements and interactions
 */

class UIManager {
	constructor(gameState, marketSystem, mercenarySystem) {
		this.gameState = gameState;
		this.marketSystem = marketSystem;
		this.mercenarySystem = mercenarySystem;
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
			caravanMercenariesList: document.getElementById('caravan-mercenaries-list'),
			journeyHistory: document.getElementById('journey-history'),
			encounterHistory: document.getElementById('encounter-history'),
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
			innBtn: document.getElementById('inn-btn'),
			buyFoodBtn: document.getElementById('buy-food-btn'),
			foodQtyInput: document.getElementById('food-qty'),

			// Inn view
			innView: document.getElementById('inn-view'),
			availableMercenaries: document.getElementById('available-mercenaries'),
			hiredMercenaries: document.getElementById('hired-mercenaries'),
			backToCityFromInnBtn: document.getElementById('back-to-city-from-inn-btn'),

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

		// Setup tabs
		this.initializeTabs();

		// City modal
		this.elements.closeModalBtn.addEventListener('click', () => this.closeCityModal());
		this.elements.leaveCityBtn.addEventListener('click', () => this.closeCityModal());
		this.elements.marketBtn.addEventListener('click', () => this.openMarket());
		this.elements.innBtn.addEventListener('click', () => this.openInn());
		this.elements.backToCityBtn.addEventListener('click', () => this.backToCity());
		this.elements.backToCityFromInnBtn.addEventListener('click', () => this.backToCity());
		this.elements.buyFoodBtn.addEventListener('click', () => this.buyFood());

		// Modal click outside to close
		this.elements.caravanModal.addEventListener('click', (e) => {
			if (e.target === this.elements.caravanModal) {
				this.closeCaravanModal();
			}
		});

		this.elements.cityModal.addEventListener('click', (e) => {
			if (e.target === this.elements.cityModal) {
				this.closeCityModal();
			}
		});

		// ESC key to close modals
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				if (!this.elements.caravanModal.classList.contains('hidden')) {
					this.closeCaravanModal();
				} else if (!this.elements.cityModal.classList.contains('hidden')) {
					this.closeCityModal();
				}
			}
		});
	}

	// Initialize tab functionality
	initializeTabs() {
		const tabButtons = document.querySelectorAll('.tab-btn');

		tabButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const tabName = button.getAttribute('data-tab');
				this.switchTab(tabName);
			});
		});
	}

	// Switch between tabs
	switchTab(tabName) {
		// Remove active class from all buttons and panels
		document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
		document.querySelectorAll('.tab-panel').forEach((panel) => panel.classList.remove('active'));

		// Add active class to clicked button and corresponding panel
		const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
		const activePanel = document.getElementById(`tab-${tabName}`);

		if (activeButton && activePanel) {
			activeButton.classList.add('active');
			activePanel.classList.add('active');
		}
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

		// Update hired mercenaries
		this.updateCaravanMercenaries();

		// Update histories
		this.updateJourneyHistory();
		this.updateEncounterHistory();
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

	// Update caravan mercenaries display
	updateCaravanMercenaries() {
		const container = this.elements.caravanMercenariesList;
		container.innerHTML = '';

		const hiredMercs = this.mercenarySystem.getHiredMercenaries();

		if (!hiredMercs || hiredMercs.length === 0) {
			container.innerHTML = '<p class="empty-message">No mercenaries hired</p>';
			return;
		}

		hiredMercs.forEach((merc) => {
			const mercItem = document.createElement('div');
			mercItem.className = 'mercenary-item';
			mercItem.style.cssText = `
				background: rgba(76, 175, 80, 0.1);
				border: 2px solid #4CAF50;
				border-radius: 8px;
				padding: 12px;
				margin-bottom: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
			`;

			// Build skills display
			let skillsHTML = '<div style="font-size: 11px; color: #aaa; margin-top: 5px;">';
			if (merc.skills.combat > 0.3) skillsHTML += `⚔️ Combat ${Math.round(merc.skills.combat * 100)}% `;
			if (merc.skills.negotiation > 0.3) skillsHTML += `💬 Negotiation ${Math.round(merc.skills.negotiation * 100)}% `;
			if (merc.skills.foraging > 0.3) skillsHTML += `🌿 Foraging ${Math.round(merc.skills.foraging * 100)}% `;
			if (merc.skills.avoidance) skillsHTML += `👁️ Avoidance ${Math.round(merc.skills.avoidance * 100)}% `;
			if (merc.skills.trading) skillsHTML += `💰 Trading ${Math.round(merc.skills.trading * 100)}% `;
			if (merc.skills.foodEfficiency) skillsHTML += `🍖 Food -${Math.round(merc.skills.foodEfficiency * 20)}% `;
			skillsHTML += '</div>';

			mercItem.innerHTML = `
				<div>
					<div style="font-size: 18px; font-weight: bold; color: #4CAF50;">
						${merc.icon} ${merc.name}
					</div>
					<div style="font-size: 12px; color: #bbb; margin-top: 3px;">
						${merc.type.charAt(0).toUpperCase() + merc.type.slice(1)}
					</div>
					${skillsHTML}
				</div>
				<div style="text-align: right;">
					<div style="font-size: 11px; color: #FFD700;">
						Upkeep: ${merc.upkeep}g/day
					</div>
				</div>
			`;

			container.appendChild(mercItem);
		});
	}

	// Update encounter history display
	updateEncounterHistory() {
		const container = this.elements.encounterHistory;
		container.innerHTML = '';

		if (this.gameState.encounterHistory.length === 0) {
			container.innerHTML = '<p class="empty-message">No encounters yet</p>';
			return;
		}

		this.gameState.encounterHistory.forEach((entry) => {
			const historyEntry = document.createElement('div');
			historyEntry.className = `history-entry ${
				entry.type === 'positive' ? 'positive-encounter' : 'negative-encounter'
			}`;

			const icon = entry.type === 'positive' ? '✨' : '⚠️';
			const mercInfo = entry.mercenary ? ` (helped by ${entry.mercenary})` : '';

			historyEntry.innerHTML = `
				<span class="history-timestamp">Day ${entry.day}</span>
				${icon} <strong>${entry.name}</strong>${mercInfo}<br>
				<span style="font-size: 0.9em; color: #bbb;">${entry.result}</span>
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
		this.elements.innView.classList.add('hidden');
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
		this.elements.innView.classList.add('hidden');
		this.renderMarket();
	}

	// Open inn view
	openInn() {
		this.elements.cityMenu.classList.add('hidden');
		this.elements.marketView.classList.add('hidden');
		this.elements.innView.classList.remove('hidden');
		this.renderInn();
	}

	// Back to city menu
	backToCity() {
		this.elements.marketView.classList.add('hidden');
		this.elements.innView.classList.add('hidden');
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

	// Render inn with mercenaries
	renderInn() {
		const cityId = this.gameState.playerCaravan.currentCity;
		if (!cityId) return;

		// Render available mercenaries
		this.renderAvailableMercenaries(cityId);
		// Render hired mercenaries
		this.renderHiredMercenaries();
	}

	// Render available mercenaries for hire
	renderAvailableMercenaries(cityId) {
		const availableList = this.elements.availableMercenaries;
		availableList.innerHTML = '';

		const mercenaries = this.mercenarySystem.getAvailableMercenaries(cityId);

		if (mercenaries.length === 0) {
			availableList.innerHTML =
				'<p style="color: #aaa; padding: 15px;">No mercenaries available for hire in this city.</p>';
			return;
		}

		mercenaries.forEach((merc) => {
			const mercDiv = document.createElement('div');
			mercDiv.className = 'mercenary-card';
			mercDiv.style.cssText = `
				background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
				border: 2px solid #555;
				border-radius: 8px;
				padding: 15px;
				margin: 10px 0;
				color: white;
			`;

			// Build skills display
			let skillsHTML = '<div style="margin: 10px 0; font-size: 13px; color: #aaa;">';
			if (merc.skills.combat > 0.3)
				skillsHTML += `<span style="margin-right: 10px;">⚔️ Combat: ${Math.round(merc.skills.combat * 100)}%</span>`;
			if (merc.skills.negotiation > 0.3)
				skillsHTML += `<span style="margin-right: 10px;">💬 Negotiation: ${Math.round(
					merc.skills.negotiation * 100
				)}%</span>`;
			if (merc.skills.foraging > 0.3)
				skillsHTML += `<span style="margin-right: 10px;">🌿 Foraging: ${Math.round(
					merc.skills.foraging * 100
				)}%</span>`;
			if (merc.skills.avoidance)
				skillsHTML += `<span style="margin-right: 10px;">👁️ Avoidance: ${Math.round(
					merc.skills.avoidance * 100
				)}%</span>`;
			if (merc.skills.trading)
				skillsHTML += `<span style="margin-right: 10px;">💰 Trading: ${Math.round(merc.skills.trading * 100)}%</span>`;
			if (merc.skills.foodEfficiency)
				skillsHTML += `<span style="margin-right: 10px;">🍖 Food Efficiency: ${Math.round(
					merc.skills.foodEfficiency * 100
				)}%</span>`;
			skillsHTML += '</div>';

			mercDiv.innerHTML = `
				<div style="display: flex; justify-content: space-between; align-items: start;">
					<div style="flex: 1;">
						<div style="font-size: 24px; margin-bottom: 5px;">${merc.icon}</div>
						<div style="font-size: 18px; font-weight: bold; margin-bottom: 5px;">${merc.name}</div>
						<div style="font-size: 14px; color: #4CAF50; margin-bottom: 5px;">${
							merc.type.charAt(0).toUpperCase() + merc.type.slice(1)
						}</div>
						<div style="font-size: 13px; color: #bbb; margin-bottom: 10px;">${merc.description}</div>
						${skillsHTML}
						<div style="font-size: 13px; color: #FFD700; margin-top: 5px;">
							💰 Hire Cost: ${merc.cost} gold | Daily Upkeep: ${merc.upkeep} gold/day
						</div>
					</div>
					<button class="hire-merc-btn" data-merc-id="${merc.id}" style="
						padding: 10px 20px;
						background: #4CAF50;
						border: none;
						border-radius: 5px;
						color: white;
						font-weight: bold;
						cursor: pointer;
						transition: all 0.3s;
						margin-left: 15px;
					">Hire</button>
				</div>
			`;

			availableList.appendChild(mercDiv);
		});

		// Add event listeners to hire buttons
		document.querySelectorAll('.hire-merc-btn').forEach((btn) => {
			btn.addEventListener('mouseenter', () => {
				btn.style.transform = 'scale(1.05)';
				btn.style.boxShadow = '0 5px 15px rgba(76, 175, 80, 0.5)';
			});
			btn.addEventListener('mouseleave', () => {
				btn.style.transform = 'scale(1)';
				btn.style.boxShadow = 'none';
			});
			btn.addEventListener('click', (e) => {
				const mercId = e.target.getAttribute('data-merc-id');
				this.hireMercenary(mercId, cityId);
			});
		});
	}

	// Render hired mercenaries
	renderHiredMercenaries() {
		const hiredList = this.elements.hiredMercenaries;
		hiredList.innerHTML = '';

		const hired = this.mercenarySystem.getHiredMercenaries();

		if (hired.length === 0) {
			hiredList.innerHTML = '<p style="color: #aaa; padding: 15px;">No mercenaries hired yet.</p>';
			return;
		}

		hired.forEach((merc) => {
			const mercDiv = document.createElement('div');
			mercDiv.className = 'mercenary-card';
			mercDiv.style.cssText = `
				background: linear-gradient(135deg, #2a4a2a 0%, #1a3a1a 100%);
				border: 2px solid #4CAF50;
				border-radius: 8px;
				padding: 15px;
				margin: 10px 0;
				color: white;
			`;

			mercDiv.innerHTML = `
				<div style="display: flex; justify-content: space-between; align-items: start;">
					<div style="flex: 1;">
						<div style="font-size: 20px; margin-bottom: 5px;">${merc.icon} ${merc.name}</div>
						<div style="font-size: 13px; color: #4CAF50;">${merc.type.charAt(0).toUpperCase() + merc.type.slice(1)}</div>
						<div style="font-size: 12px; color: #FFD700; margin-top: 5px;">Daily Upkeep: ${merc.upkeep} gold/day</div>
					</div>
					<button class="dismiss-merc-btn" data-merc-id="${merc.id}" style="
						padding: 8px 16px;
						background: #f44336;
						border: none;
						border-radius: 5px;
						color: white;
						font-weight: bold;
						cursor: pointer;
						transition: all 0.3s;
						margin-left: 15px;
					">Dismiss</button>
				</div>
			`;

			hiredList.appendChild(mercDiv);
		});

		// Add event listeners to dismiss buttons
		document.querySelectorAll('.dismiss-merc-btn').forEach((btn) => {
			btn.addEventListener('mouseenter', () => {
				btn.style.transform = 'scale(1.05)';
				btn.style.boxShadow = '0 5px 15px rgba(244, 67, 54, 0.5)';
			});
			btn.addEventListener('mouseleave', () => {
				btn.style.transform = 'scale(1)';
				btn.style.boxShadow = 'none';
			});
			btn.addEventListener('click', (e) => {
				const mercId = e.target.getAttribute('data-merc-id');
				this.dismissMercenary(mercId);
			});
		});
	}

	// Hire a mercenary
	hireMercenary(mercId, cityId) {
		const mercenaries = this.mercenarySystem.getAvailableMercenaries(cityId);
		const merc = mercenaries.find((m) => m.id === mercId);

		if (!merc) return;

		const result = this.mercenarySystem.hireMercenary(merc);
		alert(result.message);

		if (result.success) {
			this.updateHUD();
			this.renderInn();
		}
	}

	// Dismiss a mercenary
	dismissMercenary(mercId) {
		const confirm = window.confirm('Are you sure you want to dismiss this mercenary?');
		if (!confirm) return;

		const result = this.mercenarySystem.dismissMercenary(mercId);
		alert(result.message);

		if (result.success) {
			this.renderInn();
		}
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
