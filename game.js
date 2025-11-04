// Game Data (Static)
const gameData = {
	goods: {
		grain: { name: 'Grain', basePrice: 10 },
		wool: { name: 'Wool', basePrice: 15 },
		iron: { name: 'Iron Ore', basePrice: 25 },
		tools: { name: 'Tools', basePrice: 50 },
	},
	cities: {
		rivertown: {
			name: 'Rivertown',
			position: { x: 100, y: 0, z: 50 },
			produces: ['grain', 'wool'],
			consumes: ['iron', 'tools'],
			market: {
				grain: { price: 5 },
				wool: { price: 10 },
				iron: { price: 35 },
				tools: { price: 60 },
			},
		},
		mountainhold: {
			name: 'Mountainhold',
			position: { x: -200, y: 0, z: -150 },
			produces: ['iron'],
			consumes: ['grain', 'wool'],
			market: {
				grain: { price: 18 },
				wool: { price: 22 },
				iron: { price: 18 },
				tools: { price: 45 },
			},
		},
		portcity: {
			name: 'Port City',
			position: { x: 150, y: 0, z: -100 },
			produces: ['tools'],
			consumes: ['wool', 'iron'],
			market: {
				grain: { price: 12 },
				wool: { price: 25 },
				iron: { price: 30 },
				tools: { price: 40 },
			},
		},
	},
};

// Game State
const gameState = {
	playerCaravan: {
		gold: 1000,
		food: 50,
		speed: 1.0,
		position: new THREE.Vector3(0, 0, 0),
		targetPosition: new THREE.Vector3(0, 0, 0),
		isMoving: false,
		cargo: [],
		maxCargo: 100,
		currentCity: null,
	},
	gameDay: 1,
	selectedCity: null,
};

// Three.js Setup
let scene, camera, renderer, raycaster, mouse;
let caravan,
	cities = {};

function init() {
	// Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x87ceeb);

	// Camera
	camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
	camera.position.set(0, 300, 300);
	camera.lookAt(0, 0, 0);

	// Renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.getElementById('game-container').appendChild(renderer.domElement);

	// Lighting
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
	scene.add(ambientLight);
	const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
	directionalLight.position.set(50, 100, 50);
	scene.add(directionalLight);

	// Raycaster for mouse picking
	raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();

	// Create World
	createWorld();
	createCaravan();
	createCities();

	// Event Listeners
	window.addEventListener('resize', onWindowResize);
	renderer.domElement.addEventListener('click', onMouseClick);

	// UI Event Listeners
	setupUIListeners();

	// Update HUD
	updateHUD();

	// Start Animation
	animate();
}

function createWorld() {
	// Ground plane
	const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
	const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x4a7c39 });
	const ground = new THREE.Mesh(groundGeometry, groundMaterial);
	ground.rotation.x = -Math.PI / 2;
	ground.receiveShadow = true;
	scene.add(ground);

	// Grid helper for reference
	const gridHelper = new THREE.GridHelper(1000, 20, 0x000000, 0x555555);
	scene.add(gridHelper);
}

function createCaravan() {
	// Caravan as a simple box
	const caravanGeometry = new THREE.BoxGeometry(10, 8, 15);
	const caravanMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
	caravan = new THREE.Mesh(caravanGeometry, caravanMaterial);
	caravan.position.copy(gameState.playerCaravan.position);
	caravan.position.y = 4;
	scene.add(caravan);
}

function createCities() {
	Object.keys(gameData.cities).forEach((cityId) => {
		const cityData = gameData.cities[cityId];

		// City as a larger box
		const cityGeometry = new THREE.BoxGeometry(30, 20, 30);
		const cityMaterial = new THREE.MeshLambertMaterial({ color: 0x999999 });
		const cityMesh = new THREE.Mesh(cityGeometry, cityMaterial);

		cityMesh.position.set(cityData.position.x, 10, cityData.position.z);

		cityMesh.userData = { cityId: cityId, type: 'city' };
		cities[cityId] = cityMesh;
		scene.add(cityMesh);

		// Add a label (optional visual marker)
		const markerGeometry = new THREE.ConeGeometry(5, 15, 4);
		const markerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
		const marker = new THREE.Mesh(markerGeometry, markerMaterial);
		marker.position.set(cityData.position.x, 30, cityData.position.z);
		scene.add(marker);
	});
}

function onMouseClick(event) {
	// Calculate mouse position in normalized device coordinates
	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

	// Update the raycaster
	raycaster.setFromCamera(mouse, camera);

	// Check for intersections with cities
	const cityMeshes = Object.values(cities);
	const intersects = raycaster.intersectObjects(cityMeshes);

	if (intersects.length > 0 && !gameState.playerCaravan.isMoving) {
		const clickedCity = intersects[0].object;
		const cityId = clickedCity.userData.cityId;
		moveCaravanToCity(cityId);
	}
}

function moveCaravanToCity(cityId) {
	const cityData = gameData.cities[cityId];
	gameState.playerCaravan.targetPosition.set(cityData.position.x, 0, cityData.position.z);
	gameState.playerCaravan.isMoving = true;
	gameState.selectedCity = cityId;
}

function updateCaravanPosition() {
	if (gameState.playerCaravan.isMoving) {
		const current = gameState.playerCaravan.position;
		const target = gameState.playerCaravan.targetPosition;

		// Lerp towards target
		current.lerp(target, 0.02);
		caravan.position.set(current.x, 4, current.z);

		// Check if reached destination
		const distance = current.distanceTo(target);
		if (distance < 1) {
			gameState.playerCaravan.isMoving = false;
			gameState.playerCaravan.position.copy(target);
			arrivedAtCity();
		}
	}
}

