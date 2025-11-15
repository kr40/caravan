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
│   │   ├── cities.js               # Cities & market data (15 cities)
│   │   ├── roads.js                # Road network connections
│   │   ├── encounters.js           # Random encounter definitions
│   │   └── mercenaries.js          # Mercenary hire pool data
│   │
│   ├── js/                         # Core game logic
│   │   ├── main.js                 # Main Game class (orchestrator)
│   │   └── gameState.js            # Game state manager
│   │
│   ├── managers/                   # Game object managers
│   │   ├── worldManager.js         # 3D world & terrain
│   │   ├── caravanManager.js       # Player caravan
│   │   ├── cityManager.js          # Cities management
│   │   └── roadManager.js          # Road network & 3D visualization
│   │
│   ├── systems/                    # Game systems
│   │   ├── marketSystem.js         # Trading & economy
│   │   ├── inputSystem.js          # User input handling
│   │   ├── encounterSystem.js      # Random encounters (bandits, events)
│   │   ├── mercenarySystem.js      # Mercenary hiring & management
│   │   ├── saveManager.js          # 3-slot save/load system
│   │   ├── resourceSystem.js       # Food consumption & management
│   │   └── pathfindingSystem.js    # Road-based pathfinding (BFS)
│   │
│   └── ui/                         # User interface
│       ├── uiManager.js            # DOM UI management
│       ├── debugManager.js         # Debug console (~key)
│       ├── minimapManager.js       # Minimap with city markers
│       └── tooltipManager.js       # Hover tooltips for cities
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
- **cities.js**: City data (positions, economies, market prices, production/consumption) - 15 cities
- **roads.js**: Road network defining connections between cities (regular roads, bridges, mountain passes)
- **encounters.js**: Random encounter definitions (bandits, merchants, events)
- **mercenaries.js**: Mercenary pool data for hiring (names, costs, combat power)

### src/js/

- **main.js**: Main Game class that initializes and coordinates all systems
- **gameState.js**: GameState class managing player data, cargo, gold, soldiers, etc.

### src/managers/

- **worldManager.js**: Creates 3D world (ground, grid, terrain features, mountains, rivers, forests, deserts)
- **caravanManager.js**: Manages player caravan 3D model and movement along roads
- **cityManager.js**: Creates city 3D models and handles city interactions
- **roadManager.js**: Creates road network 3D visualization (roads, bridges, mountain passes)

### src/systems/

- **marketSystem.js**: All trading logic (buy/sell validation, price checks, transactions)
- **inputSystem.js**: Handles mouse clicks and raycasting (extensible for keyboard)
- **encounterSystem.js**: Random encounter system (bandits, merchants, special events during travel)
- **mercenarySystem.js**: Mercenary hiring, combat resolution, and management
- **saveManager.js**: 3-slot browser localStorage save/load system (saves game state, cities, mercenaries)
- **resourceSystem.js**: Food consumption during travel, day/night cycle management
- **pathfindingSystem.js**: BFS pathfinding algorithm for road-based route calculation

### src/ui/

- **uiManager.js**: Manages all DOM elements (HUD, modals, market interface, caravan details, tabs)
- **debugManager.js**: Debug console (~ key) - set resources, teleport, reset game, advance days
- **minimapManager.js**: Minimap display with city markers and caravan position
- **tooltipManager.js**: Hover tooltips showing city names and distances

### assets/

- Currently empty folders ready for:
  - 3D models (caravan, cities, NPCs)
  - Textures (terrain, buildings)
  - Sound effects and music

## Loading Order (in index.html)

Scripts must load in this specific order:

1. Three.js library (CDN)
2. **Data files** (config, goods, cities, roads, encounters, mercenaries)
3. **Core** (gameState)
4. **Managers** (world, caravan, city, road)
5. **Systems** (market, input, encounter, mercenary, save, resource, pathfinding)
6. **UI** (uiManager, debugManager, minimapManager, tooltipManager)
7. **Main** (main.js) - starts the game

## Architecture Benefits

✅ **Modular**: Each file has a single responsibility
✅ **Scalable**: Easy to add new features without touching existing code
✅ **Maintainable**: Clear separation of concerns
✅ **Testable**: Each class can be tested independently
✅ **Readable**: Well-organized and documented
✅ **Extensible**: Ready for future enhancements (custom models, sounds, etc.)

## Next Development Steps

1. Replace box models with proper 3D assets (.glb/.gltf)
2. Add sound effects and music
3. Implement quest system
4. Add global events affecting economy
5. Seasonal weather effects
6. More encounter variety
7. City reputation system
8. Advanced trading strategies (futures, contracts)
