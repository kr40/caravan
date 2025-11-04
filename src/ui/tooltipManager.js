/**
 * Tooltip Manager
 * Handles displaying city information tooltips on hover
 */

class TooltipManager {
	constructor() {
		this.tooltip = document.getElementById('city-tooltip');
		this.cityName = document.getElementById('tooltip-city-name');
		this.terrain = document.getElementById('tooltip-terrain');
		this.produces = document.getElementById('tooltip-produces');
		this.consumes = document.getElementById('tooltip-consumes');
		this.connections = document.getElementById('tooltip-connections');
		this.currentCity = null;
	}

	// Show tooltip for a city
	showCityTooltip(cityId, mouseX, mouseY) {
		const cityData = CitiesData[cityId];
		if (!cityData) return;

		this.currentCity = cityId;

		// Update content
		this.cityName.textContent = cityData.name;
		this.terrain.textContent = this.formatTerrain(cityData.terrain);
		this.produces.textContent = this.formatGoods(cityData.produces);
		this.consumes.textContent = this.formatGoods(cityData.consumes);
		this.connections.textContent = this.formatConnections(cityId);

		// Position tooltip near mouse
		const offsetX = 15;
		const offsetY = 15;
		let left = mouseX + offsetX;
		let top = mouseY + offsetY;

		// Keep tooltip on screen
		const tooltipRect = this.tooltip.getBoundingClientRect();
		if (left + tooltipRect.width > window.innerWidth) {
			left = mouseX - tooltipRect.width - offsetX;
		}
		if (top + tooltipRect.height > window.innerHeight) {
			top = mouseY - tooltipRect.height - offsetY;
		}

		this.tooltip.style.left = left + 'px';
		this.tooltip.style.top = top + 'px';

		// Show tooltip
		this.tooltip.classList.remove('hidden');
	}

	// Hide tooltip
	hideTooltip() {
		this.currentCity = null;
		this.tooltip.classList.add('hidden');
	}

	// Format terrain type for display
	formatTerrain(terrain) {
		const terrainNames = {
			plains: 'Plains',
			forest: 'Forest',
			mountains: 'Mountains',
			desert: 'Desert',
			river: 'River',
			road: 'Road',
		};
		return terrainNames[terrain] || terrain;
	}

	// Format goods list for display
	formatGoods(goodsArray) {
		if (!goodsArray || goodsArray.length === 0) return 'None';

		return goodsArray
			.map((goodId) => {
				const good = GoodsData[goodId];
				return good ? good.name : goodId;
			})
			.join(', ');
	}

	// Format road connections for display
	formatConnections(cityId) {
		const connections = RoadsData.connections.filter((conn) => conn.from === cityId || conn.to === cityId);

		if (connections.length === 0) return 'None';

		const cityNames = connections.map((conn) => {
			const targetId = conn.from === cityId ? conn.to : conn.from;
			const targetCity = CitiesData[targetId];
			const roadType = RoadsData.types[conn.type];

			// Add icon/indicator for road type
			let icon = '─'; // Regular road
			if (conn.type === 'bridge') icon = '≈';
			if (conn.type === 'mountain_pass') icon = '∧';

			return `${icon} ${targetCity ? targetCity.name : targetId}`;
		});

		return cityNames.join(', ');
	}

	// Update tooltip position
	updatePosition(mouseX, mouseY) {
		if (this.currentCity) {
			const offsetX = 15;
			const offsetY = 15;
			let left = mouseX + offsetX;
			let top = mouseY + offsetY;

			// Keep tooltip on screen
			const tooltipRect = this.tooltip.getBoundingClientRect();
			if (left + tooltipRect.width > window.innerWidth) {
				left = mouseX - tooltipRect.width - offsetX;
			}
			if (top + tooltipRect.height > window.innerHeight) {
				top = mouseY - tooltipRect.height - offsetY;
			}

			this.tooltip.style.left = left + 'px';
			this.tooltip.style.top = top + 'px';
		}
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = TooltipManager;
}
