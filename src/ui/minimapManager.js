/**
 * Minimap Manager
 * Handles rendering and updating the minimap
 */

class MinimapManager {
	constructor(gameState, worldSize = 1500) {
		this.gameState = gameState;
		this.worldSize = worldSize;
		this.canvas = document.getElementById('minimap');
		this.ctx = this.canvas.getContext('2d');
		this.mapSize = 200; // Canvas size

		// Zoom settings
		this.zoomLevel = 1; // Default zoom level
		this.minZoom = 0.5; // Show more area (zoomed out)
		this.maxZoom = 3; // Show less area (zoomed in)
		this.zoomStep = 0.5; // How much to zoom per click

		// Pan settings for minimap
		this.panOffset = { x: 0, y: 0 };
		this.isPanning = false;
		this.panStart = { x: 0, y: 0 };
		this.lastPanOffset = { x: 0, y: 0 };

		this.scale = this.mapSize / this.worldSize;

		// Initialize controls
		this.initializeZoomControls();
		this.initializePanControls();
	}

	// Initialize zoom button event listeners
	initializeZoomControls() {
		const zoomInBtn = document.getElementById('zoom-in-btn');
		const zoomOutBtn = document.getElementById('zoom-out-btn');

		if (zoomInBtn) {
			zoomInBtn.addEventListener('click', () => this.zoomIn());
		}

		if (zoomOutBtn) {
			zoomOutBtn.addEventListener('click', () => this.zoomOut());
		}
	}

	// Initialize pan controls
	initializePanControls() {
		this.canvas.addEventListener('mousedown', (e) => this.onMinimapMouseDown(e));
		this.canvas.addEventListener('mousemove', (e) => this.onMinimapMouseMove(e));
		this.canvas.addEventListener('mouseup', (e) => this.onMinimapMouseUp(e));
		this.canvas.addEventListener('mouseleave', (e) => this.onMinimapMouseUp(e));
		this.canvas.addEventListener('wheel', (e) => this.onMinimapWheel(e), { passive: false });
	}

	// Handle minimap mouse down
	onMinimapMouseDown(event) {
		const rect = this.canvas.getBoundingClientRect();
		this.panStart.x = event.clientX - rect.left;
		this.panStart.y = event.clientY - rect.top;
		this.lastPanOffset.x = this.panOffset.x;
		this.lastPanOffset.y = this.panOffset.y;
		this.isPanning = true;
		event.preventDefault();
	}

	// Handle minimap mouse move
	onMinimapMouseMove(event) {
		if (!this.isPanning) return;

		const rect = this.canvas.getBoundingClientRect();
		const currentX = event.clientX - rect.left;
		const currentY = event.clientY - rect.top;

		const deltaX = currentX - this.panStart.x;
		const deltaY = currentY - this.panStart.y;

		this.panOffset.x = this.lastPanOffset.x + deltaX;
		this.panOffset.y = this.lastPanOffset.y + deltaY;

		this.update();
		event.preventDefault();
	}

	// Handle minimap mouse up
	onMinimapMouseUp(event) {
		this.isPanning = false;
	}

	// Handle minimap wheel for zoom
	onMinimapWheel(event) {
		event.preventDefault();

		// Determine zoom direction
		const delta = Math.sign(event.deltaY);

		// Update zoom level
		if (delta < 0) {
			this.zoomIn();
		} else {
			this.zoomOut();
		}
	}

	// Zoom in (show less area, more detail)
	zoomIn() {
		if (this.zoomLevel < this.maxZoom) {
			this.zoomLevel += this.zoomStep;
			this.update();
		}
	}

	// Zoom out (show more area, less detail)
	zoomOut() {
		if (this.zoomLevel > this.minZoom) {
			this.zoomLevel -= this.zoomStep;
			this.update();
		}
	}

	// Convert world coordinates to minimap coordinates
	worldToMap(x, z) {
		const caravanPos = this.gameState.playerCaravan.position;

		// Calculate offset to center on caravan when zoomed
		const offsetX = (caravanPos.x + this.worldSize / 2) * this.scale;
		const offsetZ = (caravanPos.z + this.worldSize / 2) * this.scale;
		const centerX = this.mapSize / 2;
		const centerY = this.mapSize / 2;

		// Convert coordinates with zoom
		const mapX = (x + this.worldSize / 2) * this.scale * this.zoomLevel;
		const mapY = (z + this.worldSize / 2) * this.scale * this.zoomLevel;

		// Center on caravan when zoomed, plus manual pan offset
		const finalX = mapX - (offsetX * this.zoomLevel - centerX) + this.panOffset.x;
		const finalY = mapY - (offsetZ * this.zoomLevel - centerY) + this.panOffset.y;

		return {
			x: finalX,
			y: finalY,
		};
	}

	// Clear the minimap
	clear() {
		this.ctx.fillStyle = '#1a1510';
		this.ctx.fillRect(0, 0, this.mapSize, this.mapSize);
	}

