# Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         BROWSER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   index.html                          │  │
│  │  ┌─────────────┐  ┌──────────────────────────────┐  │  │
│  │  │   HTML UI   │  │      Three.js Canvas          │  │  │
│  │  │   (Modal,   │  │      (3D World)               │  │  │
│  │  │    HUD)     │  │                                │  │  │
│  │  └─────────────┘  └──────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          ▲ ▼
┌─────────────────────────────────────────────────────────────┐
│                      MAIN GAME (main.js)                     │
│                   Orchestrates everything                    │
└─────────────────────────────────────────────────────────────┘
         │         │          │          │          │
         ▼         ▼          ▼          ▼          ▼
    ┌────────┬────────┬──────────┬──────────┬─────────┐
    │  UI    │Systems │ Managers │  Save    │  State  │
    │(4 UI) │(7 Sys) │(4 Mgrs)  │  System  │         │
    └────────┴────────┴──────────┴──────────┴─────────┘
         │         │          │          │          │
         └─────────┴──────────┴──────────┴──────────┘
                          ▼
                   ┌─────────────┐
                   │  Game State │
                   │   (Data)    │
                   └─────────────┘
                          ▲
                          │
                   ┌─────────────┐
                   │  Data Files │
                   │ Config/Goods│
                   │Cities/Roads │
                   │Encounters   │
                   │ Mercenaries │
                   └─────────────┘
```

## Component Hierarchy

```
Game (main.js)
│
├─── GameState (gameState.js)
│    └─── Data Files
│         ├─── config.js
│         ├─── goods.js
│         ├─── cities.js (15 cities)
│         ├─── roads.js (road network)
│         ├─── encounters.js (random events)
│         └─── mercenaries.js (hire pool)
│
├─── Managers (4 total)
│    ├─── WorldManager (worldManager.js)
│    │    └─── Creates: Ground, Grid, Terrain, Mountains, Rivers
│    │
│    ├─── CaravanManager (caravanManager.js)
│    │    └─── Creates: Caravan 3D model
│    │    └─── Updates: Movement along roads
│    │
│    ├─── CityManager (cityManager.js)
│    │    └─── Creates: City 3D models (15 cities)
│    │    └─── Manages: City interactions
│    │
│    └─── RoadManager (roadManager.js)
│         └─── Creates: Road network visualization
│         └─── Manages: Roads, bridges, mountain passes
│
├─── Systems (7 total)
│    ├─── MarketSystem (marketSystem.js)
│    │    └─── Handles: Buy/Sell/Pricing
│    │
│    ├─── InputSystem (inputSystem.js)
│    │    └─── Handles: Mouse/Keyboard input
│    │
│    ├─── EncounterSystem (encounterSystem.js)
│    │    └─── Handles: Random encounters, bandit fights
│    │
│    ├─── MercenarySystem (mercenarySystem.js)
│    │    └─── Handles: Hiring, dismissal, combat power
│    │
│    ├─── SaveManager (saveManager.js)
│    │    └─── Handles: 3-slot save/load, localStorage
│    │
│    ├─── ResourceSystem (resourceSystem.js)
│    │    └─── Handles: Food consumption, day/night cycle
│    │
│    └─── PathfindingSystem (pathfindingSystem.js)
│         └─── Handles: BFS pathfinding through road network
│
└─── UI (4 components)
     ├─── UIManager (uiManager.js)
     │    └─── Manages: HUD, Modals, Market UI, Tabs
     │
     ├─── DebugManager (debugManager.js)
     │    └─── Manages: Debug console (~key)
     │
     ├─── MinimapManager (minimapManager.js)
     │    └─── Manages: Minimap rendering
     │
     └─── TooltipManager (tooltipManager.js)
          └─── Manages: City hover tooltips
```

## Data Flow Diagrams

### Trading Flow

```
User clicks "Buy"
      │
      ▼
UIManager.handleBuy()
      │
      ▼
MarketSystem.buyGoods()
      │
      ├──> Check: canBuy()?
      │    └──> GameState.getTotalCargoCount()
      │    └──> GameState.playerCaravan.gold
      │
      ├──> GameState.removeGold(cost)
      │
      └──> GameState.addCargo(good, qty, price)
      │
      ▼
UIManager.updateHUD()
UIManager.renderMarket()
```

### Movement Flow

```
User clicks on City
      │
      ▼
InputSystem (raycaster)
      │
      ▼
Game.handleClick()
      │
      ▼
Game.moveToCity(cityId)
      │
      ├──> PathfindingSystem.findPath(from, to)
      │    └──> Returns: {path, distance, roads}
      │
      ├──> ResourceSystem.consumeFoodForTravel()
      │    └──> Check if enough food
      │
      ▼
GameState.setTarget(x, z, isOnRoad, speedBonus)
      │
      ▼
