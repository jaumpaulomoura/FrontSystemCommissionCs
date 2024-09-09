module.exports = {
  apps: [
    {
      name: "APP_Comissao",       // Nome da aplicação no PM2
      script: "node_modules/.bin/react-scripts", // Caminho para o script do React
      args: "start",             // Argumentos para o script
      env: {
        PORT: 3001,              // Variável de ambiente PORT
        BROWSER: "none",         // Variável de ambiente BROWSER
      },
      cwd: "./",                 // Diretório de trabalho (ajuste se necessário)
    },
  ],
};
