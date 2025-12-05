import { useEffect } from 'react';

export default function Notification({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-5 right-5 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-4 z-50 animate-slide-in-right min-w-[250px]">
      <span>✓ {message}</span>
      <button onClick={onClose} className="text-2xl leading-none hover:opacity-75">×</button>
    </div>
  );
}
