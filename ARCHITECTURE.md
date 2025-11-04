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
    │  UI    │ Input  │ Market   │ Managers │  State  │
    │Manager │ System │ System   │          │         │
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
                   │   /Cities   │
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
│         └─── cities.js
│
├─── Managers
│    ├─── WorldManager (worldManager.js)
│    │    └─── Creates: Ground, Grid, Terrain
│    │
│    ├─── CaravanManager (caravanManager.js)
│    │    └─── Creates: Caravan 3D model
│    │    └─── Updates: Movement, Position
│    │
│    └─── CityManager (cityManager.js)
│         └─── Creates: City 3D models
│         └─── Manages: City interactions
│
├─── Systems
│    ├─── MarketSystem (marketSystem.js)
│    │    └─── Handles: Buy/Sell/Pricing
│    │
│    └─── InputSystem (inputSystem.js)
│         └─── Handles: Mouse/Keyboard input
│
└─── UI
     └─── UIManager (uiManager.js)
          └─── Manages: HUD, Modals, Market UI
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
      ▼
GameState.setTarget(x, z)
      │
      ▼
[Every Frame]
CaravanManager.update()
      │
      ├──> Lerp position towards target
      │
      └──> Distance < threshold?
           │
           ▼ (YES)
      Game.handleArrival()
           │
           ▼
      GameState.setCurrentCity(cityId)
           │
           ▼
      UIManager.openCityModal(cityId)
```

### Initialization Flow

```
Page Load
   │
   ▼
window.load event
   │
   ▼
new Game()
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
   │    │   └─ createWorld()
   │    ├─ new CaravanManager()
   │    │   └─ createCaravan()
   │    ├─ new CityManager()
   │    │   └─ createCities()
   │    ├─ new MarketSystem()
   │    ├─ new InputSystem()
   │    │   └─ initialize()
   │    └─ new UIManager()
   │        └─ initialize()
   │
   ├──> setupEventListeners()
   │    └─ Register handlers
   │
   └──> start()
        └─ animate() [Game Loop]
           ├─ update()
           └─ render()
```

## Class Responsibilities

```
┌─────────────────────────────────────────────────────────┐
│ GameState                                                │
├─────────────────────────────────────────────────────────┤
│ • Store player data (gold, food, cargo)                 │
│ • Provide methods to modify state safely                │
│ • Calculate derived values (protection, costs)          │
│ • No rendering, no DOM, no Three.js                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ WorldManager                                             │
├─────────────────────────────────────────────────────────┤
│ • Create 3D world geometry                              │
│ • Manage terrain and environment                        │
│ • Future: Weather, day/night, roads                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ CaravanManager                                           │
├─────────────────────────────────────────────────────────┤
│ • Create and update caravan 3D model                    │
│ • Handle movement interpolation                         │
│ • Future: Load custom models, animations                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ CityManager                                              │
├─────────────────────────────────────────────────────────┤
│ • Create city 3D models                                 │
│ • Provide city data access                              │
│ • Future: City-specific visuals, NPCs                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ MarketSystem                                             │
├─────────────────────────────────────────────────────────┤
│ • All trading logic (buy, sell, validate)               │
│ • Price calculations and checks                         │
│ • Future: Dynamic pricing, supply/demand                │
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
│ • Update HUD, modals, menus                             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Main (Game class)                                        │
├─────────────────────────────────────────────────────────┤
│ • Initialize and coordinate all systems                 │
│ • Game loop (update, render)                            │
│ • Event handling and routing                            │
│ • High-level game flow control                          │
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
2. config.js ──┐
3. goods.js ───┼─ Data Layer (no dependencies)
4. cities.js ──┘
   │
5. gameState.js (uses: THREE, config)
   │
6. worldManager.js ──┐
7. caravanManager.js ├─ Managers (use: THREE, gameState, data)
8. cityManager.js ───┘
   │
9. marketSystem.js ──┐
10. inputSystem.js ──┘ Systems (use: gameState, data)
   │
11. uiManager.js (uses: gameState, marketSystem)
   │
12. main.js (uses: EVERYTHING)
```

This load order ensures each file has access to its dependencies.
