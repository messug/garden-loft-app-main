// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")();

client.calls
  .create({
    url: "http://demo.twilio.com/docs/voice.xml",
    from: "+16505499394",
    to: "+14036901549",
  })
  .then((call) => console.log(call.sid));
