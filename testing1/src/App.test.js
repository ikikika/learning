import { render, screen } from "@testing-library/react";
import { logRoles } from "@testing-library/react";
import App from "./App";

test("button has correct initial color and text", () => {
  // 1. render component
  const { container } = render(<App />);
  logRoles(container);

  // 2. identify element
  const button = screen.getByRole("button", { name: "Change to blue" });

  // 3. assertion
  expect(button).toHaveStyle({ backgroundColor: "red" });
});
test("button turns blue when clicked", () => {});
