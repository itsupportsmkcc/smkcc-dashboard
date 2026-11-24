const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:postgres@localhost:5434/student_care?schema=public'
});

async function main() {
  await client.connect();
  const r1 = await client.query('SELECT category, count(*)::int as count FROM "Case" GROUP BY category ORDER BY count DESC;');
  console.log('Categories:', r1.rows);

  const r2 = await client.query('SELECT status, count(*)::int as count FROM "Case" GROUP BY status;');
  console.log('Status:', r2.rows);

  const r3 = await client.query('SELECT "moodLevel", count(*)::int as count FROM "CheckIn" GROUP BY "moodLevel";');
  console.log('Moods:', r3.rows);

  const r4 = await client.query('SELECT "caseNumber", category, "studentName", "urgencyLevel", status, detail, "createdAt" FROM "Case" ORDER BY "createdAt" DESC LIMIT 5;');
  console.log('Recent Cases:', r4.rows);

  await client.end();
}

main().catch(console.error);
