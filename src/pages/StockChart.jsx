import { Line } from "react-chartjs-2";

export default function StockChart({ data }) {
  const prices = data.indicators.quote[0].close;
  const dates = data.timestamp.map(t =>
    new Date(t * 1000).toLocaleDateString()
  );

  return (
    <div className="mt-6">
      <h2 className="font-bold text-xl">{data.meta.symbol}</h2>
      <p>High: {data.meta.regularMarketDayHigh}</p>
      <p>Low: {data.meta.regularMarketDayLow}</p>
      <p>Price: {data.meta.regularMarketPrice}</p>

      <Line
        data={{
          labels: dates,
          datasets: [
            {
              label: "Price",
              data: prices
            }
          ]
        }}
      />
    </div>
  );
}
