/**
 * Created by Naver on 2016. 8. 16..
 */
(function () {
    'use strict';

    function ControlPoint (color) {
        PIXI.Sprite.call(this);
        this.initialize(color);
        this.draw();
    };


    var p = ControlPoint.prototype = Object.create(PIXI.Sprite.prototype);

    p.initialize = function (color) {
        this.color = color;
        this.size = 16;
        this.half = this.size / 2;
        this.globalAlpha = 1;
        this.interactive = true;
        this.buttonMode = true;
        this.defaultCursor = 'default';
        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
    };

    p.draw = function (type) {
        this.graphics.clear();
        this.graphics.beginFill(this.color, this.globalAlpha);
        this.graphics.drawRect(-this.half, -this.half, this.size, this.size);
        this.graphics.endFill();
    };

    usenamespace('editor.ui').ControlPoint = ControlPoint;
})();