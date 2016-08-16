/**
 * Created by Naver on 2016. 8. 16..
 */

(function () {
    'use strict';

    var ui = usenamespace('editor.ui');

    function TransformUI(rootLayer, stickerLayer) {
        PIXI.Container.call(this);
        this.rootLayer = rootLayer;
        this.stickerLayer= stickerLayer;

        this.initialize();
    };

    var p = TransformUI.prototype = Object.create(PIXI.Container.prototype);

    p.initialize = function () {
        this.offsetX = 0;
        this.offsetY = 0;
        this.screenScale = 1;
        this.transformMatrix = new PIXI.Matrix();

        this.g = new PIXI.Graphics();
        this.addChild(this.g);

        this.ro = new ui.ControlPoint(0x3333FF)
        this.tl = new ui.ControlPoint(0xFF3300);
        this.tc = new ui.ControlPoint(0xFF3300);
        this.tr = new ui.ControlPoint(0xFF3300);
        this.ml = new ui.ControlPoint(0xFF3300);
        this.mc = new ui.ControlPoint(0xFF3300);
        this.mr = new ui.ControlPoint(0xFF3300);
        this.bl = new ui.ControlPoint(0xFF3300);
        this.bc = new ui.ControlPoint(0xFF3300);
        this.br = new ui.ControlPoint(0xFF3300);

        this.ro.visible = false;
        this.tl.visible = false;
        this.tl.visible = false;
        this.tr.visible = false;
        this.ml.visible = false;
        this.mc.visible = false;
        this.mr.visible = false;
        this.bl.visible = false;
        this.bl.visible = false;
        this.br.visible = false;
        this.addChild(this.ro);
        this.addChild(this.tl);
        this.addChild(this.tc);
        this.addChild(this.tr);
        this.addChild(this.ml);
        this.addChild(this.mc);
        this.addChild(this.mr);
        this.addChild(this.bl);
        this.addChild(this.bc);
        this.addChild(this.br);

        this.addCornerDownEvent();
    };

    p.setObject = function (sticker) {
        this.sticker = sticker;

        console.log('**********************');
        console.log(this.sticker.worldTransform);
        console.log('**********************');
        this.ro.visible = false;
        this.tl.visible = true;
        this.tl.visible = true;
        this.tr.visible = true;
        this.ml.visible = true;
        this.mc.visible = true;
        this.mr.visible = true;
        this.bl.visible = true;
        this.bl.visible = true;
        this.br.visible = true;


        this.setAbsHandles();
        this.setRefHandles();
        this.updataHandleBoard();
    };


    p.addCornerDownEvent = function () {
        this._cornerDownListener = this.onCornerDown.bind(this);
        this.tl.on('mousedown', this._cornerDownListener);
        this.tc.on('mousedown', this._cornerDownListener);
        this.tr.on('mousedown', this._cornerDownListener);
        this.ml.on('mousedown', this._cornerDownListener);
        this.mc.on('mousedown', this._cornerDownListener);
        this.mr.on('mousedown', this._cornerDownListener);
        this.bl.on('mousedown', this._cornerDownListener);
        this.bc.on('mousedown', this._cornerDownListener);
        this.br.on('mousedown', this._cornerDownListener);
    };

    p.removeCornerDownEvent = function () {
        this.tl.off('mousedown', this._cornerDownListener);
        this.tc.off('mousedown', this._cornerDownListener);
        this.tr.off('mousedown', this._cornerDownListener);
        this.ml.off('mousedown', this._cornerDownListener);
        this.mc.off('mousedown', this._cornerDownListener);
        this.mr.off('mousedown', this._cornerDownListener);
        this.bl.off('mousedown', this._cornerDownListener);
        this.bc.off('mousedown', this._cornerDownListener);
        this.br.off('mousedown', this._cornerDownListener);
    };

    p.addCornerMoveEvent = function () {
        this._cornerUpListener = this.onCornerUp.bind(this);
        this._cornerMoveListener = this.onCornerMove.bind(this);

        window.document.addEventListener('mouseup', this._cornerUpListener);
        window.document.addEventListener('mousemove', this._cornerMoveListener);
    };

    p.removeCornerMoveEvent = function () {
        window.document.removeEventListener('mouseup', this._cornerUpListener);
        window.document.removeEventListener('mousemove', this._cornerMoveListener);
    };


    p.resizeControl = function (info) {
        var pivot;
        var target = info.target;
        var mouseX = info.mouseX;
        var mouseY = info.mouseY;

        switch (target) {
            case this.tl:
                pivot = this.br;
                break;
            case this.tc:
                pivot = this.bc;
                break;
            case this.tr:
                pivot = this.bl;
                break;
            case this.ml:
                pivot = this.mr;
                break;
            case this.mr:
                pivot = this.ml;
                break;
            case this.bl:
                pivot = this.tr;
                break;
            case this.bc:
                pivot = this.tc;
                break;
            case this.br:
                pivot = this.tl;
                break;
        }


        if (target !== this.ro) {
            target.x += info.dx;
            target.y += info.dy;
        }


    };


    p.updataHandleBoard = function () {

        var inversed = {};

        var uiPoints = this.absHandles;
        var imageWorldTransform = this.sticker.worldTransform.clone();


        for(var prop in uiPoints){
            inversed[prop] = imageWorldTransform.applyInverse(uiPoints[prop]);

            console.log('uiPoints[' + prop + ']:' + uiPoints[prop].x, uiPoints[prop].y);
            console.log('inversed[' + prop + ']:' + inversed[prop].x, inversed[prop].y);
        }
    };


    p.setAbsHandles = function () {
        var w = this.sticker._ob.width;
        var h = this.sticker._ob.height;

        var t = 0;
        var m = h / 2;
        var b = h;
        var l = 0;
        var c = w / 2;
        var r = w;

        this.absHandles = [
            new PIXI.Point(l, t),
            new PIXI.Point(r, t),
            new PIXI.Point(r, b),
            new PIXI.Point(l, b),
            new PIXI.Point(c, t),
            new PIXI.Point(r, m),
            new PIXI.Point(c, b),
            new PIXI.Point(l, m)
        ];
    };


    p.setRefHandles = function () {
        if (!this.refHandles)
            this.refHandles = new Array();

        this.refHandleMatrix = this.sticker.worldTransform.clone();
        this.refHandleMatrix.append(this.transformMatrix);

        this.iRefHandleMatrix = this.refHandleMatrix.clone();
        this.iRefHandleMatrix.invert();

        for (var i = 0; i < this.absHandles.length; i++) {
            this.refHandles[i] = this.refHandleMatrix.applyInverse(this.absHandles[i]);
            console.log('absHandles[' + i + ']:', this.absHandles[i]);
            console.log('refHandles[' + i + ']:', this.refHandles[i]);
        }
    };


    p.onCornerDown = function (e) {
        e.stopPropagation();

        this.selectedTarget = e.target;
        this.dragStartX = this.prevDragX = e.data.global.x;
        this.dragStartY = this.prevDragY = e.data.global.y;

        console.log('dragStartX:', this.dragStartX, 'dragStartY:', this.dragStartY);
        this.addCornerMoveEvent();
        this.removeCornerDownEvent();

        this.emit('controlMoveStart', {
            target: this.selectedTarget,
            dragStartX: this.dragStartX,
            dragStartY: this.dragStartY
        });
    };

    p.onCornerMove = function (e) {
        this.currentDragX = e.clientX - this.offsetX;
        this.currentDragY = e.clientY - this.offsetY;

        this.dx = this.currentDragX - this.prevDragX;
        this.dy = this.currentDragY - this.prevDragY;

        this.dx2 = this.dragStartX - this.currentDragX;
        this.dy2 = this.dragStartY - this.currentDragY;

        console.log('dx:', this.dx, 'dy:', this.dy, 'dx2:', this.dx2, 'dy2:', this.dy2);

        var info = {
            dx: this.dx,
            dy: this.dy,
            dx2: this.dx2,
            dy2: this.dy2,
            prevX: this.prevDragX,
            prevY: this.prevDragY,
            target: this.selectedTarget,
            mouseX: e.clientX - this.offsetX,
            mouseY: e.clientY - this.offsetY
        };

        this.emit('controlMove', info);

        this.prevDragX = this.currentDragX;
        this.prevDragY = this.currentDragY;

        this.resizeControl(info);
    };

    p.onCornerUp = function (e) {
        this.addCornerDownEvent();
        this.removeCornerMoveEvent();

        this.emit('controlMoveEnd', {
            target: this.selectedTarget
        });

        this.selectedTarget = null;
    };

    usenamespace('editor.ui').TransformUI = TransformUI;

})();