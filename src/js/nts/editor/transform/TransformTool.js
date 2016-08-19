import {ToolControl} from './ToolControl';
import {ToolControlType} from './ToolControlType';
import {Cal} from './../utils/Calculator';

export class TransfromTool {
    constructor(canvas, options, rootLayer, stickerLayer) {

        this.canvas = canvas;
        this.options = options || {
                offsetX: 0,
                offsetY: 0
            };

        this.offsetX = this.options.offsetX;
        this.offsetY = this.options.offsetY;
        this.rootLayer = rootLayer;
        this.stickerLayer = stickerLayer;

        this.initialize();
        this.addDebug();
    };

    initialize() {
        console.log('TransformTool.initialize');
        this.matrix = new PIXI.Matrix();
        this.g = this.graphics = new PIXI.Graphics();
        this.rootLayer.addChild(this.graphics);

        var toolControlOptions = {
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            size: 10,
            alpha: 1,
            thickness: 1,
            color: 0xFFFFFF,
            defaultCursor: 'pointer'
        };

        var rotationOptions = {
            offsetX: this.offsetX,
            offsetY: this.offsetY,
            size: 10,
            alpha: 1,
            thickness: 1,
            color: 0xFF3300,
            defaultCursor: 'pointer'
        };

        this.c = this.controls = {
            cl: new ToolControl(ToolControlType.CLOSE, toolControlOptions),
            ro: new ToolControl(ToolControlType.ROTATION, rotationOptions),
            tl: new ToolControl(ToolControlType.TOP_LEFT, toolControlOptions),
            tc: new ToolControl(ToolControlType.TOP_CENTER, toolControlOptions),
            tr: new ToolControl(ToolControlType.TOP_RIGHT, toolControlOptions),
            ml: new ToolControl(ToolControlType.MIDDLE_LEFT, toolControlOptions),
            mc: new ToolControl(ToolControlType.MIDDLE_CENTER, toolControlOptions),
            mr: new ToolControl(ToolControlType.MIDDLE_RIGHT, toolControlOptions),
            bl: new ToolControl(ToolControlType.BOTTOM_LEFT, toolControlOptions),
            bc: new ToolControl(ToolControlType.BOTTOM_CENTER, toolControlOptions),
            br: new ToolControl(ToolControlType.BOTTOM_RIGHT, toolControlOptions)
        };

        this.selectedControl = null;

        //this._controlMoveStartListener = this.onControlMoveStart.bind(this);
        //this._controlMoveListener = this.onControlMove.bind(this);
        //this._controlMoveEndListener = this.onControlMoveEnd.bind(this);

        for(var prop in this.controls) {
            var control = this.controls[prop];
            control.visible = false;
            this.rootLayer.addChild(control);
            control.on(ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
            control.on(ToolControl.MOVE, this.onControlMove.bind(this));
            control.on(ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));
        }
    };

    addDebug() {
        window.document.addEventListener('keyup', this.onKeyUp.bind(this));
    }


    setTarget(pixiSprite) {
        console.log('setTarget(' + pixiSprite + ')');


        this.target = pixiSprite;
        this.matrix = this.target.worldTransform;


        this.pivot = new PIXI.Graphics();
        this.pivot.beginFill(0xFF3300);
        this.pivot.drawRect(0, 0, 10, 10);
        this.pivot.endFill();
        this.target.addChild(this.pivot);
        this.setPrevTopLeftPoint();


        var w = this.target.width;
        var h = this.target.height;

        this.c.tl.localPoint = new PIXI.Point(0, 0);
        this.c.tr.localPoint = new PIXI.Point(w, 0);
        this.c.tc.localPoint = Cal.interpolate(this.c.tr.localPoint, this.c.tl.localPoint, .5);

        this.c.bl.localPoint = new PIXI.Point(0, h);
        this.c.br.localPoint = new PIXI.Point(w, h);
        this.c.bc.localPoint = Cal.interpolate(this.c.br.localPoint, this.c.bl.localPoint, .5);

        this.c.ml.localPoint = Cal.interpolate(this.c.bl.localPoint, this.c.tl.localPoint, .5);
        this.c.mr.localPoint = Cal.interpolate(this.c.br.localPoint, this.c.tr.localPoint, .5);
        this.c.mc.localPoint = Cal.interpolate(this.c.bc.localPoint, this.c.tc.localPoint, .5);

        this.c.ro.localPoint = Cal.add(this.controls.tc.localPoint.clone(), new PIXI.Point(0, -25));




        /*console.log('1', this.target.anchor);
        this.target.anchor = {x:0.5, y:0.5};
        console.log('2', this.target.anchor);*/

        for (var prop in this.controls) {
            var c = this.controls[prop];
            c.matrix = this.matrix;
            c.centerPoint = this.c.mc.localPoint;
        }

        this.draw();
    };


