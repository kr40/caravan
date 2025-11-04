/**
 * Input System
 * Handles mouse and keyboard input
 */

class InputSystem {
	constructor(camera, renderer) {
		this.camera = camera;
		this.renderer = renderer;
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.clickHandlers = [];
		this.hoverHandlers = [];

		// Camera pan settings
		this.isPanning = false;
		this.panStart = new THREE.Vector2();
		this.panOffset = new THREE.Vector3(0, 0, 0);
		this.lastMousePos = new THREE.Vector2();
		this.panSpeed = 2;

		// Camera zoom settings
		this.zoomLevel = 1;
		this.minZoom = 0.5;
		this.maxZoom = 2.5;
		this.zoomSpeed = 0.1;
		this.baseHeight = GameConfig.camera.position.y;
		this.baseDistance = GameConfig.camera.position.z;
	}

	// Set up event listeners
	initialize() {
		this.renderer.domElement.addEventListener('click', (event) => this.onMouseClick(event));
		this.renderer.domElement.addEventListener('mousedown', (event) => this.onMouseDown(event));
		this.renderer.domElement.addEventListener('mousemove', (event) => this.onMouseMove(event));
		this.renderer.domElement.addEventListener('mouseup', (event) => this.onMouseUp(event));
		this.renderer.domElement.addEventListener('mouseleave', (event) => this.onMouseUp(event));
		this.renderer.domElement.addEventListener('wheel', (event) => this.onMouseWheel(event), { passive: false });
		// Future: Add keyboard listeners, touch support, etc.
	}

	// Register a click handler
	registerClickHandler(handler) {
		this.clickHandlers.push(handler);
	}

	// Remove a click handler
	unregisterClickHandler(handler) {
		const index = this.clickHandlers.indexOf(handler);
		if (index > -1) {
			this.clickHandlers.splice(index, 1);
		}
	}

	// Register a hover handler
	registerHoverHandler(handler) {
		this.hoverHandlers.push(handler);
	}

	// Remove a hover handler
	unregisterHoverHandler(handler) {
		const index = this.hoverHandlers.indexOf(handler);
		if (index > -1) {
			this.hoverHandlers.splice(index, 1);
		}
	}

	// Handle mouse click
	onMouseClick(event) {
		// Don't process click if we were panning
		if (this.wasPanning) {
			this.wasPanning = false;
			return;
		}

		// Calculate mouse position in normalized device coordinates
		this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		// Update the raycaster
		this.raycaster.setFromCamera(this.mouse, this.camera);

		// Notify all handlers
		this.clickHandlers.forEach((handler) => {
			handler(this.raycaster, this.mouse, event);
		});
	}

	// Handle mouse down
	onMouseDown(event) {
		// Only handle left click
		if (event.button !== 0) return;

		this.panStart.set(event.clientX, event.clientY);
		this.lastMousePos.set(event.clientX, event.clientY);
		this.isPanning = false; // Will become true when moved
		this.wasPanning = false;

		// Change cursor immediately
		this.renderer.domElement.style.cursor = 'grabbing';
	}

	// Handle mouse move
	onMouseMove(event) {
		// Check if mouse button is down
		if (event.buttons === 1) {
			const deltaX = event.clientX - this.lastMousePos.x;
			const deltaY = event.clientY - this.lastMousePos.y;

			// Mark as panning if moved more than a few pixels
			if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
				this.isPanning = true;
				this.wasPanning = true;
			}

			if (this.isPanning) {
				// Pan the camera
				const panDeltaX = -deltaX * this.panSpeed;
				const panDeltaZ = -deltaY * this.panSpeed;

				this.panOffset.x += panDeltaX;
				this.panOffset.z += panDeltaZ;

				// Update camera position
				this.updateCameraPosition();
			}

			this.lastMousePos.set(event.clientX, event.clientY);
		} else {
			// Reset cursor when not dragging
			this.renderer.domElement.style.cursor = 'grab';

			// Update mouse position for hover detection
			this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			// Update raycaster
			this.raycaster.setFromCamera(this.mouse, this.camera);

			// Notify hover handlers
			this.hoverHandlers.forEach((handler) => {
				handler(this.raycaster, this.mouse, event);
			});
		}
	}

	// Handle mouse up
	onMouseUp(event) {
		this.isPanning = false;
		this.renderer.domElement.style.cursor = 'grab';
	}

	// Handle mouse wheel for zoom
	onMouseWheel(event) {
		event.preventDefault();

		// Determine zoom direction
		const delta = Math.sign(event.deltaY);

		// Update zoom level
		this.zoomLevel -= delta * this.zoomSpeed;
		this.zoomLevel = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoomLevel));

		// Update camera position
		this.updateCameraPosition();
	}

	// Update camera position with pan offset and zoom
	updateCameraPosition() {
		const basePos = GameConfig.camera.position;

		// Apply zoom to height and distance
		const zoomedHeight = this.baseHeight / this.zoomLevel;
		const zoomedDistance = this.baseDistance / this.zoomLevel;

		this.camera.position.set(basePos.x + this.panOffset.x, zoomedHeight, zoomedDistance + this.panOffset.z);
		this.camera.lookAt(this.panOffset.x, 0, this.panOffset.z);
	}

	// Reset camera to default position
	resetCamera() {
		this.panOffset.set(0, 0, 0);
		this.zoomLevel = 1;
		this.updateCameraPosition();
	}

	// Get raycaster intersections with objects
	getIntersections(objects) {
		return this.raycaster.intersectObjects(objects);
	}

	destroy() {
		this.renderer.domElement.removeEventListener('click', this.onMouseClick);
		this.renderer.domElement.removeEventListener('mousedown', this.onMouseDown);
		this.renderer.domElement.removeEventListener('mousemove', this.onMouseMove);
		this.renderer.domElement.removeEventListener('mouseup', this.onMouseUp);
		this.renderer.domElement.removeEventListener('mouseleave', this.onMouseUp);
		this.renderer.domElement.removeEventListener('wheel', this.onMouseWheel);
		this.clickHandlers = [];
		this.hoverHandlers = [];
	}
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
	module.exports = InputSystem;
}
