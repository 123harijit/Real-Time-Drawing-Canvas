document.addEventListener('DOMContentLoaded', () => {
    
    const ws = new WebSocketHandler();
    
    const roomIdInput = document.getElementById('roomIdInput');
    const usernameInput = document.getElementById('usernameInput');
    const joinRoomBtn = document.getElementById('joinRoomBtn');
    const roomSetup = document.getElementById('room-setup');
    const appContainer = document.getElementById('app-container');

    const initializeApp = () => {
        roomSetup.style.display = 'none';
        appContainer.style.display = 'block';

        const canvas = new DrawingCanvas('drawing-canvas');
        canvas.init();

        const colorPicker = document.getElementById('color');
        const strokeSlider = document.getElementById('strokeWidth');
        const strokeValue = document.getElementById('strokeValue');
        const brushBtn = document.getElementById('brush');
        const eraserBtn = document.getElementById('eraser');
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');

        colorPicker.addEventListener('change', (e) => {
            canvas.setColor(e.target.value);
        });
        strokeSlider.addEventListener('input', (e) => {
            const width = e.target.value;
            canvas.setStrokeWidth(width);
            strokeValue.textContent = width;
        });
        brushBtn.addEventListener('click', () => {
            canvas.setTool('brush');
        });
        eraserBtn.addEventListener('click', () => {
            canvas.setTool('eraser');
        });

        undoBtn.addEventListener('click', () => {
            ws.requestUndo();
        });
        redoBtn.addEventListener('click', () => {
            ws.requestRedo();
        });

        ws.finalizeSetup(canvas);
    };

    joinRoomBtn.addEventListener('click', () => {
        const roomId = roomIdInput.value.trim();
        const username = usernameInput.value.trim();
        
        if (roomId && username) {
            ws.joinRoom(roomId, username);
            initializeApp();
        } else {
            alert('Please enter both a Username and a Room ID.');
        }
    });
});