	// Draw grid
	drawGrid() {
		this.ctx.strokeStyle = 'rgba(139, 111, 71, 0.3)';
		this.ctx.lineWidth = 0.5;

		const gridSpacing = (this.worldSize / 10) * this.scale * this.zoomLevel;
		const caravanPos = this.gameState.playerCaravan.position;
		const offsetX =
			(caravanPos.x + this.worldSize / 2) * this.scale * this.zoomLevel - this.mapSize / 2 - this.panOffset.x;
		const offsetY =
			(caravanPos.z + this.worldSize / 2) * this.scale * this.zoomLevel - this.mapSize / 2 - this.panOffset.y;

		// Calculate visible grid lines
		const startX = Math.floor(offsetX / gridSpacing) * gridSpacing - offsetX;
		const startY = Math.floor(offsetY / gridSpacing) * gridSpacing - offsetY;

		for (let i = 0; i <= Math.ceil(this.mapSize / gridSpacing) + 1; i++) {
			const posX = startX + i * gridSpacing;
			const posY = startY + i * gridSpacing;

			// Vertical lines
			if (posX >= 0 && posX <= this.mapSize) {
				this.ctx.beginPath();
				this.ctx.moveTo(posX, 0);
				this.ctx.lineTo(posX, this.mapSize);
				this.ctx.stroke();
			}

			// Horizontal lines
			if (posY >= 0 && posY <= this.mapSize) {
				this.ctx.beginPath();
				this.ctx.moveTo(0, posY);
				this.ctx.lineTo(this.mapSize, posY);
				this.ctx.stroke();
			}
		}
	}

	// Draw border
	drawBorder() {
		this.ctx.strokeStyle = '#8b6f47';
		this.ctx.lineWidth = 2;
		this.ctx.strokeRect(1, 1, this.mapSize - 2, this.mapSize - 2);
	}

	// Draw cities
	drawCities() {
		Object.keys(CitiesData).forEach((cityId) => {
			const city = CitiesData[cityId];
			const pos = this.worldToMap(city.position.x, city.position.z);

			// Only draw if within minimap bounds
			if (pos.x < -10 || pos.x > this.mapSize + 10 || pos.y < -10 || pos.y > this.mapSize + 10) {
				return;
			}

			// Scale city dot size with zoom
			const dotSize = 3 * Math.min(this.zoomLevel, 1.5);

			// Draw city dot
			this.ctx.fillStyle = '#d4af37';
			this.ctx.beginPath();
			this.ctx.arc(pos.x, pos.y, dotSize, 0, Math.PI * 2);
			this.ctx.fill();

			// Draw city border
			this.ctx.strokeStyle = '#8b6f47';
			this.ctx.lineWidth = 1;
			this.ctx.stroke();

			// Draw city name with scaled font
			const fontSize = Math.max(6, Math.min(10, 8 * this.zoomLevel));
			this.ctx.fillStyle = '#d4af37';
			this.ctx.font = `${fontSize}px Georgia`;
			this.ctx.textAlign = 'center';
			this.ctx.fillText(city.name, pos.x, pos.y - (dotSize + 3));
		});
	}

	// Draw caravan position
	drawCaravan() {
		const caravanPos = this.gameState.playerCaravan.position;
		const pos = this.worldToMap(caravanPos.x, caravanPos.z);

		// Scale caravan size with zoom
		const size = 4 * Math.min(this.zoomLevel, 1.5);

		// Draw caravan as a red triangle
		this.ctx.fillStyle = '#ff4444';
		this.ctx.strokeStyle = '#ffffff';
		this.ctx.lineWidth = 1.5;

		this.ctx.beginPath();
		this.ctx.moveTo(pos.x, pos.y - size); // Top
		this.ctx.lineTo(pos.x - size * 0.75, pos.y + size * 0.75); // Bottom left
		this.ctx.lineTo(pos.x + size * 0.75, pos.y + size * 0.75); // Bottom right
		this.ctx.closePath();
		this.ctx.fill();
		this.ctx.stroke();
	}

	// Draw target destination if traveling
	drawTarget() {
		if (this.gameState.playerCaravan.isMoving) {
			const targetPos = this.gameState.playerCaravan.targetPosition;
			const pos = this.worldToMap(targetPos.x, targetPos.z);

			// Only draw if within minimap bounds
			if (pos.x < -20 || pos.x > this.mapSize + 20 || pos.y < -20 || pos.y > this.mapSize + 20) {
				return;
			}

			// Scale target size with zoom
			const circleSize = 5 * Math.min(this.zoomLevel, 1.5);

			// Draw target as a pulsing circle
			this.ctx.strokeStyle = '#44ff44';
			this.ctx.lineWidth = 2;
			this.ctx.setLineDash([3, 3]);
			this.ctx.beginPath();
			this.ctx.arc(pos.x, pos.y, circleSize, 0, Math.PI * 2);
			this.ctx.stroke();
			this.ctx.setLineDash([]);

			// Draw line from caravan to target
			const caravanMapPos = this.worldToMap(
				this.gameState.playerCaravan.position.x,
				this.gameState.playerCaravan.position.z
			);
			this.ctx.strokeStyle = 'rgba(68, 255, 68, 0.5)';
			this.ctx.lineWidth = 1;
			this.ctx.setLineDash([2, 2]);
			this.ctx.beginPath();
			this.ctx.moveTo(caravanMapPos.x, caravanMapPos.y);
			this.ctx.lineTo(pos.x, pos.y);
			this.ctx.stroke();
			this.ctx.setLineDash([]);
		}
	}

	// Update and render the minimap
	update() {
		this.clear();
		this.drawGrid();
		this.drawCities();
		this.drawTarget();
		this.drawCaravan();
		this.drawBorder();
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = MinimapManager;
}
