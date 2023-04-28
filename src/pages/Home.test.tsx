import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Home } from './Home';
import '@testing-library/jest-dom/extend-expect';

const mockCurrencyPairs = [
  {
    id: 'EURUSD',
    label: 'EURUSD',
  },
  {
    id: 'USDMXN',
    label: 'USDMXN',
  },
  {
    id: 'CHFMXN',
    label: 'CHFMXN',
  },
  {
    id: 'EURCHF',
    label: 'EURCHF',
  },
];

describe('Home component', () => {
  beforeEach(() => {
    const mockFetchPromise = Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCurrencyPairs),
    });

    global.fetch = jest.fn().mockImplementation(() => mockFetchPromise);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders Home component with fetched data', async () => {
    render(<Home />);
    for (const currencyPair of mockCurrencyPairs) {
      const button = await screen.findByText(currencyPair.label);
      expect(button).toBeInTheDocument();
    }
  });

  test('changes selected currency on button click', async () => {
    render(<Home />);

    for (const currencyPair of mockCurrencyPairs) {
      const button = await screen.findByText(currencyPair.label);
      fireEvent.click(button);

      const banner = screen.getByTestId("currency-pair");
      expect(banner).toHaveTextContent(currencyPair.label);
    }
  });
});