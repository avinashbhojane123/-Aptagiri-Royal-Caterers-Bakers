const { Client } = require('pg');

async function createDatabase() {
  const credentials = {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: process.env.DB_PASSWORD || 'Avinash@9019',
    database: 'cake_shop', // Connect to default database
  };

  const client = new Client(credentials);

  try {
    await client.connect();
    console.log('Connected to default postgres database.');
    
    // Check if database exists
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='cake_shop'");
    if (res.rowCount === 0) {
      await client.query('CREATE DATABASE cake_shop');
      console.log("Database 'cake_shop' created successfully!");
    } else {
      console.log("Database 'cake_shop' already exists.");
    }
  } catch (err) {
    console.error('Error creating database:', err.message);
    console.log('\n--- Troubleshooting DB Connection ---');
    console.log('Please verify:');
    console.log('1. PostgreSQL service is running.');
    console.log('2. The password is correct (default is "postgres"). You can set the DB_PASSWORD environment variable if it is different.');
    process.exit(1);
  } finally {
    await client.end();
  }
}

createDatabase();
