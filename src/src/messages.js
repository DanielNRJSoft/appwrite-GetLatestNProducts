import { Client, Databases } from 'node-appwrite';
import { DB_ID, MESSAGES_COLLECTION_ID } from './constants';



export async function getMessages({ req, log, error }) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID);

  const databases = new Databases(client);

  var response = {};

  try {
    const productsResponse = await databases.listDocuments(
      DB_ID, // databaseId
      MESSAGES_COLLECTION_ID // collectionId
    );

    log(`Total messages: ${productsResponse.total}`);
    response = { cmd: 'MESSAGES LIST', data: productsResponse };
  } catch (err) {
    error('Could not list messages: ' + err.message);
    response = {
      cmd: 'MESSAGES LIST',
      error: err,
    };
  }

  return response;
}
