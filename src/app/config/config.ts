const apiBaseUrl = import.meta.env.VITE_API_BASE_URL as string;

if (!apiBaseUrl) {
  throw new Error(
    '[Config] VITE_API_BASE_URL is not defined. Make sure it is set in your .env.development file.'
  );
}

const config = {
  apiBaseUrl,
};

export default config;
