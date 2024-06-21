const express = require("express");
const wppconnect = require("@wppconnect-team/wppconnect");

const app = express();

let client;

wppconnect
  .create()
  .then((whatsappClient) => {
    client = whatsappClient;

    client.onMessage((message) => {
      console.log(message.from);
      console.log(message.body);

      if (message.body == "/start") {
        client.sendText(message.from, "Hello there! I am a whatsapp bot.");
      }

      if (message.body == "/register") {
        client.sendText(
          message.from,
          `Your phone number ${message.from} has been registered.`
        );
      }

      if (message.body == "/events") {
        client.sendText(
          message.from,
          "Given are the list of events: 1. Clash of Titans\n2. Valorant Masters"
        );
      }
    });
  })
  .catch((error) => {
    console.error("Error creating client:", error);
  });

app.use(express.static("public"));

app.post("/send-message", express.json(), (req, res) => {
  const { countryCode, phoneNumber, message } = req.body;
  const formattedPhoneNumber = `${countryCode}${phoneNumber}@c.us`;

  client
    .sendText(formattedPhoneNumber, message)
    .then((result) => {
      // console.log(`Sent message to ${phoneNumber}: ${message}`);
      res.json({ success: true });
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      res.json({ success: false });
    });
});

app.listen(3000, () => console.log("Server started on port 3000"));
