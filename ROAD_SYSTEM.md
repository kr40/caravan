# Road System & Pathfinding

## Overview
The game now features a comprehensive road network connecting the 15 cities, with natural obstacles that require strategic route planning.

## Road Types

### 🛤️ Regular Roads
- **Speed Bonus:** 1.5x
- **Food Multiplier:** 0.8x (saves food)
- **Color:** Brown (#8b7355)
- **Description:** Well-maintained roads between cities on open terrain

### 🌉 Bridges
- **Speed Bonus:** 1.3x
- **Food Multiplier:** 0.9x
- **Color:** Dark Brown (#6b5d4f)
- **Description:** Sturdy bridges crossing rivers and water
- **Visual:** Bridge support pillars visible in 3D world

### ⛰️ Mountain Passes
- **Speed Bonus:** 1.2x
- **Food Multiplier:** 1.1x (uses more food)
- **Color:** Light Brown/Grey (#9b8b7e)
- **Description:** Carved paths through mountain ranges
- **Visual:** Stone cairn markers along the route

## Natural Obstacles

### Mountains 🏔️
**Ironpeak Range**
- Blocks direct passage between western mountains and eastern plains
- Must use mountain passes to cross
- Visual: Large cone-shaped peaks in the 3D world

**Northern Peaks**
- Smaller mountain range in the north
- Creates barriers for some routes

### Rivers 💧
**Great River**
- Runs through the middle of the map
- Requires bridges to cross
- Visual: Blue flowing water segments

**Western Stream**
- Smaller river in the western region

### Forests 🌲
**Deepwood**
- Dense forest making direct travel difficult
- Roads provide clear paths through
- Visual: Trees and trunks scattered in area

### Deserts 🏜️
**Sun-scorched Wastes**
- Harsh desert terrain near southeastern cities
- Roads are essential for safe passage

## Road Network Connections

### Central Trade Hub
- **Rivertown** ↔️ Port City (road)
- **Rivertown** ↔️ East Market (road)
- **Rivertown** ↔️ Laketown (road)

### Coastal Routes
- **Port City** ↔️ The Vineyards (road)
- **Port City** ↔️ Stormhaven (bridge)

### Eastern Network
- **East Market** ↔️ North Keep (road)
- **East Market** ↔️ Golden Fields (road)
- **Golden Fields** ↔️ Laketown (road)
- **Golden Fields** ↔️ Windmill Town (road)

### Northern Circuit
- **North Keep** ↔️ Forest Hold (road through forest)
- **North Keep** ↔️ Laketown (bridge)
- **Forest Hold** ↔️ Windmill Town (road)

### Mountain Routes
- **Mountainhold** ↔️ Silvermine (mountain pass)
- **Mountainhold** ↔️ Ironforge (mountain pass)
- **Silvermine** ↔️ Ironforge (mountain pass)
- **Ironforge** ↔️ Windmill Town (road)

### Southern Routes
- **The Vineyards** ↔️ High Cliff (road)
- **The Vineyards** ↔️ Sand Port (desert road)
- **Sand Port** ↔️ Stormhaven (desert road)
- **High Cliff** ↔️ Stormhaven (road)

## Gameplay Mechanics

### Pathfinding System
The game automatically calculates the best route between cities:
1. **Direct Road Check:** First checks if there's a direct road connection
2. **Obstacle Check:** Verifies if natural obstacles block the direct path
3. **Route Calculation:** Uses BFS algorithm to find alternate routes through the road network
4. **Multi-hop Routes:** Can suggest routes that pass through intermediate cities

### Travel Modifiers
- **On-Road Travel:** Faster speed, less food consumption
- **Off-Road Travel:** Slower (0.7x speed), more food (1.3x consumption)
- **Blocked Paths:** Cannot travel if mountains/rivers block and no road exists

### Route Information
When planning a journey:
- **Direct Roads:** Instant confirmation with road type displayed
- **Multi-city Routes:** Shows which cities you'll pass through
- **Off-Road Warning:** Alerts about penalties for traveling without roads
- **Blocked Routes:** Informs about obstacles and suggests finding alternate paths

### City Tooltips
Hover over any city to see:
- Terrain type
- Goods produced/consumed
- **Road connections** with symbols:
  - `─` Regular road
  - `≈` Bridge
  - `∧` Mountain pass

## Strategic Planning

### Tips for Efficient Travel
1. **Use Roads When Possible:** 50% speed boost and 20% food savings
2. **Plan Multi-City Routes:** Sometimes going through an intermediate city is faster
3. **Stock Up on Food:** Off-road travel requires 30% more food
4. **Check Connections:** Use tooltips to see which cities are directly connected
5. **Mountain Trade:** Mountain passes are slower but connect valuable mining cities

### Example Routes

**From Rivertown to Mountainhold:**
- ❌ Direct path blocked by Ironpeak Range
- ✅ Route through: Rivertown → Laketown → North Keep → Forest Hold → Windmill Town → Ironforge → Mountainhold

**From Port City to Stormhaven:**
- ✅ Direct bridge connection available
- Faster than going around via The Vineyards

## Visual Indicators

### In 3D World
- **Roads:** Brown pathways connecting cities
- **Bridges:** Dark brown with support pillars
- **Mountain Passes:** Grey paths with stone cairns
- **Mountains:** Large grey/brown cone peaks
- **Rivers:** Blue flowing water
- **Forests:** Green trees with brown trunks

### In Minimap
- Cities shown as gold dots
- Roads visible as lines (if zoomed in sufficiently)
- Player position as red triangle

## Future Enhancements
- Road condition/maintenance system
- Seasonal weather affecting road travel
- Bandit encounters on certain routes
- Toll roads and bridges
- Road construction/upgrades
