const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); 
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3000;

const rooms = {};

const getRoomState = (roomId) => {
    if (!rooms[roomId]) {
        rooms[roomId] = {
            history: [],
            redoStack: [],
            currentStrokes: {},
            users: {} 
        };
    }
    return rooms[roomId];
};

const clientPath = path.join(__dirname, '..', 'client');
app.use(express.static(clientPath));

app.get('/', (req, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    let currentRoomId = null;

    socket.on('room:join', (data) => {
        if (currentRoomId) {
            socket.leave(currentRoomId);
        }

        currentRoomId = data.roomId;
        socket.join(currentRoomId); 

        const roomState = getRoomState(currentRoomId);
        
        console.log(`User ${socket.id} (${data.username}) joined room ${currentRoomId}. History size: ${roomState.history.length}`);
        
        roomState.users[socket.id] = { username: data.username };

        socket.emit('history:load', roomState.history);
        io.to(currentRoomId).emit('user:joined', { id: socket.id, username: data.username });
    });

    socket.on('draw:start', (data) => {
        if (!currentRoomId) return; 
        const roomState = getRoomState(currentRoomId);
        
        roomState.redoStack = []; 

        roomState.currentStrokes[socket.id] = {
            userId: socket.id,
            tool: data.tool,
            color: data.color,
            width: data.width,
            points: [{ x: data.x, y: data.y }]
        };
        socket.to(currentRoomId).emit('draw:start', data);
    });

    socket.on('draw:move', (data) => {
        if (!currentRoomId) return;
        const roomState = getRoomState(currentRoomId);

        if (roomState.currentStrokes[socket.id]) {
            roomState.currentStrokes[socket.id].points.push(data);
        }
        socket.to(currentRoomId).emit('draw:move', data);
    });

    socket.on('draw:end', () => {
        if (!currentRoomId) return;
        const roomState = getRoomState(currentRoomId);

        if (roomState.currentStrokes[socket.id]) {
            roomState.history.push(roomState.currentStrokes[socket.id]);
            delete roomState.currentStrokes[socket.id];
        }
        socket.to(currentRoomId).emit('draw:end');
    });

    socket.on('history:undo', () => {
        if (!currentRoomId) return;
        const roomState = getRoomState(currentRoomId);

        if (roomState.history.length > 0) {
            const undoneStroke = roomState.history.pop();
            roomState.redoStack.push(undoneStroke); 
            
            io.to(currentRoomId).emit('history:redraw', roomState.history);
        }
    });
    
    socket.on('history:redo', () => {
        if (!currentRoomId) return;
        const roomState = getRoomState(currentRoomId);

        if (roomState.redoStack.length > 0) {
            const redoneStroke = roomState.redoStack.pop();
            roomState.history.push(redoneStroke);
            
            io.to(currentRoomId).emit('history:redraw', roomState.history);
        }
    });

    socket.on('cursor:move', (data) => {
        if (!currentRoomId) return;
        socket.to(currentRoomId).emit('cursor:update', { ...data, id: socket.id });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        if (currentRoomId) {
            io.to(currentRoomId).emit('cursor:remove', socket.id); 
            const roomState = getRoomState(currentRoomId);
            delete roomState.users[socket.id];
        }
    });
});


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});