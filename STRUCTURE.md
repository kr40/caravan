# Project File Structure

```
caravan/
│
├── index.html                      # Main entry point
├── gamedesign.md                   # Complete game design document
├── README.md                       # Project documentation
├── .gitignore                      # Git ignore rules
├── game.js                         # [LEGACY] Original monolithic file (can be deleted)
│
├── src/                            # All source code
│   │
│   ├── css/
│   │   └── styles.css              # Main stylesheet (medieval theme)
│   │
│   ├── data/                       # Game data definitions
│   │   ├── config.js               # Game constants & configuration
│   │   ├── goods.js                # Tradeable goods data
│   │   └── cities.js               # Cities & market data
│   │
│   ├── js/                         # Core game logic
│   │   ├── main.js                 # Main Game class (orchestrator)
│   │   └── gameState.js            # Game state manager
│   │
│   ├── managers/                   # Game object managers
│   │   ├── worldManager.js         # 3D world & terrain
│   │   ├── caravanManager.js       # Player caravan
│   │   └── cityManager.js          # Cities management
│   │
│   ├── systems/                    # Game systems
│   │   ├── marketSystem.js         # Trading & economy
│   │   └── inputSystem.js          # User input handling
│   │
│   └── ui/                         # User interface
│       └── uiManager.js            # DOM UI management
│
└── assets/                         # Game assets (ready for graphics)
    ├── models/                     # 3D models (.glb, .gltf)
    ├── textures/                   # Texture images
    └── sounds/                     # Audio files
```

## File Descriptions

### Root Files

- **index.html**: Main HTML with UI structure, loads all scripts in correct order
- **gamedesign.md**: Complete game design document with all planned features
- **README.md**: Project overview, architecture, and usage instructions
- **game.js**: Legacy monolithic file (functionality now split into modules)

### src/css/

- **styles.css**: All game styling (HUD, modals, buttons, medieval theme)

### src/data/

- **config.js**: Central configuration (colors, speeds, starting values, camera settings)
- **goods.js**: Definitions of all tradeable goods (name, price, category, description)
- **cities.js**: City data (positions, economies, market prices, production/consumption)

### src/js/

- **main.js**: Main Game class that initializes and coordinates all systems
- **gameState.js**: GameState class managing player data, cargo, gold, soldiers, etc.

### src/managers/

- **worldManager.js**: Creates 3D world (ground, grid, terrain features)
- **caravanManager.js**: Manages player caravan 3D model and movement
- **cityManager.js**: Creates city 3D models and handles city interactions

### src/systems/

- **marketSystem.js**: All trading logic (buy/sell validation, price checks, transactions)
- **inputSystem.js**: Handles mouse clicks and raycasting (extensible for keyboard)

### src/ui/

- **uiManager.js**: Manages all DOM elements (HUD, modals, market interface)

### assets/

- Currently empty folders ready for:
  - 3D models (caravan, cities, NPCs)
  - Textures (terrain, buildings)
  - Sound effects and music

## Loading Order (in index.html)

Scripts must load in this specific order:

1. Three.js library (CDN)
2. **Data files** (config, goods, cities)
3. **Core** (gameState)
4. **Managers** (world, caravan, city)
5. **Systems** (market, input)
6. **UI** (uiManager)
7. **Main** (main.js) - starts the game

## Architecture Benefits

✅ **Modular**: Each file has a single responsibility
✅ **Scalable**: Easy to add new features without touching existing code
✅ **Maintainable**: Clear separation of concerns
✅ **Testable**: Each class can be tested independently
✅ **Readable**: Well-organized and documented
✅ **Extensible**: Ready for future enhancements (custom models, sounds, etc.)

## Next Development Steps

1. Add dynamic economy system
2. Implement bandit encounters
3. Add NPC interactions (Tavern, Guild, Stables)
4. Create resource consumption (food, wages)
5. Replace box models with proper 3D assets
6. Add sound effects and music
7. Implement quest system
8. Add global events
