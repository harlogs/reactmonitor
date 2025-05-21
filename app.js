// App.jsx
import React, { useEffect, useState } from 'react';

const socket = new WebSocket("wss://monitor-production-f146.up.railway.app/control");

function App() {
  const [callLogs, setCallLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [liveNotification, setLiveNotification] = useState(null);

  useEffect(() => {
    // Fetch initial data
    fetch("https://monitor-production-f146.up.railway.app/api/call-logs")
      .then(res => res.json())
      .then(setCallLogs);

    fetch("https://monitor-production-f146.up.railway.app/api/notifications")
      .then(res => res.json())
      .then(setNotifications);

    // WebSocket listener
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "notification_live") {
        setLiveNotification(data.notification);
        setNotifications(prev => [data.notification, ...prev].slice(0, 50));
      }
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Control Panel</h1>

      <section className="my-4">
        <h2 className="text-xl">Live Notification:</h2>
        {liveNotification ? (
          <div className="bg-yellow-200 p-2 my-2">{liveNotification}</div>
        ) : <div>No live notification yet.</div>}
      </section>

      <section className="my-4">
        <h2 className="text-xl">Call Logs</h2>
        <ul className="list-disc pl-5">
          {callLogs.map((log, i) => (
            <li key={i}>{JSON.stringify(log)}</li>
          ))}
        </ul>
      </section>

      <section className="my-4">
        <h2 className="text-xl">Notification History</h2>
        <ul className="list-disc pl-5">
          {notifications.map((note, i) => (
            <li key={i}>{note}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;
