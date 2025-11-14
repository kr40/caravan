/**
 * Random Encounters Data
 * Defines encounters that can happen during travel based on terrain
 */

const EncountersData = {
	// Encounter types by terrain
	plains: [
		{
			id: 'merchant_plains',
			name: 'Traveling Merchant',
			type: 'positive',
			chance: 0.15,
			description: 'You meet a friendly merchant on the road who offers to trade.',
			effects: {
				goldMin: 50,
				goldMax: 150,
				message: 'The merchant buys some of your goods for {gold} gold!',
			},
		},
		{
			id: 'bandits_plains',
			name: 'Bandits',
			type: 'negative',
			chance: 0.12,
			description: 'Bandits ambush your caravan!',
			effects: {
				goldLossMin: 30,
				goldLossMax: 100,
				foodLossMin: 5,
				foodLossMax: 15,
				message: 'The bandits rob you of {gold} gold and {food} food!',
			},
		},
		{
			id: 'farmer_plains',
			name: 'Generous Farmer',
			type: 'positive',
			chance: 0.18,
			description: 'A farmer offers you fresh provisions.',
			effects: {
				foodMin: 10,
				foodMax: 25,
				message: 'The farmer gives you {food} food for your journey!',
			},
		},
		{
			id: 'patrol_plains',
			name: 'Road Patrol',
			type: 'positive',
			chance: 0.1,
			description: 'You encounter a patrol who shares information about nearby markets.',
			effects: {
				goldMin: 20,
				goldMax: 50,
				message: 'The guards tip you off about a trading opportunity worth {gold} gold!',
			},
		},
	],

	mountains: [
		{
			id: 'rockslide',
			name: 'Rockslide',
			type: 'negative',
			chance: 0.15,
			description: 'A rockslide blocks your path! You must take a longer route.',
			effects: {
				foodLossMin: 15,
				foodLossMax: 30,
				message: 'The detour costs you {food} extra food!',
			},
		},
		{
			id: 'mountain_wolf',
			name: 'Mountain Wolves',
			type: 'negative',
			chance: 0.18,
			description: 'A pack of wolves stalks your caravan!',
			effects: {
				foodLossMin: 20,
				foodLossMax: 40,
				goldLossMin: 0,
				goldLossMax: 50,
				message: 'You fend off the wolves but lose {food} food and {gold} gold in the chaos!',
			},
		},
		{
			id: 'mountain_hermit',
			name: 'Mountain Hermit',
			type: 'positive',
			chance: 0.12,
			description: 'A hermit shows you a shortcut through the mountains.',
			effects: {
				foodMin: 5,
				foodMax: 15,
				goldMin: 30,
				goldMax: 80,
				message: 'The hermit shares {food} food and points you to a cache with {gold} gold!',
			},
		},
		{
			id: 'mining_camp',
			name: 'Mining Camp',
			type: 'positive',
			chance: 0.14,
			description: 'You find a mining camp willing to trade.',
			effects: {
				goldMin: 100,
				goldMax: 200,
				message: 'The miners pay {gold} gold for supplies!',
			},
		},
	],

	forest: [
		{
			id: 'forest_bandits',
			name: 'Forest Bandits',
			type: 'negative',
			chance: 0.16,
			description: 'Bandits leap from the trees to ambush you!',
			effects: {
				goldLossMin: 50,
				goldLossMax: 150,
				foodLossMin: 10,
				foodLossMax: 20,
				message: 'The bandits steal {gold} gold and {food} food before vanishing into the trees!',
			},
		},
		{
			id: 'wild_boar',
			name: 'Wild Boar',
			type: 'negative',
			chance: 0.14,
			description: 'A wild boar charges at your caravan!',
			effects: {
				foodLossMin: 15,
				foodLossMax: 25,
				message: 'The boar damages your supplies, destroying {food} food!',
			},
		},
		{
			id: 'forest_ranger',
			name: 'Forest Ranger',
			type: 'positive',
			chance: 0.15,
			description: 'A ranger guides you safely through the forest.',
			effects: {
				foodMin: 20,
				foodMax: 35,
				message: 'The ranger helps you forage, gaining {food} food!',
			},
		},
		{
			id: 'mysterious_shrine',
			name: 'Mysterious Shrine',
			type: 'positive',
			chance: 0.08,
			description: 'You discover an ancient shrine with offerings.',
			effects: {
				goldMin: 80,
				goldMax: 180,
				message: 'You find {gold} gold at the shrine!',
			},
		},
		{
			id: 'druid_circle',
			name: 'Druid Circle',
			type: 'positive',
			chance: 0.1,
			description: 'Druids bless your journey.',
			effects: {
				foodMin: 15,
				foodMax: 30,
				goldMin: 20,
				goldMax: 60,
				message: 'The druids gift you {food} food and {gold} gold!',
			},
		},
	],

	desert: [
		{
			id: 'sandstorm',
			name: 'Sandstorm',
			type: 'negative',
			chance: 0.2,
			description: 'A fierce sandstorm forces you to take shelter.',
			effects: {
				foodLossMin: 20,
				foodLossMax: 40,
				message: 'The delay costs you {food} food!',
			},
		},
		{
			id: 'desert_raiders',
			name: 'Desert Raiders',
			type: 'negative',
			chance: 0.18,
			description: 'Desert raiders on camels surround your caravan!',
			effects: {
				goldLossMin: 80,
				goldLossMax: 200,
				foodLossMin: 15,
				foodLossMax: 30,
				message: 'The raiders take {gold} gold and {food} food!',
			},
		},
		{
			id: 'oasis',
			name: 'Hidden Oasis',
			type: 'positive',
			chance: 0.12,
			description: 'You find a hidden oasis!',
			effects: {
				foodMin: 25,
				foodMax: 45,
				message: 'You rest and gather {food} food from the oasis!',
			},
		},
		{
			id: 'nomad_traders',
			name: 'Nomad Traders',
			type: 'positive',
			chance: 0.15,
			description: 'Nomadic traders share their camp with you.',
			effects: {
				goldMin: 60,
				goldMax: 140,
				foodMin: 10,
				foodMax: 20,
				message: 'You trade stories and goods, earning {gold} gold and {food} food!',
			},
		},
		{
			id: 'scorpion_attack',
			name: 'Giant Scorpions',
			type: 'negative',
			chance: 0.15,
			description: 'Giant scorpions attack your caravan!',
			effects: {
				foodLossMin: 10,
				foodLossMax: 25,
				goldLossMin: 20,
				goldLossMax: 60,
				message: 'You fight off the scorpions but lose {food} food and {gold} gold!',
			},
		},
	],

	river: [
		{
			id: 'river_pirates',
			name: 'River Pirates',
			type: 'negative',
			chance: 0.14,
			description: 'Pirates demand a toll to cross their waters!',
			effects: {
				goldLossMin: 60,
				goldLossMax: 120,
				message: 'You pay the pirates {gold} gold to pass safely.',
			},
		},
		{
			id: 'fishermen',
			name: 'Friendly Fishermen',
			type: 'positive',
			chance: 0.18,
			description: 'Fishermen share their catch with you.',
			effects: {
				foodMin: 20,
				foodMax: 40,
				message: 'The fishermen give you {food} food!',
			},
		},
		{
			id: 'river_merchant',
			name: 'River Merchant',
			type: 'positive',
			chance: 0.15,
			description: 'A merchant on a riverboat offers to trade.',
			effects: {
				goldMin: 70,
				goldMax: 150,
				message: 'You trade goods for {gold} gold!',
			},
		},
		{
			id: 'flash_flood',
			name: 'Flash Flood',
			type: 'negative',
			chance: 0.12,
			description: 'Sudden rains cause dangerous flooding!',
			effects: {
				foodLossMin: 15,
				foodLossMax: 35,
				goldLossMin: 30,
				goldLossMax: 80,
				message: 'The flood damages your cargo, losing {food} food and {gold} gold!',
			},
		},
	],
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = EncountersData;
}
