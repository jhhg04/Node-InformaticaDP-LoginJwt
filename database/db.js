const mysql = require('mysql2');

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

conexion.connect((error) => {
  if (error) {
    console.log('ERROR de conexion ' + error);
    return;
  }
  console.log('Conectado a la base de datos Mysql!');
});

module.exports = conexion;
// export const pool = createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   port: process.env.DB_PORT,
//   database: process.env.DB_DATABASE,
// });
