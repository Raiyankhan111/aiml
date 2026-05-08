import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ISSSpeedChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-slate-500 dark:text-slate-400">
        Waiting for speed data...
      </div>
    );
  }

  return (
    <div className="h-[250px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
          <XAxis 
            dataKey="time" 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            tickMargin={10}
            axisLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis 
            domain={['auto', 'auto']} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
            width={60}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.9)', 
              borderColor: '#334155',
              color: '#fff',
              borderRadius: '8px'
            }}
            itemStyle={{ color: '#60a5fa' }}
          />
          <Line 
            type="monotone" 
            dataKey="speed" 
            stroke="#3b82f6" 
            strokeWidth={3}
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
            activeDot={{ r: 6, fill: '#60a5fa', stroke: '#fff' }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
