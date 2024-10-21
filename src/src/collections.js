import { Client, Databases } from 'node-appwrite';
import { API_KEY_COLLECTIONS_READ_WRITE, DB_ID } from './constants';



export default async function getCollection({ req, log, error }) {
  const key = API_KEY_COLLECTIONS_READ_WRITE;
  log(`key: ${key}`);

  const client = new Client();
  const db = new Databases(client);

  client
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(key);

  // collection list.
  var collections = {};

  try {
    const collectionsResponse = await db.listCollections(DB_ID);
    log(`Total collections: ${collectionsResponse.total}`);
    collections = {
      cmd: 'COLLECTIONS LIST',
      data: collectionsResponse,
    };
  } catch (err) {
    error('Could not list collections: ' + err.message);
    collections = {
      cmd: 'COLLECTIONS LIST',
      error: err,
    };
  }

  return collections;
}

