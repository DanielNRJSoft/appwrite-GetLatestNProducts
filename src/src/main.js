import { Client, Users, Databases } from 'node-appwrite';

const DB_ID = 'shopApp';

const USER_COLLECTION_ID = '66fe5102000cea9b12c0';
const PRODUCTS_COLLECTION_ID = 'products';
const PRODUCT_IMAGES_COLLECTION_ID = 'images';
const MESSAGES_COLLECTION_ID = 'messages';

const API_KEY_ALL_RIGHTS =
  'standard_d8582ff37d402854e22b78a74d0da37ea338cab3ff5aa552abf26ab5cf5c727903f64db77e7d1043a2ffdae617ebeb78cbacea3b28c54c4b62d110c123c07fa9a84f58b6bd1fca68b6745930e392b2080bf33d70f6551b4df1f1e1b9d153057386f25d1df6d6419e6c967f8782974a4b600241440c73d85268d2b14b7db01cd3';

const API_KEY_COLLECTIONS_READ_WRITE =
  'standard_1cff975bc1a9c3330d25a15e80dd3f2a54245f334ef42c0b575f5407f436d536dec7ebd5a4745ee25be0c3834497e838db76eff36d3473379c51510dd229675ff986099fd6b2641c420d441d0cd78f82888a372f45712302a42c509bb3fd314a2bf5b504ebf6240fd270e91ddac22a23628389c275ea5e013ee0b78a05941069';

const DEFAULT_RESPONSE = {
  motto: 'Build like a team of hundreds_',
  learn: 'https://appwrite.io/docs',
  connect: 'https://appwrite.io/discord',
  getInspired: 'https://builtwith.appwrite.io',
};

async function getUsers({ req, log, error }) {
  // You can use the Appwrite SDK to interact with other services
  // For this example, we're using the Users service
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'] ?? '');

  const users = new Users(client);

  var respUsers = {};
  try {
    const userResponse = await users.list();
    // Log messages and errors to the Appwrite Console
    // These logs won't be seen by your end users
    log(`Total users: ${userResponse.total}`);
    respUsers = {
      cmd: 'USER LIST',
      data: userResponse,
    };
  } catch (err) {
    error('Could not list users: ' + err.message);
    respUsers = {
      cmd: 'USER LIST',
      error: err,
    };
  }

  return respUsers;
}

async function getCollection({ req, log, error }) {
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

async function getProducts({ req, log, error }) {
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

async function getMessages({ req, log, error }) {
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
    response = { cmd: 'IMAGES LIST', data: productsResponse.documents };
  } catch (err) {
    error('Could not list images: ' + err.message);
    response = {
      cmd: 'IMAGES LIST',
      error: err,
    };
  }

  return response;
}

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
  // The req object contains the request data
  if (req.path === '/ping') {
    // Use res object to respond with text(), json(), or binary()
    // Don't forget to return a response!
    return res.text('Pong');
  }

  if (req.path === '/default') {
    return res.json(DEFAULT_RESPONSE);
  }

  if (req.path === '/env') {
    return res.json({ env: process.env });
  }

  if (req.path === '/users') {
    const users = await getUsers({ req, log, error });
    return res.json({
      users: users,
    });
  }

  if (req.path === '/collections') {
    const collections = await getCollection({ req, log, error });
    return res.json({
      collections: collections,
    });
  }

  if (req.path === '/images') {
    const messages = await getMessages({ req, log, error });
    return res.json({
      messages,
    });
  }
  const products = await getProducts({ req, log, error });
  return res.json({
    products: products,
  });
};
