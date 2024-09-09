module.exports = {
  apps: [
    {
      name: "APP_Comissao",       
      script: "node_modules/.bin/react-scripts",
      args: "start", 
      env: {
        PORT: 3001, 
        BROWSER: "none",
      },
      cwd: "./",
    },
  ],
};
