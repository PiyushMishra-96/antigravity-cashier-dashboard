import React, { useMemo } from 'react';
import { usePOS } from '../context/POSContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, Award } from 'lucide-react';

export const Dashboard = () => {
  const { orderHistory, getTotalSales } = usePOS();

  const stats = useMemo(() => {
    const totalRevenue = getTotalSales();
    const averageOrderValue = orderHistory.length > 0 ? totalRevenue / orderHistory.length : 0;
    
    // Calculate best selling category
    const categoryCounts = {};
    orderHistory.forEach(order => {
      order.items.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + item.quantity;
      });
    });
    
    let bestCategory = 'N/A';
    let max = 0;
    for (const [cat, count] of Object.entries(categoryCounts)) {
      if (count > max) {
        max = count;
        bestCategory = cat;
      }
    }

    // Chart Data
    const chartData = orderHistory.map((order, index) => ({
      name: `Order ${index + 1}`,
      sales: order.total,
      items: order.items.reduce((sum, item) => sum + item.quantity, 0)
    }));

    return { totalRevenue, averageOrderValue, bestCategory, chartData };
  }, [orderHistory, getTotalSales]);

  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glassmorphism p-4 rounded-2xl border-l-4 border-success flex items-center gap-4">
          <div className="p-3 bg-success/20 rounded-full text-success">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-bold font-mono">${stats.totalRevenue.toFixed(2)}</h3>
          </div>
        </div>
        
        <div className="glassmorphism p-4 rounded-2xl border-l-4 border-accent flex items-center gap-4">
          <div className="p-3 bg-accent/20 rounded-full text-accent">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Avg Order Value</p>
            <h3 className="text-2xl font-bold font-mono">${stats.averageOrderValue.toFixed(2)}</h3>
          </div>
        </div>

        <div className="glassmorphism p-4 rounded-2xl border-l-4 border-[#f85149] flex items-center gap-4">
          <div className="p-3 bg-[#f85149]/20 rounded-full text-[#f85149]">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Best Category</p>
            <h3 className="text-2xl font-bold">{stats.bestCategory}</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      {stats.chartData.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glassmorphism p-4 rounded-2xl h-64 flex flex-col">
            <h4 className="text-sm font-bold mb-4 text-white/70">Sales Trend</h4>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chartData}>
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} />
                  <YAxis stroke="#ffffff50" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: '#58a6ff', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="sales" stroke="#58a6ff" strokeWidth={3} dot={{ r: 4, fill: '#58a6ff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glassmorphism p-4 rounded-2xl h-64 flex flex-col">
            <h4 className="text-sm font-bold mb-4 text-white/70">Items per Order</h4>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.chartData}>
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} />
                  <YAxis stroke="#ffffff50" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: '#0d1117', borderColor: '#3fb950', borderRadius: '8px' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                  <Bar dataKey="items" fill="#3fb950" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="glassmorphism p-8 rounded-2xl text-center text-white/50 border-dashed border-2 border-white/10">
          <TrendingUp size={48} className="mx-auto mb-4 opacity-20" />
          <p>No sales data yet. Complete an order to view the dashboard.</p>
        </div>
      )}
    </div>
  );
};
