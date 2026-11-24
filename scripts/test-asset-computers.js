const { Client } = require('pg');

async function test() {
  const c = new Client({
    connectionString: 'postgresql://postgres.ybaimqsliodimktwleio:3FJ77M%2FdXe%3FMC*s@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await c.connect();

  // 1. Statuses in equipments
  const statuses = await c.query('SELECT status, count(*) FROM equipments GROUP BY status;');
  console.log('Equipments by status:', statuses.rows);

  // 2. Computers breakdown
  const computerStatuses = await c.query(`
    SELECT category, status, count(*) 
    FROM equipments 
    WHERE category ILIKE '%notebook%' OR category ILIKE '%all in one%' OR category ILIKE '%desktop%' or category ILIKE '%pc%' 
    GROUP BY category, status 
    ORDER BY category;
  `);
  console.log('Computers by status:', computerStatuses.rows);

  // 3. Check active borrowings
  const bList = await c.query(`
    SELECT status, count(*) 
    FROM borrowings 
    GROUP BY status;
  `);
  console.log('Borrowings statuses:', bList.rows);

  // 4. Check how borrowing links to equipment
  const bItems = await c.query(`
    SELECT b.status as borrow_status, e.asset_code, e.brand, e.model, e.category, e.status as equip_status
    FROM borrowing_items bi
    JOIN borrowings b ON bi.borrowing_id = b.id
    JOIN equipments e ON bi.equipment_id = e.id
    LIMIT 5;
  `);
  console.log('Sample borrowed items:', bItems.rows);

  // 5. Total computers, currently borrowed, and ready to borrow
  const compSummary = await c.query(`
    SELECT 
      count(*) as total_computers,
      count(*) FILTER (WHERE category ILIKE '%notebook%') as total_notebooks,
      count(*) FILTER (WHERE category ILIKE '%desktop%' OR category ILIKE '%all in one%') as total_desktops,
      count(*) FILTER (WHERE status = 'normal' OR status = 'active' OR status = 'available' OR status = 'ready') as ready_to_use,
      count(*) FILTER (WHERE status = 'borrowed') as currently_borrowed,
      count(*) FILTER (WHERE status = 'repair' OR status = 'broken') as under_repair
    FROM equipments
    WHERE category ILIKE '%notebook%' OR category ILIKE '%all in one%' OR category ILIKE '%desktop%' OR category ILIKE '%pc%';
  `);
  console.log('Computer Summary:', compSummary.rows[0]);

  // Let's inspect location or owner of ready notebooks
  const availableNotebooks = await c.query(`
    SELECT id, asset_code, brand, model, location, status 
    FROM equipments 
    WHERE category ILIKE '%notebook%'
    LIMIT 6;
  `);
  console.log('Sample notebooks:', availableNotebooks.rows);

  await c.end();
}

test().catch(console.error);

async function checkAvailable() {
  const c = new Client({
    connectionString: 'postgresql://postgres.ybaimqsliodimktwleio:3FJ77M%2FdXe%3FMC*s@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });
  await c.connect();
  const available = await c.query("SELECT id, asset_code, category, brand, model, location, status FROM equipments WHERE status = 'ว่าง';");
  console.log('Available machines (สถานะว่าง):', available.rows);
  await c.end();
}
checkAvailable().catch(console.error);
