export default () => ({
  ari: {
    url: process.env.ARI_URL || 'http://localhost:8088', // Adjust as needed
    username: process.env.ARI_USERNAME || 'asterisk',
    password: process.env.ARI_PASSWORD || 'asterisk',
    appName: process.env.ARI_APP_NAME || 'myApp',
    outboundEndpoint: process.env.ARI_OUTBOUND_ENDPOINT || 'PJSIP/1001',
  },
});
