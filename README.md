# Caravan Adventures

A top-down, low-poly 3D trading simulation game built with Three.js where players manage a medieval caravan, buying and selling goods in a dynamic economy.

## Project Structure

```
caravan/
├── index.html              # Main HTML file
├── gamedesign.md           # Complete game design document
├── game.js                 # Legacy monolithic game file (can be removed)
│
├── src/                    # Source code
│   ├── css/
│   │   └── styles.css      # All game styles
│   │
│   ├── data/               # Game data files
│   │   ├── config.js       # Game configuration and constants
│   │   ├── goods.js        # Tradeable goods definitions
│   │   └── cities.js       # Cities data and markets
│   │
│   ├── js/                 # Core game logic
│   │   ├── main.js         # Main game class and initialization
│   │   └── gameState.js    # Game state management
│   │
│   ├── managers/           # Game managers
│   │   ├── worldManager.js     # 3D world creation and management
│   │   ├── caravanManager.js   # Player caravan control
│   │   └── cityManager.js      # Cities creation and management
│   │
│   ├── systems/            # Game systems
│   │   ├── marketSystem.js     # Trading and economy logic
│   │   └── inputSystem.js      # Input handling (mouse, keyboard)
│   │
│   └── ui/                 # UI components
│       └── uiManager.js    # UI display and interactions
│
└── assets/                 # Game assets
    ├── models/             # 3D models (.glb, .gltf files)
    ├── textures/           # Texture images
    └── sounds/             # Audio files
```

## Architecture

### Data Layer (`src/data/`)
- **config.js**: Central configuration for all game constants
- **goods.js**: Definitions for all tradeable items
- **cities.js**: City locations, economies, and market prices

### Core (`src/js/`)
- **main.js**: Main Game class that orchestrates all systems
- **gameState.js**: Manages the game state (player stats, cargo, etc.)

### Managers (`src/managers/`)
- **worldManager.js**: Creates and manages the 3D world (terrain, grid)
- **caravanManager.js**: Handles player caravan 3D model and movement
- **cityManager.js**: Creates city 3D models and manages city interactions

### Systems (`src/systems/`)
- **marketSystem.js**: All trading logic (buy, sell, prices)
- **inputSystem.js**: Mouse and keyboard input handling

### UI (`src/ui/`)
- **uiManager.js**: Manages all DOM elements and UI interactions

## How to Run

1. Open `index.html` in a web browser
2. Click on cities (gray boxes) to travel
3. Enter markets to buy and sell goods
4. Build your trading empire!

## Development Guidelines

### Adding a New Good
1. Add to `src/data/goods.js`
2. Add market prices to each city in `src/data/cities.js`

### Adding a New City
1. Add city data to `src/data/cities.js` with position and market
2. The CityManager will automatically create it

### Adding a New Feature
1. Create a new manager/system file in appropriate folder
2. Initialize it in `main.js`
3. Connect it to existing systems as needed

### Modifying Game Constants
- Edit `src/data/config.js` (colors, speeds, costs, etc.)

## Current Status: MVP

The MVP includes:
- ✅ 3D world with Three.js
- ✅ Caravan movement (click-to-move)
- ✅ Three cities with different markets
- ✅ Trading system (buy/sell goods)
- ✅ HUD showing player stats
- ✅ Modular, scalable architecture

## Next Steps

Future features from the design document:
- Dynamic economy (price fluctuations)
- Bandit encounters and combat
- Soldier hiring and management
- Food consumption and resource management
- Tavern, Guild, and Stables NPCs
- Global events affecting economy
- Quest system
- Caravan upgrades (more carts)
- Custom 3D models replacing boxes
- Sound effects and music

## File Dependencies

When loading in the browser, files must be loaded in this order (already set up in index.html):
1. Three.js library
2. Data files (config, goods, cities)
3. Game state
4. Managers (world, caravan, city)
5. Systems (market, input)
6. UI
7. Main game file

## Notes

- All classes are designed to be modular and independent
- Each file exports its class/data for potential future bundling
- The architecture supports easy addition of new features
- Asset folders are ready for graphics/sounds when needed
