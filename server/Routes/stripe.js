const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_51K9OorSHWdNs9aoM0OmiyxfH58RaBpY2QERDBVDHMyTbjJCpjAyOS9oqnCNeBpbmbBGmeIT8KfNKeYbf1jlJR1E000UfIAlq0j');
const { v4: uuidv4 } = require('uuid');

// dotenv.config();
// const KEY = process.env.STRIPE_KEY;
// stripe(KEY);

router.post("/payment", async (req, res) => {
  const  {  tokenId,email} = req.body;
  const idempotencyKey = uuidv4();

  // console.log(amount)
  console.log(tokenId)
  console.log(email);

  return stripe.customers.create({
      source: tokenId,
     
      email:email
    })
      .then(customer => {
          stripe.charges.create({
              amount: 101 * 100,
              currency:'INR',
              customer:customer.id,
              receipt_email: email,
              description: "puchase of product",
            

          }, {idempotencyKey})
              .then(result => res.status(200).json(result))
              .catch(err => {
                  console.log(err)
                  res.status(400).json(err)
              })
      })
      .catch(error => {
          console.error(error)
      });

});

module.exports = router;