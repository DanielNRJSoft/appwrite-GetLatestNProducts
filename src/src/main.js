import getUsers from "./users.js";
import getCollection from "./collections.js";
import { getMessages } from "./messages.js";
import { getProducts, getProductsImages } from "./products.js";

import { DEFAULT_RESPONSE } from "./constants.js";

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

  if (req.path === '/messages') {
    const messages = await getMessages({ req, log, error });
    return res.json({
      messages,
    });
  }

  if (req.path === '/product-images') {
    const productsImages = await getProductsImages({ req, log, error });
    return res.json({
      productsImages,
    });
  }

  if (req.path === '/products') {
    const products = await getProducts({ req, log, error });
    return res.json({
      products: products,
    });
  }

  return res.json({
    defaults: DEFAULT_RESPONSE,
    env: process.env 
  });
};
