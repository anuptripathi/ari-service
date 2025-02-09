'use strict';

const AriClient = require('ari-client');

// ARI connection configuration
const ariUrl = 'http://localhost:8088'; // Replace with your ARI URL
const ariUsername = 'asterisk'; // Your ARI username
const ariPassword = 'asterisk'; // Your ARI password

// Replace with your outbound endpoint when dialing out.
const OUTBOUND_ENDPOINT = 'SIP/1001'; // Example endpoint

// Connect to ARI
AriClient.connect(ariUrl, ariUsername, ariPassword)
  .then((client) => {
    // Log when connected
    console.log('Connected to ARI');

    // ========================
    // Helper Functions
    // ========================

    // Bridge two channels together
    function bridgeChannels(channel1, channel2) {
      // Create a new mixing bridge.
      client.bridges
        .create({ type: 'mixing' })
        .then((bridge) => {
          console.log(`Created bridge ${bridge.id}`);
          // Add both channels to the bridge.
          return Promise.all([
            bridge.addChannel({ channel: channel1.id }),
            bridge.addChannel({ channel: channel2.id }),
          ]).then(() => {
            console.log('Channels added to bridge.');
          });
        })
        .catch((err) => console.error('Error creating bridge:', err));
    }

    // Dial out to a new endpoint and bridge with the caller
    function dialOutbound(callerChannel) {
      console.log('Dialing outbound endpoint:', OUTBOUND_ENDPOINT);

      // Originate a new channel to the outbound endpoint.
      client.channels
        .originate({
          endpoint: OUTBOUND_ENDPOINT,
          app: 'myApp', // Ensure the dialed channel enters your ARI app so you can control it.
          callerId: 'NodeARI', // Caller ID for the outbound channel.
          timeout: 30,
        })
        .then((newChannel) => {
          console.log(`Outbound channel ${newChannel.id} created.`);

          // When the new channel starts, create a bridge and add both channels.
          newChannel.on('StasisStart', (event, channel) => {
            console.log('Outbound channel answered. Bridging the call.');
            bridgeChannels(callerChannel, channel);
          });
        })
        .catch((err) => console.error('Error originating channel:', err));
    }

    // Record the caller’s message
    function recordMessage(channel) {
      console.log('Recording the channel:', channel.id);

      // Start recording on the channel (record in WAV format, beep enabled, and play a beep before starting).
      channel
        .record({
          name: 'recording-' + channel.id,
          format: 'wav',
          beep: true,
          maxDurationSeconds: 30,
          ifExists: 'overwrite',
        })
        .then(() => {
          console.log('Recording started.');
        })
        .catch((err) => console.error('Error starting recording:', err));
    }

    // ========================
    // Event Handlers
    // ========================

    // Listen for channels entering the application.
    client.on('StasisStart', (event, channel) => {
      console.log(`Channel ${channel.id} has entered the application.`);

      // Answer the incoming call.
      channel
        .answer()
        .then(() => {
          console.log(`Channel ${channel.id} answered.`);
          // Play a greeting prompt.
          return channel.play({ media: 'sound:hello-world' });
        })
        .then((playback) => {
          console.log('Greeting playback started.');
          // After playing the greeting, prompt for DTMF.
          // Note: In a real application you might play another prompt or use a dedicated Gather verb.
          // Here we simply listen for DTMF events.
        })
        .catch((err) => console.error('Error in answering or playing:', err));

      // Listen for DTMF input on this channel.
      channel.on('ChannelDtmfReceived', (event, channel) => {
        const digit = event.digit;
        console.log(`Received DTMF digit: ${digit} on channel ${channel.id}`);

        // Act based on the digit pressed.
        switch (digit) {
          case '1':
            // If 1 is pressed, record the message.
            recordMessage(channel);
            break;
          case '2':
            // If 2 is pressed, dial out to another endpoint and bridge.
            dialOutbound(channel);
            break;
          default:
            console.log(`Digit ${digit} is not assigned to an action.`);
        }
      });

      // Optionally, listen for channel hangup or other events.
      channel.on('StasisEnd', (event, channel) => {
        console.log(`Channel ${channel.id} has left the application.`);
      });
    });

    // Start the ARI application by name.
    client.start('myApp');
  })
  .catch((err) => {
    console.error('Error connecting to ARI:', err);
  });
