const express = require("express");
const wppconnect = require("@wppconnect-team/wppconnect");

const app = express();

let client;

let eventList = [
  {
    eventID: "1",
    eventName: "Clash of Titans",
    eventDescription: "a coc tournament",
    eventAdmins: ["918248654856@c.us"],
    eventRegistrationTemplate: "Player Details\n\nPlayer 1:\nPlayer 2:",
  },
  {
    eventID: "2",
    eventName: "Valorant Masters",
    eventDescription: "a valorant tournament",
    eventAdmins: ["918248654856@c.us"],
    eventRegistrationTemplate: "Player Details\n\nPlayer 1:\nPlayer 2:",
  },
];

let registrationOnProgress = {};
let registrationCompleted = {};
let registrationVerified = {};

function formatEventList(eventList) {
  return eventList
    .map((event) => {
      return `${event.eventID}. ${event.eventName}\n\t${
        event.eventDescription
      }\n\t${event.eventAdmins.join(", ")}`;
    })
    .join("\n\n");
}

function formatPhoneNumber(phoneNumber) {
  return "+" + phoneNumber.replace("@c.us", "");
}

function isPhoneNumberPresent(dict, key, phoneNumber) {
  for (let obj of dict[key]) {
    if (obj.phoneNumber === phoneNumber) {
      return true;
    }
  }

  return false;
}

function removeObject(array, keyToCheck, valueToCheck) {
  return array.filter((item) => item[keyToCheck] !== valueToCheck);
}

function initializeRegistrationObjects() {
  eventList.forEach((event) => {
    registrationOnProgress[event.eventID] = [];
    registrationCompleted[event.eventID] = [];
    registrationVerified[event.eventID] = [];
  });
}

wppconnect
  .create()
  .then((whatsappClient) => {
    client = whatsappClient;

    initializeRegistrationObjects();

    client.onMessage((message) => {
      if (message.author == undefined) {
        if (message.body == "/test") {
          client.sendText(
            message.from,
            `Hello there ${formatPhoneNumber(
              message.from
            )}! I am a whatsapp bot.`
          );
        }

        if (message.body == "/events") {
          client.sendText(
            message.from,
            `Here are the upcoming events:\n${formatEventList(
              eventList
            )}\n\nReply with \`/register <optionNumber>\` to register for an event.\neg: \`/register 1\``
          );
        }

        if (message.body.startsWith("/register")) {
          try {
            const eventID = message.body.split(" ")[1];
            if (isNaN(parseInt(eventID))) {
              throw Error();
            }
            let eventIDInt = parseInt(eventID);
            if (1 <= eventIDInt && eventIDInt <= eventList.length) {
              let newRegistrationEntry = {
                eventID: eventID,
                phoneNumber: message.from,
              };
              if (
                !isPhoneNumberPresent(
                  registrationOnProgress,
                  eventID,
                  message.from
                ) &&
                !isPhoneNumberPresent(
                  registrationCompleted,
                  eventID,
                  message.from
                ) &&
                !isPhoneNumberPresent(
                  registrationVerified,
                  eventID,
                  message.from
                )
              ) {
                registrationOnProgress[eventID].push(newRegistrationEntry);
                client.sendText(
                  message.from,
                  "Copy the following template and fill out the required fields:\n"
                );
                client.sendText(
                  message.from,
                  `/entry ${eventList[eventIDInt - 1].eventID}\n\n${
                    eventList[eventIDInt - 1].eventRegistrationTemplate
                  }`
                );
              } else if (
                isPhoneNumberPresent(
                  registrationOnProgress,
                  eventID,
                  message.from
                ) &&
                !isPhoneNumberPresent(
                  registrationCompleted,
                  eventID,
                  message.from
                ) &&
                !isPhoneNumberPresent(
                  registrationVerified,
                  eventID,
                  message.from
                )
              ) {
                client.sendText(
                  message.from,
                  "Copy the following template and fill out the required fields:\n"
                );
                client.sendText(
                  message.from,
                  `/entry ${eventList[eventIDInt - 1].eventID}\n\n${
                    eventList[eventIDInt - 1].eventRegistrationTemplate
                  }`
                );
              } else if (
                isPhoneNumberPresent(
                  registrationCompleted,
                  eventID,
                  message.from
                ) ||
                isPhoneNumberPresent(
                  registrationVerified,
                  eventID,
                  message.from
                )
              ) {
                client.sendText(
                  message.from,
                  "You have already registered for this event."
                );
              } else {
                client.sendText(
                  message.from,
                  "Some Internal error occured. Please try again later. or contact the admins"
                );
              }
            }
          } catch (error) {
            client.sendText(
              message.from,
              "Please enter a valid event ID. eg: `/register 1`"
            );
          }
        }

        if (message.body.startsWith("/entry")) {
          try {
            const contentMatch = message.body.match(/\/entry (\d+)([\s\S]+)/);
            if (!contentMatch) {
              throw new Error(
                "Invalid input format or no content after '/entry <number>'"
              );
            }
            const eventID = contentMatch[1];
            const registrationData = contentMatch[2].trim();
            if (
              isPhoneNumberPresent(registrationCompleted, eventID, message.from)
            ) {
              client.sendText(
                message.from,
                "You have already registered for this event."
              );
              throw new Error("Already registered");
            }
            const newRegistrationEntry = {
              eventID: eventID,
              phoneNumber: message.from,
              registrationData: registrationData,
            };
            registrationCompleted[eventID].push(newRegistrationEntry);
            registrationOnProgress[eventID] = removeObject(
              registrationOnProgress[eventID],
              "phoneNumber",
              message.from
            );
          } catch {}
        }
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
