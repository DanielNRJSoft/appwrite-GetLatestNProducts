import { Client, Users, Databases } from 'node-appwrite';

// This Appwrite function will be executed every time your function is triggered
export default async ({ req, res, log, error }) => {
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

  const db = new Databases(client);

  // collection list.
  var respCollection = {};
  try {
    const collectionsResponse = await db.listCollections();
    // Log messages and errors to the Appwrite Console
    // These logs won't be seen by your end users
    log(`Total users: ${collectionsResponse.total}`);
    respCollection = {
      cmd: 'COLLECTIONS LIST',
      data: collectionsResponse,
    };
  } catch (err) {
    error('Could not list collections: ' + err.message);
    respCollection = {
      cmd: 'COLLECTIONS LIST',
      error: err,
    };
  }

  const dbClient = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(
      req.headers['x-appwrite-key'] ??
        'standard_d8582ff37d402854e22b78a74d0da37ea338cab3ff5aa552abf26ab5cf5c727903f64db77e7d1043a2ffdae617ebeb78cbacea3b28c54c4b62d110c123c07fa9a84f58b6bd1fca68b6745930e392b2080bf33d70f6551b4df1f1e1b9d153057386f25d1df6d6419e6c967f8782974a4b600241440c73d85268d2b14b7db01cd3'
    );
  const databases = new Databases(dbClient);

  var respProducts = {};

  try {
    const productsResponse = await databases.getCollection(
      'shopApp', // databaseId
      'products' // collectionId
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

  // The req object contains the request data
  if (req.path === '/ping') {
    // Use res object to respond with text(), json(), or binary()
    // Don't forget to return a response!
    return res.text('Pong');
  }

  const defaultResponse = {
    motto: 'Build like a team of hundreds_',
    learn: 'https://appwrite.io/docs',
    connect: 'https://appwrite.io/discord',
    getInspired: 'https://builtwith.appwrite.io',
  };

  return res.json({
    default: defaultResponse,
    users: respUsers,
    collections: respCollection,
    products: respProducts,
  });
};
