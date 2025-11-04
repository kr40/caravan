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
gameState.addCargo(goodId, quantity, price)
gameState.removeCargo(goodId, quantity)
gameState.getTotalCargoCount()
gameState.getCargoItem(goodId)
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
```

### CityManager
```javascript
cityManager.getCityData(cityId)
cityManager.getCityPosition(cityId)
cityManager.isAtCity(position, threshold)
```

### UIManager
```javascript
uiManager.updateHUD()
uiManager.openCityModal(cityId)
uiManager.closeCityModal()
uiManager.showNotification(message, type)
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
  │   └─> handleArrival() if arrived
  │       └─> uiManager.openCityModal()
  └─> render()
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
2. Config (uses nothing)
3. Goods (uses nothing)
4. Cities (uses nothing)
5. GameState (uses THREE, Config)
6. Managers (use THREE, GameState, Data)
7. Systems (use GameState, Data)
8. UI (use GameState, Systems)
9. Main (uses everything)

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
