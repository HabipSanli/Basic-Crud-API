import { Pool } from 'pg';
const cfg = require('../../config.json')

const pool = new Pool(cfg.dbConfig);

export default pool;