import {Mouse} from './../utils/Mouse';
import {Calc} from './../utils/Calculator';
import {PointUtil} from './../utils/PointUtil';
import {ToolControl} from './ToolControl';
import {ToolControlType} from './ToolControlType';
import {VectorContainer} from './../ui/VectorContainer';


export class TransfromTool {

    static get TRANSFORM_COMPLETE() {
        return 'transformComplete';
    }

    constructor(rootLayer, stickerLayer, options) {
        this.rootLayer = rootLayer;
        this.stickerLayer = stickerLayer;

        this.options = options || {
                scaleOffsetX: 0,
                scaleOffsetY: 0,
                canvasOffsetX: 0,
                canvasOffsetY: 0,
                deleteButtonOffsetY: 20,
                rotationLineLength: 25
            };

        // stickerLayer의 스케일이 1이 아닐 경우 그 차이값 (this.stickerLayer.scale.x - 1)
        this.scaleOffsetX = this.options.scaleOffsetX;
        this.scaleOffsetY = this.options.scaleOffsetY;
        this.canvasOffsetX = this.options.canvasOffsetX;
        this.canvasOffsetY = this.options.canvasOffsetY;
        this.rotationLineLength = this.options.rotationLineLength || 25;
        this.deleteButtonOffsetY = this.options.deleteButtonOffsetY || 20;

        this.initialize();
    };


    initialize() {
        this.transform = new PIXI.Matrix();
        this.invertTransform = new PIXI.Matrix();

        this.g = this.graphics = new PIXI.Graphics();
        this.rootLayer.addChild(this.graphics);

        this.target = null;
        this._targetTextureUpdateListener = null;


        var deleteButtonOptions = {
            size: 10,
            alpha: 1,
            thickness: 1,
            color: 0xFFFFFF,
            defaultCursor: 'pointer',
            canvasOffsetX: this.canvasOffsetX,
            canvasOffsetY: this.canvasOffsetY
        };

        var rotationOptions = {
            size: 10,
            alpha: 1,
            thickness: 1,
            color: 0xFF3300,
            defaultCursor: 'pointer',
            canvasOffsetX: this.canvasOffsetX,
            canvasOffsetY: this.canvasOffsetY
        };

        var controlOptions = {
            size: 10,
            alpha: 1,
            thickness: 1,
            color: 0xFFFFFF,
            defaultCursor: 'pointer',
            canvasOffsetX: this.canvasOffsetX,
            canvasOffsetY: this.canvasOffsetY
        };



        this.c = this.controls = {
            de: new ToolControl(ToolControlType.DELETE, deleteButtonOptions),
            ro: new ToolControl(ToolControlType.ROTATION, rotationOptions),
            tl: new ToolControl(ToolControlType.TOP_LEFT, controlOptions),
            tc: new ToolControl(ToolControlType.TOP_CENTER, controlOptions),
            tr: new ToolControl(ToolControlType.TOP_RIGHT, controlOptions),
            ml: new ToolControl(ToolControlType.MIDDLE_LEFT, controlOptions),
            mr: new ToolControl(ToolControlType.MIDDLE_RIGHT, controlOptions),
            bl: new ToolControl(ToolControlType.BOTTOM_LEFT, controlOptions),
            bc: new ToolControl(ToolControlType.BOTTOM_CENTER, controlOptions),
            br: new ToolControl(ToolControlType.BOTTOM_RIGHT, controlOptions),
            mc: new ToolControl(ToolControlType.MIDDLE_CENTER, controlOptions)
        };

        // 맨 아래에 위치시킵니다.
        this.rootLayer.addChild(this.c.mc);
        this.c.mc.on(ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
        this.c.mc.on(ToolControl.MOVE, this.onControlMove.bind(this));
        this.c.mc.on(ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.visible = false;
            control.centerPoint = this.controls.mc;

            switch (control.type) {
                case ToolControlType.DELETE:
                    this.rootLayer.addChild(control);
                    control.on('click', this.onDelete.bind(this));
                    break;

                case ToolControlType.ROTATION:
                    this.rootLayer.addChild(control);
                    control.on(ToolControl.ROTATE_START, this.onRotateStart.bind(this));
                    control.on(ToolControl.ROTATE, this.onRotate.bind(this));
                    control.on(ToolControl.ROTATE_END, this.onRotateEnd.bind(this));
                    break;

                case ToolControlType.TOP_LEFT:
                case ToolControlType.TOP_RIGHT:
                case ToolControlType.TOP_CENTER:
                case ToolControlType.MIDDLE_LEFT:
                case ToolControlType.MIDDLE_RIGHT:
                case ToolControlType.BOTTOM_LEFT:
                case ToolControlType.BOTTOM_RIGHT:
                case ToolControlType.BOTTOM_CENTER:
                    this.rootLayer.addChild(control);
                    control.on(ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
                    control.on(ToolControl.MOVE, this.onControlMove.bind(this));
                    control.on(ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));
                    break;
            }
        }
    };


    setTarget(pixiSprite) {
        // TODO 테스트 코드
        window.target = window.t = pixiSprite;

        this.target = pixiSprite;
        this.removeTextureUpdateEvent();
        this.addTextureUpdateEvent();

        //현재는 scale 후 스케일로 1로 강제 조정하기 때문에 diffScale의 차이가 없습니다.
        this._diffScaleX = 0;
        this._diffScaleY = 0;
        //타겟의 스케일이 1로 변하지 않았을 때는 차이 값을 저장했다가 변형 시 반영해야 합니다.
        //this._diffScaleX = this.target.scale.x - 1;
        //this._diffScaleY = this.target.scale.y - 1;

        this.update();
        this.c.mc.drawCenter(this.c.tl.globalPoints, this.c.tr, this.c.globalPoints, this.c.br.globalPoints, this.c.bl.globalPoints);
    };


    releaseTarget() {
        if(this.target === null)
            return;

        if(this._targetTextureUpdateListener !== null) {
            this.target.off(VectorContainer.TEXTURE_UPDATE, this._targetTextureUpdateListener);
        }

        this.target = null;
        this._targetTextureUpdateListener = null;
    }


    addTextureUpdateEvent() {
        this._targetTextureUpdateListener = this.onTextureUpdate.bind(this);
        this.target.on(VectorContainer.TEXTURE_UPDATE, this._targetTextureUpdateListener);
    }


    removeTextureUpdateEvent() {
        if(this._targetTextureUpdateListener !== null) {
            this.target.off(VectorContainer.TEXTURE_UPDATE, this._targetTextureUpdateListener);
        }
    }


    update() {
        this.setControls();
        this.updateTransform();
        this.draw();
        this.updatePrevTargetLt();
    }


    setControls() {
        var localBounds = this.target.getLocalBounds();
        var w = localBounds.width;
        var h = localBounds.height;
        this.c.tl.localPoint = new PIXI.Point(0, 0);
        this.c.tr.localPoint = new PIXI.Point(w, 0);
        this.c.tc.localPoint = PointUtil.interpolate(this.c.tr.localPoint, this.c.tl.localPoint, .5);
        this.c.bl.localPoint = new PIXI.Point(0, h);
        this.c.br.localPoint = new PIXI.Point(w, h);
        this.c.bc.localPoint = PointUtil.interpolate(this.c.br.localPoint, this.c.bl.localPoint, .5);
        this.c.ml.localPoint = PointUtil.interpolate(this.c.bl.localPoint, this.c.tl.localPoint, .5);
        this.c.mr.localPoint = PointUtil.interpolate(this.c.br.localPoint, this.c.tr.localPoint, .5);
        this.c.mc.localPoint = PointUtil.interpolate(this.c.bc.localPoint, this.c.tc.localPoint, .5);
        this.c.de.localPoint = PointUtil.add(this.c.tl.localPoint.clone(), new PIXI.Point(0, this.deleteButtonOffsetY));
        this.c.ro.localPoint = PointUtil.add(this.c.tc.localPoint.clone(), new PIXI.Point(0, this.rotationLineLength));

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.transform = this.transform;
        }
    }


