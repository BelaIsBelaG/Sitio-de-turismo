const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Configuración de la conexión MySQL con filess.io
const connection = mysql.createConnection({
  host: 'ed0wd.h.filess.io',
  user: 'turismoisajali_beanropeby',
  password: 'ec673c66debf1e353edb3f105bfeadeb1c12f5e6', 
  database: 'turismoisajali_beanropeby',
  port: 61002
});

// Verifica la conexión a la base de datos
connection.connect(error => {
  if (error) {
    console.error('Error conectando a la base de datos:', error);
    return;
  }
  console.log('Conexión a la base de datos exitosa.');
});

// Obtener todos los paquetes
app.get('/api/paquetes', (req, res) => {
  const sql = `
    SELECT PA.PAQUETE_ID, PA.NOMBRE, D.NOMBRE AS DESTINO, PA.PRECIO_BASE, PA.DURACION_DIAS
    FROM PAQUETE PA
    JOIN DESTINO D ON PA.DESTINO_ID = D.DESTINO_ID
  `;
  connection.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Obtener paquete por ID
app.get('/api/paquetes/:id', (req, res) => {
  const sql = `SELECT * FROM PAQUETE WHERE PAQUETE_ID = ?`;
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Paquete no encontrado' });
    res.json(result[0]);
  });
});

// Crear un nuevo paquete
app.post('/api/paquetes', (req, res) => {
  const { nombre, destino_id, precio_base, duracion_dias } = req.body;
  const sql = `
    INSERT INTO PAQUETE (NOMBRE, DESTINO_ID, PRECIO_BASE, DURACION_DIAS)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(sql, [nombre, destino_id, precio_base, duracion_dias], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Paquete creado', paqueteId: result.insertId });
  });
});

// Actualizar un paquete por ID
app.put('/api/paquetes/:id', (req, res) => {
  const { nombre, destino_id, precio_base, duracion_dias } = req.body;
  const sql = `
    UPDATE PAQUETE
    SET NOMBRE = ?, DESTINO_ID = ?, PRECIO_BASE = ?, DURACION_DIAS = ?
    WHERE PAQUETE_ID = ?
  `;
  connection.query(sql, [nombre, destino_id, precio_base, duracion_dias, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Paquete actualizado' });
  });
});

// Eliminar un paquete por ID
app.delete('/api/paquetes/:id', (req, res) => {
  const sql = `DELETE FROM PAQUETE WHERE PAQUETE_ID = ?`;
  connection.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Paquete eliminado' });
  });
});

// Levantar el servidor
const port = 61002;
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});


//Reiniciar la conexion 
process.on('SIGINT', () => {
  connection.end(err => {
    if (err) console.error('Error cerrando la conexión:', err);
    else console.log('Conexión MySQL cerrada.');
    process.exit();
  });
});

