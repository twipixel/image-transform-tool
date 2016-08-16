(function () {
    'use strict';

    var utils = usenamespace('editor.utils');

    function DimedUI (width, height) {
        PIXI.Sprite.call(this);
        this.initialize(width, height);
    };

    var p = DimedUI.prototype = Object.create(PIXI.Sprite.prototype);

    p.initialize = function (width, height) {
        this.w = width;
        this.h = height;

        // 배경 여백이 0이면 이미지 테두리가 Dimed 되지 않는 경우가 있습니다.
        this.bgSpace = 0.5;
        this.drawSpace = 0.1;
        this.easingDuration = 6;
        this.dimedShowAlpha = 0.4;
        this.dimedHideAlpha = 0.82;

        if(!this.graphics) {
            this.graphics = new PIXI.Graphics();
            this.graphics.alpha = this.dimedShowAlpha;
            this.addChild(this.graphics);
        }
    };

    p.show = function () {
        cancelAnimFrame(this.displayAnimationId);

        this._tFrom = this.graphics.alpha;
        this._tTo = this.dimedShowAlpha;
        this._tCurt = this._tFrom;

        this.displayAnimationId =
            animationLoop(
                this.changeGridAlpha.bind(this), this.easingDuration, 'easeOutQuad',
                function progressHandler() {},
                function completeHandler() {
                    this.graphics.alpha = this._tTo;
                },
                this
            );
    };

    p.changeGridAlpha = function (easeDecimal, stepDecimal, currentStep) {
        this._tCurt = utils.Calc.getTweenValue(this._tFrom, this._tTo, easeDecimal);
        this.graphics.alpha = this._tCurt;
    };

    p.draw = function (imageBasedUIPoints, alpha) {
        alpha = utils.Func.getDefaultParameters(alpha, this.graphics.alpha);
        this._tFrom = alpha;
        this._tCurt = alpha;
        this.graphics.alpha = alpha;

        this.clear();
        this.validationCheck(imageBasedUIPoints);
        this.drawDimed(imageBasedUIPoints);
    };

    p.validationCheck = function (uiPoints) {
        for(var prop in uiPoints) {
            var point = uiPoints[prop];
            var x = point.x;
            var y = point.y;
            if(x < 0) x = 0;
            if(x > this.w) x = this.w;
            if(y < 0) y = 0;
            if(y > this.h) y = this.h;
            uiPoints[prop].x = x;
            uiPoints[prop].y = y;
        }
    };

    p.drawDimed = function (uiPoints) {
        var w = this.w;
        var h = this.h;
        var p = uiPoints;
        this.graphics.lineStyle(0, 0xFF3300, 0);
        this.graphics.beginFill(0x000000);
        this.graphics.moveTo(-this.bgSpace, -this.bgSpace);
        this.graphics.lineTo(w + this.bgSpace, -this.bgSpace);
        this.graphics.lineTo(w + this.bgSpace, h + this.bgSpace);
        this.graphics.lineTo(-this.bgSpace, h + this.bgSpace);
        this.graphics.lineTo(-this.bgSpace, -this.bgSpace);
        this.graphics.lineTo(p.tl.x, p.tl.y);
        this.graphics.lineTo(p.br.x, p.br.y);
        this.graphics.lineTo(p.bl.x, p.bl.y);
        this.graphics.lineTo(p.tr.x, p.tr.y);
        this.graphics.lineTo(p.tl.x, p.tl.y);
        //this.graphics.lineTo(p.lt.x - this.drawSpace, p.lt.y - this.drawSpace);
        //this.graphics.lineTo(p.lb.x - this.drawSpace, p.lb.y + this.drawSpace);
        //this.graphics.lineTo(p.rb.x + this.drawSpace, p.rb.y + this.drawSpace);
        //this.graphics.lineTo(p.rt.x + this.drawSpace, p.rt.y - this.drawSpace);
        //this.graphics.lineTo(p.lt.x - this.drawSpace, p.lt.y - this.drawSpace);
        this.graphics.endFill();
    };

    p.hide = function () {
        cancelAnimFrame(this.displayAnimationId);

        this._tFrom = this.graphics.alpha;
        this._tTo = this.dimedHideAlpha;
        this._tCurt = this._tFrom;

        this.displayAnimationId =
            animationLoop(
                this.changeGridAlpha.bind(this), this.easingDuration, 'easeOutQuad',
                function progressHandler() {},
                function completeHandler() {
                    this.graphics.alpha = this._tTo;
                },
                this
            );
    };

    p.clear = function () {
        this.graphics.clear();
    };


    usenamespace('editor.ui').DimedUI = DimedUI;
})();
