Game Design Document: Caravan Adventures

1. Game Title

Caravan Adventures

2. Logline

A top-down, low-poly 3D trading simulation where players manage a medieval caravan, buying and selling goods in a dynamic economy, while hiring soldiers to protect their cargo from bandits.

3. Core Concept

The player is a merchant in a medieval kingdom. They start with a small amount of gold, a single cart, and a dream. The goal is to build a vast trading empire by traveling between cities, exploiting a fluctuating market (buying low, selling high), and managing the caravan's resources (food, gold, guards). The world is persistent and dangerous; bandits roam the roads, and hiring protection is a necessary business expense.

4. Technology

Engine: Three.js (for 3D rendering of the world map and caravan)

Language: JavaScript/TypeScript

UI: HTML/CSS DOM elements overlaid on the Three.js canvas.

5. Game View & Art Style

View: The primary game view (world map) will be a top-down 3D camera (either orthographic or a fixed-angle perspective) that follows the player's caravan.

Art Style: Low-poly 3D. This keeps asset creation simple and performs well. Models for cities, mountains, forests, and the caravan itself should be distinct but simple.

UI Style: Simple, medieval-themed 2D menus (using HTML/CSS) that appear when the player enters a city or an encounter.

6. Core Gameplay Loops

Primary Loop: Trading

Arrive at City: Player's caravan reaches a city.

Check Market: Player opens the city's Market UI.

Analyze Prices: The player compares the city's prices against their cargo's average purchase price. They also look for goods that are cheap to buy.

Sell High: Sell goods from the caravan that fetch a high price in this city.

Buy Low: Purchase new goods that are produced locally and are cheap.

Leave City: Player exits the city menu and selects a new destination on the world map.

Travel: The caravan moves across the 3D world map in real-time.

Repeat.

Secondary Loop: Management & Risk

Earn Profit: Successful trades increase the player's gold.

Manage Resources: During travel, the caravan consumes Food and Gold (for soldier wages). The player must restock these in cities.

Mitigate Risk:

Player hires Soldiers from the Tavern to increase the caravan's Protection stat.

While traveling, a random Bandit Encounter may occur.

The encounter is auto-resolved based on Caravan Protection vs. Bandit Strength.

Outcome: Win (lose nothing), Partial Loss (lose some goods), or Total Loss (lose all cargo and some gold).

Upgrade: Use profits to buy more Carts (increasing Max Cargo) or hire more/better Soldiers.

7. Key Features

The Caravan

The player's central "unit." It's a 3D model on the world map.

Stats:

Gold: The player's currency.

Food: Consumed daily by the caravan and soldiers. Running out causes soldiers to desert.

Cargo: A list of goods currently held.

Max Cargo: The total amount of goods the caravan can hold. Upgraded by buying more carts.

Soldiers: The number of guards. Determines the Protection stat.

Protection: A calculated value based on Soldiers. Used to resist bandit attacks.

Speed: How fast the caravan moves on the world map.

World Map

A 3D plane rendered with Three.js.

Terrain: Simple terrain like Plains, Forest, Mountains (affects caravan speed).

Roads: Connect cities and provide a speed boost.

Cities: 3D models on the map. The main interaction hubs.

Bandit Units: (Optional MVP+) Roaming 3D models that chase the player if they get too close.

Cities & NPCs

When a player enters a city, a 2D menu interface opens.

The Market: The main screen for buying and selling goods.

Shows city prices vs. your caravan's average buy price.

Indicates which goods are "In Demand" (high price) and "In Surplus" (low price).

The Tavern (NPC: Tavern Keeper):

Hire Soldiers: Recruit basic guards for a hiring fee and a daily wage.

Get Rumors: Get tips about market changes (e.g., "There's a famine in the North, they're paying a fortune for Grain!").

The Guild (NPC: Guild Master):

Provides simple quests (e.g., "Deliver 20 Wool to City Y for 500 Gold bonus").

The Stables (NPC: Stable Master):

Upgrade Caravan: Buy new Carts to increase Max Cargo.

Dynamic Economy

The core of the game.

Goods: A list of tradable items (e.g., Grain, Wool, Iron, Tools, Wine, Spices).

