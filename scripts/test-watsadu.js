const { Client } = require('pg');

async function test() {
  const c = new Client({
    connectionString: 'postgresql://neondb_owner:npg_L54FafqonOEt@ep-little-heart-a1ng9vap-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
  });
  await c.connect();
  const tables = await c.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public';");
  console.log('Tables in KumWatsadu:', tables.rows.map(r => r.table_name));

  for (const t of tables.rows) {
    try {
      const cnt = await c.query(`SELECT count(*) as count FROM "${t.table_name}";`);
      console.log(`Table ${t.table_name}:`, cnt.rows[0].count);
      const cols = await c.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${t.table_name}' LIMIT 5;`);
      console.log(`  cols:`, cols.rows.map(r => r.column_name).join(', '));
    } catch(e) {
      console.error(e.message);
    }
  }
  await c.end();
}

test().catch(console.error);
