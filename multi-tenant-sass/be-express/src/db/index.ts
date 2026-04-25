import mysql from 'mysql2/promise';
import { getDbConfig } from '../config/db';

const { host, port, username: user, password, database } = getDbConfig();

let pool: mysql.Pool | null = null;

export function getPool() {
  if (pool) return pool;
  pool = mysql.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 10 });
  return pool;
}

export async function query(sql: string, params?: any[]) {
  const p = getPool();
  const [rows] = await p.query(sql, params);
  return rows as any;
}
