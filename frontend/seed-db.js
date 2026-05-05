import { MongoClient } from 'mongodb';

async function listDbs() {
  const client = new MongoClient('mongodb://localhost:27017');
  try {
    await client.connect();
    const adminDb = client.db('test').admin();
    const dbs = await adminDb.listDatabases();
    console.log(dbs.databases.map(d => d.name));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

listDbs();
