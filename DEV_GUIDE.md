# Quick Development Reference

## Common Tasks

### Adding a New Good

1. Edit `src/data/goods.js`:
```javascript
newgood: {
    name: 'New Good',
    basePrice: 50,
    category: 'raw',  // 'food', 'raw', 'crafted', 'luxury'
    description: 'Description here'
}
```

2. Add to each city's market in `src/data/cities.js`:
```javascript
market: {
    newgood: { price: 45 }
}
```

### Adding a New City

Edit `src/data/cities.js`:
```javascript
newcity: {
    name: 'New City',
    position: { x: 0, y: 0, z: 0 },
    produces: ['grain'],      // Cheap goods
    consumes: ['tools'],      // Expensive goods
    description: 'City description',
    market: {
        grain: { price: 5 },
        // ... all goods
    }
}
```

### Modifying Game Settings

Edit `src/data/config.js`:
- Starting values (gold, food, cargo)
- Movement speed
- Colors
- Camera position
- World size

### Creating a New System

1. Create file in `src/systems/yourSystem.js`
2. Export the class
3. Initialize in `src/js/main.js`:

```javascript
// In initializeSystems()
this.yourSystem = new YourSystem(dependencies);
this.yourSystem.initialize();
```

### Creating a New Manager

1. Create file in `src/managers/yourManager.js`
2. Follow the pattern:

```javascript
class YourManager {
    constructor(scene, gameState) {
        this.scene = scene;
        this.gameState = gameState;
    }

    initialize() { }
    update() { }
    destroy() { }
}
```

## Key Classes & Methods

### GameState
```javascript
gameState.addGold(amount)
gameState.removeGold(amount)
gameState.addFood(amount)
gameState.removeFood(amount)
gameState.addCargo(goodId, quantity, price)
gameState.removeCargo(goodId, quantity)
gameState.getTotalCargoCount()
gameState.getCargoItem(goodId)
gameState.incrementDay()
gameState.addJourneyHistoryEntry(from, to)
gameState.addTradeHistoryEntry(type, cityId, goodId, quantity, price)
```

### MarketSystem
```javascript
marketSystem.buyGoods(cityId, goodId, quantity)
marketSystem.sellGoods(cityId, goodId, quantity)
marketSystem.getPrice(cityId, goodId)
marketSystem.canBuy(cityId, goodId, quantity)
marketSystem.canSell(goodId, quantity)
```

### CaravanManager
```javascript
caravanManager.setPosition(x, z)
caravanManager.getPosition()
caravanManager.update()  // Call in game loop
caravanManager.setTarget(x, z, isOnRoad, speedBonus)
```

### CityManager
```javascript
cityManager.getCityData(cityId)
cityManager.getCityPosition(cityId)
cityManager.isAtCity(position, threshold)
cityManager.getCityIdFromPosition(position)
```

### UIManager
```javascript
uiManager.updateHUD()
uiManager.openCityModal(cityId)
uiManager.closeCityModal()
uiManager.showNotification(message, type)
uiManager.openCaravanDetails()
uiManager.closeCaravanDetails()
```

### SaveManager
```javascript
saveManager.saveGame(slotNumber)        // Save to slot 1, 2, or 3
saveManager.loadGame(slotNumber)        // Load from slot
saveManager.getSaveInfo(slotNumber)     // Get {slot, timestamp, gold, day}
saveManager.getAllSavesInfo()           // Get info for all 3 slots
saveManager.setCurrentSlot(slotNumber)  // Set active slot
```

### EncounterSystem
```javascript
encounterSystem.checkForEncounter(fromCity, toCity, mercenaryCount)
encounterSystem.resolveEncounter(choice, mercenaryCount)
// Returns: {success, message, goldLost?, foodLost?, mercenariesLost?}
```

### MercenarySystem
```javascript
mercenarySystem.getAvailableMercenaries()
mercenarySystem.hireMercenary(mercenaryId, cost)
mercenarySystem.getHiredMercenaries()
mercenarySystem.getTotalMercenaryCount()
mercenarySystem.getHireCost()
mercenarySystem.dismissMercenary(mercenaryId)
```

