import React from "react";
import { render, screen } from "@testing-library/react";
import DataTable from "./DataTable";
import mockData from "./mockData.json";
import fetchMock from "jest-fetch-mock";
import "@testing-library/jest-dom/extend-expect";

describe("DataTable component", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(mockData));
  });

  test("renders Historic Prices table header", async () => {
    render(<DataTable currencyId="EURUSD" />);
    const tableHeader = await screen.findByText(/Historic Prices/i);
    expect(tableHeader).toBeInTheDocument();
  });

  test("renders Daily Trend table header", async () => {
    render(<DataTable currencyId="EURUSD" />);
    const tableHeader = await screen.findByText(/Daily Trend/i);
    expect(tableHeader).toBeInTheDocument();
  });

  test("renders historic data and daily trend data", async () => {
    render(<DataTable currencyId="EURUSD" />);

    // Verifica que los datos de precios históricos se rendericen
    const historicHigh = await screen.findByText(/0.97014/i);
    const historicLow = await screen.findByText(/0.95501/i);
    expect(historicHigh).toBeInTheDocument();
    expect(historicLow).toBeInTheDocument();
  });
});
