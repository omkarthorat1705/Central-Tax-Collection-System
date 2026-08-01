const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const queries = [
  'SELECT COUNT(*) as count FROM tenants',
  'SELECT COUNT(*) as count FROM tax_types',
  'SELECT COUNT(*) as count FROM citizens',
  'SELECT COUNT(*) as count FROM citizen_assets',
  'SELECT COUNT(*) as count FROM tax_assessments',
  'SELECT COUNT(*) as count FROM citizen_portal_credentials',
];

let index = 0;
function next() {
  if (index >= queries.length) {
    db.close();
    return;
  }

  const query = queries[index];
  db.get(query, (err, row) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(query + ' => ' + row.count);
    index += 1;
    next();
  });
}

next();
