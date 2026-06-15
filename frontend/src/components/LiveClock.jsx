import { useState, useEffect } from 'react';

export default function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div 
      className="font-mono text-sm flex items-center gap-2"
      style={{
        color: 'var(--accent-cyan)',
        letterSpacing: '0.05em',
        fontFamily: '"Chakra Petch", sans-serif',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '4px 10px',
        borderRadius: '6px',
        border: '1px solid var(--accent-cyan)'
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-cyan)', boxShadow: '0 0 6px var(--accent-cyan)' }}></span>
      {formatTime(time)}
    </div>
  );
}
