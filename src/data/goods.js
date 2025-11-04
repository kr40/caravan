/**
 * Game Goods Data
 * Defines all tradeable goods in the game
 */

const GoodsData = {
	grain: {
		name: 'Grain',
		basePrice: 10,
		category: 'food',
		description: 'Essential food crop grown in farmlands',
	},
	wool: {
		name: 'Wool',
		basePrice: 15,
		category: 'raw',
		description: 'Raw wool from sheep, used for textiles',
	},
	iron: {
		name: 'Iron Ore',
		basePrice: 25,
		category: 'raw',
		description: 'Raw ore mined from mountains',
	},
	tools: {
		name: 'Tools',
		basePrice: 50,
		category: 'crafted',
		description: 'Crafted implements for farming and construction',
	},
	wine: {
		name: 'Wine',
		basePrice: 80,
		category: 'luxury',
		description: 'Fine wine from the vineyards',
	},
	spices: {
		name: 'Spices',
		basePrice: 100,
		category: 'luxury',
		description: 'Exotic spices from distant lands',
	},
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = GoodsData;
}
