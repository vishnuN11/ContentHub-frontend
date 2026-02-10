import { useState } from "react";
import axios from "axios";
import StockChart from "./StockChart";

export default function StockSearch() {
  const [symbol, setSymbol] = useState("");
  const [range, setRange] = useState("1mo");
  const [data, setData] = useState(null);

  const fetchStock = async () => {
    const res = await axios.get(
      `http://localhost:5000/api/stocks?symbol=${symbol}&range=${range}`
    );
    setData(res.data);
  };

  return (
    <div className="p-6">
      <input
        className="border p-2 mr-2"
        placeholder="RELIANCE, TCS"
        onChange={e => setSymbol(e.target.value)}
      />

      <select onChange={e => setRange(e.target.value)}>
        <option value="1d">1 Day</option>
        <option value="5d">5 Days</option>
        <option value="1mo">1 Month</option>
        <option value="6mo">6 Months</option>
        <option value="1y">1 Year</option>
      </select>

      <button onClick={fetchStock} className="ml-2 bg-blue-500 text-white px-4 py-2">
        Search
      </button>

      {data && <StockChart data={data} />}
    </div>
  );
}
