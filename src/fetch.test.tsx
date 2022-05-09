// __tests__/fetch.test.js
import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Fetch from "./fetch";

const server = setupServer(
  rest.get("https://ghibliapi.herokuapp.com/films", (req, res, ctx) => {
    return res(ctx.json([{ title: "hello there" }]));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and displays greeting", async () => {
  render(<Fetch url="https://ghibliapi.herokuapp.com/films" />);

  fireEvent.click(screen.getByText("Load Greeting"));

  await screen.findByRole("heading");

  expect(screen.getByRole("heading")).toHaveTextContent("hello there");
  expect(screen.getByRole("button")).toBeDisabled();
});

test("handles server error", async () => {
  server.use(
    rest.get("https://ghibliapi.herokuapp.com/films", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  render(<Fetch url="https://ghibliapi.herokuapp.com/films" />);

  fireEvent.click(screen.getByText("Load Greeting"));

  await screen.findByRole("alert");

  expect(screen.getByRole("alert")).toHaveTextContent(
    "Oops… something went wrong, try again 🤕!"
  );
  expect(screen.getByRole("button")).not.toBeDisabled();
});
