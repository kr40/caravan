/**
 * Roads and Obstacles Data
 * Defines road connections between cities and natural obstacles
 */

const RoadsData = {
	// Road connections between cities (bidirectional)
	connections: [
		// Main trade routes
		{ from: 'rivertown', to: 'portcity', type: 'road', terrain: 'plains' },
		{ from: 'rivertown', to: 'eastmarket', type: 'road', terrain: 'plains' },
		{ from: 'rivertown', to: 'laketown', type: 'road', terrain: 'plains' },

		{ from: 'portcity', to: 'vineyards', type: 'road', terrain: 'plains' },
		{ from: 'portcity', to: 'stormhaven', type: 'bridge', terrain: 'river' }, // Coastal bridge

		{ from: 'vineyards', to: 'highcliff', type: 'road', terrain: 'plains' },
		{ from: 'vineyards', to: 'sandport', type: 'road', terrain: 'desert' },

		{ from: 'eastmarket', to: 'northkeep', type: 'road', terrain: 'plains' },
		{ from: 'eastmarket', to: 'goldenfields', type: 'road', terrain: 'plains' },

		{ from: 'northkeep', to: 'foresthold', type: 'road', terrain: 'forest' },
		{ from: 'northkeep', to: 'laketown', type: 'bridge', terrain: 'river' },

		{ from: 'foresthold', to: 'goldenfields', type: 'road', terrain: 'forest' },

		{ from: 'mountainhold', to: 'silvermine', type: 'mountain_pass', terrain: 'mountains' },
		{ from: 'mountainhold', to: 'ironforge', type: 'mountain_pass', terrain: 'mountains' },

		{ from: 'silvermine', to: 'ironforge', type: 'mountain_pass', terrain: 'mountains' },

		{ from: 'ironforge', to: 'foresthold', type: 'road', terrain: 'plains' },

		{ from: 'sandport', to: 'stormhaven', type: 'road', terrain: 'desert' },

		{ from: 'laketown', to: 'goldenfields', type: 'road', terrain: 'plains' },

		{ from: 'goldenfields', to: 'vineyards', type: 'road', terrain: 'plains' },

		{ from: 'highcliff', to: 'stormhaven', type: 'road', terrain: 'plains' },

		{ from: 'westwood', to: 'goldenfields', type: 'road', terrain: 'plains' },
		{ from: 'westwood', to: 'foresthold', type: 'road', terrain: 'forest' },
	],

	// Road type properties
	types: {
		road: {
			name: 'Road',
			speedBonus: 1.5,
			foodMultiplier: 0.8,
			color: 0x8b7355, // Brown
			description: 'A well-maintained road',
		},
		bridge: {
			name: 'Bridge',
			speedBonus: 1.3,
			foodMultiplier: 0.9,
			color: 0x6b5d4f, // Dark brown
			description: 'A sturdy bridge crossing water',
		},
		mountain_pass: {
			name: 'Mountain Pass',
			speedBonus: 1.2,
			foodMultiplier: 1.1,
			color: 0x9b8b7e, // Light brown/grey
			description: 'A carved path through the mountains',
		},
	},
};

// Obstacles that block direct paths between certain cities
const ObstaclesData = {
	// Mountain ranges - block direct passage
	mountains: [
		{
			name: 'Ironpeak Range',
			// Creates a barrier between western mountains and eastern plains
			points: [
				{ x: -400, z: -200 },
				{ x: -250, z: -200 },
				{ x: -200, z: -100 },
				{ x: -250, z: 0 },
				{ x: -350, z: 50 },
				{ x: -450, z: 0 },
			],
			blocksDirect: [
				{ from: 'rivertown', to: 'mountainhold' },
				{ from: 'rivertown', to: 'silvermine' },
				{ from: 'portcity', to: 'mountainhold' },
				{ from: 'eastmarket', to: 'ironforge' },
			],
		},
		{
			name: 'Northern Peaks',
			points: [
				{ x: -100, z: -250 },
				{ x: 50, z: -300 },
				{ x: 150, z: -280 },
			],
			blocksDirect: [{ from: 'rivertown', to: 'silvermine' }],
		},
	],

	// Major rivers - require bridges to cross
	rivers: [
		{
			name: 'Great River',
			// Runs through the middle of the map
			points: [
				{ x: -100, z: 400 },
				{ x: 0, z: 300 },
				{ x: 50, z: 200 },
				{ x: 80, z: 100 },
				{ x: 100, z: 0 },
				{ x: 110, z: -100 },
				{ x: 100, z: -200 },
			],
			width: 30,
			blocksDirect: [
				{ from: 'portcity', to: 'rivertown' }, // Must use road
				{ from: 'northkeep', to: 'laketown' }, // Must use bridge
			],
		},
		{
			name: 'Western Stream',
			points: [
				{ x: -200, z: 200 },
				{ x: -250, z: 100 },
				{ x: -300, z: 0 },
			],
			width: 20,
			blocksDirect: [],
		},
	],

	// Dense forests - difficult to traverse without roads
	forests: [
		{
			name: 'Deepwood',
			center: { x: -100, z: 100 },
			radius: 80,
			blocksDirect: [
				{ from: 'rivertown', to: 'foresthold' },
				{ from: 'northkeep', to: 'windmill' },
			],
		},
	],

	// Desert regions - harsh terrain
	deserts: [
		{
			name: 'Sun-scorched Wastes',
			center: { x: 200, z: -250 },
			radius: 100,
			blocksDirect: [{ from: 'vineyards', to: 'stormhaven' }],
		},
	],
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { RoadsData, ObstaclesData };
}