function arrivedAtCity() {
	const cityId = gameState.selectedCity;
	if (cityId) {
		gameState.playerCaravan.currentCity = cityId;
		openCityModal(cityId);
	}
}

function openCityModal(cityId) {
	const cityData = gameData.cities[cityId];
	document.getElementById('city-name').textContent = cityData.name;
	document.getElementById('city-modal').classList.remove('hidden');
	document.getElementById('city-menu').classList.remove('hidden');
	document.getElementById('market-view').classList.add('hidden');
}

function closeCityModal() {
	document.getElementById('city-modal').classList.add('hidden');
	gameState.playerCaravan.currentCity = null;
}

function openMarket() {
	document.getElementById('city-menu').classList.add('hidden');
	document.getElementById('market-view').classList.remove('hidden');
	renderMarket();
}

function renderMarket() {
	const cityId = gameState.playerCaravan.currentCity;
	const cityData = gameData.cities[cityId];
	const goodsList = document.getElementById('goods-list');
	goodsList.innerHTML = '';

	Object.keys(gameData.goods).forEach((goodId) => {
		const good = gameData.goods[goodId];
		const marketPrice = cityData.market[goodId].price;

		// Find how much player has in cargo
		const cargoItem = gameState.playerCaravan.cargo.find((c) => c.goodId === goodId);
		const playerQuantity = cargoItem ? cargoItem.quantity : 0;
		const avgCost = cargoItem ? cargoItem.avgCost : 0;

		const goodDiv = document.createElement('div');
		goodDiv.className = 'good-item';
		goodDiv.innerHTML = `
            <div class="good-info">
                <strong>${good.name}</strong>
                <div class="price-info">
                    <span>Market Price: ${marketPrice} gold</span>
                    ${playerQuantity > 0 ? `<span>Your Avg: ${avgCost.toFixed(1)} gold</span>` : ''}
                    <span>You have: ${playerQuantity}</span>
                </div>
            </div>
            <div class="good-actions">
                <input type="number" id="qty-${goodId}" value="1" min="1" class="qty-input">
                <button onclick="buyGood('${goodId}')" class="action-btn buy-btn">Buy</button>
                <button onclick="sellGood('${goodId}')" class="action-btn sell-btn" ${
			playerQuantity === 0 ? 'disabled' : ''
		}>Sell</button>
            </div>
        `;
		goodsList.appendChild(goodDiv);
	});
}

function buyGood(goodId) {
	const cityId = gameState.playerCaravan.currentCity;
	const cityData = gameData.cities[cityId];
	const price = cityData.market[goodId].price;
	const quantity = parseInt(document.getElementById(`qty-${goodId}`).value);

	const totalCost = price * quantity;
	const currentCargoCount = getTotalCargoCount();

	// Validation
	if (gameState.playerCaravan.gold < totalCost) {
		alert('Not enough gold!');
		return;
	}
	if (currentCargoCount + quantity > gameState.playerCaravan.maxCargo) {
		alert('Not enough cargo space!');
		return;
	}

	// Update gold
	gameState.playerCaravan.gold -= totalCost;

	// Update cargo
	const cargoItem = gameState.playerCaravan.cargo.find((c) => c.goodId === goodId);
	if (cargoItem) {
		// Update average cost
		const totalQuantity = cargoItem.quantity + quantity;
		const totalValue = cargoItem.avgCost * cargoItem.quantity + price * quantity;
		cargoItem.avgCost = totalValue / totalQuantity;
		cargoItem.quantity = totalQuantity;
	} else {
		gameState.playerCaravan.cargo.push({
			goodId: goodId,
			quantity: quantity,
			avgCost: price,
		});
	}

	updateHUD();
	renderMarket();
}

function sellGood(goodId) {
	const cityId = gameState.playerCaravan.currentCity;
	const cityData = gameData.cities[cityId];
	const price = cityData.market[goodId].price;
	const quantity = parseInt(document.getElementById(`qty-${goodId}`).value);

	// Find cargo item
	const cargoItem = gameState.playerCaravan.cargo.find((c) => c.goodId === goodId);
	if (!cargoItem || cargoItem.quantity < quantity) {
		alert('Not enough goods to sell!');
		return;
	}

	// Update gold
	const totalRevenue = price * quantity;
	gameState.playerCaravan.gold += totalRevenue;

	// Update cargo
	cargoItem.quantity -= quantity;
	if (cargoItem.quantity === 0) {
		const index = gameState.playerCaravan.cargo.indexOf(cargoItem);
		gameState.playerCaravan.cargo.splice(index, 1);
	}

	updateHUD();
	renderMarket();
}

function getTotalCargoCount() {
	return gameState.playerCaravan.cargo.reduce((sum, item) => sum + item.quantity, 0);
}

function updateHUD() {
	document.getElementById('gold-display').textContent = gameState.playerCaravan.gold;
	document.getElementById('food-display').textContent = gameState.playerCaravan.food;
	document.getElementById('cargo-display').textContent = `${getTotalCargoCount()}/${gameState.playerCaravan.maxCargo}`;
	document.getElementById('day-display').textContent = gameState.gameDay;
}

function setupUIListeners() {
	document.getElementById('close-modal').addEventListener('click', closeCityModal);
	document.getElementById('leave-city-btn').addEventListener('click', closeCityModal);
	document.getElementById('market-btn').addEventListener('click', openMarket);
	document.getElementById('back-to-city-btn').addEventListener('click', () => {
		document.getElementById('market-view').classList.add('hidden');
		document.getElementById('city-menu').classList.remove('hidden');
	});
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);
	updateCaravanPosition();
	renderer.render(scene, camera);
}

// Initialize the game when the page loads
window.addEventListener('load', init);
