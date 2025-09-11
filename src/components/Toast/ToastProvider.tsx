import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from 'react';

interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  text: string;
}

export interface ToastContextValue {
  showSuccess: (text: string) => void;
  showError: (text: string) => void;
  showInfo: (text: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(
  undefined
);

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

const ToastProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const enqueue = (type: ToastMessage['type'], text: string) => {
    const id = Date.now() + Math.random();
    setMessages((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 2500);
  };

  const value: ToastContextValue = {
    showSuccess: (text) => enqueue('success', text),
    showError: (text) => enqueue('error', text),
    showInfo: (text) => enqueue('info', text),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className='fixed top-4 right-4 z-[3000] space-y-2'>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`px-4 py-2 rounded-lg shadow text-sm border backdrop-blur-md ${
              m.type === 'success'
                ? 'bg-green-600/90 text-white border-green-500/30'
                : m.type === 'error'
                ? 'bg-red-600/90 text-white border-red-500/30'
                : 'bg-gray-700/90 text-white border-gray-600/30'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
