# Assets

This folder contains all game assets.

## Folder Structure

### `/models`

3D models for the game (.glb, .gltf, .fbx formats)

**Planned models:**

- Caravan (different types: basic, upgraded)
- Cities (various medieval buildings)
- Terrain features (trees, rocks, mountains)
- Bandits and soldiers
- NPCs

### `/textures`

Texture images for 3D models and terrain

**Planned textures:**

- Ground textures (grass, dirt, road, snow)
- Building textures (stone, wood, roofs)
- Character textures

### `/sounds`

Audio files for the game

**Planned sounds:**

- Background music (different tracks for day/night, cities, travel)
- Sound effects:
  - Caravan movement
  - City ambience
  - Market sounds
  - Combat sounds
  - UI clicks
  - Coin/transaction sounds

## Adding Assets

When adding new assets:

1. Place files in the appropriate folder
2. Use descriptive names (e.g., `caravan_basic.glb`, `grass_texture.png`)
3. Keep file sizes optimized for web use
4. Document any attribution requirements

## Asset Loading

Assets will be loaded through the respective managers:

- Models: Through `CaravanManager`, `CityManager`, `WorldManager`
- Textures: Applied to materials in Three.js
- Sounds: Through a future `AudioManager` system
