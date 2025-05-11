// database.js
import * as SQLite from 'expo-sqlite/legacy';

const db = SQLite.openDatabase('transit.db'); // ← now ‘db.transaction’, ‘db.exec’, etc. exist

export const setupDatabase = () => {
  db.transaction(tx => {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS transport_options (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        transportType TEXT,
        stopID TEXT,
        arrivalTime TEXT,
        departureTime TEXT,
        line TEXT,
        destination TEXT,
        latitude REAL,
        longitude REAL
      );
    `);
  });
};

export const insertTransportOption = (option) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO transport_options 
         (transportType, stopID, arrivalTime, departureTime, line, destination, latitude, longitude)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        option.transportType,
        option.stopID,
        option.arrivalTime,
        option.departureTime,
        option.line,
        option.destination,
        option.latitude,
        option.longitude,
      ]
    );
  });
};

export const getTransportOptions = (destination, transportType) =>
  new Promise((resolve, reject) => {
    const now = new Date();
    const formatted = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM transport_options
         WHERE LOWER(destination) LIKE LOWER(?)
           AND transportType = ?
           AND arrivalTime > ?
         ORDER BY arrivalTime ASC;`,
        [`%${destination}%`, transportType, formatted],
        (_, { rows: { _array } }) => resolve(_array),
        (_, error) => reject(error)
      );
    });
  });

  export default db;
