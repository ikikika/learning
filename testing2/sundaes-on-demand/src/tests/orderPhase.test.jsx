import { render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";

test("Order phases for happy path", async () => {
  // render app
  // Don't need to wrap in provider; already wrapped!
  // add ice cream scoops and toppings
  // find and click order summary button
  // check summary subtotals
  // check summary option items
  // accept terms and click button
  // Expect "loading" to show
  // check confirmation page text
  // expect that loading has disappeared
  // find and click "new order" button on confirmation page
  // check that scoops and toppings have been reset
  // wait for items to appear so that Testing Library doesn't get angry about stuff
  // happening after test is over
});
