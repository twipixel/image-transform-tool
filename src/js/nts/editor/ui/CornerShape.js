(function () {
    'use strict';

    var utils = usenamespace('editor.utils');

    function CornerShape (type, size, thickness, color) {
        PIXI.Sprite.call(this);
        this.initialize(type, size, thickness, color);
        this.draw(type);
    };

    CornerShape.LEFT_TOP = 'leftTop';
    CornerShape.RIGHT_TOP = 'rightTop';
    CornerShape.RIGHT_BOTTOM = 'rightBottom';
    CornerShape.LEFT_BOTTOM = 'leftBottom';

    var p = CornerShape.prototype = Object.create(PIXI.Sprite.prototype);

    p.initialize = function (type, size, thickness, color) {
        this.type = type;
        this.size = utils.Func.getDefaultParameters(size, 20);
        this.half = this.size / 2;
        this.defaultColor = 0xFFFFFF;
        this.thickness = utils.Func.getDefaultParameters(thickness, 4);
        this.shapeColor = utils.Func.getDefaultParameters(color, this.defaultColor);
        this.buttonAreaAlpha = 0;
        this.buttonAreaColor = 0x4285f4;
        this.interactive = true;
        this.buttonMode = true;
        this.defaultCursor = 'default';
        this.graphics = new PIXI.Graphics();
        this.buttonArea = new PIXI.Graphics();
        this.addChild(this.graphics);
        this.addChild(this.buttonArea);
    };

    p.draw = function (type) {
        this.drawButtonArea();

        switch (type) {
            case CornerShape.LEFT_TOP:
                this.drawLeftTop();
                break;
            case CornerShape.RIGHT_TOP:
                this.drawRightTop();
                break;
            case CornerShape.RIGHT_BOTTOM:
                this.drawRightBottom();
                break;
            case CornerShape.LEFT_BOTTOM:
                this.drawLeftBottom();
                break;
        }
    };

    p.changeColor = function (color) {
        this.shapeColor = color;
        this.draw(this.type);
    };

    p.drawButtonArea = function () {
        var h = this.half;
        var s = this.size;
        this.buttonArea.clear();
        this.buttonArea.beginFill(this.buttonAreaColor, this.buttonAreaAlpha);
        this.buttonArea.drawRect(-h, -h, s, s);
        this.buttonArea.endFill();
    };

    p.drawLeftTop = function () {
        var h = this.half;
        var t = this.thickness;
        this.graphics.clear();
        this.graphics.beginFill(this.shapeColor);
        this.graphics.drawRect(-t, -t, h, t);
        this.graphics.drawRect(-t, -t, t, h);
        this.graphics.endFill();
    };

    p.drawRightTop = function () {
        var h = this.half;
        var t = this.thickness;
        this.graphics.clear();
        this.graphics.beginFill(this.shapeColor);
        this.graphics.drawRect(-(h - t), -t, h, t);
        this.graphics.drawRect(0, -t, t, h);
        this.graphics.endFill();
    };

    p.drawRightBottom = function () {
        var h = this.half;
        var t = this.thickness;
        this.graphics.clear();
        this.graphics.beginFill(this.shapeColor);
        this.graphics.drawRect(-(h - t), 0, h, t);
        this.graphics.drawRect(0, t, t, -h);
        this.graphics.endFill();
    };

    p.drawLeftBottom = function () {
        var h = this.half;
        var t = this.thickness;
        this.graphics.clear();
        this.graphics.beginFill(this.shapeColor);
        this.graphics.drawRect(-t, 0, h, t);
        this.graphics.drawRect(-t, t, t, -h);
        this.graphics.endFill();
    };

    usenamespace('editor.ui').CornerShape = CornerShape;
})();