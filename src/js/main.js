/**
 * Main Game Class
 * Orchestrates all game systems and managers
 */

class Game {
	constructor() {
		// Three.js core
		this.scene = null;
		this.camera = null;
		this.renderer = null;

		// Game systems
		this.gameState = null;
		this.worldManager = null;
		this.caravanManager = null;
		this.cityManager = null;
		this.marketSystem = null;
		this.inputSystem = null;
		this.uiManager = null;
		this.resourceSystem = null;
		this.minimapManager = null;
		this.tooltipManager = null;

		// Animation
		this.animationId = null;

		// Journey tracking
		this.lastCity = null;
	} // Initialize the game
	initialize() {
		this.setupThreeJS();
		this.setupLighting();
		this.initializeSystems();
		this.setupEventListeners();
		this.start();
	}

	// Set up Three.js scene, camera, and renderer
	setupThreeJS() {
		// Scene
		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(GameConfig.rendering.backgroundColor);

		// Camera
		this.camera = new THREE.PerspectiveCamera(
			GameConfig.camera.fov,
			window.innerWidth / window.innerHeight,
			GameConfig.camera.near,
			GameConfig.camera.far
		);
		this.camera.position.set(GameConfig.camera.position.x, GameConfig.camera.position.y, GameConfig.camera.position.z);
		this.camera.lookAt(0, 0, 0);

		// Renderer
		this.renderer = new THREE.WebGLRenderer({
			antialias: GameConfig.rendering.antialias,
		});
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.shadowMap.enabled = true;
		document.getElementById('game-container').appendChild(this.renderer.domElement);
	}

	// Set up lighting
	setupLighting() {
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(50, 100, 50);
		directionalLight.castShadow = true;
		this.scene.add(directionalLight);
	}

	// Initialize all game systems and managers
	initializeSystems() {
		// Core state
		this.gameState = new GameState();

		// Managers
		this.worldManager = new WorldManager(this.scene);
		this.caravanManager = new CaravanManager(this.scene, this.gameState);
		this.cityManager = new CityManager(this.scene, this.gameState);

		// Systems
		this.marketSystem = new MarketSystem(this.gameState);
		this.inputSystem = new InputSystem(this.camera, this.renderer);
		this.uiManager = new UIManager(this.gameState, this.marketSystem);
		this.resourceSystem = new ResourceSystem(this.gameState);
		this.debugManager = new DebugManager(this.gameState, this.uiManager);
		this.minimapManager = new MinimapManager(this.gameState, GameConfig.world.size);
		this.tooltipManager = new TooltipManager();

		// Create world elements
		this.worldManager.createWorld();
		this.caravanManager.createCaravan();
		this.cityManager.createCities();

		// Initialize systems
		this.inputSystem.initialize();
		this.uiManager.initialize();
		this.debugManager.initialize();

		// Set up input handling
		this.inputSystem.registerClickHandler((raycaster) => this.handleClick(raycaster));
		this.inputSystem.registerHoverHandler((raycaster, mouse, event) => this.handleHover(raycaster, event));

		// Set up UI callbacks
		this.uiManager.setCityExitCallback(() => this.handleCityExit());

		// Set up debug callbacks
		this.debugManager.onTeleport = (cityId) => this.teleportToCity(cityId);
		this.debugManager.onReset = () => this.resetCaravanPosition();
		this.debugManager.onResetCamera = () => this.resetCamera();

		// Initial UI update
		this.uiManager.updateHUD();
	}

	// Handle click events
	handleClick(raycaster) {
		// Only handle clicks when not moving and not in a city
		if (this.gameState.playerCaravan.isMoving || this.gameState.playerCaravan.currentCity) {
			return;
		}

		// Check for city clicks
		const cityMeshes = this.cityManager.getCityMeshes();
		const intersects = raycaster.intersectObjects(cityMeshes);

		if (intersects.length > 0) {
			const clickedCity = intersects[0].object;
			const cityId = clickedCity.userData.cityId;
			this.moveToCity(cityId);
		}
	}

	// Handle hover events
	handleHover(raycaster, event) {
		// Check for city hovers
		const cityMeshes = this.cityManager.getCityMeshes();
		const intersects = raycaster.intersectObjects(cityMeshes);

		if (intersects.length > 0) {
			const hoveredCity = intersects[0].object;
			const cityId = hoveredCity.userData.cityId;

			// Show tooltip
			this.tooltipManager.showCityTooltip(cityId, event.clientX, event.clientY);
		} else {
			// Hide tooltip when not hovering over a city
			this.tooltipManager.hideTooltip();
		}
	}

