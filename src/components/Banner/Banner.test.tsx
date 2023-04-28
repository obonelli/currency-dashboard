import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import WS from "jest-websocket-mock";
import Banner from "./Banner";

describe("Banner component", () => {
  let server: WS;

  beforeEach(async () => {
    server = new WS("ws://67.205.189.142:8000/websockets/");
  });

  afterEach(() => {
    WS.clean();
  });

  test("renders currency pair", () => {
    render(<Banner currencyId="BTC" />);
    const currencyPairElement = screen.getByText(/Currency Pair/);
    expect(currencyPairElement).toBeInTheDocument();
    const currencyPairValue = screen.getByText(/BTC/);
    expect(currencyPairValue).toBeInTheDocument();
  });

  test("renders initial loading state", () => {
    render(<Banner currencyId="BTC" />);
    const loadingElements = screen.getAllByText(/Loading.../i);
    loadingElements.forEach((element) => {
      expect(element).toBeInTheDocument();
    });
  });

  test("renders data after receiving websocket message", async () => {
    render(<Banner currencyId="BTC" />);
    await server.connected;

    server.send(JSON.stringify({ currency: "BTC", point: 30000 }));

    const pointElement = await screen.findByText(/30000.0000/);
    expect(pointElement).toBeInTheDocument();
  });
});
