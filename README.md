<<<<<<< Updated upstream
# Getting Started

This boilerplate is meant to give you a simple starting point to build new features in Topia using our Javascript SDK.

- Clone this repository
- Run `yarn` in server
- `cd client`
- Run `yarn` in client
- `cd ..` back to server
=======
# 🐾 Virtual Pet Adventure 🎮

Hey there, welcome to the **Virtual Pet Adventure** repository! If you ever wanted to raise your own dragon, unicorn, or even a penguin, this is the place to be.

## 🚀 Features

1. **Growth Spurts**: Your pet grows in size as it ages. So, when your baby pet turns teen, you'll notice the change!
2. **Pet Patience**: Don't rush! Your pet takes its time to eat, sleep, and play. Check back on them after a while for more interactions.
3. **Feedback Fun**: We've added fun feedback when you interact with your pet. Big texts, emojis, and a talking pet! 🐕💬

## 🖌️ Visuals

- Beautifully designed pets with 3 stages: Baby, Teen, and Adult.
- Interactive actions to make your experience lively.

## 🛠️ Tech Stack

- **Backend:** Node.js
- **Frontend:** React
>>>>>>> Stashed changes

## 🤔 Feedback

Got ideas? Found a bug? Feel free to raise an issue or PR. And if you're into gaming and pets, let's chat!

## 💻 Get Started

### 🔧 Server Setup

1. Navigate to the `server` directory:

`cd server`

2. Install the dependencies:

`npm i`

`npm start`

### 🔧 Client (React App) Setup

1. Navigate to the `client` directory:

`cd server`

2. Install the dependencies:
   `npm i`
   `npm start`

### 🌍 Environment Variables

Before running the server or client, ensure you have set the following environment variables:

<<<<<<< Updated upstream
```json
API_KEY=488ecv4e-82ea-4r41-av3a-fdf73fgfq6v6
API_URL=http://localhost:3001
INSTANCE_DOMAIN=api.topia.io
INTERACTIVE_KEY=enteryourinteractivekey
INTERACTIVE_SECRET=enteryoursecret
```
=======
NODE_ENV=production
>>>>>>> Stashed changes

INSTANCE_DOMAIN=api.topia.io

INSTANCE_PROTOCOL=https

<<<<<<< Updated upstream
# Deploying to Heroku

- Go to https://heroku.com and create an account if you don't already have one.
- Create a new Heroku project.
- Add your .env parameters to a heroku project.
- Add both the `https://github.com/mars/create-react-app-buildpack.git` and `heroku/nodejs` buildpacks to your project.
- From your terminal, type `git remote add heroku <your heroku git URL>`.
- From your terminal, type `git push heroku master`.
=======
INTERACTIVE_KEY=YOUR_INTERACTIVE_KEY

INTERACTIVE_SECRET=YOUR_INTERACTIVE_SECRET

IMG_ASSET_ID=webImageAsset

- Make sure to replace `YOUR_INTERACTIVE_KEY` and `YOUR_INTERACTIVE_SECRET` with your actual values.
>>>>>>> Stashed changes
