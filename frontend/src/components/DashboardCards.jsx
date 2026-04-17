import React from 'react';

const Card = ({ title, value, change, icon, trend }) => (
  <div className="glass p-6 rounded-2xl hover:translate-y-[-4px] transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-accent/10 text-accent rounded-xl">
        {icon}
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

export default Card;
