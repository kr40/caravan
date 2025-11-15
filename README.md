# Caravan Adventures

A top-down, low-poly 3D trading simulation game built with Three.js where players manage a medieval caravan, buying and selling goods in a dynamic economy, navigating roads and obstacles, encountering random events, hiring mercenaries, and managing multiple save slots.

## Project Structure

```
caravan/
├── index.html              # Main HTML file with start screen and save slots
├── gamedesign.md           # Complete game design document
├── game.js                 # Legacy monolithic game file (can be removed)
│
├── src/                    # Source code
│   ├── css/
│   │   └── styles.css      # All game styles (including start screen and save slots)
│   │
│   ├── data/               # Game data files
│   │   ├── config.js       # Game configuration and constants
│   │   ├── goods.js        # Tradeable goods definitions
│   │   ├── cities.js       # 15 cities with unique backstories and economies
│   │   ├── roads.js        # Road network connections between cities
│   │   ├── encounters.js   # Random encounters by terrain type
│   │   └── mercenaries.js  # Mercenary types and generation
│   │
│   ├── js/                 # Core game logic
│   │   ├── main.js         # Main game class and initialization with save/load
│   │   └── gameState.js    # Game state management with history tracking
│   │
│   ├── managers/           # Game managers
│   │   ├── worldManager.js     # 3D world creation with terrain types
│   │   ├── caravanManager.js   # Player caravan control
│   │   ├── cityManager.js      # 15 cities creation and management
│   │   └── roadManager.js      # Road system with bridges and obstacles
│   │
│   ├── systems/            # Game systems
│   │   ├── marketSystem.js         # Trading and economy logic
│   │   ├── inputSystem.js          # Input handling (mouse, keyboard)
│   │   ├── resourceSystem.js       # Food consumption and daily costs
│   │   ├── pathfindingSystem.js    # BFS pathfinding through road network
│   │   ├── encounterSystem.js      # Random encounter generation
│   │   ├── mercenarySystem.js      # Mercenary hiring and management
│   │   └── saveManager.js          # Save/load system with 3 save slots
│   │
│   └── ui/                 # UI components
│       ├── uiManager.js        # UI display and interactions with tabs
│       ├── debugManager.js     # Debug console for testing
│       ├── minimapManager.js   # 2D minimap with zoom controls
│       └── tooltipManager.js   # City tooltips on hover
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
- **cities.js**: 15 cities with positions, economies, backstories, and terrain types
- **roads.js**: Road network defining connections between cities
- **encounters.js**: 25+ random encounters organized by terrain type (plains, mountains, forest, desert, river)
- **mercenaries.js**: 6 mercenary types with unique skills and name pools

### Core (`src/js/`)
- **main.js**: Main Game class with save/load system, start screen, and slot management
- **gameState.js**: Manages game state with history tracking (journeys, trades, encounters)

### Managers (`src/managers/`)
- **worldManager.js**: Creates 3D world with color-coded terrain types
- **caravanManager.js**: Handles player caravan 3D model and movement
- **cityManager.js**: Creates 15 unique cities with 3D models
- **roadManager.js**: Manages road network with bridges and obstacles (mountains, rivers)

### Systems (`src/systems/`)
- **marketSystem.js**: All trading logic with buy/sell mechanics
- **inputSystem.js**: Mouse and keyboard input handling with raycasting
- **resourceSystem.js**: Food consumption, daily costs, and journey tracking
- **pathfindingSystem.js**: BFS pathfinding through road network, obstacle detection
- **encounterSystem.js**: Random encounter generation every 100 units traveled
- **mercenarySystem.js**: Mercenary hiring, interactive encounter resolution
- **saveManager.js**: Save/load with 3 independent save slots and auto-save

### UI (`src/ui/`)
- **uiManager.js**: Manages all DOM elements, tabbed Caravan Chronicles modal
- **debugManager.js**: Debug console with teleport, reset, and test commands
- **minimapManager.js**: 2D minimap with zoom controls and city tracking
- **tooltipManager.js**: City information tooltips on hover

## How to Run

1. **Start a local web server** (required for JavaScript modules):
   ```bash
   cd /path/to/caravan
   python -m http.server 8000
   ```
2. Open browser to `http://localhost:8000`
3. **Start Screen**: Choose "New Game" or "Load Game"
4. **Save Slot Selection**: Pick one of 3 save slots
5. **Play**: Click on cities to travel, trade goods, hire mercenaries
6. **Save**: Click "💾 Save Game" button or auto-saves every 60 seconds
7. **Quit**: Click "🚪 Quit to Menu" to return to start screen

## Core Features

### Trading System
- **15 Cities** with unique economies and backstories
- **10 Tradeable goods** with varying prices
- **Market Interface** with buy/sell controls and profit calculation
- **Dynamic prices** based on production and consumption

### Road & Travel System
- **Road network** connecting all cities with bridges
- **Pathfinding** automatically finds routes between cities
- **Obstacles**: Mountains and rivers block direct travel
- **Terrain types**: Plains, mountains, forests, deserts, rivers
- **Food consumption** during travel (5 food/day base + mercenaries)
- **Daily wages** for mercenaries (6-10 gold/day per mercenary)

### Encounter System
- **25+ random encounters** based on terrain type
- **Positive encounters**: Traders, helpful travelers, abandoned supplies
- **Negative encounters**: Bandits, harsh weather, broken equipment
- **Encounter frequency**: Check every 100 units traveled
- **Interactive encounters**: Mercenaries provide choices (combat, negotiate, avoid, forage, trade)

