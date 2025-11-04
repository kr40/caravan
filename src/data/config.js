/**
 * Game Configuration
 * Central configuration for game constants and settings
 */

const GameConfig = {
	// Caravan defaults
	caravan: {
		startingGold: 1000,
		startingFood: 50,
		startingCargo: 100,
		baseSpeed: 1.0,
		baseFoodCost: 1, // Daily food cost for the caravan itself
		soldierFoodCost: 1, // Daily food cost per soldier
		soldierWageCost: 1, // Daily wage per soldier
		startingSoldiers: 5,
	},

	// World settings
	world: {
		size: 1500, // Expanded from 1000 to 1500
		gridSize: 30, // Increased grid spacing
	},

	// Camera settings
	camera: {
		fov: 45,
		near: 1,
		far: 2000, // Increased to see the larger map
		position: { x: 0, y: 400, z: 400 }, // Moved camera higher and further
	},

	// Rendering
	rendering: {
		antialias: true,
		backgroundColor: 0x87ceeb, // Sky blue
	},

	// Game mechanics
	mechanics: {
		movementSpeed: 0.02, // Lerp speed for caravan movement
		arrivalThreshold: 1, // Distance to consider "arrived" at city
		baseMovementCost: 0.1, // Base food cost per distance unit
	},

	// Terrain types and their properties
	terrain: {
		plains: {
			name: 'Plains',
			speedMultiplier: 1.0, // Normal speed
			foodMultiplier: 1.0, // Normal food consumption
			color: 0x7cb342, // Green
		},
		forest: {
			name: 'Forest',
			speedMultiplier: 0.7, // Slower movement
			foodMultiplier: 1.3, // More food (harder to navigate)
			color: 0x2e7d32, // Dark green
		},
		mountains: {
			name: 'Mountains',
			speedMultiplier: 0.5, // Much slower
			foodMultiplier: 1.8, // Much more food (steep climbs)
			color: 0x5d4037, // Brown
		},
		desert: {
			name: 'Desert',
			speedMultiplier: 0.6, // Slower in sand
			foodMultiplier: 2.0, // Highest food cost (harsh conditions)
			color: 0xfdd835, // Yellow
		},
		river: {
			name: 'River',
			speedMultiplier: 0.4, // Very slow (crossing water)
			foodMultiplier: 1.5, // More food (building rafts, etc.)
			color: 0x1976d2, // Blue
		},
		road: {
			name: 'Road',
			speedMultiplier: 1.5, // Faster on roads
			foodMultiplier: 0.7, // Less food (easier travel)
			color: 0x8d6e63, // Brown-grey
		},
	},

	// Colors for visual elements
	colors: {
		ground: 0x4a7c39,
		caravan: 0x8b4513,
		city: 0x999999,
		cityMarker: 0xff0000,
		grid: {
			center: 0x000000,
			lines: 0x555555,
		},
	},

	// UI Colors (for consistency with CSS)
	ui: {
		primary: '#d4af37',
		secondary: '#8b6f47',
		background: '#3a2f26',
		backgroundDark: '#2a1f16',
	},
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = GameConfig;
}
