import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

type WebSocketMessage = {
  type: string;
  data: any;
};

type WebSocketContextType = {
  isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Setup polling for real-time updates instead of WebSockets
  // This is a more reliable approach in the Replit environment
  useEffect(() => {
    if (!user) {
      return;
    }

    console.log('Setting up real-time polling for updates');

    // Poll for vehicle location updates
    const locationPollInterval = setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/vehicles'] 
      });
    }, 15000); // Poll every 15 seconds

    // Poll for alerts
    const alertsPollInterval = setInterval(() => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/alerts'] 
      });
    }, 30000); // Poll every 30 seconds

    setIsConnected(true);

    // Clean up
    return () => {
      clearInterval(locationPollInterval);
      clearInterval(alertsPollInterval);
      setIsConnected(false);
    };
  }, [user]);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}