    updateTransform() {
        this.transform = this.target.worldTransform.clone();
        this.invertTransform = this.transform.clone();
        this.invertTransform.invert();

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.transform = this.transform;
        }
    }


    updatePrevTargetLt() {
        this.prevLtX = this.lt.x;
        this.prevLtY = this.lt.y;
    }


    scale(e) {
        var currentControl = e.target;
        var currentMousePoint = e.currentMousePoint;

        var n = 1;
        var currentPoint = this.invertTransform.apply(currentMousePoint);
        var startPoint = this.invertTransform.apply(this.startMousePoint);
        var vector = PointUtil.subtract(currentPoint, startPoint);

        var currentControl = this.invertTransform.apply(currentControl.globalPoint);
        var centerPoint = this.invertTransform.apply(this.c.mc.globalPoint);
        var wh = PointUtil.subtract(currentControl, centerPoint);

        var w = wh.x * 2;
        var h = wh.y * 2;
        var ratioW = (vector.x / w) * this.xScaleSign;
        var ratioH = (vector.y / h) * this.yScaleSign;
        var scaleX = 1 + (n * ratioW);
        var scaleY = 1 + (n * ratioH);
        this.target.scale = {x: scaleX + this._diffScaleX, y: scaleY + this._diffScaleY};
    }


    move(e) {
        var change = e.changeMovement;
        this.target.x += change.x;
        this.target.y += change.y;
    }


    doTransform(e) {
        var control = e.target;
        switch (control.type) {
            case ToolControlType.TOP_LEFT:
            case ToolControlType.TOP_RIGHT:
            case ToolControlType.BOTTOM_LEFT:
            case ToolControlType.BOTTOM_RIGHT:
                this.scale(e);
                break;

            case ToolControlType.MIDDLE_LEFT:
            case ToolControlType.MIDDLE_RIGHT:
            case ToolControlType.TOP_CENTER:
            case ToolControlType.BOTTOM_CENTER:
                break;

            case ToolControlType.MIDDLE_CENTER:
                this.move(e);
                break;
        }
    }


    draw() {
        var g = this.g;
        var transform = this.target.worldTransform.clone();
        var globalPoints = {
            de: this.deleteButtonPosition,
            ro: this.rotateControlPosition,
            tl: transform.apply(this.c.tl.localPoint),
            tr: transform.apply(this.c.tr.localPoint),
            tc: transform.apply(this.c.tc.localPoint),
            bl: transform.apply(this.c.bl.localPoint),
            br: transform.apply(this.c.br.localPoint),
            bc: transform.apply(this.c.bc.localPoint),
            ml: transform.apply(this.c.ml.localPoint),
            mr: transform.apply(this.c.mr.localPoint),
            mc: transform.apply(this.c.mc.localPoint)
        };

        g.clear();
        g.lineStyle(1, 0xFF3300);
        g.moveTo(globalPoints.tl.x, globalPoints.tl.y);
        g.lineTo(globalPoints.tr.x, globalPoints.tr.y);
        g.lineTo(globalPoints.br.x, globalPoints.br.y);
        g.lineTo(globalPoints.bl.x, globalPoints.bl.y);
        g.lineTo(globalPoints.tl.x, globalPoints.tl.y);
        g.moveTo(globalPoints.tc.x, globalPoints.tc.y);
        g.lineTo(globalPoints.ro.x, globalPoints.ro.y);

        for (var prop in this.controls) {
            var p = globalPoints[prop];
            var c = this.controls[prop];
            c.x = p.x;
            c.y = p.y;
            console.log(prop + ', xy[' + this.c[prop].x + ', ' + this.c[prop].y + '], p[' + p.x + ', ' + p.y + ']');
            c.visible = true;
        }
    }


    setPivotByLocalPoint(localPoint) {
        this.target.pivot = localPoint;
        var offsetX = this.lt.x - this.prevLtX;
        var offsetY = this.lt.y - this.prevLtY;
        // stickerLayer 의 스케일 포함한 offset 결과값
        var targetScaleOffsetX = (this.scaleOffsetX * 100) / 100 * offsetX;
        var targetScaleOffsetY = (this.scaleOffsetY * 100) / 100 * offsetY;
        this.target.x = this.target.x - offsetX + targetScaleOffsetX;
        this.target.y = this.target.y - offsetY + targetScaleOffsetY;
        this.updatePrevTargetLt();
    }


    setPivotByControl(control) {
        this.pivot = this.getPivot(control);
        this.target.pivot = this.pivot.localPoint;
        var offsetX = this.lt.x - this.prevLtX;
        var offsetY = this.lt.y - this.prevLtY;
        // stickerLayer 의 스케일 포함한 offset 결과값
        var targetScaleOffsetX = (this.scaleOffsetX * 100) / 100 * offsetX;
        var targetScaleOffsetY = (this.scaleOffsetY * 100) / 100 * offsetY;
        this.target.x = this.target.x - offsetX + targetScaleOffsetX;
        this.target.y = this.target.y - offsetY + targetScaleOffsetY;
        this.updatePrevTargetLt();
    }


    getPivot(control) {
        switch (control.type) {
            case ToolControlType.DELETE:
                return this.c.de;
            case ToolControlType.ROTATION:
                return this.c.mc;
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
        }
    }


    onDelete(e) {
        console.log('Delete Click');
    }


    onRotateStart(e) {
        this.setPivotByControl(e.target);
    }


    onRotate(e) {
        this.target.rotation += e.changeRadian;

        this.draw();
        this.updatePrevTargetLt();
    }


    onRotateEnd(e) {
        this.update();
    }


    onControlMoveStart(e) {
        this.xScaleSign = (this.target.scale.x < 0) ? -1 : 1;
        this.yScaleSign = (this.target.scale.y < 0) ? -1 : 1;
        this.startMousePoint = {x: e.currentMousePoint.x, y: e.currentMousePoint.y};

        this.setPivotByControl(e.target);
        this.updatePrevTargetLt();
    }


    onControlMove(e) {
        this.doTransform(e);
        this.draw();
        this.updatePrevTargetLt();
    }


    onControlMoveEnd(e) {
        this.target.emit(TransfromTool.TRANSFORM_COMPLETE);
    }


    onTextureUpdate(e) {
        this.setPivotByLocalPoint({x:0, y:0});
        this.update();
    }





    get lt() {
        return this.target.toGlobal({x: 0, y: 0});
    }

    get deleteButtonPosition() {
        if(!this.c)
            return new PIXI.Point(0, 0);

        var transform = this.target.worldTransform.clone();
        var tl = transform.apply(this.c.tl.localPoint);
        var ml = transform.apply(this.c.ml.localPoint);
        return PointUtil.getAddedInterpolate(tl, ml, this.deleteButtonOffsetY);
    }

    get rotateControlPosition() {
        if(!this.c)
            return new PIXI.Point(0, 0);

        var transform = this.target.worldTransform.clone();
        var tc = transform.apply(this.c.tc.localPoint);
        var ro = transform.apply(this.c.ro.localPoint);
        return PointUtil.getAddedInterpolate(tc, ro, this.rotationLineLength);
    }




}
