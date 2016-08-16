(function () {
    'use strict';

    var utils = usenamespace('editor.es5.utils');

    function MoveUI (options) {
        PIXI.Sprite.call(this);
        this.initialize(options);
        this.render();
        this.addCursorEvent();
        this.addMouseDownEvent();
    }

    MoveUI.MOVE_START = 'moveStart';
    MoveUI.MOVE = 'move';
    MoveUI.MOVE_END = 'moveEnd';

    var p = MoveUI.prototype = Object.create(PIXI.Sprite.prototype);

    p.initialize = function (options) {
        this.interactive = true;
        this.buttonMode = true;
        this.defaultCursor = 'pointer';
        this.offsetX = utils.Func.getDefaultParameters(options.offsetX, 0);
        this.offsetY = utils.Func.getDefaultParameters(options.offsetY, 0);

        if(!this.graphics) {
            this.graphics = new PIXI.Graphics();
            this.addChild(this.graphics);
        }
    };

    p.reset = function (options) {
        this.initialize(options);
    };

    p.render = function () {
        this.graphics.clear();
        this.graphics.beginFill(0x4285f4, 0);
        this.graphics.drawRect(0, 0, 1, 1);
        this.graphics.endFill();
    };

    p.setSize = function (sizeRect) {
        this.graphics.x = sizeRect.x;
        this.graphics.y = sizeRect.y;
        this.graphics.width = sizeRect.width;
        this.graphics.height = sizeRect.height;
    };

    p.changeCursor = function (cursor) {
        this.defaultCursor = cursor;
    };

    p.addCursorEvent = function () {
        this.mouseover = this.changeCursor.bind(this, 'pointer');
    };

    p.removeCursorEvent = function () {
        this.mouseover = null;
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
        this.prevMousePoint = {x: e.data.global.x, y: e.data.global.y};
        this.emit(MoveUI.MOVE_START);

        e.stopPropagation();

        this.changeCursor('move');
        this.addMouseMoveEvent();
        this.removeMouseDownEvent();
    };

    p.onMouseMove = function (e) {
        this.currentMousePoint = {x: e.clientX - this.offsetX, y: e.clientY - this.offsetY};

        this.change = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        this.emit(MoveUI.MOVE, {
            prevMousePoint: this.prevMousePoint,
            currentMousePoint: this.currentMousePoint,
            change: this.change
        });

        this.prevMousePoint = this.currentMousePoint;
    };

    p.onMouseUp = function () {
        this.changeCursor('pointer');
        this.emit(MoveUI.MOVE_END);
        this.addMouseDownEvent();
        this.removeMouseMoveEvent();
    };

    usenamespace('editor.es5.ui').MoveUI = MoveUI;
})();
