import { Client, Databases,Query  } from 'node-appwrite';
import { DB_ID, PRODUCT_IMAGES_COLLECTION_ID, PRODUCTS_COLLECTION_ID } from './constants.js';

const CMD={
  PRODUCTS_LIST:"PRODUCT LIST",
  PRODUCTS_IMAGES_LIST:'PRODUCTS IMAGES LIST', 
  GET_PAGEABLE_PRODUCTS_LIST:"GET PAGEABLE PRODUCTS LIST", 
  GET_PRODUCTS_N:"GET %{{N}} PRODUCTS"
};

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

    log(`TOTAL: ${CMD.PRODUCTS_LIST}: ${productsResponse.total}`);
    respProducts = { cmd: CMD.PRODUCTS_LIST, data: productsResponse };
  } catch (err) {
    error(`ERROR: ${CMD.PRODUCTS_LIST}: ${err.message}`);
    respProducts = {
      cmd: CMD.PRODUCTS_LIST,
      error: err,
    };
  }

  return respProducts;
}

export async function getPageableProducts({ req, log, error }) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID);
  // .setKey(req.headers['x-appwrite-key'] ?? API_KEY_ALL_RIGHTS);

  const databases = new Databases(client);

  const cmd = CMD.GET_PAGEABLE_PRODUCTS_LIST;

  const page= parseInt(req.query.page??"0");
  const limit= parseInt(req.query.rowsPerPage??"10");

  const offset=  page*limit;
  var respProducts = {};

  try {
    const productsResponse = await databases.listDocuments(
      DB_ID, // databaseId
      PRODUCTS_COLLECTION_ID ,// collectionId
      [
        Query.limit(limit),
        Query.offset(offset)
      ]
    );

    log(`TOTAL: ${cmd}: ${productsResponse.total}`);
    respProducts = { cmd: cmd, data: productsResponse };
  } catch (err) {
    error(`ERROR: ${cmd}: ${err.message}`);
    respProducts = {
      cmd,
      error: err,
    };
  }

  return respProducts;
}

export async function getNProducts({ req, log, error }) {
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID);
  // .setKey(req.headers['x-appwrite-key'] ?? API_KEY_ALL_RIGHTS);

  const databases = new Databases(client);

  const n = parseInt(req.query.n ?? "5");
  const cmd = CMD.GET_PRODUCTS_N.replace("${{N}}",n);

  var respProducts = {};

  try {
    const productsResponse = await databases.listDocuments(
      DB_ID, // databaseId
      PRODUCTS_COLLECTION_ID ,// collectionId
      [
        Query.limit(n),
      ]
    );

    log(`TOTAL: ${cmd}: ${productsResponse.total}`);
    respProducts = { cmd: cmd, data: productsResponse };
  } catch (err) {
    error(`ERROR: ${cmd}: ${err.message}`);
    respProducts = {
      cmd,
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

    log(`TOTAL: ${CMD.PRODUCTS_IMAGES_LIST}: ${productsImagesResponse.total}`);
    response = { cmd: CMD.PRODUCTS_IMAGES_LIST, data: productsImagesResponse };
  } catch (err) {
    error(`ERROR: ${CMD.PRODUCTS_IMAGES_LIST} ${err.message}`);
    response = {
      cmd: CMD.PRODUCTS_IMAGES_LIST,
      error: err,
    };
  }

  return respProducts;
}
