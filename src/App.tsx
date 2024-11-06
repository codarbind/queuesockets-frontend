import React, { useState, useEffect } from 'react';
import socketService from './services/socket.service';
import { QueueData } from './types';

const App: React.FC = () => {
  const [isChecked, setIsChecked] = useState(false); // State to track checkbox
  const [customUrl, setCustomUrl] = useState<string>(''); // State to hold custom URL

  useEffect(() => {
    if (isChecked && customUrl) {
      socketService.disconnect();
      console.log({isChecked,customUrl})
      // Connect to the socket with the custom URL when the checkbox is checked
      socketService.connect(customUrl);
    } else {
      // Default connection if not checked
      socketService.connect();
    }

    const user_id = Math.random().toString(36).slice(2);

    // Send data function
    const sendData = () => {
      const msg_id = Math.random().toString(18).slice(2);
      const data: QueueData = {
        user_id,
        msg_id,
        message: `Hello-${msg_id} from user ${user_id}`,
        timestamp: new Date().toISOString(),
      };
      socketService.sendData(data);
    };

    // Interval to send data every 1 sec
    const interval = setInterval(sendData, 1000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      socketService.disconnect();
    };
  }, [isChecked, customUrl]); 

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(e.target.value);
  };

  return (
    <div>
      <h1>Socket Client</h1>
      <p>Sending lots of data to the server through socket</p>
      
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={isChecked} 
            onChange={handleCheckboxChange} 
          />
          Use Custom URL
        </label>
        
        {isChecked && (
          <div>
            <label>
              Custom URL:
              <input
                type="url"
                value={customUrl}
                onChange={handleUrlChange}
                placeholder="Enter custom URL"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
