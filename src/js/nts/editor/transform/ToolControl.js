import {Calc} from './../utils/Calculator';
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
    static get ROTATE_START() {
        return 'rotateStart';
    }
    static get ROTATE() {
        return 'rotate';
    }
    static get ROTATE_END() {
        return 'rotateEnd';
    }
    static get CLOSE() {
        return 'close';
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

        this._localPoint = new PIXI.Point();
        this.offsetX = this.options.offsetX;
        this.offsetY = this.options.offsetY;

        this.interactive = true;
        this.currentRadian = 0;
        this.currentRotation = 0;
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
        e.stopPropagation();
        this.changeCursor('move');
        this.prevMousePoint = this.currentMousePoint = {x: e.data.global.x, y: e.data.global.y};

        if(this.type === ToolControlType.ROTATION) {
            this.prevRotation = this.currentRotation = Calc.getRotation(this.centerPoint, {
                x: e.data.global.x,
                y: e.data.global.y
            });
            this.currentRadian = Calc.toRadians(this.currentRotation);

            console.log('this.emit(ToolControl.ROTATE_START');
            this.emit(ToolControl.ROTATE_START, {
                target: this,
                type: this.type,
                currentRadian: this.currentRadian,
                currentRotation: this.currentRotation,
                currentMousePoint: this.currentMousePoint
            });

        } else {
            this.emit(ToolControl.MOVE_START, {
                target: this,
                type: this.type,
                currentMousePoint: this.currentMousePoint
            });
        }

        this.addMouseMoveEvent();
        this.removeMouseDownEvent();
    };

    onMouseMove(e) {
        this.currentMousePoint = {x: e.clientX - this.offsetX, y: e.clientY - this.offsetY};

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        if(this.type === ToolControlType.ROTATION) {
            this.currentRotation = Calc.getRotation(this.centerPoint, {
                x: e.clientX - this.offsetX,
                y: e.clientY - this.offsetY
            });

            this.changeRotation = this.currentRotation - this.prevRotation;
            this.absChangeRotation = (this.changeRotation < 0) ? this.changeRotation * -1 : this.changeRotation;

            console.log('changeRotation:', this.changeRotation, 'absChangeRotation:', this.absChangeRotation);
            if (this.absChangeRotation < 100) {
                console.log('this.emit(ToolControl.ROTATE');
                this.emit(ToolControl.ROTATE, {
                    prevRotation: this.prevRotation,
                    changeRotation: this.changeRotation,
                    currentRotation: this.currentRotation,
                    currentRadian: Calc.toRadians(this.currentRotation),
                    changeRadian: Calc.toRadians(this.changeRotation)
                });
            }
        } else {
            this.emit(ToolControl.MOVE, {
                target: this,
                type: this.type,
                prevMousePoint: this.prevMousePoint,
                changeMovement: this.changeMovement,
                currentMousePoint: this.currentMousePoint
            });
        }

        this.prevRotation = this.currentRotation;
        this.prevMousePoint = this.currentMousePoint;
    };

    onMouseUp(e) {
        this.changeCursor('pointer');
        this.currentMousePoint = {x: e.clientX - this.offsetX, y: e.clientY - this.offsetY};

        if(this.type === ToolControlType.ROTATION) {

            this.currentRotation = Calc.getRotation(this.centerPoint, {
                x: e.clientX - this.offsetX,
                y: e.clientY - this.offsetY
            });

            this.changeRotation = this.currentRotation - this.prevRotation;
            this.absChangeRotation = (this.changeRotation < 0) ? this.changeRotation * -1 : this.changeRotation;

            if (this.absChangeRotation < 100) {
                console.log('this.emit(ToolControl.ROTATE_END');

                this.emit(ToolControl.ROTATE_END, {
                    target: this,
                    type: this.type,
                    prevRotation: this.prevRotation,
                    changeRotation: this.changeRotation,
                    currentRotation: this.currentRotation,
                    currentRadian: Calc.toRadians(this.currentRotation),
                    changeRadian: Calc.toRadians(this.changeRotation)
                });
            }
        } else {
            this.emit(ToolControl.MOVE_END, {
                target: this,
                type: this.type,
                prevMousePoint: this.prevMousePoint,
                currentMousePoint: this.currentMousePoint
            });
        }

        this.addMouseDownEvent();
        this.removeMouseMoveEvent();
    };



    set localPoint(value) {
        this._localPoint = value;
    }

    get localPoint() {
        return this._localPoint;
    }


    set centerPoint(value) {
        this._centerPoint = value;
    }

    get centerPoint() {
        if(!this._centerPoint)
            this._centerPoint = {x:0, y:0};
        return this._centerPoint;
    }


}