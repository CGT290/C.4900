// app/tabs/database.js
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'transit.db'
let dbHandle = null

async function getDb() {
  if (!dbHandle) {
    dbHandle = await SQLite.openDatabaseAsync(DB_NAME)
  }
  return dbHandle
}

/**
 * Create the buses table if it doesn't exist.
 */
export async function setupDatabase() {
  const db = await getDb()
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS buses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      stopID TEXT,
      arrivalTime TEXT,
      line TEXT,
      destination TEXT,
      direction TEXT,
      latitude REAL,
      longitude REAL
    );
  `)
}

/**
 * Insert a single bus record.
 * @param {{stopID:string,arrivalTime:string,line:string,destination:string,direction:string,latitude:number,longitude:number}} bus
 */
export async function insertBus(bus) {
  const db = await getDb()
  await db.runAsync(
    `INSERT INTO buses
       (stopID, arrivalTime, line, destination, direction, latitude, longitude)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    bus.stopID,
    bus.arrivalTime,
    bus.line,
    bus.destination,
    bus.direction,
    bus.latitude,
    bus.longitude
  )
}

/**
 * Fetch upcoming buses matching `dest` and departure time > now.
 * @param {string} dest
 * @returns {Promise<Array>}
 */
export async function getUpcomingBuses(dest) {
  const db = await getDb()
  const now = new Date()
  const formatted = `${now.getHours()}:${now.getMinutes().toString().padStart(2,'0')}`

  return db.getAllAsync(
    `SELECT *
       FROM buses
      WHERE LOWER(destination) LIKE LOWER(?)
        AND arrivalTime > ?
      ORDER BY arrivalTime ASC;`,
    `%${dest}%`,
    formatted
  )
}
