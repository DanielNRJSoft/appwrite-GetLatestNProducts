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

  const databases = new Databases(client);

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
    products: respProducts,
  });
};
