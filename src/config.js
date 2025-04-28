let config = null;

export const loadConfig = async () => {
  console.log("config.js: loading...1");

  if (!config) {
    console.log("config.js: loading...2");

    const response = await fetch("/config.json");
    if (!response.ok) {
      throw new Error("Failed to load config.json");
    }
    config = await response.json();
    console.log("config.js: loading...3");
  }
  return config;
};

export const getConfig = () => {
  if (!config) {
    throw new Error("Config not loaded yet! Call loadConfig() first.");
  }
  return config;
};
