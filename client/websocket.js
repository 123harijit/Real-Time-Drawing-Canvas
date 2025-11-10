class WebSocketHandler {
    constructor() {
        this.socket = io();
        this.canvas = null;
        this.otherCursors = {};
        this.currentRoomId = null; 
    }

    joinRoom(roomId, username) {
        this.currentRoomId = roomId;
        this.socket.emit('room:join', { roomId, username });
    }

    finalizeSetup(canvas) {
        this.canvas = canvas;
        this.createCursorLayer();
        this.bindSocketEvents();
        this.bindCanvasEvents();
    }
    
    requestUndo() {
        if (!this.currentRoomId) return;
        this.socket.emit('history:undo');
    }
    
    requestRedo() {
        if (!this.currentRoomId) return;
        this.socket.emit('history:redo');
    }

    createCursorLayer() {
        this.cursorCanvas = document.getElementById('cursor-layer');
        this.cursorCanvas.width = this.canvas.canvas.width;
        this.cursorCanvas.height = this.canvas.canvas.height;
        
        this.cursorCanvas.style.position = 'absolute';
        this.cursorCanvas.style.left = this.canvas.canvas.offsetLeft + 'px';
        this.cursorCanvas.style.top = this.canvas.canvas.offsetTop + 'px';
        this.cursorCtx = this.cursorCanvas.getContext('2d');
    }

    bindSocketEvents() {
        this.socket.on('draw:start', (data) => {
            this.canvas.startDrawing(data, false);
        });
        this.socket.on('draw:move', (data) => {
            this.canvas.draw(data, false);
        });
        this.socket.on('draw:end', () => {
            this.canvas.stopDrawing(false);
        });
        
        this.socket.on('history:load', (history) => {
            this.canvas.redrawHistory(history);
        });
        this.socket.on('history:redraw', (history) => {
            this.canvas.redrawHistory(history);
        });
        
        this.socket.on('cursor:update', (data) => {
            this.otherCursors[data.id] = { x: data.x, y: data.y };
            this.drawCursors();
        });
        this.socket.on('cursor:remove', (id) => {
            delete this.otherCursors[id];
            this.drawCursors();
        });
        
        this.socket.on('user:joined', (data) => {
            console.log(`User ${data.username} joined the room.`);
        });
    }

    bindCanvasEvents() {
        const canvasEl = this.canvas.canvas;

        canvasEl.addEventListener('mousedown', (e) => {
            if (!this.currentRoomId) return; 
            
            this.socket.emit('draw:start', {
                x: e.offsetX,
                y: e.offsetY,
                color: this.canvas.strokeColor,
                width: this.canvas.strokeWidth,
                tool: this.canvas.currentTool
            });
        });

        canvasEl.addEventListener('mousemove', (e) => {
            if (!this.currentRoomId) return;

            if (this.canvas.isDrawing) {
                this.socket.emit('draw:move', {
                    x: e.offsetX,
                    y: e.offsetY
                });
            }
            this.socket.emit('cursor:move', { x: e.offsetX, y: e.offsetY });
        });

        canvasEl.addEventListener('mouseup', () => {
            if (!this.currentRoomId) return;
            this.socket.emit('draw:end');
        });
        canvasEl.addEventListener('mouseout', () => {
            if (!this.currentRoomId) return;
            this.socket.emit('draw:end');
        });
    }

    drawCursors() {
        this.cursorCtx.clearRect(0, 0, this.cursorCanvas.width, this.cursorCanvas.height);
        
        for (const id in this.otherCursors) {
            const cursor = this.otherCursors[id];
            
            this.cursorCtx.beginPath();
            this.cursorCtx.arc(cursor.x, cursor.y, 5, 0, Math.PI * 2);
            this.cursorCtx.fillStyle = '#007bff';
            this.cursorCtx.fill();
            this.cursorCtx.closePath();
        }
    }
}