### ResourceSystem
```javascript
resourceSystem.consumeFoodForTravel(distance, isOnRoad, foodMultiplier)
// Returns: {success, foodConsumed}
resourceSystem.getDayProgress()
resourceSystem.update(deltaTime)  // Updates day/night cycle
```

### PathfindingSystem
```javascript
pathfindingSystem.findPath(fromCityId, toCityId)
// Returns: {path: [cityIds], totalDistance, roads: [{type, distance}]}
```

### RoadManager
```javascript
roadManager.getRoadBetweenCities(cityId1, cityId2)
// Returns: {type: 'road'|'bridge'|'mountain_pass', speedBonus, foodMultiplier}
roadManager.getSpeedBonus(roadType)
roadManager.getFoodMultiplier(roadType)
```

### DebugManager
```javascript
debugManager.toggleDebugConsole()  // Show/hide with ~ key
debugManager.setGold(amount)
debugManager.setFood(amount)
debugManager.addGold(amount)
debugManager.addFood(amount)
debugManager.clearCargo()
debugManager.fillCargo()
debugManager.teleportToCity(cityId)
debugManager.advanceDays(days)
debugManager.resetGame()
```

### MinimapManager
```javascript
minimapManager.updateCaravanPosition(x, z)
minimapManager.render()
```

### TooltipManager
```javascript
tooltipManager.showTooltip(cityName, distance)
tooltipManager.hideTooltip()
```

## Events & Callbacks

### Input Click Handler
Register in InputSystem:
```javascript
inputSystem.registerClickHandler((raycaster, mouse, event) => {
    // Handle click
});
```

### City Exit Callback
```javascript
uiManager.setCityExitCallback(() => {
    // Called when player leaves city
});
```

## Game Loop Flow

```
Game.animate()
  ├─> update()
  │   ├─> caravanManager.update()
  │   │   └─> returns true if arrived
  │   ├─> resourceSystem.update(deltaTime)
  │   │   └─> updates day/night cycle
  │   ├─> minimapManager.updateCaravanPosition()
  │   └─> handleArrival() if arrived
  │       ├─> encounterSystem.checkForEncounter()
  │       │   └─> show encounter modal if triggered
  │       └─> uiManager.openCityModal()
  └─> render()
      ├─> minimapManager.render()
      └─> renderer.render(scene, camera)
```

## Data Flow

```
User Click
  └─> InputSystem
      └─> Game.handleClick()
          └─> Game.moveToCity()
              └─> GameState.setTarget()
                  └─> CaravanManager.update() (each frame)
                      └─> Game.handleArrival()
                          └─> UIManager.openCityModal()
```

```
UI Buy Button
  └─> UIManager.handleBuy()
      └─> MarketSystem.buyGoods()
          └─> GameState.removeGold()
          └─> GameState.addCargo()
      └─> UIManager.updateHUD()
      └─> UIManager.renderMarket()
```

## Debugging Tips

### Check Game State
Open browser console:
```javascript
game.gameState.playerCaravan  // View caravan data
game.gameState.playerCaravan.cargo  // View cargo
```

### Modify State in Console
```javascript
game.gameState.addGold(1000)  // Add gold
game.uiManager.updateHUD()    // Refresh display
```

### Check Positions
```javascript
game.caravanManager.getPosition()  // Caravan position
game.cityManager.getCityPosition('rivertown')  // City position
```

## File Import Order (Critical!)

Always maintain this order in index.html:
1. Three.js
2. Data (config, goods, cities, roads, encounters, mercenaries)
3. GameState (uses THREE, Config)
4. Managers (world, caravan, city, road)
5. Systems (market, input, encounter, mercenary, save, resource, pathfinding)
6. UI (uiManager, debugManager, minimapManager, tooltipManager)
7. Main (uses everything)

## Common Pitfalls

❌ **Don't** modify gameState directly in UI
✅ **Do** use GameState methods

❌ **Don't** access DOM in managers/systems
✅ **Do** use UIManager for all DOM operations

❌ **Don't** handle input in multiple places
✅ **Do** use InputSystem for all input

❌ **Don't** hard-code values
✅ **Do** use GameConfig constants

## Testing Workflow

1. Make changes to files
2. Save all files
3. Refresh browser (hard refresh: Ctrl+F5)
4. Open console (F12) to check for errors
5. Test functionality
