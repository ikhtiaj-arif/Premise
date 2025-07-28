// src/components/Hello.test.js

import { render, screen } from "@testing-library/react";
import Hello from "./Hello";

test("renders Hello World text", () => {
  render(<Hello />);
  expect(screen.getByText(/hello/i)).toBeInTheDocument();
});