[Every Frame]
CaravanManager.update()
      │
      ├──> Lerp position towards target
      │    (with speed bonus if on road)
      │
      └──> Distance < threshold?
           │
           ▼ (YES)
      Game.handleArrival()
           │
           ├──> EncounterSystem.checkForEncounter()
           │    └──> Show encounter modal if triggered
           │
           ▼
      GameState.setCurrentCity(cityId)
           │
           ▼
      UIManager.openCityModal(cityId)
```

### Save/Load Flow

```
User clicks "Save Game"
      │
      ▼
Game.saveGame()
      │
      ▼
SaveManager.saveGame(slotNumber)
      │
      ├──> Serialize GameState
      │    └──> gold, food, cargo, day, position, etc.
      │
      ├──> Serialize Cities
      │    └──> market prices for all cities
      │
      ├──> Serialize Mercenaries
      │    └──> hired + available pool
      │
      └──> localStorage.setItem('caravan_adventures_save_X', JSON)

User clicks "Load Game" → Select Slot
      │
      ▼
Game.loadGame(slotNumber)
      │
      ▼
SaveManager.loadGame(slotNumber)
      │
      ├──> localStorage.getItem('caravan_adventures_save_X')
      │
      ├──> Parse JSON
      │
      ├──> Restore GameState
      │
      ├──> Restore Cities
      │
      ├──> Restore Mercenaries
      │
      └──> CaravanManager.setPosition()
      │
      ▼
UIManager.updateHUD()
MinimapManager.updateCaravanPosition()
```

### Encounter Flow

```
Caravan arrives at city
      │
      ▼
Game.handleArrival()
      │
      ▼
EncounterSystem.checkForEncounter()
      │
      ├──> Roll random chance
      │
      └──> Encounter triggered?
           │
           ▼ (YES)
      UIManager.showEncounterModal()
           │
           ├─> User chooses: Fight / Run / Pay
           │
           ▼
      EncounterSystem.resolveEncounter(choice, mercenaryCount)
           │
           ├──> Calculate outcome based on:
           │    • Choice (fight/run/pay)
           │    • Mercenary count
           │    • Random roll
           │
           └──> Returns: {success, message, goldLost?, foodLost?, mercenariesLost?}
           │
           ▼
      GameState.applyEncounterResult()
           │
           ▼
      UIManager.showNotification()
```

### Initialization Flow

```
Page Load
   │
   ▼
Start Screen
   │
   ├─> New Game → Select Slot
   │   │
   │   ▼
   │   SaveManager.setCurrentSlot(slot)
   │   │
   │   ▼
   │   new Game()
   │
   └─> Load Game → Select Slot
       │
       ▼
       SaveManager.loadGame(slot)
       │
       ▼
       new Game() with loaded state
   │
   ▼
game.initialize()
   │
   ├──> setupThreeJS()
   │    ├─ Create Scene
   │    ├─ Create Camera
   │    └─ Create Renderer
   │
   ├──> setupLighting()
   │    ├─ Ambient Light
   │    └─ Directional Light
   │
   ├──> initializeSystems()
   │    ├─ new GameState()
   │    ├─ new WorldManager()
   │    │   └─ createWorld() (terrain, mountains, rivers)
   │    ├─ new RoadManager()
   │    │   └─ createRoads() (roads, bridges, passes)
   │    ├─ new CaravanManager()
   │    │   └─ createCaravan()
   │    ├─ new CityManager()
   │    │   └─ createCities() (15 cities)
   │    ├─ new MarketSystem()
   │    ├─ new EncounterSystem()
   │    ├─ new MercenarySystem()
   │    ├─ new ResourceSystem()
   │    ├─ new PathfindingSystem()
   │    ├─ new InputSystem()
   │    │   └─ initialize()
   │    ├─ new UIManager()
   │    │   └─ initialize()
   │    ├─ new DebugManager()
   │    ├─ new MinimapManager()
   │    └─ new TooltipManager()
   │
   ├──> setupEventListeners()
   │    └─ Register handlers
   │
   ├──> setupAutoSave()
   │    └─ Auto-save every 60 seconds
   │
   └──> start()
        └─ animate() [Game Loop]
           ├─ update()
           │  ├─ caravanManager.update()
           │  ├─ resourceSystem.update()
           │  └─ minimapManager.updateCaravanPosition()
           └─ render()
              ├─ renderer.render(scene, camera)
              └─ minimapManager.render()
