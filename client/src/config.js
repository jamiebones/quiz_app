const settings = {
  API_URL:
    process.env.NODE_ENV === "production"
      ? `https://${window.location.hostname}`
      : "http://localhost:9000",
};

export default settings;
