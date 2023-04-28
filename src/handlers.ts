import { rest } from 'msw';

const mockHistoricData = {
  "Time Series FX (Daily)": {
    "2023-04-14": {
      "1. open": "1.0000",
      "2. high": "1.1000",
      "3. low": "0.9000",
      "4. close": "1.0500",
    },
    "2023-04-13": {
      "1. open": "1.0100",
      "2. high": "1.1200",
      "3. low": "0.8900",
      "4. close": "1.0400",
    },
  },
};

export const handlers = [
  rest.get('http://67.205.189.142:8000/historic-data/:currencyId', (req, res, ctx) => {
    return res(ctx.json(mockHistoricData));
  }),
];
