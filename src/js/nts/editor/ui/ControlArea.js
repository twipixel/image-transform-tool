(function () {
    'use strict';

    function ControlArea (type) {
        PIXI.Sprite.call(this);
        this.initialize(type);
        this.draw(type);
    };

    ControlArea.ROW = 'row';
    ControlArea.COL = 'col';
    ControlArea.CORNER = 'corner';

    var p = ControlArea.prototype = Object.create(PIXI.Sprite.prototype);

    p.initialize = function (type) {
        this.type = type;
        this.size = 32;
        this.half = this.size / 2;
        this.globalAlpha = 0.0;
        this.interactive = true;
        this.buttonMode = true;
        this.defaultCursor = 'default';
        this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
    };

    p.draw = function (type) {
        this.graphics.clear();

        switch (type) {
            case ControlArea.ROW:
                this.graphics.beginFill(0xFF3300, this.globalAlpha);
                this.graphics.drawRect(0, -this.half, 1, this.size);
                break;

            case ControlArea.COL:
                this.graphics.beginFill(0xFF3300, this.globalAlpha);
                this.graphics.drawRect(-this.half, 0, this.size, 1);
                break;

            case ControlArea.CORNER:
                this.graphics.beginFill(0x4285f4, this.globalAlpha);
                this.graphics.drawRect(-this.half, -this.half, this.size, this.size);
                break;
        }

        this.graphics.endFill();
    };

    usenamespace('editor.ui').ControlArea = ControlArea;
})();