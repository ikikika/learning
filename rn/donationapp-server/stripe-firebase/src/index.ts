/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// import {setGlobalOptions} from "firebase-functions";
// import {onRequest} from "firebase-functions/https";
// import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// // this will be the maximum concurrent request count.
// setGlobalOptions({ maxInstances: 10 });

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

import * as functions from "firebase-functions";
import bodyParser from "body-parser";
import express from "express";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "./constants.ts";

// import { STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY } from "cons";

// const stripePublishableKey = STRIPE_PUBLISHABLE_KEY;
const stripeSecretKey = STRIPE_SECRET_KEY;

const app = express();

app.use((req, res, next) => {
  bodyParser.json()(req, res, next);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/create-payment-intent", async (req, res) => {
  const { email, currency, amount } = req.body;
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2022-11-15",
  });
  const customer = await stripe.customers.create({ email });
  console.log(req.body);
  const params: Stripe.PaymentIntentCreateParams = {
    amount: parseInt(amount),
    currency,
    customer: customer.id,
    payment_method_options: {
      card: {
        request_three_d_secure: "automatic",
      },
    },
    payment_method_types: ["card"],
  };

  try {
    const paymentIntent = await stripe.paymentIntents.create(params);
    return res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Stripe.errors.StripeError) {
      return res.send({ error: error.message });
    }

    return res.send({ error: "Unexpected server error" });
  }
});

app.listen(3000, () => console.log("Node server listening on port 3000!"));

export const stripePayment = functions.https.onRequest(app);
