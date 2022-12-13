import Container from "react-bootstrap/Container";

import OrderEntry from "./pages/entry/OrderEntry";

import { OrderDetailsProvider } from "./context/OrderDetails";
import OrderSummary from "./pages/summary/OrderSummary";

function App() {
  return (
    <Container>
      <OrderDetailsProvider>
        {/* Summary page and entry page need provider */}
        <OrderEntry />
        <OrderSummary />
      </OrderDetailsProvider>
      {/* Confirmation page does not need provider */}
    </Container>
  );
}

export default App;
