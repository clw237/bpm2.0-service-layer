export default () => ({
  bpm: {
    url: process.env.BPM_LAYER_URL,
    apiKey: process.env.BPM_API_KEY,
    hmacSecret: process.env.BPM_HMAC_SECRET,
  },
});