    draw() {
        var g = this.g;
        g.clear();
        g.lineStyle(1, 0xFF3300);
        g.moveTo(this.c.tl.globalX, this.c.tl.globalY);
        g.lineTo(this.c.tr.globalX, this.c.tr.globalY);
        g.lineTo(this.c.br.globalX, this.c.br.globalY);
        g.lineTo(this.c.bl.globalX, this.c.bl.globalY);
        g.lineTo(this.c.tl.globalX, this.c.tl.globalY);
        g.moveTo(this.c.tc.globalX, this.c.tc.globalY);
        g.lineTo(this.c.ro.globalX, this.c.ro.globalY);

        for (var prop in this.controls) {
            var c = this.controls[prop];
            c.x = c.globalX;
            c.y = c.globalY;
            c.visible = true;
        }
    }


    getPivot(control) {
        console.dir(control);
        switch (control.type) {
            case ToolControlType.TOP_LEFT:
                return this.c.br;
            case ToolControlType.TOP_CENTER:
                return this.c.bc;
            case ToolControlType.TOP_RIGHT:
                return this.c.bl;
            case ToolControlType.MIDDLE_LEFT:
                return this.c.mr;
            case ToolControlType.MIDDLE_RIGHT:
                return this.c.ml;
            case ToolControlType.BOTTOM_LEFT:
                return this.c.tr;
            case ToolControlType.BOTTOM_CENTER:
                return this.c.tc;
            case ToolControlType.BOTTOM_RIGHT:
                return this.c.tl;
            case ToolControlType.MIDDLE_CENTER:
                return this.c.mc;
            case ToolControlType.ROTATION:
                return this.c.mc;
                break;
            case ToolControlType.CLOSE:
                return this.c.cl;
                break;
        }
    }


    transform(control, currentMousePoint) {
        switch (control.type) {
            case ToolControlType.TOP_LEFT:
            case ToolControlType.TOP_RIGHT:
            case ToolControlType.MIDDLE_LEFT:
            case ToolControlType.MIDDLE_RIGHT:
            case ToolControlType.BOTTOM_LEFT:
            case ToolControlType.BOTTOM_RIGHT:
                this.cornerScale(control, currentMousePoint);
                break;

            case ToolControlType.TOP_CENTER:
                break;
            case ToolControlType.BOTTOM_CENTER:
                break;

            case ToolControlType.MIDDLE_CENTER:
                break;
            case ToolControlType.ROTATION:
                this.rotation(control, currentMousePoint);
                break;
                break;
            case ToolControlType.CLOSE:
                break;
                break;
        }
    }

    setPivot(control) {
        console.log('setPivot(' + control + ')');
        this.pivotControl = this.getPivot(control);

        var newPivot = this.pivotControl.localPoint;
        var offsetX = newPivot.x - this.prevTopLeftX;
        var offsetY = newPivot.y - this.prevTopLeftY;

        console.log('offsetX', offsetX, 'offsetY', offsetY);
        this.target.pivot = this.pivotControl.localPoint;
        this.target.x = this.target.x + offsetX;
        this.target.y = this.target.y + offsetY;

        this.setPrevTopLeftPoint();
    }

