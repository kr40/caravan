/**
 * World Manager
 * Handles creation and management of the 3D world
 */

class WorldManager {
	constructor(scene) {
		this.scene = scene;
		this.ground = null;
		this.gridHelper = null;
		this.terrainPatches = [];
	}

	createWorld() {
		this.createGround();
		this.createGrid();
		this.createTerrainZones();
	}

	createGround() {
		const groundGeometry = new THREE.PlaneGeometry(GameConfig.world.size, GameConfig.world.size);
		const groundMaterial = new THREE.MeshLambertMaterial({
			color: GameConfig.colors.ground,
		});
		this.ground = new THREE.Mesh(groundGeometry, groundMaterial);
		this.ground.rotation.x = -Math.PI / 2;
		this.ground.receiveShadow = true;
		this.scene.add(this.ground);
	}

	createGrid() {
		this.gridHelper = new THREE.GridHelper(
			GameConfig.world.size,
			GameConfig.world.gridSize,
			GameConfig.colors.grid.center,
			GameConfig.colors.grid.lines
		);
		this.scene.add(this.gridHelper);
	}

	// Create terrain zones around cities
	createTerrainZones() {
		// Iterate through all cities and create terrain patches
		Object.keys(CitiesData).forEach((cityId) => {
			const cityData = CitiesData[cityId];
			const terrainType = cityData.terrain || 'plains';

			// Create main terrain patch around city
			this.createTerrainPatch(
				cityData.position.x,
				cityData.position.z,
				100, // size
				terrainType
			);

			// Create nearby terrain patches if specified
			if (cityData.nearbyTerrain && cityData.nearbyTerrain.length > 0) {
				// Add variety with nearby terrain types
				cityData.nearbyTerrain.forEach((nearbyType, index) => {
					if (nearbyType !== terrainType) {
						// Offset positions around the city
						const angle = (index * Math.PI * 2) / cityData.nearbyTerrain.length;
						const offsetX = Math.cos(angle) * 80;
						const offsetZ = Math.sin(angle) * 80;

						this.createTerrainPatch(
							cityData.position.x + offsetX,
							cityData.position.z + offsetZ,
							70, // smaller size
							nearbyType
						);
					}
				});
			}
		});
	}

	// Create a single terrain patch
	createTerrainPatch(x, z, size, terrainType) {
		const terrainConfig = GameConfig.terrain[terrainType];
		if (!terrainConfig) return;

		// Create circular or organic-looking patch
		const shape = new THREE.Shape();
		const segments = 16;
		const radiusVariation = 0.15; // Random variation for organic look

		for (let i = 0; i <= segments; i++) {
			const angle = (i / segments) * Math.PI * 2;
			const variation = 1 + (Math.random() - 0.5) * radiusVariation;
			const radius = (size / 2) * variation;
			const px = Math.cos(angle) * radius;
			const pz = Math.sin(angle) * radius;

			if (i === 0) {
				shape.moveTo(px, pz);
			} else {
				shape.lineTo(px, pz);
			}
		}

		const geometry = new THREE.ShapeGeometry(shape);
		const material = new THREE.MeshLambertMaterial({
			color: terrainConfig.color,
			transparent: true,
			opacity: 0.6,
		});

		const patch = new THREE.Mesh(geometry, material);
		patch.rotation.x = -Math.PI / 2;
		patch.position.set(x, 0.1, z); // Slightly above ground to prevent z-fighting
		patch.receiveShadow = true;

		this.terrainPatches.push(patch);
		this.scene.add(patch);
	}

	// Future: Add terrain features, roads, etc.
	addTerrainFeature(type, position) {
		// Placeholder for future terrain features
	}

	destroy() {
		if (this.ground) {
			this.scene.remove(this.ground);
			this.ground.geometry.dispose();
			this.ground.material.dispose();
		}
		if (this.gridHelper) {
			this.scene.remove(this.gridHelper);
		}
		// Clean up terrain patches
		this.terrainPatches.forEach((patch) => {
			this.scene.remove(patch);
			patch.geometry.dispose();
			patch.material.dispose();
		});
		this.terrainPatches = [];
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = WorldManager;
}
