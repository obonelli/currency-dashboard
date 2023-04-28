// Home.tsx
import React, { useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import Chart from "../components/Chart/Chart";
import DataTable from "../components/DataTable/DataTable";
import "./Home_style.css";

interface CurrencyPair {
  id: string;
  label: string;
}

const fetchCurrencyPairs = async () => {
  const response = await fetch("http://67.205.189.142:8000/pairs");
  const data: CurrencyPair[] = await response.json();
  return data;
};

export const Home: React.FC = () => {
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPair[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState("EURUSD");

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCurrencyPairs();
      setCurrencyPairs(data);
    };

    fetchData();
  }, []);

  const handleCurrencyButtonClick = (currencyId: string) => {
    setSelectedCurrency(currencyId);
  };

  return (
    <div className="home">
      <div className="currency-button-container">
        {currencyPairs.map((currencyPair) => (
          <button
            key={currencyPair.id}
            className={`currency-button ${
              selectedCurrency === currencyPair.id ? "selected" : ""
            }`}
            onClick={() => handleCurrencyButtonClick(currencyPair.id)}
          >
            {currencyPair.label}
          </button>
        ))}
      </div>
      <Banner currencyId={selectedCurrency} data-testid="banner" />
      <DataTable currencyId={selectedCurrency} />
      <Chart currencyId={selectedCurrency} />
    </div>
  );
};
