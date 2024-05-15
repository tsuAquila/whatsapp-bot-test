# Simple WhatsApp Bot

This is a basic WhatsApp bot built with Node.js that responds to incoming messages with predefined replies. 

## Features

- Responds to commands like `/start`, `/register`, and `/events`.
- Can send messages to specific phone numbers via a web interface.

## Setup

1. **Install Node.js:** Download and install Node.js from [https://nodejs.org/](https://nodejs.org/).

2. **Install Dependencies:** Navigate to the project directory and run:

   ```bash
   npm install
   ```

3. **Start the Server:**

   ```bash
   npm start
   ```
   This will start the server on port 3000. You can access the web interface at [http://localhost:3000](http://localhost:3000).

4. **Scan QR Code:** When you first start the server, a QR code will be displayed in the console. Use your WhatsApp mobile app to scan this code to authenticate the bot.

## Usage

### Interacting with the Bot

Once the bot is authenticated, you can send it messages containing the following commands:

- `/start`: Sends a welcome message.
- `/register`: Sends a registration confirmation message (placeholder).
- `/events`: Sends a list of events (placeholder).

### Sending Messages via Web Interface

The web interface at [http://localhost:3000](http://localhost:3000) has a form to send messages to a specific phone number. Fill in the country code, phone number, and message, and click "Send".

## Expanding Functionality

The bot's current functionality is very limited. You can expand it by:

- **Adding more commands:** Implement more command handlers in `bot.js`.
- **Connecting to external services:** Use APIs to retrieve data (e.g., events, weather) and send more dynamic responses.
- **Implementing a database:** Store user data and preferences to personalize the bot's responses.

## Technologies Used

- Node.js
- [@wppconnect-team/wppconnect](https://www.npmjs.com/package/@wppconnect-team/wppconnect)
- Express

## License

MIT
