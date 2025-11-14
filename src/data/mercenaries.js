/**
 * Mercenaries Data
 * Defines mercenary types, their skills, and hiring costs
 */

const MercenariesData = {
	// Mercenary types and their specialties
	types: {
		warrior: {
			name: 'Warrior',
			icon: '⚔️',
			baseCost: 200,
			upkeepPerDay: 10,
			description: 'Skilled fighter who can defend against bandits and wild creatures',
			skills: {
				combat: 0.8, // 80% chance to reduce/prevent combat losses
				negotiation: 0.2,
				foraging: 0.1,
			},
		},
		scout: {
			name: 'Scout',
			icon: '🏹',
			baseCost: 150,
			upkeepPerDay: 8,
			description: 'Expert tracker who can find food and avoid dangerous encounters',
			skills: {
				combat: 0.4,
				negotiation: 0.3,
				foraging: 0.7, // 70% chance to find extra food
				avoidance: 0.5, // 50% chance to avoid negative encounters entirely
			},
		},
		diplomat: {
			name: 'Diplomat',
			icon: '🎭',
			baseCost: 180,
			upkeepPerDay: 9,
			description: 'Smooth talker who can negotiate with bandits and make better deals',
			skills: {
				combat: 0.1,
				negotiation: 0.9, // 90% chance to negotiate out of trouble
				foraging: 0.2,
			},
		},
		cook: {
			name: 'Cook',
			icon: '👨‍🍳',
			baseCost: 120,
			upkeepPerDay: 6,
			description: 'Master chef who reduces food consumption and can prepare meals from wild ingredients',
			skills: {
				combat: 0.1,
				negotiation: 0.2,
				foraging: 0.6,
				foodEfficiency: 0.8, // Reduces food consumption by 20%
			},
		},
		ranger: {
			name: 'Ranger',
			icon: '🌲',
			baseCost: 170,
			upkeepPerDay: 8,
			description: 'Wilderness expert skilled in combat, foraging, and navigation',
			skills: {
				combat: 0.6,
				negotiation: 0.3,
				foraging: 0.8,
				avoidance: 0.3,
			},
		},
		merchant: {
			name: 'Merchant',
			icon: '💰',
			baseCost: 160,
			upkeepPerDay: 7,
			description: 'Experienced trader who can turn encounters into profitable opportunities',
			skills: {
				combat: 0.2,
				negotiation: 0.7,
				foraging: 0.2,
				trading: 0.8, // 80% chance to improve positive encounter rewards
			},
		},
	},

	// Generate random mercenary with random name
	generateMercenary(type, nameList) {
		const typeData = this.types[type];
		const randomName = nameList[Math.floor(Math.random() * nameList.length)];

		return {
			id: `merc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			type: type,
			name: randomName,
			icon: typeData.icon,
			cost: typeData.baseCost + Math.floor(Math.random() * 50), // Some price variation
			upkeep: typeData.upkeepPerDay,
			description: typeData.description,
			skills: { ...typeData.skills },
			hired: false,
		};
	},

	// Name pools for different mercenary types
	names: {
		warrior: [
			'Bjorn the Bold',
			'Valeria Ironheart',
			'Marcus Stormbreaker',
			'Grimnar Axehand',
			'Helena Warblade',
			'Thorgrim Steelback',
			'Lyanna Shieldmaiden',
			'Ragnar Bloodaxe',
		],
		scout: [
			'Swift Arrow',
			'Shadow Walker',
			'Elara Keeneye',
			'Finn Quickfoot',
			'Aria Pathfinder',
			'Rowan the Silent',
			'Kael Nightrunner',
			'Nyx Shadowstep',
		],
		diplomat: [
			'Lord Percival',
			'Lady Cordelia',
			'Ambassador Vale',
			'Silvanus Wordsmith',
			'Beatrice Fairspeak',
			'Reginald Smoothtongue',
			'Isolde Peacemaker',
			'Sebastian Goldentongue',
		],
		cook: [
			'Chef Auguste',
			'Mama Rosa',
			'Gordon the Stout',
			'Marie Flavorful',
			'Boris Spicemixer',
			'Celeste Savorheart',
			'Pietro Tastebud',
			'Ingrid Honeypot',
		],
		ranger: [
			'Oakley Greenwood',
			'Willow Forestborn',
			'Drake Wildwalker',
			'Sage Thornheart',
			'Ash Wolfriend',
			'Maple Deerwhisperer',
			'Reed Riverbend',
			'Ivy Moonshadow',
		],
		merchant: [
			'Goldwin Coinstack',
			'Ruby Gemcutter',
			'Sterling Tradehands',
			'Jasper Silverworth',
			'Opal Bargainlady',
			'Cassius Moneybags',
			'Pearl Dealmaker',
			'Garnet Profiteer',
		],
	},
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = MercenariesData;
}
