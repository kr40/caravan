/**
 * Caravan Manager
 * Handles the player's caravan 3D model and movement
 */

class CaravanManager {
	constructor(scene, gameState) {
		this.scene = scene;
		this.gameState = gameState;
		this.caravan = null;
		this.terrainSpeedMultiplier = 1.0;
	}

	createCaravan() {
		// Simple box for now - can be replaced with a proper model later
		const caravanGeometry = new THREE.BoxGeometry(10, 8, 15);
		const caravanMaterial = new THREE.MeshLambertMaterial({
			color: GameConfig.colors.caravan,
		});
		this.caravan = new THREE.Mesh(caravanGeometry, caravanMaterial);
		this.caravan.position.copy(this.gameState.playerCaravan.position);
		this.caravan.position.y = 4;
		this.caravan.castShadow = true;
		this.scene.add(this.caravan);
	}

	update() {
		if (this.gameState.playerCaravan.isMoving) {
			return this.updateMovement();
		}
		return false;
	}

	updateMovement() {
		const current = this.gameState.playerCaravan.position;
		const target = this.gameState.playerCaravan.targetPosition;

		// Apply terrain speed multiplier
		const baseSpeed = GameConfig.mechanics.movementSpeed;
		const adjustedSpeed = baseSpeed * this.terrainSpeedMultiplier;

		// Lerp towards target with terrain-adjusted speed
		current.lerp(target, adjustedSpeed);
		this.caravan.position.set(current.x, 4, current.z);

		// Check if reached destination
		const distance = current.distanceTo(target);
		if (distance < GameConfig.mechanics.arrivalThreshold) {
			this.gameState.playerCaravan.isMoving = false;
			this.gameState.playerCaravan.position.copy(target);
			return true; // Arrived
		}
		return false; // Still moving
	}

	// Set terrain speed multiplier (called by game when starting journey)
	setTerrainSpeed(multiplier) {
		this.terrainSpeedMultiplier = multiplier;
	}

	// Set position directly
	setPosition(x, z) {
		this.gameState.playerCaravan.position.set(x, 0, z);
		this.caravan.position.set(x, 4, z);
	}

	// Get current position
	getPosition() {
		return this.gameState.playerCaravan.position.clone();
	}

	// Future: Load custom 3D model
	loadModel(modelPath) {
		// Placeholder for loading .glb or .gltf models
	}

	destroy() {
		if (this.caravan) {
			this.scene.remove(this.caravan);
			this.caravan.geometry.dispose();
			this.caravan.material.dispose();
		}
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = CaravanManager;
}
