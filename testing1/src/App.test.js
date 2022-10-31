import { render, screen, fireEvent } from "@testing-library/react";
// import { logRoles } from "@testing-library/react";
import App from "./App";

test("button has correct initial color and text, and updates when clicked", () => {
  // const { container } = render(<App />);
  // logRoles(container);

  // 1. render component
  render(<App />);

  // 2. identify element
  const button = screen.getByRole("button", { name: "Change to blue" });

  // 3. assertion
  expect(button).toHaveStyle({ backgroundColor: "red" });

  // 4. event and assertions
  fireEvent.click(button);
  expect(button).toHaveStyle({ backgroundColor: "blue" });
  expect(button).toHaveTextContent("Change to red");
});