    setPrevTopLeftPoint() {
        //var tl = this.target.toLocal(this.pivot);
        //this.prevTopLeftX = tl.x;
        //this.prevTopLeftY = tl.y;

        this.prevTopLeftX = this.target.pivot.x;
        this.prevTopLeftY = this.target.pivot.y;
        console.log('prevTopLeftX:', this.prevTopLeftX, 'prevTopLeftY:', this.prevTopLeftY, this.target.pivot.x, this.target.pivot.y);
    }

    cornerScale(control, currentMousePoint) {
        var xscale = (this.pivotControl.globalX - currentMousePoint.x) / (this.pivotControl.globalX - this.startPoint.x);
        var yscale = (this.pivotControl.globalY - currentMousePoint.y) / (this.pivotControl.globalY - this.startPoint.y);

        var uAngle = Cal.calcAngle(this.c.tl.toGlobal(this.c.tl.localPoint), this.c.tl.toGlobal(this.c.tr.localPoint));
        var vAngle = Cal.calcAngle(this.c.tl.toGlobal(this.c.tl.localPoint), this.c.tl.toGlobal(this.c.bl.localPoint));
        var skewAngle = uAngle - vAngle + Math.PI / 2;

        this.target.scale.x = xscale;
        this.target.scale.y = yscale;

        //return mtf.absScaleAroundPoint(pivot, scale, scale, uAngle, vAngle);

        //this.target.worldTransform.translate(-this.pivotControl.globalX, -this.pivotControl.globalY);
        //this.target.worldTransform.rotate(-uAngle);
        //this.target.worldTransform.scale(xscale, yscale);
        //this.target.worldTransform.rotate(uAngle);
        //this.target.worldTransform.translate(this.pivotControl.globalX, this.pivotControl.globalY);


        //var localMousePoint = this.target.toLocal(currentMousePoint);
        //var diff = Cal.subtract(localMousePoint, control.localPoint);
        //
        //var wh = Cal.subtract(control.localPoint, control.centerPoint);
        //var w =  wh.x  * 2;
        //var h =  wh.y  * 2;
        //var wr = (diff.x / w);
        //var hr = (diff.y / h);
        //var scalex, scaley;
        //var n = 1;
        //scalex = 1 + (n * wr);
        //scaley = 1 + (n * hr);
        //
        //console.log('wh:', wh, 'w:', w, 'h:', h, 'wr:', wr, 'hr:', hr, 'n:', n, 'scalex:', scalex, 'scaley:', scaley);
        //
        //this.target.scale.x = scalex;
        //this.target.scale.y = scaley;
        //this.target.x = diff.x;
        //this.target.y = diff.y;

        //this.target.updateTransform();
        //this.target.scale.x = scalex;
        //this.target.scale.y = scaley;
    }

    rotation(control, currentMousePoint) {
        var angle = Cal.calcAngle(this.startPoint, this.pivotControl.toGlobal(this.pivotControl.localPoint), currentMousePoint);
        this.target.rotation = angle;
        console.log('angle:', angle);
    }


    onControlMoveStart(e) {
        this.startPoint = e.currentMousePoint;
        this.setPivot(e.target);
        console.log('startPoint:', this.startPoint);
    }

    onControlMove(e) {
        var currentMousePoint = e.currentMousePoint;
        this.change = e.change;
        //console.log('change:', this.change);

        this.transform(e.target, currentMousePoint);
        this.draw();

        //this.setPrevTopLeftPoint();
    }

    onControlMoveEnd(e) {
        console.log('MoveEnd');

        //this.setPrevTopLeftPoint();
    }





    onKeyUp(e) {
        switch (e.keyCode) {
            case 27: //consts.KeyCode.ESC:
                break;
            case 32: //consts.KeyCode.SPACE:
                break;

            case 49: //consts.KeyCode.NUM_1:
                break;
            case 50: //consts.KeyCode.NUM_2:
                break;
            case 51: //consts.KeyCode.NUM_3:
                break;
            case 52: //consts.KeyCode.NUM_4:
                break;
            case 53: //consts.KeyCode.NUM_5:
                break;
            case 54: //consts.KeyCode.NUM_6:
                break;
        }
    };


}
