/**
 * Handles all canvas drawing logic and state manipulation.
 */
class DrawingCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext('2d');
        
        this.canvas.width = window.innerWidth * 0.9;
        this.canvas.height = window.innerHeight * 0.7;

        this.context.lineJoin = 'round';
        this.context.lineCap = 'round';

        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;

        this.strokeColor = '#000000';
        this.strokeWidth = 5;
        this.currentTool = 'brush'; 
    }

    init() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e, true));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e, true));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing(true));
        this.canvas.addEventListener('mouseout', () => this.stopDrawing(true));
    }
    
    drawSegment(x1, y1, x2, y2, color, width, tool) {
        this.context.beginPath();

        this.context.strokeStyle = (tool === 'eraser') ? '#FFFFFF' : color;
        this.context.lineWidth = width;
        this.context.globalCompositeOperation = 'source-over';
        
        this.context.moveTo(x1, y1);
        this.context.lineTo(x2, y2);
        this.context.stroke();
    }

    startDrawing(e, isLocal = true) {
        this.isDrawing = true;

        if (isLocal) {
            [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
        } else {
            const { x, y, color, width, tool } = e;
            [this.lastX, this.lastY] = [x, y];
            
            this.context.strokeStyle = (tool === 'eraser') ? '#FFFFFF' : color;
            this.context.lineWidth = width;
            this.context.globalCompositeOperation = 'source-over';
        }
    }

    draw(e, isLocal = true) {
        if (!this.isDrawing) return;

        let currentX, currentY;
        let color, width, tool;
        
        if (isLocal) {
            currentX = e.offsetX;
            currentY = e.offsetY;
            color = this.strokeColor;
            width = this.strokeWidth;
            tool = this.currentTool;
        } else {
            currentX = e.x;
            currentY = e.y;
            color = this.context.strokeStyle;
            width = this.context.lineWidth;
            tool = (color === '#FFFFFF') ? 'eraser' : 'brush';
        }

        this.drawSegment(this.lastX, this.lastY, currentX, currentY, color, width, tool);

        [this.lastX, this.lastY] = [currentX, currentY];
    }

    stopDrawing(isLocal = true) {
        this.isDrawing = false;
    }

    redrawHistory(history) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        history.forEach(stroke => {
            const { points, color, width, tool } = stroke;
            
            for (let i = 1; i < points.length; i++) {
                const p1 = points[i - 1];
                const p2 = points[i];
                
                this.drawSegment(p1.x, p1.y, p2.x, p2.y, color, width, tool);
            }
        });
    }

    setTool(tool) {
        this.currentTool = tool;
    }
    setColor(color) {
        this.strokeColor = color;
    }
    setStrokeWidth(width) {
        this.strokeWidth = width;
    }
}