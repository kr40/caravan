# GEMINI.md

## Project Overview

This project is a top-down, low-poly 3D trading simulation game named "Caravan Adventures". It is built using JavaScript and the Three.js library for 3D rendering. The game runs entirely in the browser.

The architecture is modular, with a clear separation of concerns between data, core game logic, managers, systems, and UI components.

-   **Data Layer (`src/data/`)**: Contains game data such as configuration, goods, cities, and roads.
-   **Core Logic (`src/js/`)**: The main game class (`Game`) orchestrates all other components. Game state is managed in `gameState.js`.
-   **Managers (`src/managers/`)**: Handle the creation and management of 3D objects in the world, such as the caravan, cities, and roads.
-   **Systems (`src/systems/`)**: Implement game mechanics like the market and trading system, input handling, resource management, and pathfinding.
-   **UI (`src/ui/`)**: Manages the user interface, including the HUD, modals, tooltips, and the minimap.

## Building and Running

This is a client-side JavaScript project that does not require a build step.

To run the game:

1.  Open the `index.html` file in a web browser.

There are no explicit build or test commands found in the project.

## Development Conventions

The project follows a modular, class-based approach. Each file typically defines and exports a single class.

-   **Adding New Features**: To add a new feature, you would typically create a new manager or system file in the appropriate directory, initialize it in `src/js/main.js`, and connect it to existing systems as needed.
-   **Data Management**: Game data is stored in plain JavaScript files in the `src/data/` directory. To add new content like cities or goods, you would modify the corresponding files in this directory.
-   **Configuration**: Global game settings are centralized in `src/data/config.js`.
-   **Dependencies**: The project relies on the Three.js library, which is loaded from a CDN in `index.html`. All other scripts are local and their load order is defined in `index.html`.
