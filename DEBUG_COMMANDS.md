# Debug Console Guide

## Opening the Debug Menu

Press the **~** (tilde) or **`** (backtick) key to toggle the debug console.
Press **ESC** to close it.

## Features

### Resources
- **Set Gold**: Enter a specific amount of gold and click "Set" to update your gold
- **Set Food**: Enter a specific amount of food and click "Set" to update your food

### Quick Actions
- **+1000 Gold**: Instantly add 1000 gold to your caravan
- **+100 Food**: Instantly add 100 food to your caravan
- **Clear Cargo**: Remove all goods from your cargo
- **Fill Cargo (Test Goods)**: Fills your cargo with a variety of goods for testing (10-35 units of each good type)

### Game State
- **Reset Game**: Resets the game to initial state:
  - Gold: 1000
  - Food: 50
  - Cargo: Empty
  - Day: 1
  - Position: Center of map
  - *Note: Requires confirmation*

- **+10 Days**: Advance the game calendar by 10 days

### Teleport
- **Select City**: Choose any city from the dropdown menu
- **Teleport**: Instantly travel to the selected city and open the city menu
  - Available cities:
    - Rivertown
    - Mountainhold
    - Port City
    - The Vineyards
    - East Market
    - North Keep
    - Sand Port
    - Forest Hold

## Tips for Testing

1. **Testing Trading**: Use "Fill Cargo" to quickly get goods, then teleport to different cities to test market prices
2. **Testing Food System**: Set food to low amounts (e.g., 5) and try traveling to test food consumption warnings
3. **Testing Economy**: Give yourself lots of gold to experiment with different trading strategies
4. **Testing Journey Distance**: Teleport between distant cities to test long-distance travel mechanics

## Console Logging

All debug actions are logged to the browser console (F12 → Console tab) for tracking what changes were made.
