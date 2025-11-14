/**
 * Mercenary System
 * Handles hiring, managing, and utilizing mercenaries
 */

class MercenarySystem {
	constructor(gameState) {
		this.gameState = gameState;
		this.hiredMercenaries = [];
		this.availableMercenaries = {}; // Available mercenaries per city
	}

	// Generate available mercenaries for a city
	generateMercenariesForCity(cityId) {
		if (this.availableMercenaries[cityId]) {
			return this.availableMercenaries[cityId];
		}

		const mercTypes = Object.keys(MercenariesData.types);
		const numMercenaries = 2 + Math.floor(Math.random() * 3); // 2-4 mercenaries per city
		const cityMercs = [];

		for (let i = 0; i < numMercenaries; i++) {
			const randomType = mercTypes[Math.floor(Math.random() * mercTypes.length)];
			const merc = MercenariesData.generateMercenary(randomType, MercenariesData.names[randomType]);
			merc.cityId = cityId;
			cityMercs.push(merc);
		}

		this.availableMercenaries[cityId] = cityMercs;
		return cityMercs;
	}

	// Hire a mercenary
	hireMercenary(mercenary) {
		// Check if can afford
		if (this.gameState.playerCaravan.gold < mercenary.cost) {
			return { success: false, message: 'Not enough gold!' };
		}

		// Check if already hired
		if (this.hiredMercenaries.find((m) => m.id === mercenary.id)) {
			return { success: false, message: 'Already hired!' };
		}

		// Deduct cost
		this.gameState.playerCaravan.gold -= mercenary.cost;

		// Add to hired list
		mercenary.hired = true;
		this.hiredMercenaries.push(mercenary);

		// Remove from available in that city
		if (this.availableMercenaries[mercenary.cityId]) {
			this.availableMercenaries[mercenary.cityId] = this.availableMercenaries[mercenary.cityId].filter(
				(m) => m.id !== mercenary.id
			);
		}

		return { success: true, message: `${mercenary.name} hired successfully!` };
	}

	// Dismiss a mercenary
	dismissMercenary(mercenaryId) {
		const index = this.hiredMercenaries.findIndex((m) => m.id === mercenaryId);
		if (index !== -1) {
			const merc = this.hiredMercenaries[index];
			this.hiredMercenaries.splice(index, 1);
			return { success: true, message: `${merc.name} has been dismissed.` };
		}
		return { success: false, message: 'Mercenary not found.' };
	}

	// Pay daily upkeep for mercenaries
	payUpkeep() {
		let totalUpkeep = 0;
		this.hiredMercenaries.forEach((merc) => {
			totalUpkeep += merc.upkeep;
		});

		if (totalUpkeep > 0) {
			this.gameState.playerCaravan.gold = Math.max(0, this.gameState.playerCaravan.gold - totalUpkeep);
		}

		return totalUpkeep;
	}

	// Get total food efficiency bonus from cooks
	getFoodEfficiency() {
		let efficiency = 1.0;
		this.hiredMercenaries.forEach((merc) => {
			if (merc.skills.foodEfficiency) {
				efficiency *= 1 - merc.skills.foodEfficiency * 0.2; // Each cook reduces consumption by their efficiency * 20%
			}
		});
		return efficiency;
	}

