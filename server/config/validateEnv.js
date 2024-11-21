const requiredEnvVars = [
    'PORT',
    'MONGO_URI',
    'PROJECT_ID',
    'ETHERSCAN_API_KEY'
  ];
  
  export const validateEnv = () => {
    const missing = requiredEnvVars.filter(env => !process.env[env]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  };