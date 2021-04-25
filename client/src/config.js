const settings = {
  API_URL:
    process.env.NODE_ENV === "production"
      ? `https://${window.location.hostname}:9000`
      : "http://localhost:9000",
};

export default settings;
