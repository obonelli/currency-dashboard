import React, { useEffect, useState, useRef } from "react";
import "./Banner_style.css";

interface BannerProps {
  currencyId: string;
}

const Banner: React.FC<BannerProps> = ({ currencyId }) => {
  const [point, setPoint] = useState<number | null>(null);
  const [connected, setConnected] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const createWebSocket = () => {
      const newWs = new WebSocket("ws://67.205.189.142:8000/websockets/");

      newWs.addEventListener("open", () => {
        setConnected(true);
        newWs.send(JSON.stringify({ action: "subscribe", pair: currencyId }));
      });

      newWs.addEventListener("message", (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.currency === currencyId && typeof data.point === "number") {
            setPoint(data.point);
          }
        } catch (error) {
          console.error("Invalid JSON received:", event.data);
        }
      });

      newWs.addEventListener("close", () => {
        setConnected(false);
        setTimeout(() => {
          websocketRef.current = createWebSocket();
        }, 1000);
      });

      newWs.addEventListener("error", (event) => {
        if (
          newWs.readyState !== WebSocket.CLOSING &&
          newWs.readyState !== WebSocket.CLOSED
        ) {
          console.error("WebSocket error:", event);
        }
      });

      return newWs;
    };

    if (!websocketRef.current) {
      websocketRef.current = createWebSocket();
    }

    return () => {
      if (websocketRef.current) {
        if (websocketRef.current.readyState === WebSocket.OPEN && connected) {
          websocketRef.current.send(
            JSON.stringify({ action: "unsubscribe", pair: currencyId })
          );
        }
        websocketRef.current.close();
      }
    };
  }, [currencyId]);

  const formatDate = (date: Date) => {
    return date.toISOString().split(".")[0].replace("T", " ");
  };

  return (
    <div className="banner" data-testid="banner">
      <div className="currency-pair-box">
        <div className="currency-pair-container">
          <h3 className="currency-pair-tittle">Currency Pair</h3>
          <div className="separator" /> {/* Línea blanca */}
          <p className="currency-pair" data-testid="currency-pair">
            {currencyId}
          </p>
        </div>
      </div>
      <div className="box">
      <div className="vertical-separator" /> {/* Línea vertical */}
        <h3>Current Exchange-Rate Value</h3>
        <p className="exchange-rate">{point ? point.toFixed(4) : "Loading..."}</p>
      </div>    
      <div className="box">
      <div className="vertical-separator" /> {/* Línea vertical */}
        <h3>Highest Exchange-Rate Today</h3>
        <p>{point ? (point * 1.02).toFixed(4) : "Loading..."}</p>
      </div>
      <div className="box">
      <div className="vertical-separator" /> {/* Línea vertical */}
        <h3>Lowest Exchange-Rate Today</h3>
        <p>{point ? (point * 0.98).toFixed(4) : "Loading..."}</p>
      </div>
      <div className="date-container">
        <h3>Last Update (UTC)</h3>
        <p>{point ? formatDate(new Date()) : "Loading..."}</p>
      </div>
    </div>
  );
};

export default Banner;
