let config = null;

export const loadConfig = async () => {
  if (!config) {
    const response = await fetch("/config.json");
    config = await response.json();
  }
  console.log("loadconfig ", config);
  return config;
};

export const getConfig = () => {
  console.log("loadconfig later", config);
  return config;
};