```

## Class Responsibilities

```
┌─────────────────────────────────────────────────────────┐
│ GameState                                                │
├─────────────────────────────────────────────────────────┤
│ • Store player data (gold, food, cargo, day)            │
│ • Journey & trade history tracking                      │
│ • Provide methods to modify state safely                │
│ • Calculate derived values (protection, costs)          │
│ • No rendering, no DOM, no Three.js                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ WorldManager                                             │
├─────────────────────────────────────────────────────────┤
│ • Create 3D world geometry                              │
│ • Terrain features (mountains, rivers, forests)         │
│ • Day/night cycle visualization                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ RoadManager                                              │
├─────────────────────────────────────────────────────────┤
│ • Create road network 3D visualization                  │
│ • Manage roads, bridges, mountain passes                │
│ • Provide road data for pathfinding                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ CaravanManager                                           │
├─────────────────────────────────────────────────────────┤
│ • Create and update caravan 3D model                    │
│ • Handle movement interpolation with road bonuses       │
│ • Future: Load custom models, animations                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ CityManager                                              │
├─────────────────────────────────────────────────────────┤
│ • Create city 3D models (15 cities)                     │
│ • Provide city data access                              │
│ • City-specific visuals and labels                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ MarketSystem                                             │
├─────────────────────────────────────────────────────────┤
│ • All trading logic (buy, sell, validate)               │
│ • Price calculations and checks                         │
│ • Track trade history                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ EncounterSystem                                          │
├─────────────────────────────────────────────────────────┤
│ • Random encounter generation                           │
│ • Combat resolution (fight/run/pay)                     │
│ • Apply encounter outcomes                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ MercenarySystem                                          │
├─────────────────────────────────────────────────────────┤
│ • Mercenary hiring and dismissal                        │
│ • Combat power calculations                             │
│ • Manage available and hired pools                      │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ SaveManager                                              │
├─────────────────────────────────────────────────────────┤
│ • 3-slot save system using localStorage                 │
│ • Serialize/deserialize game state                      │
│ • Save slot info display                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ ResourceSystem                                           │
├─────────────────────────────────────────────────────────┤
│ • Food consumption during travel                        │
│ • Day/night cycle management                            │
│ • Day increment logic                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ PathfindingSystem                                        │
├─────────────────────────────────────────────────────────┤
│ • BFS pathfinding through road network                  │
│ • Calculate route distance and road types               │
│ • Find optimal paths between cities                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ InputSystem                                              │
├─────────────────────────────────────────────────────────┤
│ • Handle all user input (mouse, keyboard)               │
│ • Raycasting for 3D object selection                    │
│ • Event distribution to handlers                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ UIManager                                                │
├─────────────────────────────────────────────────────────┤
│ • All DOM manipulation                                  │
│ • Display game state in UI                              │
│ • Handle UI events (buttons, inputs)                    │
│ • Update HUD, modals, menus, tabs                       │
│ • Caravan details panel                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ DebugManager                                             │
├─────────────────────────────────────────────────────────┤
│ • Debug console (~ key toggle)                          │
│ • Set resources, teleport, reset game                   │
│ • Advance days for testing                              │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ MinimapManager                                           │
├─────────────────────────────────────────────────────────┤
│ • Render minimap with city markers                      │
│ • Update caravan position on minimap                    │
│ • Visual representation of game world                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TooltipManager                                           │
├─────────────────────────────────────────────────────────┤
│ • Show/hide city tooltips on hover                      │
│ • Display city name and distance                        │
│ • Position tooltips near mouse                          │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Main (Game class)                                        │
├─────────────────────────────────────────────────────────┤
│ • Initialize and coordinate all 15+ systems             │
│ • Game loop (update, render)                            │
│ • Event handling and routing                            │
│ • High-level game flow control                          │
│ • Auto-save management                                  │
└─────────────────────────────────────────────────────────┘
```

## Dependency Graph

```
        Data Files (config, goods, cities)
                    ▲
                    │
                GameState ◄─────────┐
                    ▲               │
                    │               │
        ┌───────────┼───────────┐   │
        │           │           │   │
   WorldManager  CaravanMgr  CityMgr│
        │           │           │   │
        └───────────┼───────────┘   │
                    │               │
              MarketSystem ─────────┘
                    ▲
                    │
                UIManager
                    ▲
                    │
              InputSystem
                    ▲
                    │
                  Main
                    ▲
                    │
                index.html
```

## File Load Order (Critical!)

```
1. THREE.js library
   │
2. config.js ──────┐
3. goods.js ───────┤
4. cities.js ──────├─ Data Layer (no dependencies)
5. roads.js ───────┤
6. encounters.js ──┤
7. mercenaries.js ─┘
   │
8. gameState.js (uses: THREE, config)
   │
9. worldManager.js ────┐
10. caravanManager.js ─┤
11. cityManager.js ────├─ Managers (use: THREE, gameState, data)
12. roadManager.js ────┘
   │
13. marketSystem.js ────┐
14. inputSystem.js ─────┤
15. encounterSystem.js ─┤
16. mercenarySystem.js ─├─ Systems (use: gameState, data)
17. saveManager.js ─────┤
18. resourceSystem.js ──┤
19. pathfindingSystem.js┘
   │
20. uiManager.js ────┐
21. debugManager.js ─┤
22. minimapManager.js├─ UI Components (use: gameState, systems)
23. tooltipManager.js┘
   │
24. main.js (uses: EVERYTHING)
```

This load order ensures each file has access to its dependencies.

**Total Files: 24 JavaScript files + index.html + styles.css**
