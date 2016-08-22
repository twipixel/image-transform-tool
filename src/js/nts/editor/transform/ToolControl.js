import {ToolControlType} from './ToolControlType';

export class ToolControl extends PIXI.Sprite {

    static get MOVE_START() {
        return 'moveStart';
    }

    static get MOVE() {
        return 'move';
    }

    static get MOVE_END() {
        return 'moveEnd';
    }

    constructor(type, options) {
        super();
        this.type = type;
        this.options = options || {
                offsetX: 0,
                offsetY: 0,
                size: 5,
                alpha: 1,
                thickness: 1,
                color: 0xFFFFFF,
                defaultCursor: 'pointer'
            };
        this.offsetX = this.options.offsetX;
        this.offsetY = this.options.offsetY;
        this._localPoint = new PIXI.Point();

        this.interactive = true;
        this.size = this.options.size;
        this.half = this.size / 2;
        this.color = this.options.color;
        this.alpha = this.options.alpha;
        this.thickness = this.options.thickness;
        this.defaultColor = this.options.defaultCursor;

        this.initialize();
        this.render();
        this.addCursorEvent();
        this.addMouseDownEvent();
    }

    initialize() {
        this.g = this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
    }

    render() {
        switch (this.type) {
            case ToolControlType.TOP_LEFT:
            case ToolControlType.TOP_CENTER:
            case ToolControlType.TOP_RIGHT:
            case ToolControlType.MIDDLE_LEFT:
            case ToolControlType.MIDDLE_RIGHT:
            case ToolControlType.BOTTOM_LEFT:
            case ToolControlType.BOTTOM_CENTER:
            case ToolControlType.BOTTOM_RIGHT:
                this.drawControl();
                break;

            case ToolControlType.MIDDLE_CENTER:
                this.drawTranslateControl();
                break;

            case ToolControlType.ROTATION:
                this.drawRotation();
                break;

            case ToolControlType.CLOSE:
                this.drawCloseButton();
                break;
        }
    }

    drawControl() {
        this.g.clear();
        this.g.beginFill(this.color, this.alpha);
        this.g.drawRect(-this.half, -this.half, this.size, this.size);
        this.g.endFill();
    }

    drawTranslateControl() {
        this.g.clear();
        this.g.beginFill(this.color, this.alpha);
        this.g.drawRect(-this.half, -this.half, this.size, this.size);
        this.g.endFill();
    }

    drawRotation() {
        this.g.clear();
        this.g.beginFill(this.color, this.alpha);
        this.g.drawCircle(0, 0, this.half);
        this.g.endFill();
    }

    drawCloseButton() {
        this.g.clear();
        this.g.beginFill(this.color, this.alpha);
        this.g.drawRect(-this.half, -this.half, this.size, this.size);
        this.g.endFill();
    }




    changeCursor(cursor) {
        this.defaultCursor = cursor;
    };

    addCursorEvent() {
        this.mouseover = this.changeCursor.bind(this, 'pointer');
    };

    removeCursorEvent() {
        this.mouseover = null;
    };

    addMouseDownEvent() {
        this._mouseDownListener = this.onMouseDown.bind(this);
        this.on('mousedown', this._mouseDownListener);
    };

    removeMouseDownEvent() {
        this.off('mousedown', this._mouseDownListener);
    };

    addMouseMoveEvent() {
        this._mouseMoveListener = this.onMouseMove.bind(this);
        this._mouseUpListener = this.onMouseUp.bind(this);

        window.document.addEventListener('mousemove', this._mouseMoveListener);
        window.document.addEventListener('mouseup', this._mouseUpListener);
    };

    removeMouseMoveEvent() {
        window.document.removeEventListener('mousemove', this._mouseMoveListener);
        window.document.removeEventListener('mouseup', this._mouseUpListener);
    };



    onMouseDown(e) {
        this.prevMousePoint = this.currentMousePoint = {x: e.data.global.x, y: e.data.global.y};
        this.emit(ToolControl.MOVE_START, {
            type: this.type,
            target: this,
            currentMousePoint: this.currentMousePoint
        });

        e.stopPropagation();

        this.changeCursor('move');
        this.addMouseMoveEvent();
        this.removeMouseDownEvent();
    };

    onMouseMove(e) {
        this.currentMousePoint = {x: e.clientX - this.offsetX, y: e.clientY - this.offsetY};

        this.change = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        this.emit(ToolControl.MOVE, {
            type: this.type,
            target: this,
            prevMousePoint: this.prevMousePoint,
            currentMousePoint: this.currentMousePoint,
            change: this.change
        });

        this.prevMousePoint = this.currentMousePoint;
    };

    onMouseUp() {
        this.changeCursor('pointer');
        this.emit(ToolControl.MOVE_END, {
            type: this.type,
            target: this
        });
        this.addMouseDownEvent();
        this.removeMouseMoveEvent();
    };


    set localPoint(value) {
        this._localPoint = value;
    }

    get localPoint() {
        return this._localPoint;
    }



}