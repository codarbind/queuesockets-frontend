
import React, { useEffect } from 'react';
import socketService from './services/socket.service';
import { QueueData } from './types';

const App: React.FC = () => {
  
  useEffect(() => {
    // Connect to the socket when page is visited
    socketService.connect();
const user_id= Math.random().toString(36).slice(2)

    //  send data
    const sendData = () => {
      const msg_id= Math.random().toString(18).slice(2)
    const data: QueueData = {
      user_id,
        msg_id,
        message: `Hello-${msg_id} from user ${user_id} `,
        timestamp: new Date().toISOString(),
      };
       socketService.sendData(data);
    };

    // interval to send data every 1sec
    const interval = setInterval(sendData,  1000);

    // stop the interval ssetup if page is left
    return () => {
      clearInterval(interval);
      socketService.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Socket Client</h1>
      <p>Sending lots of data to the server through socket</p>
    </div>
  );
};

export default App;
