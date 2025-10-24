import React from 'react';
import Icon from '../../../components/AppIcon';

const ConnectionStatus = ({ isConnected, isReconnecting }) => {
  if (isConnected && !isReconnecting) return null;

  return (
    <div className="px-4 py-2 bg-warning/10 border-b border-warning/20">
      <div className="flex items-center justify-center space-x-2 text-warning">
        {isReconnecting ? (
          <>
            <Icon name="RotateCw" size={14} className="animate-spin" />
            <span className="text-sm font-medium">Reconnecting...</span>
          </>
        ) : (
          <>
            <Icon name="WifiOff" size={14} />
            <span className="text-sm font-medium">Connection lost. Trying to reconnect...</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;