	// Move caravan to a city
	moveToCity(cityId) {
		const cityData = this.cityManager.getCityData(cityId);
		const cityPosition = this.cityManager.getCityPosition(cityId);
		const currentPosition = this.caravanManager.getPosition();

		// Check if player has enough food for the journey
		const terrain = cityData.terrain || 'plains';
		if (!this.resourceSystem.canAffordJourney(currentPosition, cityPosition, terrain)) {
			const estimatedCost = this.resourceSystem.estimateFoodCost(currentPosition, cityPosition, terrain);
			alert(
				`Not enough food for this journey! Need ${estimatedCost} food. Current: ${this.gameState.playerCaravan.food}`
			);
			return;
		}

		// Set terrain speed multiplier
		const speedMultiplier = GameConfig.terrain[terrain]?.speedMultiplier || 1.0;
		this.caravanManager.setTerrainSpeed(speedMultiplier);

		// Start journey
		this.gameState.setTarget(cityPosition.x, cityPosition.z);
		this.gameState.selectedCity = cityId;
		this.resourceSystem.startJourney(currentPosition, cityId);
	}

	// Handle arrival at city
	handleArrival() {
		const cityId = this.gameState.selectedCity;
		if (cityId) {
			const cityData = CitiesData[cityId];

			// Track journey history only if we actually traveled to a different city
			const fromCity = this.lastCity || null;
			if (cityData && cityData.name !== this.lastCity) {
				this.gameState.addJourneyEntry(fromCity, cityData.name);
			}
			this.lastCity = cityData?.name;

			this.gameState.setCurrentCity(cityId);
			this.uiManager.openCityModal(cityId);
		}
	}

	// Handle exiting a city
	handleCityExit() {
		this.gameState.selectedCity = null;
	}

	// Teleport to a city (debug function)
	teleportToCity(cityId) {
		const cityPosition = this.cityManager.getCityPosition(cityId);
		if (cityPosition) {
			// Stop any current movement
			this.gameState.playerCaravan.isMoving = false;
			this.gameState.clearTarget();

			// Move caravan instantly
			this.caravanManager.setPosition(cityPosition.x, cityPosition.z);

			// Open city modal
			this.gameState.setCurrentCity(cityId);
			this.uiManager.openCityModal(cityId);
		}
	}

	// Reset caravan to starting position (debug function)
	resetCaravanPosition() {
		// Stop any current movement
		this.gameState.playerCaravan.isMoving = false;
		this.gameState.clearTarget();

		// Reset position to center of map
		this.caravanManager.setPosition(0, 0);

		// Reset journey tracking
		this.lastCity = null;
	}

	// Reset camera to default position (debug function)
	resetCamera() {
		if (this.inputSystem) {
			this.inputSystem.resetCamera();
		}
		if (this.minimapManager) {
			this.minimapManager.panOffset = { x: 0, y: 0 };
			this.minimapManager.update();
		}
	}

	// Set up event listeners
	setupEventListeners() {
		window.addEventListener('resize', () => this.onWindowResize());
	}

	// Handle window resize
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	// Start the game loop
	start() {
		this.animate();
	}

	// Main animation loop
	animate() {
		this.animationId = requestAnimationFrame(() => this.animate());
		this.update();
		this.render();
	}

	// Update game logic
	update() {
		// Update caravan movement
		const arrived = this.caravanManager.update();

		// Update resource consumption during travel
		if (this.gameState.playerCaravan.isMoving) {
			this.resourceSystem.updateTravel(this.gameState.playerCaravan.position);
			this.uiManager.updateHUD(); // Update HUD to show food consumption
		}

		// Update minimap
		this.minimapManager.update();

		if (arrived) {
			this.resourceSystem.endJourney();
			this.handleArrival();
		}

		// Future: Update other systems (economy, events, etc.)
	}

	// Render the scene
	render() {
		this.renderer.render(this.scene, this.camera);
	}

	// Clean up and destroy the game
	destroy() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
		}

		this.worldManager?.destroy();
		this.caravanManager?.destroy();
		this.cityManager?.destroy();
		this.inputSystem?.destroy();

		if (this.renderer) {
			document.getElementById('game-container').removeChild(this.renderer.domElement);
			this.renderer.dispose();
		}
	}
}

// Initialize game when page loads
let game;
window.addEventListener('load', () => {
	game = new Game();
	game.initialize();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Game;
}
