import { Client, Users } from 'node-appwrite';

export default async function getUsers({ req, log, error }) {
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

