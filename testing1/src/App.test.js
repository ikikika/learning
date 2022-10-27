import { render, screen } from "@testing-library/react";
import App from "./App";

test("button has correct initial color and text", () => {
  // 1. render component
  render(<App />);

  // 2. identify element
  const button = screen.getByRole("button", { name: "Change to blue" });

  // 3. assertion
  expect(button).toHaveStyle({ backgroundColor: "red" });
});
test("button turns blue when clicked", () => {});
