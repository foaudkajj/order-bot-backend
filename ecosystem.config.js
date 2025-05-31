module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./order-bot-backend",
      script: "main.js",
      env_production: {
        NODE_ENV: "production"
      }
    }
  ]
};