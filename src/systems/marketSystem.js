/**
 * Market System
 * Handles all trading and market-related logic
 */

class MarketSystem {
	constructor(gameState) {
		this.gameState = gameState;
		this.goodsData = GoodsData;
		this.citiesData = CitiesData;
	}

	// Get market data for a city
	getCityMarket(cityId) {
		return this.citiesData[cityId].market;
	}

	// Get price of a good in a city
	getPrice(cityId, goodId) {
		const market = this.getCityMarket(cityId);
		return market[goodId]?.price || 0;
	}

	// Check if player can buy
	canBuy(cityId, goodId, quantity) {
		const price = this.getPrice(cityId, goodId);
		const totalCost = price * quantity;
		const currentCargoCount = this.gameState.getTotalCargoCount();

		if (this.gameState.playerCaravan.gold < totalCost) {
			return { success: false, reason: 'Not enough gold!' };
		}
		if (currentCargoCount + quantity > this.gameState.playerCaravan.maxCargo) {
			return { success: false, reason: 'Not enough cargo space!' };
		}
		return { success: true };
	}

	// Buy goods
	buyGoods(cityId, goodId, quantity) {
		const check = this.canBuy(cityId, goodId, quantity);
		if (!check.success) {
			return check;
		}

		const price = this.getPrice(cityId, goodId);
		const totalCost = price * quantity;

		// Remove gold
		this.gameState.removeGold(totalCost);

		// Add cargo
		this.gameState.addCargo(goodId, quantity, price);

		// Track trade in history
		const cityData = CitiesData[cityId];
		const goodData = GoodsData[goodId];
		if (cityData && goodData) {
			this.gameState.addTradeEntry(cityData.name, 'buy', goodData.name, quantity, price, totalCost);
		}

		return { success: true, cost: totalCost };
	}

	// Check if player can sell
	canSell(goodId, quantity) {
		const cargoItem = this.gameState.getCargoItem(goodId);
		if (!cargoItem || cargoItem.quantity < quantity) {
			return { success: false, reason: 'Not enough goods to sell!' };
		}
		return { success: true };
	}

	// Sell goods
	sellGoods(cityId, goodId, quantity) {
		const check = this.canSell(goodId, quantity);
		if (!check.success) {
			return check;
		}

		const price = this.getPrice(cityId, goodId);
		const totalRevenue = price * quantity;

		// Add gold
		this.gameState.addGold(totalRevenue);

		// Remove cargo
		this.gameState.removeCargo(goodId, quantity);

		// Track trade in history
		const cityData = CitiesData[cityId];
		const goodData = GoodsData[goodId];
		if (cityData && goodData) {
			this.gameState.addTradeEntry(cityData.name, 'sell', goodData.name, quantity, price, totalRevenue);
		}

		return { success: true, revenue: totalRevenue };
	}

	// Get all goods info
	getAllGoods() {
		return this.goodsData;
	}

	// Get good info
	getGoodInfo(goodId) {
		return this.goodsData[goodId];
	}

	// Calculate profit margin for a good in a city
	calculateProfitMargin(cityId, goodId) {
		const cargoItem = this.gameState.getCargoItem(goodId);
		if (!cargoItem) return 0;

		const sellPrice = this.getPrice(cityId, goodId);
		const avgCost = cargoItem.avgCost;
		return sellPrice - avgCost;
	}

	// Future: Dynamic pricing
	updatePrices() {
		// Placeholder for dynamic price fluctuations
	}

	// Future: Global events affecting prices
	applyGlobalEvent(eventId) {
		// Placeholder for global events (war, famine, etc.)
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = MarketSystem;
}
