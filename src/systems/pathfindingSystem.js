/**
 * Pathfinding System
 * Handles route calculation considering roads and obstacles
 */

class PathfindingSystem {
	constructor() {
		this.roads = RoadsData;
		this.obstacles = ObstaclesData;
		this.cityConnections = this.buildConnectionGraph();
	}

	// Build a graph of city connections
	buildConnectionGraph() {
		const graph = {};

		// Initialize empty arrays for each city
		Object.keys(CitiesData).forEach((cityId) => {
			graph[cityId] = [];
		});

		// Add all road connections (bidirectional)
		this.roads.connections.forEach((connection) => {
			const roadType = this.roads.types[connection.type];

			graph[connection.from].push({
				city: connection.to,
				type: connection.type,
				terrain: connection.terrain,
				speedBonus: roadType.speedBonus,
				foodMultiplier: roadType.foodMultiplier,
			});

			// Bidirectional
			graph[connection.to].push({
				city: connection.from,
				type: connection.type,
				terrain: connection.terrain,
				speedBonus: roadType.speedBonus,
				foodMultiplier: roadType.foodMultiplier,
			});
		});

		return graph;
	}

	// Check if there's a direct road between two cities
	hasDirectRoad(fromCity, toCity) {
		const connections = this.cityConnections[fromCity] || [];
		return connections.some((conn) => conn.city === toCity);
	}

	// Get road information between two connected cities
	getRoadInfo(fromCity, toCity) {
		const connections = this.cityConnections[fromCity] || [];
		return connections.find((conn) => conn.city === toCity);
	}

	// Check if direct path is blocked by obstacles
	isPathBlocked(fromCity, toCity) {
		// Check mountain obstacles
		for (const mountain of this.obstacles.mountains) {
			if (
				mountain.blocksDirect.some(
					(block) =>
						(block.from === fromCity && block.to === toCity) || (block.from === toCity && block.to === fromCity)
				)
			) {
				return { blocked: true, obstacle: 'mountains', name: mountain.name };
			}
		}

		// Check river obstacles
		for (const river of this.obstacles.rivers) {
			if (
				river.blocksDirect.some(
					(block) =>
						(block.from === fromCity && block.to === toCity) || (block.from === toCity && block.to === fromCity)
				)
			) {
				return { blocked: true, obstacle: 'river', name: river.name };
			}
		}

		// Check forest obstacles
		for (const forest of this.obstacles.forests) {
			if (
				forest.blocksDirect.some(
					(block) =>
						(block.from === fromCity && block.to === toCity) || (block.from === toCity && block.to === fromCity)
				)
			) {
				return { blocked: true, obstacle: 'forest', name: forest.name };
			}
		}

		// Check desert obstacles
		for (const desert of this.obstacles.deserts) {
			if (
				desert.blocksDirect.some(
					(block) =>
						(block.from === fromCity && block.to === toCity) || (block.from === toCity && block.to === fromCity)
				)
			) {
				return { blocked: true, obstacle: 'desert', name: desert.name };
			}
		}

		return { blocked: false };
	}

	// Find a path between two cities using BFS
	findPath(fromCity, toCity) {
		// Check if direct road exists
		if (this.hasDirectRoad(fromCity, toCity)) {
			const roadInfo = this.getRoadInfo(fromCity, toCity);
			return {
				path: [fromCity, toCity],
				distance: 1,
				roads: [roadInfo],
				isDirect: true,
			};
		}

		// Check if direct path is blocked
		const blockCheck = this.isPathBlocked(fromCity, toCity);
		if (blockCheck.blocked) {
			// Need to find alternate route through road network
			return this.findRouteThroughNetwork(fromCity, toCity, blockCheck);
		}

		// No direct road and no obstacle, allow direct travel (off-road)
		return {
			path: [fromCity, toCity],
			distance: 1,
			roads: [],
			isDirect: true,
			isOffRoad: true,
		};
	}

	// Find route through the road network using BFS
	findRouteThroughNetwork(fromCity, toCity, blockInfo) {
		const queue = [[fromCity]];
		const visited = new Set([fromCity]);

		while (queue.length > 0) {
			const path = queue.shift();
			const current = path[path.length - 1];

			// Check all connected cities
			const connections = this.cityConnections[current] || [];
			for (const connection of connections) {
				if (connection.city === toCity) {
					// Found destination
					const finalPath = [...path, toCity];
					const roads = this.getRoadsForPath(finalPath);
					return {
						path: finalPath,
						distance: finalPath.length - 1,
						roads: roads,
						isDirect: false,
						obstacle: blockInfo,
					};
				}

				if (!visited.has(connection.city)) {
					visited.add(connection.city);
					queue.push([...path, connection.city]);
				}
			}
		}

		// No path found through road network
		return {
			path: null,
			distance: Infinity,
			roads: [],
			isDirect: false,
			obstacle: blockInfo,
			blocked: true,
		};
	}

	// Get road information for each segment of a path
	getRoadsForPath(path) {
		const roads = [];
		for (let i = 0; i < path.length - 1; i++) {
			const roadInfo = this.getRoadInfo(path[i], path[i + 1]);
			roads.push(roadInfo);
		}
		return roads;
	}

	// Calculate total travel modifiers for a path
	calculatePathModifiers(pathResult) {
		if (!pathResult.path || pathResult.blocked) {
			return null;
		}

		let totalSpeedBonus = 1;
		let totalFoodMultiplier = 1;

		if (pathResult.roads && pathResult.roads.length > 0) {
			// Average the bonuses across all road segments
			const avgSpeed = pathResult.roads.reduce((sum, road) => sum + road.speedBonus, 0) / pathResult.roads.length;
			const avgFood = pathResult.roads.reduce((sum, road) => sum + road.foodMultiplier, 0) / pathResult.roads.length;

			totalSpeedBonus = avgSpeed;
			totalFoodMultiplier = avgFood;
		} else if (pathResult.isOffRoad) {
			// Off-road penalty
			totalSpeedBonus = 0.7;
			totalFoodMultiplier = 1.3;
		}

		return {
			speedBonus: totalSpeedBonus,
			foodMultiplier: totalFoodMultiplier,
			distance: pathResult.distance,
		};
	}

	// Get a description of the route
	getRouteDescription(pathResult) {
		if (!pathResult.path || pathResult.blocked) {
			return `No route available. Blocked by ${pathResult.obstacle?.name || 'obstacles'}.`;
		}

		if (pathResult.isDirect) {
			if (pathResult.roads && pathResult.roads.length > 0) {
				const roadType = this.roads.types[pathResult.roads[0].type];
				return `Direct route via ${roadType.name}`;
			}
			return 'Direct route (off-road)';
		}

		const cities = pathResult.path.slice(1, -1); // Exclude start and end
		if (cities.length > 0) {
			return `Route through: ${cities.map((id) => CitiesData[id].name).join(' → ')}`;
		}

		return 'Route available';
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = PathfindingSystem;
}
