import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const SANITY_KEY = process.env.NEXT_PUBLIC_SANITY_APP_KEY;

export default async function handler(req, res) {
  if (req.method === "POST") {
    const reqCartItems = req.body.data;
    console.log("POST", reqCartItems);

    try {
      const params = {
        submit_type: "pay",
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_options: [
          {
            shipping_rate: "shr_1LMEklJhcmrcwaMOu0L11YE3",
          },
        ],
        line_items: reqCartItems.map((item) => {
          const img = item.image[0].asset._ref;
          const newImage = img
            .replace(
              "image-",
              `https://cdn.sanity.io/images/${SANITY_KEY}/production/`
            )
            .replace("-webp", ".webp");

          console.log("NEW IMAGE ", newImage);
          const response = {
            price_data: {
              currency: "eur",
              product_data: {
                name: item.name,
                images: [newImage],
              },
              unit_amount: item.price * 100,
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity,
          };

          console.log("RESPONSE ", response);

          return response;
        }),
        mode: "payment",
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      };

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      // res.redirect(303, session.url);
      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
