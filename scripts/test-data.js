const { Client } = require('pg');

async function testAll() {
  console.log("=== Testing Database Connections & Querying Metrics ===");
  // 1. Admission
  try {
    const c1 = new Client({
      connectionString: 'postgresql://neondb_owner:npg_4yW8dlTHZaMj@ep-fragrant-heart-b31mmb3s-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
      ssl: { rejectUnauthorized: false }
    });
    await c1.connect();
    const r1 = await c1.query('SELECT count(*) as total, count(*) FILTER (WHERE status = \'PENDING\') as pending, count(*) FILTER (WHERE status = \'APPROVED\') as approved FROM "Applicant";');
    const p1 = await c1.query('SELECT count(*) as total FROM "Program";');
    const programsList = await c1.query('SELECT p.name, count(a.id) as applicant_count FROM "Program" p LEFT JOIN "Applicant" a ON a."programId" = p.id GROUP BY p.id, p.name ORDER BY applicant_count DESC;');
    console.log("Admission Data:", {
      totalApplicants: r1.rows[0].total,
      pending: r1.rows[0].pending,
      approved: r1.rows[0].approved,
      programsTotal: p1.rows[0].total,
      byProgram: programsList.rows
    });
    await c1.end();
  } catch(e) {
    console.error("Admission err:", e.message);
  }

  // 2. Attendance
  try {
    const c2 = new Client({
      connectionString: 'postgresql://neondb_owner:npg_zC2AyVnoYP7k@ep-little-waterfall-aozptau3.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
      ssl: { rejectUnauthorized: false }
    });
    await c2.connect();
    const s2 = await c2.query('SELECT count(*) as total_students FROM "Student";');
    const co2 = await c2.query('SELECT count(*) as total_courses FROM "Course";');
    let a2 = { rows: [{ total_records: 0, present: 0, absent: 0, late: 0 }] };
    try {
      a2 = await c2.query('SELECT count(*) as total_records, count(*) FILTER (WHERE status = \'PRESENT\') as present, count(*) FILTER (WHERE status = \'ABSENT\') as absent, count(*) FILTER (WHERE status = \'LATE\') as late FROM "Attendance";');
    } catch(err) {
      console.warn("Attendance table note:", err.message);
    }
    console.log("Attendance Data:", {
      students: s2.rows[0].total_students,
      courses: co2.rows[0].total_courses,
      records: a2.rows[0]
    });
    await c2.end();
  } catch(e) {
    console.error("Attendance err:", e.message);
  }

  // 3. AssetX
  try {
    const c3 = new Client({
      connectionString: 'postgresql://postgres.ybaimqsliodimktwleio:3FJ77M%2FdXe%3FMC*s@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres',
      ssl: { rejectUnauthorized: false }
    });
    await c3.connect();
    const tables = await c3.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public';");
    console.log("AssetX Tables:", tables.rows.map(r => r.table_name));
    if (tables.rows.some(r => r.table_name === 'equipments')) {
      const eq = await c3.query('SELECT count(*) as total FROM equipments;');
      console.log("AssetX Equipments Total:", eq.rows[0].total);
    }
    await c3.end();
  } catch(e) {
    console.error("AssetX err:", e.message);
  }
}

testAll();
