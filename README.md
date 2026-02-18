# Virtual Pet

## Introduction / Summary

Virtual Pet is a captivating mini-game developed using React and Node.js, allowing users to adopt, care for, and interact with their virtual pets. This game fosters a community environment where users can see others' pets, contributing to a dynamic social interaction.

## Built With

### Client

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)

### Server

![Node.js](https://img.shields.io/badge/node.js-%2343853D.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express-%23000000.svg?style=for-the-badge&logo=express&logoColor=white)

## Key Features

- **Pet Selection:** Choose from a variety of pets.
- **Pet Care:** Engage in daily activities like feeding, playing, and training.
- **Growth System:** Watch your pet evolve through different stages.
- **Persistence:** Continue your care with saved user progress.
- **Social Interaction:** See and interact with other users' pets.

## Canvas Elements & Interactions

Users interact with pets through a series of actions such as eat, sleep, play, and train, each having specific cooldowns and experience gains.

## Drawer Content

Admins have the capability to pick up all pets in the world, enhancing the game's management and interaction dynamics.

## Admin Features

Admins can manage pets, including picking up all pets within the game environment for maintenance or moderation purposes.

## Force Refresh Inventory Cache

The app caches inventory data for 6 hours. To manually bypass this cache and force a refresh:

1. Open the app by clicking on the key asset in the world.
2. Right-click inside the drawer and select **Inspect** to open DevTools.
3. Find the `<iframe>` element and locate its `src` attribute.
4. Append `&forceRefreshInventory=true` to the end of the URL.
5. Press **Enter** to reload the iframe with the updated URL.

## Themes Description

N/A

## Data Objects

- **Pet States:** Each pet has states that evolve through interaction, saved in the user's session.
- **Action Cooldowns and Experience Gains:** Defined by environmental variables and affecting pet growth.

## Environment Variables

Create a `.env` file in the root directory. See `.env-example` for a template.

| Variable               | Description                                                                        | Required |
| ---------------------- | ---------------------------------------------------------------------------------- | -------- |
| `NODE_ENV`             | Node environment                                                                   | No       |
| `SKIP_PREFLIGHT_CHECK` | Skip CRA preflight check                                                           | No       |
| `IS_LOCALHOST`         | Flag to indicate local development environment                                     | No       |
| `INSTANCE_DOMAIN`      | Topia API domain (`api.topia.io` for production, `api-stage.topia.io` for staging) | Yes      |
| `INTERACTIVE_KEY`      | Topia interactive app key                                                          | Yes      |
| `INTERACTIVE_SECRET`   | Topia interactive app secret                                                       | Yes      |

## Developer Sections

### Getting Started

Clone the repository and ensure Node version 18 or higher is installed.

### Production Mode

1. Install dependencies

   ```
   npm install
   ```

2. Start the server
   ```
   npm start
   ```

### Development Mode

1. Start Server

   ```
   npm start
   ```

2. Start Client

   ```
   cd client && npm start
   ```

3. Visit `http://localhost:3001` and start your quiz experience!

### .env Variables

Refer to the `.env-example` file for necessary environment variables.

### Where to find INTERACTIVE_KEY and INTERACTIVE_SECRET

[Topia Dev Account Dashboard](https://dev.topia.io/t/dashboard/integrations)

[Topia Production Account Dashboard](https://topia.io/t/dashboard/integrations)

### Helpful Links

- [Manual Testing Guide](https://www.notion.so/topiaio/Virtual-Pet-App-fdc8fc22cc55463fa9f26dbb13d3061c)
- [View it in action](https://topia.io/virtual-pet-prod)

### How to Play

Refer to the Notion guide for detailed instructions on interacting with the game.

## As an Admin

Admins can pick up all pets in the game world, aiding in game moderation and pet management.

## As a User

Interact with the kennel to select a pet and perform actions such as eating, sleeping, playing, and training to care for your pet.

**Assets:**

Access game assets [here](https://drive.google.com/drive/folders/18HSNI0g56PegmFaJri2AKbclMKY8KSg2?usp=drive_link) for scene creation within the MC Ecosystem.

### Implementation Notes

No specific requirements for scene saving or key verification.

### App Mechanics

App mechanics include cooldowns and experience gains for pet actions, influencing pet growth and interaction.

### Manual Testing Guide

Ensure pets evolve correctly, animations function, and admin controls work as expected.
