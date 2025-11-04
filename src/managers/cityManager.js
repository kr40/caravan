/**
 * City Manager
 * Handles creation and management of city 3D models and interactions
 */

class CityManager {
	constructor(scene, gameState) {
		this.scene = scene;
		this.gameState = gameState;
		this.cities = {};
		this.cityLabels = {};
		this.cityData = CitiesData;
	}

	createCities() {
		Object.keys(this.cityData).forEach((cityId) => {
			this.createCity(cityId);
		});
	}

	createCity(cityId) {
		const cityData = this.cityData[cityId];

		// City building (simple box for now)
		const cityGeometry = new THREE.BoxGeometry(30, 20, 30);
		const cityMaterial = new THREE.MeshLambertMaterial({
			color: GameConfig.colors.city,
		});
		const cityMesh = new THREE.Mesh(cityGeometry, cityMaterial);

		cityMesh.position.set(cityData.position.x, 10, cityData.position.z);
		cityMesh.userData = { cityId: cityId, type: 'city' };
		cityMesh.castShadow = true;
		cityMesh.receiveShadow = true;

		this.cities[cityId] = cityMesh;
		this.scene.add(cityMesh);

		// City marker (cone on top)
		const markerGeometry = new THREE.ConeGeometry(5, 15, 4);
		const markerMaterial = new THREE.MeshLambertMaterial({
			color: GameConfig.colors.cityMarker,
		});
		const marker = new THREE.Mesh(markerGeometry, markerMaterial);
		marker.position.set(cityData.position.x, 30, cityData.position.z);
		marker.userData = { cityId: cityId, type: 'marker' };
		this.scene.add(marker);

		// Create city name label using sprite
		this.createCityLabel(cityId, cityData);
	}

	createCityLabel(cityId, cityData) {
		// Create canvas for text
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		canvas.width = 256;
		canvas.height = 64;

		// Draw text
		context.fillStyle = 'rgba(0, 0, 0, 0.6)';
		context.fillRect(0, 0, canvas.width, canvas.height);

		context.font = 'Bold 28px Georgia';
		context.fillStyle = '#d4af37';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(cityData.name, canvas.width / 2, canvas.height / 2);

		// Create texture from canvas
		const texture = new THREE.CanvasTexture(canvas);
		texture.needsUpdate = true;

		// Create sprite material
		const spriteMaterial = new THREE.SpriteMaterial({
			map: texture,
			transparent: true,
		});

		// Create sprite
		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.position.set(cityData.position.x, 45, cityData.position.z);
		sprite.scale.set(40, 10, 1);
		sprite.userData = { cityId: cityId, type: 'label' };

		this.cityLabels[cityId] = sprite;
		this.scene.add(sprite);
	}

	getCityMeshes() {
		return Object.values(this.cities);
	}

	getCityData(cityId) {
		return this.cityData[cityId];
	}

	getCityPosition(cityId) {
		const cityData = this.cityData[cityId];
		return new THREE.Vector3(cityData.position.x, cityData.position.y, cityData.position.z);
	}

	// Check if caravan is at a city
	isAtCity(position, threshold = 1) {
		for (const cityId in this.cityData) {
			const cityPos = this.getCityPosition(cityId);
			const distance = position.distanceTo(cityPos);
			if (distance < threshold) {
				return cityId;
			}
		}
		return null;
	}

	// Future: Load custom city models
	loadCityModel(cityId, modelPath) {
		// Placeholder for loading custom models
	}

	destroy() {
		Object.values(this.cities).forEach((cityMesh) => {
			this.scene.remove(cityMesh);
			cityMesh.geometry.dispose();
			cityMesh.material.dispose();
		});
		Object.values(this.cityLabels).forEach((label) => {
			this.scene.remove(label);
			label.material.map.dispose();
			label.material.dispose();
		});
		this.cities = {};
		this.cityLabels = {};
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = CityManager;
}
