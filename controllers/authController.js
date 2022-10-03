const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const conexion = require('../database/db');
require('dotenv').config();
const { promisify } = require('util');

// Metodo para registrarnos
exports.register = async (req, res) => {
  try {
    const name = req.body.name;
    const user = req.body.user;
    const pass = req.body.pass;
    let passHash = await bcryptjs.hash(pass, 8);
    conexion.query(
      'INSERT INTO users SET ?',
      { user: user, name: name, pass: passHash },
      (error, results) => {
        if (error) {
          console.error(error);
        }
        res.redirect('/');
      }
    );
  } catch (error) {
    console.error(error);
  }
};

// Metodo para login
exports.login = async (req, res) => {
  try {
    const user = req.body.user;
    const pass = req.body.pass;
    // console.log(user + pass);
    if (!user || !pass) {
      res.render('login', {
        alert: true,
        alertTitle: 'Advertencia',
        alertMessage: 'Ingrese un usuario y password',
        alertIcon: 'Info',
        showConfirmButton: true,
        timer: 2000,
        ruta: 'login',
      });
    } else {
      conexion.query(
        'SELECT * FROM users WHERE user=?',
        [user],
        async (error, results) => {
          if (
            results.length == 0 ||
            !(await bcryptjs.compare(pass, results[0].pass))
          ) {
            res.render('login', {
              alert: true,
              alertTitle: 'Error',
              alertMessage: 'Usuario y/o Password Incorrecto',
              alertIcon: 'error',
              showConfirmButton: true,
              timer: 2000,
              ruta: 'login',
            });
          } else {
            const id = results[0].id;
            const token = jwt.sign({ id: id }, process.env.JWT_SECRETO, {
              expiresIn: process.env.JWT_TIEMPO_EXPIRA,
            });
            console.log('Token: ' + token + ' para el usuario: ' + user);
            const cookiesOptions = {
              expires: new Date(
                Date.now() +
                  process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
              ),
            };
            res.cookie('jwt', token, cookiesOptions);
            res.render('login', {
              alert: true,
              alertTitle: 'Conexion Exitosa',
              alertMessage: 'LOGIN CORRECTO!',
              alertIcon: 'success',
              showConfirmButton: false,
              timer: 800,
              ruta: '',
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
};

// Metodo saber si esta autenticado
exports.isAuthenticated = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decodificada = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRETO
      );
      conexion.query(
        'SELECT * FROM users WHERE id=?',
        [decodificada.id],
        (error, results) => {
          if (!results) {
            return next();
          }
          req.user = results[0];
          return next();
        }
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    res.redirect('/login');
    next();
  }
};

// Metodo logout
exports.logout = async (req, res) => {
  res.clearCookie('jwt');
  return res.redirect('/');
};
