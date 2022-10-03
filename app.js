const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const app = express();

// Conf para trabjar con la cookies
// app.use(cookieParser);

// Seteamos moteor de plantillas
app.set('view engine', 'ejs');

// Seteamos la carpeta public para archivos estaticos
app.use(express.static('public'));

// Conf para procesar datos enviados desde forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Seteamos variables de entorno
dotenv.config({ path: './env/.env' });

// Llamar al Router
app.use('/', require('./routes/router'));

// Para eliminar el cache y que no se pueda volver con el boton de atras luego de que hacemos logout
app.use(function (req, res, next) {
  if (!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

// Porbar primer path
// app.get('/', (req, res) => {
//   res.render('index');
// });

app.listen(3000, () => {
  console.log('Server Running on port 3000');
});
