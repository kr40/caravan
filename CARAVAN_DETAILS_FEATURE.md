# Caravan Details Panel Feature

## Overview
A comprehensive caravan status panel that provides detailed information about your trading journey, accessible by clicking on the HUD.

## How to Access
Click on the **Caravan Status** panel in the top-left corner of the screen (the HUD).

## Features

### 1. Visual Representation
- **Portrait**: A wizard emoji representing the Master Trader (you!)
- **Caravan**: A horse and cart emoji representing your traveling caravan
- Both are displayed in ornate medieval-themed frames

### 2. Detailed Statistics
- **Current Location**: Shows where you are (city name, traveling status, or "Open Road")
- **Gold Coins**: Total gold in your possession
- **Food Supplies**: Current food units available
- **Cargo Capacity**: How much cargo you're carrying vs. maximum capacity
- **Current Date**: Medieval-style date (e.g., "1st Day of Spring, Year 1")
- **Days Traveled**: Total days since starting your journey
- **Total Trades**: Number of buy/sell transactions completed
- **Profit Earned**: Total profit from selling goods

### 3. Current Cargo
Shows all goods currently loaded in your caravan with quantities in a grid layout.

### 4. Journey History
A chronological log of your travels showing:
- Day of travel
- From location → To location
- Last 20 journeys are tracked

### 5. Trading History
A detailed record of all buy/sell transactions showing:
- Day and city of the trade
- Action (Bought/Sold)
- Item name and quantity
- Price per unit
- Total transaction amount
- Last 30 trades are tracked

## Medieval Date System
The game uses a 360-day year divided into 4 seasons:
- **Spring**: Days 1-90
- **Summer**: Days 91-180
- **Autumn**: Days 181-270
- **Winter**: Days 271-360

Dates are displayed in medieval format:
- "1st Day of Spring, Year 1"
- "42nd Day of Summer, Year 2"
- etc.

## Profit Tracking
The system automatically calculates your total profit by:
- Tracking all buy transactions (expenses)
- Tracking all sell transactions (revenue)
- Summing up the net profit from sales

## Design
- Medieval-themed dark brown and gold color scheme
- Scrollable content for long histories
- Different colored borders for different entry types:
  - Blue border: Journey entries
  - Green border: Trade entries
- Responsive layout with grid-based cargo display

## Integration with Existing Systems
- Automatically updates when you:
  - Arrive at cities
  - Buy or sell goods
  - Progress through days
  - Make any changes to your caravan status
- Syncs with debug console reset functionality
- Works seamlessly with existing HUD display

## Tips
- Check your journey history to see your trade routes
- Review trading history to identify profitable trades
- Monitor your total profit to track overall success
- Use the current cargo section to plan your next sale
