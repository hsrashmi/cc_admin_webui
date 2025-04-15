let config = null;

export const loadConfig = async () => {
  if (!config) {
    const response = await fetch("/config.json");
    config = await response.json();
  }
  return config;
};

export const getConfig = () => {
  return config;
};
