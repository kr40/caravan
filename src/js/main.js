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
		this.roadManager = null;
		this.pathfindingSystem = null;
		this.marketSystem = null;
		this.inputSystem = null;
		this.uiManager = null;
		this.resourceSystem = null;
		this.minimapManager = null;
		this.tooltipManager = null;
		this.encounterSystem = null;
		this.mercenarySystem = null;
		this.saveManager = null;

		// Animation
		this.animationId = null;

		// Journey tracking
		this.lastCity = null;

		// Game initialization state
		this.isInitialized = false;
		this.saveButtonTimeout = null;
	}

	// Show start screen
	showStartScreen() {
		const startScreen = document.getElementById('start-screen');
		const slotScreen = document.getElementById('slot-selection-screen');
		const newGameBtn = document.getElementById('new-game-btn');
		const loadGameBtn = document.getElementById('load-game-btn');
		const backToMenuBtn = document.getElementById('back-to-menu-btn');

		// Initialize save manager
		if (!this.saveManager) {
			this.saveManager = new SaveManager();
		}

		// Remove old event listeners by cloning buttons
		const newNewGameBtn = newGameBtn.cloneNode(true);
		newGameBtn.parentNode.replaceChild(newNewGameBtn, newGameBtn);

		const newLoadGameBtn = loadGameBtn.cloneNode(true);
		loadGameBtn.parentNode.replaceChild(newLoadGameBtn, loadGameBtn);

		const newBackToMenuBtn = backToMenuBtn.cloneNode(true);
		backToMenuBtn.parentNode.replaceChild(newBackToMenuBtn, backToMenuBtn);

		// New Game button - show slot selection
		newNewGameBtn.addEventListener('click', () => {
			this.showSlotSelection('new');
		});

		// Load Game button - show slot selection
		newLoadGameBtn.addEventListener('click', () => {
			this.showSlotSelection('load');
		});

		// Back to menu button
		newBackToMenuBtn.addEventListener('click', () => {
			slotScreen.style.display = 'none';
			startScreen.style.display = 'flex';
		});
	}

	// Show slot selection screen
	showSlotSelection(mode) {
		const startScreen = document.getElementById('start-screen');
		const slotScreen = document.getElementById('slot-selection-screen');
		const slotTitle = document.getElementById('slot-title');

		// Update title based on mode
		slotTitle.textContent = mode === 'new' ? 'Select Save Slot' : 'Load Game';

		// Update slot displays
		for (let i = 1; i <= 3; i++) {
			const slotElement = document.querySelector(`.save-slot[data-slot="${i}"]`);
			const saveInfo = this.saveManager.getSaveInfo(i);

			// Remove old click listeners by cloning
			const newSlotElement = slotElement.cloneNode(true);
			slotElement.parentNode.replaceChild(newSlotElement, slotElement);

			// Get elements from the NEW cloned element
			const statusElement = newSlotElement.querySelector(`#slot-${i}-status`);
			const detailsElement = newSlotElement.querySelector(`#slot-${i}-details`);

			if (saveInfo) {
				// Slot has data
				statusElement.textContent = 'Saved Game';
				newSlotElement.querySelector(`#slot-${i}-gold`).textContent = saveInfo.gold;
				newSlotElement.querySelector(`#slot-${i}-day`).textContent = saveInfo.day;
				const date = new Date(saveInfo.timestamp);
				newSlotElement.querySelector(`#slot-${i}-time`).textContent = date.toLocaleString();
				detailsElement.style.display = 'block';
			} else {
				// Empty slot
				statusElement.textContent = 'Empty';
				detailsElement.style.display = 'none';
			}

			// Add click listener
			newSlotElement.addEventListener('click', () => {
				if (mode === 'new') {
					// New game - can use any slot
					this.startNewGame(i);
				} else {
					// Load game - only if slot has data
					if (saveInfo) {
						this.loadGameFromSlot(i);
					} else {
						alert('This slot is empty!');
					}
				}
			});
		}

		// Show slot selection screen
		startScreen.style.display = 'none';
		slotScreen.style.display = 'flex';
	}

	// Start new game in specific slot
	startNewGame(slotNumber) {
		console.log('[Game] Starting new game in slot:', slotNumber);
		this.saveManager.setCurrentSlot(slotNumber);

		document.getElementById('slot-selection-screen').style.display = 'none';
		document.getElementById('game-container').style.display = 'block';
		document.getElementById('hud').style.display = 'block';
		document.getElementById('minimap-container').style.display = 'block';

		this.initialize(false);
	}

	// Load game from specific slot
	loadGameFromSlot(slotNumber) {
		console.log('[Game] Loading game from slot:', slotNumber);
		this.saveManager.setCurrentSlot(slotNumber);

		document.getElementById('slot-selection-screen').style.display = 'none';
		document.getElementById('game-container').style.display = 'block';
		document.getElementById('hud').style.display = 'block';
		document.getElementById('minimap-container').style.display = 'block';

		this.initialize(true);
	}

	// Initialize the game
	initialize(loadSave = false) {
		if (this.isInitialized) return;

		this.setupThreeJS();
		this.setupLighting();
		this.initializeSystems(loadSave);
		this.setupEventListeners();
		this.start();
		this.isInitialized = true;
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
	initializeSystems(loadSave = false) {
		// Core state
		this.gameState = new GameState();

		// Save manager (initialize early)
		if (!this.saveManager) {
			this.saveManager = new SaveManager();
		}

		// Managers
		this.worldManager = new WorldManager(this.scene);
		this.caravanManager = new CaravanManager(this.scene, this.gameState);
		this.cityManager = new CityManager(this.scene, this.gameState);
		this.roadManager = new RoadManager(this.scene);

		// Systems
		this.pathfindingSystem = new PathfindingSystem();
		this.marketSystem = new MarketSystem(this.gameState);
		this.mercenarySystem = new MercenarySystem(this.gameState);
		this.inputSystem = new InputSystem(this.camera, this.renderer);
		this.uiManager = new UIManager(this.gameState, this.marketSystem, this.mercenarySystem);
		this.resourceSystem = new ResourceSystem(this.gameState);
		this.debugManager = new DebugManager(this.gameState, this.uiManager);
		this.minimapManager = new MinimapManager(this.gameState, GameConfig.world.size);
		this.tooltipManager = new TooltipManager();
		this.encounterSystem = new EncounterSystem(this.gameState);

		// Create world elements
		this.worldManager.createWorld();
		this.caravanManager.createCaravan();
		this.cityManager.createCities();
		this.roadManager.createRoads();
		this.roadManager.createObstacles();

		// Load save if requested (AFTER creating all systems)
		if (loadSave) {
			this.loadGame();
		}

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

		// Set up save button
		const saveBtn = document.getElementById('save-game-btn');
		saveBtn.addEventListener('click', () => this.saveGame());

		// Set up quit button
		const quitBtn = document.getElementById('quit-game-btn');
		quitBtn.addEventListener('click', () => this.quitToMenu());

		// Start auto-save
		this.saveManager.startAutoSave(this.gameState, CitiesData, this.mercenarySystem);

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

		// Find current city if we're at one
		const currentCityId = this.gameState.playerCaravan.currentCity || this.findNearestCity();

		// Use pathfinding to check route
		let pathResult = null;
		let routeInfo = '';

		if (currentCityId && currentCityId !== cityId) {
			pathResult = this.pathfindingSystem.findPath(currentCityId, cityId);

			// Check if path is blocked
			if (pathResult.blocked) {
				alert(
					`Cannot travel directly to ${cityData.name}!\n\n` +
						`${pathResult.obstacle.name} blocks the way.\n\n` +
						`You need to find an alternate route through the road network.`
				);
				return;
			}

			// Get route description
			routeInfo = this.pathfindingSystem.getRouteDescription(pathResult);

			// Show route information if not direct
			if (!pathResult.isDirect) {
				const confirm = window.confirm(
					`Route to ${cityData.name}:\n\n` +
						`${routeInfo}\n\n` +
						`This route has ${pathResult.distance} segment(s).\n\n` +
						`Continue with this journey?`
				);

				if (!confirm) return;
			} else if (pathResult.isOffRoad) {
				const confirm = window.confirm(
					`Warning: Off-road travel to ${cityData.name}\n\n` +
						`Traveling without roads is slower and uses more food.\n\n` +
						`Continue?`
				);

				if (!confirm) return;
			}
		}

		// Calculate modifiers from path
		let speedMultiplier = GameConfig.terrain[cityData.terrain]?.speedMultiplier || 1.0;
		let foodMultiplier = 1.0;

		if (pathResult && pathResult.path) {
			const modifiers = this.pathfindingSystem.calculatePathModifiers(pathResult);
			if (modifiers) {
				speedMultiplier *= modifiers.speedBonus;
				foodMultiplier = modifiers.foodMultiplier;
			}
		}

		// Check if player has enough food for the journey
		const baseFoodCost = this.resourceSystem.estimateFoodCost(currentPosition, cityPosition, cityData.terrain);
		const adjustedFoodCost = Math.ceil(baseFoodCost * foodMultiplier);

		if (this.gameState.playerCaravan.food < adjustedFoodCost) {
			alert(
				`Not enough food for this journey!\n\n` +
					`Need: ${adjustedFoodCost} food\n` +
					`Have: ${this.gameState.playerCaravan.food} food\n\n` +
					(foodMultiplier > 1 ? '(Off-road travel requires extra food)' : '')
			);
			return;
		}

		// Set terrain speed multiplier
		this.caravanManager.setTerrainSpeed(speedMultiplier);

		// Store path information
		this.gameState.currentPath = pathResult;

		// Start journey
		this.gameState.setTarget(cityPosition.x, cityPosition.z);
		this.gameState.selectedCity = cityId;
		this.resourceSystem.startJourney(currentPosition, cityId);

		// Reset encounter system for new journey
		this.encounterSystem.resetForJourney();

		console.log(
			`[TRAVEL] ${routeInfo || 'Direct travel'} - Speed: ${speedMultiplier.toFixed(2)}x, Food: ${foodMultiplier.toFixed(
				2
			)}x`
		);
	}

	// Find nearest city to current position
	findNearestCity() {
		const currentPos = this.caravanManager.getPosition();
		let nearestCity = null;
		let minDistance = Infinity;

		Object.keys(CitiesData).forEach((cityId) => {
			const cityPos = this.cityManager.getCityPosition(cityId);
			const distance = currentPos.distanceTo(cityPos);

			if (distance < minDistance) {
				minDistance = distance;
				nearestCity = cityId;
			}
		});

		// Only return if we're actually close to a city
		return minDistance < 50 ? nearestCity : null;
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

	// Handle random encounter
	handleEncounter(encounter) {
		// Check if mercenaries can help
		const mercenaryOptions = this.mercenarySystem.handleEncounterWithMercenaries(encounter);

		if (mercenaryOptions && mercenaryOptions.length > 0) {
			// Show interactive encounter modal with mercenary options
			this.showInteractiveEncounterModal(encounter, mercenaryOptions);
		} else {
			// No mercenaries available, apply encounter normally
			const resultMessage = this.encounterSystem.applyEncounter(encounter);
			const encounterColor = encounter.type === 'positive' ? '#4CAF50' : '#f44336';

			// Record encounter in history
			this.gameState.addEncounterEntry(encounter.name, encounter.type, resultMessage);

			this.showEncounterModal(encounter.name, encounter.description, resultMessage, encounterColor);
		}

		// Update HUD to show changes
		this.uiManager.updateHUD();

		console.log(`[ENCOUNTER] ${encounter.name}`);
	}

	// Show encounter modal
	showEncounterModal(name, description, result, color) {
		// Create modal overlay
		const overlay = document.createElement('div');
		overlay.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.7);
			z-index: 10000;
			display: flex;
			align-items: center;
			justify-content: center;
		`;

		// Create modal content
		const modal = document.createElement('div');
		modal.style.cssText = `
			background: #2a2a2a;
			border: 3px solid ${color};
			border-radius: 10px;
			padding: 30px;
			max-width: 500px;
			box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
			color: #fff;
			font-family: 'Georgia', serif;
		`;

		modal.innerHTML = `
			<h2 style="margin: 0 0 15px 0; color: ${color}; font-size: 24px; border-bottom: 2px solid ${color}; padding-bottom: 10px;">${name}</h2>
			<p style="margin: 15px 0; line-height: 1.6; font-size: 16px;">${description}</p>
			<p style="margin: 15px 0; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 5px; border-left: 4px solid ${color}; font-weight: bold;">${result}</p>
			<button id="encounter-continue-btn" style="
				width: 100%;
				padding: 12px;
				margin-top: 15px;
				background: ${color};
				border: none;
				border-radius: 5px;
				color: white;
				font-size: 16px;
				font-weight: bold;
				cursor: pointer;
				transition: all 0.3s;
			">Continue Journey</button>
		`;

		overlay.appendChild(modal);
		document.body.appendChild(overlay);

		// Add button hover effect
		const btn = document.getElementById('encounter-continue-btn');
		btn.addEventListener('mouseenter', () => {
			btn.style.transform = 'scale(1.05)';
			btn.style.boxShadow = `0 5px 15px ${color}80`;
		});
		btn.addEventListener('mouseleave', () => {
			btn.style.transform = 'scale(1)';
			btn.style.boxShadow = 'none';
		});

		// Handle continue button
		btn.addEventListener('click', () => {
			document.body.removeChild(overlay);
			// Resume movement
			this.gameState.playerCaravan.isMoving = true;
		});
	}

	// Show interactive encounter modal with mercenary options
	showInteractiveEncounterModal(encounter, mercenaryOptions) {
		const color = encounter.type === 'positive' ? '#4CAF50' : '#f44336';

		// Create modal overlay
		const overlay = document.createElement('div');
		overlay.style.cssText = `
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.7);
			z-index: 10000;
			display: flex;
			align-items: center;
			justify-content: center;
		`;

		// Create modal content
		const modal = document.createElement('div');
		modal.style.cssText = `
			background: #2a2a2a;
			border: 3px solid ${color};
			border-radius: 10px;
			padding: 30px;
			max-width: 600px;
			box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
			color: #fff;
			font-family: 'Georgia', serif;
		`;

		// Build mercenary options HTML
		let optionsHTML = '';
		mercenaryOptions.forEach((option, index) => {
			const successPercent = Math.round(option.successChance * 100);
			optionsHTML += `
				<button class="merc-option-btn" data-option-index="${index}" style="
					width: 100%;
					padding: 15px;
					margin: 10px 0;
					background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
					border: 2px solid #555;
					border-radius: 8px;
					color: white;
					font-size: 14px;
					cursor: pointer;
					text-align: left;
					transition: all 0.3s;
				">
					<div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${option.label}</div>
					<div style="color: #aaa; font-size: 13px;">${option.description}</div>
					<div style="color: #4CAF50; font-size: 12px; margin-top: 5px;">Success Chance: ${successPercent}%</div>
				</button>
			`;
		});

		// Add "Accept Fate" option
		optionsHTML += `
			<button class="merc-option-btn" data-option-index="accept" style="
				width: 100%;
				padding: 15px;
				margin: 10px 0;
				background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
				border: 2px solid #555;
				border-radius: 8px;
				color: white;
				font-size: 14px;
				cursor: pointer;
				text-align: left;
				transition: all 0.3s;
			">
				<div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">⚖️ Accept Without Help</div>
				<div style="color: #aaa; font-size: 13px;">Face the encounter without mercenary assistance</div>
			</button>
		`;

		modal.innerHTML = `
			<h2 style="margin: 0 0 15px 0; color: ${color}; font-size: 24px; border-bottom: 2px solid ${color}; padding-bottom: 10px;">
				${encounter.type === 'positive' ? '✨' : '⚠️'} ${encounter.name}
			</h2>
			<p style="margin: 15px 0; line-height: 1.6; font-size: 16px;">${encounter.description}</p>
			<div style="margin: 20px 0; padding: 15px; background: rgba(255, 215, 0, 0.1); border-radius: 5px; border-left: 4px solid gold;">
				<strong style="color: gold;">Your mercenaries can help!</strong><br>
				<span style="color: #ccc; font-size: 14px;">Choose how to handle this situation:</span>
			</div>
			<div id="merc-options-container">
				${optionsHTML}
			</div>
		`;

		overlay.appendChild(modal);
		document.body.appendChild(overlay);

		// Add hover effects and click handlers
		const optionButtons = modal.querySelectorAll('.merc-option-btn');
		optionButtons.forEach((btn) => {
			btn.addEventListener('mouseenter', () => {
				btn.style.transform = 'translateX(5px)';
				btn.style.borderColor = '#888';
				btn.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
			});
			btn.addEventListener('mouseleave', () => {
				btn.style.transform = 'translateX(0)';
				btn.style.borderColor = '#555';
				btn.style.boxShadow = 'none';
			});

			btn.addEventListener('click', () => {
				const optionIndex = btn.getAttribute('data-option-index');
				document.body.removeChild(overlay);

				if (optionIndex === 'accept') {
					// Apply encounter normally without mercenary help
					const resultMessage = this.encounterSystem.applyEncounter(encounter);

					// Record encounter in history
					this.gameState.addEncounterEntry(encounter.name, encounter.type, resultMessage);

					this.showEncounterModal(encounter.name, encounter.description, resultMessage, color);
				} else {
					// Use mercenary action
					const option = mercenaryOptions[parseInt(optionIndex)];
					const result = this.mercenarySystem.applyMercenaryAction(option, encounter, encounter.appliedEffects);

					// Apply the modified effects
					encounter.appliedEffects = result.effects;
					const resultMessage = this.encounterSystem.applyEncounter(encounter);

					// Show result with mercenary message
					const fullMessage = `${result.message}\n\n${resultMessage}`;
					const resultColor = result.success ? '#4CAF50' : '#FF9800';

					// Record encounter in history with mercenary info
					this.gameState.addEncounterEntry(encounter.name, encounter.type, fullMessage, result.mercenary.name);

					this.showEncounterModal(
						`${result.mercenary.icon} ${encounter.name}`,
						encounter.description,
						fullMessage,
						resultColor
					);
				}

				// Update HUD
				this.uiManager.updateHUD();
			});
		});
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

	// Save game
	saveGame() {
		console.log('[Game] Save button clicked');
		const success = this.saveManager.saveGame(this.gameState, CitiesData, this.mercenarySystem);
		console.log('[Game] Save result:', success);
		if (success) {
			// Show brief notification
			const saveBtn = document.getElementById('save-game-btn');
			const originalText = saveBtn.textContent;
			saveBtn.textContent = '✓ Saved!';
			saveBtn.style.background = 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)';

			// Clear any existing timeout
			if (this.saveButtonTimeout) {
				clearTimeout(this.saveButtonTimeout);
			}

			this.saveButtonTimeout = setTimeout(() => {
				saveBtn.textContent = originalText;
				saveBtn.style.background = '';
				this.saveButtonTimeout = null;
			}, 2000);
		}
	}

	// Load game
	loadGame() {
		const saveData = this.saveManager.loadGame();
		if (!saveData) {
			console.error('[Game] Failed to load save data');
			return;
		}

		// Restore game state
		this.saveManager.restoreGameState(saveData, this.gameState);
		this.saveManager.restoreCities(saveData, CitiesData);
		this.saveManager.restoreMercenaries(saveData, this.mercenarySystem);

		// Update caravan position (fix: pass x, z instead of Vector3)
		const pos = this.gameState.playerCaravan.position;
		this.caravanManager.setPosition(pos.x, pos.z);

		// Clear any pending save button timeout and reset button
		if (this.saveButtonTimeout) {
			clearTimeout(this.saveButtonTimeout);
			this.saveButtonTimeout = null;
		}
		const saveBtn = document.getElementById('save-game-btn');
		if (saveBtn) {
			saveBtn.textContent = '💾 Save Game';
			saveBtn.style.background = '';
		}

		// Update UI
		this.uiManager.updateHUD();
		this.uiManager.updateCaravanDetails();

		console.log('[Game] Game loaded successfully');
	}

	// Quit to menu
	quitToMenu() {
		console.log('[Game] Quitting to menu...');

		// Clear any pending save button timeout and reset button immediately
		if (this.saveButtonTimeout) {
			clearTimeout(this.saveButtonTimeout);
			this.saveButtonTimeout = null;
		}
		const saveBtn = document.getElementById('save-game-btn');
		if (saveBtn) {
			saveBtn.textContent = '💾 Save Game';
			saveBtn.style.background = '';
		}

		// Trigger manual save before quitting
		this.saveManager.saveGame(this.gameState, CitiesData, this.mercenarySystem);

		// Stop auto-save timer
		this.saveManager.stopAutoSave();

		// Stop animation loop
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}

		// Clean up Three.js resources
		if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
			this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
		}

		if (this.renderer) {
			this.renderer.dispose();
			this.renderer = null;
		}

		// Clear the scene
		if (this.scene) {
			this.scene.clear();
			this.scene = null;
		}

		this.camera = null;

		// Hide game elements
		document.getElementById('game-container').style.display = 'none';
		document.getElementById('hud').style.display = 'none';
		document.getElementById('minimap-container').style.display = 'none';

		// Show start screen
		document.getElementById('start-screen').style.display = 'flex';

		// Reset initialization flag so game can be restarted
		this.isInitialized = false;

		console.log('[Game] Returned to start screen');
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

			// Check for random encounters
			const currentTerrain = this.encounterSystem.getTerrainForPosition(this.gameState.selectedCity);
			const encounter = this.encounterSystem.checkForEncounter(this.gameState.playerCaravan.position, currentTerrain);

			if (encounter) {
				// Pause movement during encounter
				this.gameState.playerCaravan.isMoving = false;
				this.handleEncounter(encounter);
			}

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
	game.showStartScreen();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = Game;
}
