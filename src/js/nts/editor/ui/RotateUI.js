(function () {
    'use strict';

    var utils = usenamespace('editor.utils');

    function RotateUI (canvas, viewport, image, options) {
        Object.defineProperty(this, 'viewport', {get: this.getViewport, set:this.setViewport});

        PIXI.Sprite.call(this);

        this.initialize(canvas, viewport, image, options);
        this.render();
        // this.addCursorEvent();
        this.addMouseDownEvent();
    };

    RotateUI.ROTATE_START = 'rotateStart';
    RotateUI.ROTATE = 'rotate';
    RotateUI.ROTATE_END = 'rotateEnd';

    var p = RotateUI.prototype = Object.create(PIXI.Sprite.prototype);

    p.initialize = function (canvas, viewport, image, options) {
        this.image = image;
        this.canvas = canvas;
        this.interactive = true;
        this.buttonMode = true;
        this.defaultCursor = 'inherit';
        this.offsetX = utils.Func.getDefaultParameters(options.offsetX, 0);
        this.offsetY = utils.Func.getDefaultParameters(options.offsetY, 0);
        this.viewport = utils.Func.getDefaultParameters(viewport, {x:0, y:0, width:canvas.width, height:canvas.height});

        if(!this.graphics) {
            this.graphics = new PIXI.Graphics();
            this.addChild(this.graphics);
        }
    };

    p.reset = function (canvas, viewport, image, options) {
        this.initialize(canvas, viewport, image, options);
    };

    p.render = function () {
        this.graphics.clear();
        this.graphics.beginFill(0xFF00FF, 0);
        this.graphics.drawRect(0, 0, 1, 1);
        this.graphics.endFill();
    };

    p.resize = function () {
        this.graphics.width = this.canvas.width;
        this.graphics.height = this.canvas.height;
    };

    p.changeCursor = function () {
        /*
        var x = utils.Mouse.stageX;
        var y = utils.Mouse.stageY;

        if(x < this.centerX) {
            if(y < this.centerY) {
                this.defaultCursor = "url('img/loading.gif'), ns-resize";
            } else {
                this.defaultCursor = "url('img/loading.gif'), ns-resize";
            }
        } else {
            if(y < this.centerY) {
                this.defaultCursor = "url('img/loading.gif'), ew-resize";
            } else {
                this.defaultCursor = "url('img/loading.gif'), ew-resize";
            }
        }
        */
    };

    p.addCursorEvent = function () {
        this.mouseover = this.changeCursor.bind(this);
    };

    p.addMouseDownEvent = function () {
        this._mouseDownListener = this.onMouseDown.bind(this);
        this.on('mousedown', this._mouseDownListener);
    };

    p.removeMouseDownEvent = function () {
        this.off('mousedown', this._mouseDownListener);
    };

    p.addMouseMoveEvent = function () {
        this._mouseMoveListener = this.onMouseMove.bind(this);
        this._mouseUpListener = this.onMouseUp.bind(this);

        window.document.addEventListener('mousemove', this._mouseMoveListener);
        window.document.addEventListener('mouseup', this._mouseUpListener);
    };

    p.removeMouseMoveEvent = function () {
        window.document.removeEventListener('mousemove', this._mouseMoveListener);
        window.document.removeEventListener('mouseup', this._mouseUpListener);
    };


    p.onMouseDown = function (e) {
        this.prevRotation = utils.Calc.getRotation({x: this.centerX, y: this.centerY}, {
            x: e.data.global.x,
            y: e.data.global.y
        });

        this.changeCursor();
        this.emit(RotateUI.ROTATE_START, {
            prevRotation: this.prevRotation,
            currentRotation: this.prevRotation,
            currentRadian: utils.Calc.toRadians(this.prevRotation)
        });

        e.stopPropagation();
        this.addMouseMoveEvent();
        this.removeMouseDownEvent();
    };

    p.onMouseMove = function (e) {
        this.currentRotation = utils.Calc.getRotation({x: this.centerX, y: this.centerY}, {
            x: e.clientX - this.offsetX,
            y: e.clientY - this.offsetY
        });

        this.change = this.currentRotation - this.prevRotation;
        this.absChange = (this.change < 0) ? this.change * -1 : this.change;

        if (this.absChange < 100) {
            this.emit(RotateUI.ROTATE, {
                prevRotation: this.prevRotation,
                currentRotation: this.currentRotation,
                currentRadian: utils.Calc.toRadians(this.currentRotation),
                change: utils.Calc.toRadians(this.change)
            });
        }

        this.prevRotation = this.currentRotation;
    };

    p.onMouseUp = function (e) {
        this.emit(RotateUI.ROTATE_END);
        this.addMouseDownEvent();
        this.removeMouseMoveEvent();
    };

    p.getViewport = function () {
        return this._viewport;
    };

    p.setViewport = function (value) {
        if(value) {
            this._viewport = value;
            this.centerX = this.viewport.x + this.viewport.width / 2;
            this.centerY = this.viewport.y + this.viewport.height / 2;
        }
    };

    usenamespace('editor.ui').RotateUI = RotateUI;
})();