City Production: Each city produces 1-2 goods (e.g., "Rivertown" produces Grain and Fish). These goods are always cheap there.

City Consumption: Each city desires 1-2 goods (e.g., "Mountainhold" needs Grain and Tools). These goods always sell for a good price there.

Market Fluctuations: Prices for all goods slowly change over time based on supply and demand.

Global Events: Random events that drastically change the economy for a short time (e.g., "War!": Iron and Tools prices skyrocket; "Good Harvest": Grain prices plummet).

8. Data Structures (for Copilot)

Use these as a guide for your objects and game state.

/*--- GAME STATE ---*/
const gameState = {
    playerCaravan: {
        gold: 1000,
        food: 50,
        speed: 1.0,
        position: { x: 0, y: 0, z: 0 }, // Three.js Vector3
        targetPosition: { x: 0, y: 0, z: 0 },
        isMoving: false,
        cargo: [
            // { goodId: 'wool', quantity: 20, avgCost: 5 },
        ],
        maxCargo: 100,
        soldiers: 5,
        protection: 10, // Calculated from soldiers
        dailyFoodCost: 7, // 1 for caravan, 1 per soldier
        dailyWageCost: 5, // 1 per soldier
    },
    gameDay: 1,
    globalEvents: [
        // { id: 'evt_war', title: 'War in the West!', duration: 30 (days) }
    ]
};

/*--- STATIC DATA ---*/
const gameData = {
    goods: {
        'grain': { name: 'Grain', basePrice: 10 },
        'wool': { name: 'Wool', basePrice: 15 },
        'iron': { name: 'Iron Ore', basePrice: 25 },
        'tools': { name: 'Tools', basePrice: 50, (isCrafted: true) },
        'wine': { name: 'Wine', basePrice: 80, (isLuxury: true) },
    },
    cities: {
        'rivertown': {
            name: 'Rivertown',
            position: { x: 100, y: 0, z: 50 },
            produces: ['grain', 'wool'], // Always cheap
            consumes: ['iron', 'tools'], // Always expensive
            market: {
                // 'grain': { price: 5, supply: 1000 },
                // ... prices are generated and fluctuated dynamically
            }
        },
        'mountainhold': {
            name: 'Mountainhold',
            position: { x: -200, y: 0, z: -150 },
            produces: ['iron'],
            consumes: ['grain', 'wine'],
            market: {}
        },
        // ... more cities
    }
};

/*--- DYNAMIC DATA (Example) ---*/
// This would be merged into `gameData.cities[cityId].market`
const dynamicMarketData = {
    'rivertown': {
        'grain': { currentPrice: 7, trend: -0.1 },
        'wool': { currentPrice: 12, trend: 0.2 },
        'iron': { currentPrice: 35, trend: 0.0 },
        'tools': { currentPrice: 60, trend: -0.5 },
        'wine': { currentPrice: 90, trend: 0.1 },
    },
    'mountainhold': {
        'grain': { currentPrice: 18, trend: 0.3 },
        'wool': { currentPrice: 20, trend: 0.1 },
        'iron': { currentPrice: 18, trend: -0.2 },
        'tools': { currentPrice: 45, trend: 0.0 },
        'wine': { currentPrice: 110, trend: 0.5 },
    }
};

9. Minimum Viable Product (MVP)

To get started, focus on the absolute core.

Three.js Scene: A simple 3D plane (PlaneGeometry) with 3 BoxGeometry "cities" at fixed locations.

Caravan Model: A single BoxGeometry representing the player.

Movement: Click on a "city" block, and the player's block moves to that location using Vector3.lerp() or a similar method in the animate loop.

UI:

A simple HUD (HTML <div>) showing Gold, Cargo, and Food.

A modal (HTML <div>) that appears when the caravan reaches a city.

Static Market:

The city modal shows a "Market" button.

The Market UI shows 3-4 goods (Grain, Wool, Iron).

Prices are static but different in each city (e.g., Rivertown sells Grain for 5, Mountainhold sells it for 15).

Core Loop: Player can buy and sell goods. Their Gold and Cargo (in a simple JS object) update correctly.

No Combat, No Food Consumption: Ignore bandits, soldiers, and resource consumption for the very first build. Just get the trading loop functional.