	// Check if mercenaries can help with an encounter
	handleEncounterWithMercenaries(encounter) {
		if (this.hiredMercenaries.length === 0) {
			return null; // No mercenaries to help
		}

		const options = [];

		// Check what options are available based on mercenary skills
		if (encounter.type === 'negative') {
			// Combat option
			const combatMercs = this.hiredMercenaries.filter((m) => m.skills.combat > 0.4);
			if (combatMercs.length > 0) {
				const bestCombat = combatMercs.reduce((best, m) => (m.skills.combat > best.skills.combat ? m : best));
				options.push({
					type: 'combat',
					mercenary: bestCombat,
					label: `${bestCombat.icon} Fight Back (${bestCombat.name})`,
					description: `${bestCombat.name} will defend the caravan`,
					successChance: bestCombat.skills.combat,
				});
			}

			// Negotiation option
			const negotiationMercs = this.hiredMercenaries.filter((m) => m.skills.negotiation > 0.5);
			if (negotiationMercs.length > 0) {
				const bestNegotiator = negotiationMercs.reduce((best, m) =>
					m.skills.negotiation > best.skills.negotiation ? m : best
				);
				options.push({
					type: 'negotiation',
					mercenary: bestNegotiator,
					label: `${bestNegotiator.icon} Negotiate (${bestNegotiator.name})`,
					description: `${bestNegotiator.name} will try to talk your way out`,
					successChance: bestNegotiator.skills.negotiation,
				});
			}

			// Avoidance option
			const avoidanceMercs = this.hiredMercenaries.filter((m) => m.skills.avoidance > 0.3);
			if (avoidanceMercs.length > 0) {
				const bestAvoider = avoidanceMercs.reduce((best, m) => (m.skills.avoidance > best.skills.avoidance ? m : best));
				options.push({
					type: 'avoidance',
					mercenary: bestAvoider,
					label: `${bestAvoider.icon} Evade (${bestAvoider.name})`,
					description: `${bestAvoider.name} knows how to slip away unnoticed`,
					successChance: bestAvoider.skills.avoidance,
				});
			}
		} else if (encounter.type === 'positive') {
			// Trading option for positive encounters
			const tradingMercs = this.hiredMercenaries.filter((m) => m.skills.trading > 0.5);
			if (tradingMercs.length > 0) {
				const bestTrader = tradingMercs.reduce((best, m) => (m.skills.trading > best.skills.trading ? m : best));
				options.push({
					type: 'trading',
					mercenary: bestTrader,
					label: `${bestTrader.icon} Negotiate Better Deal (${bestTrader.name})`,
					description: `${bestTrader.name} can improve the terms`,
					successChance: bestTrader.skills.trading,
				});
			}

			// Foraging option
			const foragingMercs = this.hiredMercenaries.filter((m) => m.skills.foraging > 0.5);
			if (foragingMercs.length > 0) {
				const bestForager = foragingMercs.reduce((best, m) => (m.skills.foraging > best.skills.foraging ? m : best));
				options.push({
					type: 'foraging',
					mercenary: bestForager,
					label: `${bestForager.icon} Gather Extra Supplies (${bestForager.name})`,
					description: `${bestForager.name} can find additional resources`,
					successChance: bestForager.skills.foraging,
				});
			}
		}

		return options;
	}

	// Apply mercenary action result
	applyMercenaryAction(action, encounter, originalEffects) {
		const roll = Math.random();
		const success = roll < action.successChance;

		let result = {
			success: success,
			mercenary: action.mercenary,
			effects: { ...originalEffects },
			message: '',
		};

		if (success) {
			switch (action.type) {
				case 'combat':
					// Reduce losses significantly
					if (result.effects.goldLoss) {
						result.effects.goldLoss = Math.floor(result.effects.goldLoss * 0.2); // 80% reduction
					}
					if (result.effects.foodLoss) {
						result.effects.foodLoss = Math.floor(result.effects.foodLoss * 0.3); // 70% reduction
					}
					result.message = `${action.mercenary.name} fought bravely and minimized your losses!`;
					break;

				case 'negotiation':
					// Reduce losses or convert to minor loss
					if (result.effects.goldLoss) {
						result.effects.goldLoss = Math.floor(result.effects.goldLoss * 0.1); // 90% reduction
					}
					if (result.effects.foodLoss) {
						result.effects.foodLoss = Math.floor(result.effects.foodLoss * 0.1); // 90% reduction
					}
					result.message = `${action.mercenary.name} negotiated skillfully and saved most of your goods!`;
					break;

				case 'avoidance':
					// Completely avoid the encounter
					result.effects.goldLoss = 0;
					result.effects.foodLoss = 0;
					result.message = `${action.mercenary.name} helped you slip away undetected!`;
					break;

				case 'trading':
					// Increase gains
					if (result.effects.gold) {
						result.effects.gold = Math.floor(result.effects.gold * 1.5); // 50% increase
					}
					if (result.effects.food) {
						result.effects.food = Math.floor(result.effects.food * 1.3); // 30% increase
					}
					result.message = `${action.mercenary.name} struck an excellent deal!`;
					break;

				case 'foraging':
					// Add extra food
					const bonusFood = 10 + Math.floor(Math.random() * 15);
					result.effects.food = (result.effects.food || 0) + bonusFood;
					result.message = `${action.mercenary.name} gathered ${bonusFood} extra food!`;
					break;
			}
		} else {
			// Failed attempt - slightly worse outcome
			result.message = `${action.mercenary.name} tried their best, but it didn't work out...`;
			if (encounter.type === 'negative') {
				// Slightly increase losses on failure
				if (result.effects.goldLoss) {
					result.effects.goldLoss = Math.floor(result.effects.goldLoss * 1.1);
				}
				if (result.effects.foodLoss) {
					result.effects.foodLoss = Math.floor(result.effects.foodLoss * 1.1);
				}
			}
		}

		return result;
	}

	// Get all hired mercenaries
	getHiredMercenaries() {
		return this.hiredMercenaries;
	}

	// Get mercenaries available in a city
	getAvailableMercenaries(cityId) {
		return this.generateMercenariesForCity(cityId);
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = MercenarySystem;
}