### Mercenary System
- **6 mercenary types**: Warrior, Scout, Diplomat, Cook, Ranger, Merchant
- **Unique skills**: Combat, negotiation, foraging, avoidance, trading, food efficiency
- **Hiring**: Available at city inns with hire costs and daily wages
- **Encounter assistance**: Mercenaries provide strategic options during encounters
- **Success rates**: Skill-based chance of success for encounter actions

### UI Features
- **Start Screen**: New Game / Load Game options
- **Save Slot Management**: 3 independent save slots with game info display
- **HUD**: Real-time display of gold, food, cargo, and date
- **Caravan Chronicles**: Tabbed modal with 5 sections:
  - Cargo inventory with purchase prices
  - Hired mercenaries with skill display
  - Journey history with routes and distances
  - Encounter history with outcomes
  - Recent trades with profit tracking
- **City Modal**: Market, Inn, and general city information
- **Minimap**: 2D overview with zoom controls
- **City Tooltips**: Hover information with produced/consumed goods
- **Debug Console**: Press `~` for development commands

### Save System
- **3 Save Slots**: Independent games in separate slots
- **Auto-Save**: Every 60 seconds
- **Manual Save**: Button in HUD with visual feedback
- **Slot Info**: Displays gold, day, and save date/time
- **Persistent**: Saves position, cargo, gold, food, mercenaries, history, city economies
- **Quit to Menu**: Auto-saves and returns to start screen

## Development Guidelines

### Adding a New Good
1. Add to `src/data/goods.js` with name, basePrice, weight
2. Add market prices to cities in `src/data/cities.js` (produces/consumes)

### Adding a New City
1. Add city data to `src/data/cities.js` with position, produces, consumes, backstory, terrain
2. Add road connections in `src/data/roads.js`
3. CityManager will automatically create it

### Adding a New Encounter
1. Add to `src/data/encounters.js` under appropriate terrain type
2. Include name, type, chance, description, and effects (gold/food gains/losses)

### Adding a New Mercenary Type
1. Add to `src/data/mercenaries.js` with type, skills, costs, and name pool
2. MercenarySystem will handle generation and hiring

### Adding a New Feature
1. Create a new manager/system file in appropriate folder
2. Initialize it in `main.js` `initializeSystems()` method
3. Connect it to existing systems as needed
4. Add UI elements in `index.html` and `uiManager.js`

### Modifying Game Constants
- Edit `src/data/config.js` (colors, speeds, costs, world size, camera settings)

## Current Status: Feature Complete MVP

Implemented features:
- ✅ 3D world with terrain-based colors
- ✅ 15 cities with unique backstories
- ✅ Road network with bridges and obstacles
- ✅ Pathfinding system with obstacle detection
- ✅ Caravan movement with click-to-travel
- ✅ Trading system with 10 goods
- ✅ Food consumption and daily costs
- ✅ Journey tracking and history
- ✅ Random encounter system (25+ encounters)
- ✅ Mercenary system (6 types with skills)
- ✅ Interactive encounters with mercenary choices
- ✅ HUD with real-time stats
- ✅ Tabbed Caravan Chronicles modal
- ✅ Minimap with zoom controls
- ✅ City tooltips on hover
- ✅ Debug console for testing
- ✅ Start screen with save slot selection
- ✅ Save/load system with 3 slots
- ✅ Auto-save every 60 seconds
- ✅ Quit to menu functionality
- ✅ Modular, scalable architecture

## Next Steps

Potential future enhancements:
- More dynamic economy (price fluctuations based on supply/demand)
- Caravan upgrades (larger cargo capacity, faster speed)
- More mercenary interactions (conversations, quests)
- Weather system affecting travel
- Seasons affecting production
- Guild system with reputation
- Quest system with objectives
- Custom 3D models replacing geometric shapes
- Sound effects and music
- Improved graphics and particle effects
- Mobile touch controls
- Multiplayer trading

## File Dependencies

When loading in the browser, files must be loaded in this order (set up in index.html):
1. Three.js library
2. Data files (config, goods, cities, roads, encounters, mercenaries)
3. Game state
4. Managers (world, caravan, city, road)
5. Systems (market, input, resource, pathfinding, encounter, mercenary, save)
6. UI (uiManager, debugManager, minimapManager, tooltipManager)
7. Main game file

## Key Controls

- **Left Click**: Select city to travel to
- **Mouse Hover**: View city tooltips
- **ESC**: Close modals
- **Click Outside Modal**: Close modals
- **~** (Tilde): Open debug console
- **HUD Click**: Open Caravan Chronicles
- **Minimap +/-**: Zoom in/out

## Debug Commands

Access via `~` key:
- `help` - Show all commands
- `teleport <cityName>` - Teleport to any city
- `addgold <amount>` - Add gold
- `addfood <amount>` - Add food
- `setday <day>` - Change game day
- `reset` - Reset caravan position
- `resetcamera` - Reset camera view

## Notes

- All classes are modular and independent
- Save data stored in browser localStorage
- Road network uses BFS pathfinding
- Encounters checked every 100 units of travel
- Auto-save runs every 60 seconds
- Each save slot is completely independent
- Food consumption: 5/day + 2/mercenary
- Daily wages: 6-10 gold per mercenary
- Mercenary hire cost: 120-200 gold
