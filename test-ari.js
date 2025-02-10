'use strict';

const client = require('ari-client');

// ARI connection configuration
const ariUrl = 'http://localhost:8088'; // Replace with your ARI URL
const ariUsername = 'asterisk'; // Your ARI username
const ariPassword = 'asterisk'; // Your ARI password

client.connect(ariUrl, ariUsername, ariPassword, function (err, ari) {
  if (err) {
    console.error('Error connecting:', err);
    return;
  }

  // Subscribe to global events for the app
  ari.on('StasisStart', function (event, channel) {
    console.log(`Stasis started on channel ${channel.id}`);
  });

  ari.on('StasisEnd', function (event, channel) {
    console.log(`Stasis ended on channel ${channel.id}`);
  });

  // Start the application BEFORE originating the call so that events aren’t missed.
  ari.start('myApp');

  // Originate a new channel to PJSIP/1001
  ari.channels.originate(
    {
      endpoint: 'PJSIP/1001',
      app: 'myApp',
      appArgs: 'dialed',
      callerId: '1001',
    },
    function (err, channel) {
      if (err) {
        console.error('Error originating channel:', err);
      } else {
        console.log(`Channel originated with id ${channel.id}`);
      }
    },
  );
});
