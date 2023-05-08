import React from "react";
import { render, screen } from "@testing-library/react";
import Chart from "./Chart";
import fetchMock from "jest-fetch-mock";
import "@testing-library/jest-dom/extend-expect";

const mockChartData = {
  "Time Series FX (Daily)": {
    "2022-09-26": {
      "2. high": "0.97014",
    },
    "2022-09-25": {
      "2. high": "0.97500",
    },
  },
};

describe("Chart component", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(mockChartData));
  });

  test("renders chart with data", async () => {
    render(<Chart currencyId="EURUSD" />);
    const chartContainer = await screen.findByTestId("chart-container");
    expect(chartContainer).toBeInTheDocument();
  });
});
