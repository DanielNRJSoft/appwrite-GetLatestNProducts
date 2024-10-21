import { Client, Databases } from 'node-appwrite';
import { DB_ID, PRODUCT_IMAGES_COLLECTION_ID, PRODUCTS_COLLECTION_ID } from './constants.js';


export async function getProducts({ req, log, error }) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID);
  // .setKey(req.headers['x-appwrite-key'] ?? API_KEY_ALL_RIGHTS);

  const databases = new Databases(client);

  var respProducts = {};

  try {
    const productsResponse = await databases.listDocuments(
      DB_ID, // databaseId
      PRODUCTS_COLLECTION_ID // collectionId
    );

    log(`Total products: ${productsResponse.total}`);
    respProducts = { cmd: 'PRODUCT LIST', data: productsResponse };
  } catch (err) {
    error('Could not list products: ' + err.message);
    respProducts = {
      cmd: 'PRODUCT LIST',
      error: err,
    };
  }

  return respProducts;
}

export async function getProductsImages({ req, log, error }) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID);

  const databases = new Databases(client);

  var response = {};

  try {
    const productsImagesResponse = await databases.listDocuments(
      DB_ID, // databaseId
      PRODUCT_IMAGES_COLLECTION_ID // collectionId
    );

    log(`Total products images: ${productsImagesResponse.total}`);
    response = { cmd: 'PRODUCTS IMAGES LIST', data: productsImagesResponse };
  } catch (err) {
    error('Could not list products images: ' + err.message);
    response = {
      cmd: 'PRODUCT IMAGES LIST',
      error: err,
    };
  }

  return respProducts;
}
