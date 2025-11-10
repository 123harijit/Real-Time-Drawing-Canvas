+---------------------+
|      Browser 1      |
|  (HTML, CSS, JS)    |
+----------▲-----------+
           |
           |  WebSocket (Socket.IO)
           ▼
+---------------------+
|      Node.js        |
|   Express Server     |
|   Socket.IO Server   |
|   Drawing State Mgmt |
+----------▲-----------+
           |
           |  WebSocket (Socket.IO)
           ▼
+---------------------+
|      Browser N      |
|  (HTML, CSS, JS)    |
+---------------------+
