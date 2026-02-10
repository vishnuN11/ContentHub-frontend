import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { createChart } from 'lightweight-charts';
import { Search, TrendingUp, TrendingDown, RefreshCw, AlertCircle } from 'lucide-react';

const StockDashboard = () => {
  const [query, setQuery] = useState('RELIANCE');
  const [data, setData] = useState(null);
  const [range, setRange] = useState('1mo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const chartContainerRef = useRef();
  const chartRef = useRef();

  const fetchStock = async (searchSymbol = query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/stock/${searchSymbol}?range=${range}`);
      setData(res.data);
      renderChart(res.data.history);
    } catch (err) {
      setError("Could not find stock. Try RELIANCE, TCS, or INFY.");
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (history) => {
    if (!chartContainerRef.current) return;
    if (chartRef.current) chartRef.current.remove();

    const chart = createChart(chartContainerRef.current, {
      layout: { background: { color: 'transparent' }, textColor: '#64748b' },
      grid: { vertLines: { visible: false }, horzLines: { color: '#f1f5f9' } },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: { borderVisible: false },
    });

    const series = chart.addAreaSeries({
      lineColor: '#7c3aed',
      topColor: 'rgba(124, 58, 237, 0.2)',
      bottomColor: 'rgba(124, 58, 237, 0.0)',
      lineWidth: 2,
    });

    series.setData(history);
    chart.timeScale().fitContent();
    chartRef.current = chart;
  };

  useEffect(() => {
    fetchStock();
    // Handle window resize
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [range]);

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Search Section */}
        <section className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && fetchStock()}
              className="w-full pl-12 pr-4 py-3 bg-white border-none shadow-sm rounded-2xl focus:ring-2 focus:ring-purple-500 outline-none transition"
              placeholder="Enter NSE Symbol (e.g., TATAMOTORS)"
            />
          </div>
          <button 
            onClick={() => fetchStock()}
            disabled={loading}
            className="bg-purple-700 hover:bg-purple-800 text-white px-8 rounded-2xl font-bold flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? <RefreshCw className="h-5 w-5 animate-spin" /> : "Search"}
          </button>
        </section>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-2">
            <AlertCircle className="h-5 w-5" /> {error}
          </div>
        )}

        {data && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Price Header */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">{data.meta.name}</h1>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{data.meta.symbol}</span>
              </div>
              <div className="text-right">
                <div className="text-4xl font-black text-slate-900">₹{data.meta.price.toLocaleString('en-IN')}</div>
                <div className={`flex items-center justify-end font-bold text-sm ${data.meta.percent >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {data.meta.percent >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {data.meta.percent.toFixed(2)}% Today
                </div>
              </div>
            </div>

            {/* Chart Card */}
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['1d', '5d', '1mo', '6mo', '1y', '5y'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${range === r ? 'bg-purple-700 text-white shadow-lg shadow-purple-200' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                  >
                    {r.toUpperCase()}
                  </button>
                ))}
              </div>
              <div ref={chartContainerRef} className="w-full" />
            </div>

            {/* Stats Grid */}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem label="Day Low" value={data.meta.low} />
              <StatItem label="Day High" value={data.meta.high} />
              <StatItem label="52W Low" value={data.meta.l52} color="text-rose-600" />
              <StatItem label="52W High" value={data.meta.h52} color="text-emerald-600" />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

const StatItem = ({ label, value, color = "text-slate-800" }) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">{label}</p>
    <p className={`text-lg font-bold ${color}`}>₹{value?.toLocaleString('en-IN')}</p>
  </div>
);

export default StockDashboard;