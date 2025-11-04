/**
 * Road Manager
 * Handles creation and rendering of roads and obstacles in 3D world
 */

class RoadManager {
	constructor(scene) {
		this.scene = scene;
		this.roads = [];
		this.obstacles = [];
	}

	// Create all roads
	createRoads() {
		RoadsData.connections.forEach((connection) => {
			this.createRoad(connection);
		});
	}

	// Create a single road between two cities
	createRoad(connection) {
		const fromCity = CitiesData[connection.from];
		const toCity = CitiesData[connection.to];

		if (!fromCity || !toCity) return;

		const roadType = RoadsData.types[connection.type];
		const start = new THREE.Vector3(fromCity.position.x, 0.5, fromCity.position.z);
		const end = new THREE.Vector3(toCity.position.x, 0.5, toCity.position.z);

		// Calculate direction and distance
		const direction = new THREE.Vector3().subVectors(end, start);
		const distance = direction.length();
		const roadWidth = connection.type === 'bridge' ? 8 : 12;

		// Create road geometry (width, height, depth)
		const roadGeometry = new THREE.BoxGeometry(roadWidth, 0.5, distance);
		const roadMaterial = new THREE.MeshLambertMaterial({
			color: roadType.color,
		});
		const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);

		// Position road at midpoint
		const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
		roadMesh.position.copy(midpoint);

		// Rotate road to align with direction
		const angle = Math.atan2(direction.x, direction.z);
		roadMesh.rotation.y = angle;

		roadMesh.userData = {
			type: 'road',
			roadType: connection.type,
			from: connection.from,
			to: connection.to,
		};

		this.roads.push(roadMesh);
		this.scene.add(roadMesh);

		// Add road markers for special types
		if (connection.type === 'bridge') {
			this.createBridgeMarkers(start, end, roadWidth);
		} else if (connection.type === 'mountain_pass') {
			this.createPassMarkers(start, end);
		}
	}

	// Create bridge support markers
	createBridgeMarkers(start, end, width) {
		const direction = new THREE.Vector3().subVectors(end, start);
		const distance = direction.length();
		const numSupports = Math.floor(distance / 40);

		for (let i = 1; i <= numSupports; i++) {
			const t = i / (numSupports + 1);
			const position = new THREE.Vector3().lerpVectors(start, end, t);

			// Create support pillars
			const pillarGeometry = new THREE.CylinderGeometry(2, 3, 15, 8);
			const pillarMaterial = new THREE.MeshLambertMaterial({ color: 0x5a4a3a });
			const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
			pillar.position.set(position.x, -5, position.z);

			this.obstacles.push(pillar);
			this.scene.add(pillar);
		}
	}

	// Create mountain pass markers
	createPassMarkers(start, end) {
		const direction = new THREE.Vector3().subVectors(end, start);
		const distance = direction.length();
		const numMarkers = Math.floor(distance / 50);

		for (let i = 1; i <= numMarkers; i++) {
			const t = i / (numMarkers + 1);
			const position = new THREE.Vector3().lerpVectors(start, end, t);

			// Create stone cairn markers
			const markerGeometry = new THREE.ConeGeometry(3, 8, 4);
			const markerMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
			const marker = new THREE.Mesh(markerGeometry, markerMaterial);
			marker.position.set(position.x, 4, position.z);

			this.obstacles.push(marker);
			this.scene.add(marker);
		}
	}

	// Create visual obstacles (mountains, rivers, etc.)
	createObstacles() {
		this.createMountainRanges();
		this.createRivers();
		this.createForests();
	}

	// Create mountain range visuals
	createMountainRanges() {
		ObstaclesData.mountains.forEach((mountain) => {
			// Create mountain peaks along the range
			for (let i = 0; i < mountain.points.length; i++) {
				const point = mountain.points[i];

				// Main peak
				const peakGeometry = new THREE.ConeGeometry(25, 60, 6);
				const peakMaterial = new THREE.MeshLambertMaterial({
					color: 0x6b675f,
				});
				const peak = new THREE.Mesh(peakGeometry, peakMaterial);
				peak.position.set(point.x, 30, point.z);
				peak.castShadow = true;

				this.obstacles.push(peak);
				this.scene.add(peak);

				// Add smaller peaks nearby
				if (i < mountain.points.length - 1) {
					const nextPoint = mountain.points[i + 1];
					const midX = (point.x + nextPoint.x) / 2;
					const midZ = (point.z + nextPoint.z) / 2;

					const smallPeakGeometry = new THREE.ConeGeometry(15, 40, 6);
					const smallPeak = new THREE.Mesh(smallPeakGeometry, peakMaterial);
					smallPeak.position.set(midX + (Math.random() - 0.5) * 20, 20, midZ + (Math.random() - 0.5) * 20);

					this.obstacles.push(smallPeak);
					this.scene.add(smallPeak);
				}
			}
		});
	}

	// Create river visuals
	createRivers() {
		ObstaclesData.rivers.forEach((river) => {
			for (let i = 0; i < river.points.length - 1; i++) {
				const start = river.points[i];
				const end = river.points[i + 1];

				const direction = {
					x: end.x - start.x,
					z: end.z - start.z,
				};
				const distance = Math.sqrt(direction.x ** 2 + direction.z ** 2);

				// Create river segment
				const riverGeometry = new THREE.PlaneGeometry(river.width, distance);
				const riverMaterial = new THREE.MeshLambertMaterial({
					color: 0x4a90e2,
					transparent: true,
					opacity: 0.7,
				});
				const riverSegment = new THREE.Mesh(riverGeometry, riverMaterial);

				riverSegment.position.set((start.x + end.x) / 2, 0.2, (start.z + end.z) / 2);
				riverSegment.rotation.x = -Math.PI / 2;
				riverSegment.rotation.z = Math.atan2(direction.z, direction.x) - Math.PI / 2;

				this.obstacles.push(riverSegment);
				this.scene.add(riverSegment);
			}
		});
	}

	// Create forest visuals
	createForests() {
		ObstaclesData.forests.forEach((forest) => {
			const numTrees = 30;
			const treeGeometry = new THREE.ConeGeometry(5, 20, 8);
			const treeMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });

			for (let i = 0; i < numTrees; i++) {
				const angle = (Math.PI * 2 * i) / numTrees;
				const radius = forest.radius * (0.5 + Math.random() * 0.5);
				const x = forest.center.x + Math.cos(angle) * radius;
				const z = forest.center.z + Math.sin(angle) * radius;

				const tree = new THREE.Mesh(treeGeometry, treeMaterial);
				tree.position.set(x, 10, z);
				tree.castShadow = true;

				this.obstacles.push(tree);
				this.scene.add(tree);

				// Tree trunk
				const trunkGeometry = new THREE.CylinderGeometry(2, 3, 10, 8);
				const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x4a3728 });
				const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
				trunk.position.set(x, 5, z);

				this.obstacles.push(trunk);
				this.scene.add(trunk);
			}
		});
	}

	// Destroy and clean up
	destroy() {
		[...this.roads, ...this.obstacles].forEach((obj) => {
			this.scene.remove(obj);
			obj.geometry.dispose();
			obj.material.dispose();
		});
		this.roads = [];
		this.obstacles = [];
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = RoadManager;
}
