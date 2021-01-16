export const defaultService = {
turtle: {
    "x": 0.0,
    "y": 0.0,
    "angle": 0.0,
    "down": true,
    "rgb": "rgb(0,0,0)",
    "reset": function(x, y, degrees, down) {
        this.turtle.x = x;
        this.turtle.y = y;
        this.turtle.angle = degrees;
        this.turtle.down = down;
        this.turtle.rgb = "rgb(0,0,0)";
    },
    "move": function(distance) {
        let a = Math.PI / 180 * this.turtle.angle;
        let s = Math.sin(a);
        let c = Math.cos(a);
        let x = this.turtle.x + distance * s;
        let y = this.turtle.y + distance * c;
        if (this.turtle.down && this.turtle.dom)
        {
            let ctx = this.turtle.dom.getContext("2d");
            ctx.lineWidth = 1;
            ctx.strokeStyle = this.turtle.rgb;
            ctx.beginPath();
            ctx.moveTo(300+3*this.turtle.x, 300-3*this.turtle.y);
            ctx.lineTo(300+3*x, 300-3*y);
            ctx.stroke();
        }
        this.turtle.x = x;
        this.turtle.y = y;
    },
    "turn": function(degrees) {
        this.turtle.angle = (this.turtle.angle + degrees) % 360.0;
    },
    "color": function(red, green, blue) {
        if (red < 0) red = 0;
        else if (red > 1) red = 1;
        if (green < 0) green = 0;
        else if (green > 1) green = 1;
        if (blue < 0) blue = 0;
        else if (blue > 1) blue = 1;
        this.turtle.rgb = "rgb(" + Math.round(255*red) + "," + Math.round(255*green) + "," + Math.round(255*blue) + ")";
    },
    "pen": function(down) {
        this.turtle.down = down;
    }
},

canvas: {
    "font_size": 16,
    "width": function() {
        if (! this.canvas.dom) return 0;
        return this.canvas.dom.width;
    },
    "height": function() {
        if (! this.canvas.dom) return 0;
        return this.canvas.dom.height;
    },
    "setLineWidth": function(width) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.lineWidth = width;
    },
    "setLineColor": function(red, green, blue, alpha) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        let r = Math.min(1, Math.max(0, red));
        let g = Math.min(1, Math.max(0, green));
        let b = Math.min(1, Math.max(0, blue));
        let a = Math.min(1, Math.max(0, alpha));
        ctx.strokeStyle = "rgba(" + Math.round(255 * r) + "," + Math.round(255 * g) + "," + Math.round(255 * b) + "," + a + ")";
    },
    "setFillColor": function(red, green, blue, alpha) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        let r = Math.min(1, Math.max(0, red));
        let g = Math.min(1, Math.max(0, green));
        let b = Math.min(1, Math.max(0, blue));
        let a = Math.min(1, Math.max(0, alpha));
        ctx.fillStyle = "rgba(" + Math.round(255 * r) + "," + Math.round(255 * g) + "," + Math.round(255 * b) + "," + a + ")";
    },
    "setFont": function(fontface, fontsize) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.font = fontsize + "px " + fontface;
        this.canvas.font_size = fontsize;
    },
    "setTextAlign": function(alignment) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.textAlign = alignment;
    },
    "clear": function() {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.fillRect(0, 0, this.canvas.dom.width, this.canvas.dom.height);
    },
    "line": function(x1, y1, x2, y2) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    },
    "rect": function(left, top, width, height) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.stroke();
    },
    "fillRect": function(left, top, width, height) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.fillRect(left, top, width, height);
    },
    "frameRect": function(left, top, width, height) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.beginPath();
        ctx.rect(left, top, width, height);
        ctx.fill();
        ctx.stroke();
    },
    "circle": function(x, y, radius) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.stroke();
    },
    "fillCircle": function(x, y, radius) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill();
    },
    "frameCircle": function(x, y, radius) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
    },
    "curve": function(points, closed) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.beginPath();
        let n = points.length;
        if (n > 0)
        {
            let p = points[0];
            ctx.moveTo(p[0], p[1]);
            for (let i=1; i<n; i++)
            {
                let p = points[i];
                ctx.lineTo(p[0], p[1]);
            }
        }
        if (closed) ctx.closePath();
        ctx.stroke();
    },
    "fillArea": function(points) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.beginPath();
        let n = points.length;
        if (n > 0)
        {
            let p = points[0];
            ctx.moveTo(p[0], p[1]);
            for (let i=1; i<n; i++)
            {
                let p = points[i];
                ctx.lineTo(p[0], p[1]);
            }
        }
        ctx.closePath();
        ctx.fill();
    },
    "frameArea": function(points) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.beginPath();
        let n = points.length;
        if (n > 0)
        {
            let p = points[0];
            ctx.moveTo(p[0], p[1]);
            for (let i=1; i<n; i++)
            {
                let p = points[i];
                ctx.lineTo(p[0], p[1]);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    },
    "text": function(x, y, str) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.textBaseline = "top";
        let lines = str.split('\n');
        for (let i=0; i<lines.length; i++)
        {
            ctx.fillText(lines[i], x, y);
            y += this.canvas.font_size;
        }
    },
    "reset": function() {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    },
    "shift": function(dx, dy) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.translate(dx, dy);
    },
    "scale": function(factor) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.scale(factor, factor);
    },
    "rotate": function(angle) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.rotate(angle);
    },
    "transform": function(A, b) {
        if (! this.canvas.dom || ! this.canvas.dom.getContext) return;
        let ctx = this.canvas.dom.getContext("2d");
        ctx.transform(A[0][0], A[1][0], A[0][1], A[1][1], b[0], b[1]);
    }
},
audioContext: new AudioContext()
};