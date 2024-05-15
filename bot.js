// Importing necessary modules
const express = require("express");
const wppconnect = require("@wppconnect-team/wppconnect");

// Initializing Express app
const app = express();

// Variable to store the WhatsApp client
let client;

// Creating a WhatsApp client using wppconnect
wppconnect
  .create()
  .then((whatsappClient) => {
    client = whatsappClient;

    // Event listener for incoming messages
    client.onMessage((message) => {
      // Logging the sender's phone number and message
      console.log(message.from);
      console.log(message.body);
      
      // Responding to "/start" command
      if (message.body == "/start") {
        client.sendText(message.from, "Hello there! I am a whatsapp bot.");
      }

      // Responding to "/register" command
      if (message.body == "/register") {
        client.sendText(
          message.from,
          `Your phone number ${message.from} has been registered.`
        );
      }

      // Responding to "/events" command
      if (message.body == "/events") {
        client.sendText(
          message.from,
          "Given are the list of events: 1. Clash of Titans\n2. Valorant Masters"
        );
      }
    });
  })
  .catch((error) => {
    // Logging errors if the client creation fails
    console.error("Error creating client:", error);
  });

// Serving static files from the "public" directory
app.use(express.static("public"));

// Route to send messages via POST request
app.post("/send-message", express.json(), (req, res) => {
  // Extracting data from the request body
  const { countryCode, phoneNumber, message } = req.body;
  // Formatting the phone number to include country code and WhatsApp domain
  const formattedPhoneNumber = `${countryCode}${phoneNumber}@c.us`;

  // Sending the message to the formatted phone number
  client
    .sendText(formattedPhoneNumber, message)
    .then((result) => {
      // Uncomment the next line to log the message sending result
      // console.log(`Sent message to ${phoneNumber}: ${message}`);
      res.json({ success: true });
    })
    .catch((error) => {
      // Logging errors if message sending fails
      console.error("Error sending message:", error);
      res.json({ success: false });
    });
});

// Starting the server on port 3000
app.listen(3000, () => console.log("Server started on port 3000"));
