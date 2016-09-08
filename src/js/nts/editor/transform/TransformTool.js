import {Mouse} from './../utils/Mouse';
import {Calc} from './../utils/Calculator';
import {PointUtil} from './../utils/PointUtil';
import {ToolControl} from './ToolControl';
import {ToolControlType} from './ToolControlType';
import {RotationControlType} from './RotationControlType';
import {VectorContainer} from './../view/VectorContainer';


export class TransformTool {

    static get DELETE() {
        return 'delete';
    }

    static get SET_TARGET() { 
        return 'setTarget'; 
    }

    static get TRANSFORM_COMPLETE() {
        return 'transformComplete';
    }


    constructor(stageLayer, targetLayer, options) {
        this.stageLayer = stageLayer;
        this.targetLayer = targetLayer;

        this.options = options || {
                canvasOffsetX: 0,
                canvasOffsetY: 0,
                deleteButtonOffsetY: 0,
                //rotationLineLength: 25
            };

        this.deleteButtonSize = 28;
        this.canvasOffsetX = this.options.canvasOffsetX;
        this.canvasOffsetY = this.options.canvasOffsetY;
        this.deleteButtonOffsetY = this.options.deleteButtonOffsetY || 0;
        //this.rotationLineLength = this.options.rotationLineLength || 25;

        this.initialize();
        this.addEvent();
    };


    initialize() {
        this.transform = new PIXI.Matrix();
        this.invertTransform = new PIXI.Matrix();

        this.g = this.graphics = new PIXI.Graphics();
        this.stageLayer.addChild(this.graphics);

        this.target = null;
        this._targetTextureUpdateListener = null;


        var deleteButtonOptions = {
            canvasOffsetX: this.canvasOffsetX,
            canvasOffsetY: this.canvasOffsetY
        };

        var rotationOptions = {
            canvasOffsetX: this.canvasOffsetX,
            canvasOffsetY: this.canvasOffsetY
        };

        var controlOptions = {
            canvasOffsetX: this.canvasOffsetX,
            canvasOffsetY: this.canvasOffsetY
        };

        this.c = this.controls = {
            de: new ToolControl(ToolControlType.DELETE, deleteButtonOptions),
            tl: new ToolControl(ToolControlType.TOP_LEFT, controlOptions),
            tc: new ToolControl(ToolControlType.TOP_CENTER, controlOptions),
            tr: new ToolControl(ToolControlType.TOP_RIGHT, controlOptions),
            ml: new ToolControl(ToolControlType.MIDDLE_LEFT, controlOptions),
            mr: new ToolControl(ToolControlType.MIDDLE_RIGHT, controlOptions),
            bl: new ToolControl(ToolControlType.BOTTOM_LEFT, controlOptions),
            bc: new ToolControl(ToolControlType.BOTTOM_CENTER, controlOptions),
            br: new ToolControl(ToolControlType.BOTTOM_RIGHT, controlOptions),
            mc: new ToolControl(ToolControlType.MIDDLE_CENTER, controlOptions),
            rde: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.DELETE),
            rtl: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.TOP_LEFT),
            rtc: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.TOP_CENTER),
            rtr: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.TOP_RIGHT),
            rml: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.MIDDLE_LEFT),
            rmr: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.MIDDLE_RIGHT),
            rbl: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.BOTTOM_LEFT),
            rbc: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.BOTTOM_CENTER),
            rbr: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.BOTTOM_RIGHT)
        };

        // 맨 아래에 위치시킵니다.
        this.stageLayer.addChild(this.c.mc);
        this.c.mc.on(ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
        this.c.mc.on(ToolControl.MOVE, this.onControlMove.bind(this));
        this.c.mc.on(ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));

        this.stageLayer.addChild(this.c.rde);
        this.stageLayer.addChild(this.c.rtl);
        this.stageLayer.addChild(this.c.rtc);
        this.stageLayer.addChild(this.c.rtr);
        this.stageLayer.addChild(this.c.rml);
        this.stageLayer.addChild(this.c.rmr);
        this.stageLayer.addChild(this.c.rbl);
        this.stageLayer.addChild(this.c.rbc);
        this.stageLayer.addChild(this.c.rbr);

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.visible = false;
            control.centerPoint = this.controls.mc;

            switch (control.type) {
                case ToolControlType.DELETE:
                    this.stageLayer.addChild(control);
                    control.on('click', this.onDelete.bind(this));
                    break;

                case ToolControlType.ROTATION:
                    //this.stageLayer.addChild(control);
                    control.on(ToolControl.ROTATE_START, this.onRotateStart.bind(this));
                    control.on(ToolControl.ROTATE, this.onRotate.bind(this));
                    control.on(ToolControl.ROTATE_END, this.onRotateEnd.bind(this));
                    control.on(ToolControl.CHANGE_ROTATION_CURSOR, this.onChangeRotationCursor.bind(this));
                    break;

                case ToolControlType.TOP_LEFT:
                case ToolControlType.TOP_RIGHT:
                case ToolControlType.TOP_CENTER:
                case ToolControlType.MIDDLE_LEFT:
                case ToolControlType.MIDDLE_RIGHT:
                case ToolControlType.BOTTOM_LEFT:
                case ToolControlType.BOTTOM_RIGHT:
                case ToolControlType.BOTTOM_CENTER:
                    this.stageLayer.addChild(control);
                    control.on(ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
                    control.on(ToolControl.MOVE, this.onControlMove.bind(this));
                    control.on(ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));
                    break;
            }
        }
    };


    addEvent() {
        this.stageLayer.on(TransformTool.SET_TARGET, this.onSetTarget.bind(this));
        window.document.addEventListener('mouseup', this.onMouseUp.bind(this));
        if (!this.stageLayer.eventTargets){
            this.stageLayer.eventTargets = [];
        }
        this.downCnt = 0;
    }

    onMouseUp(e){
        this.downCnt--;
        if (this.downCnt < 0){
            this.releaseTarget();
        }
        this.downCnt = 0;
    }


    show() {
        if (!this.controls) return;
        this.g.visible = true;
        for (var prop in this.controls)
            this.controls[prop].visible = true;
    }


    hide() {
        if (!this.controls) return;
        this.g.visible = false;
        for (var prop in this.controls)
            this.controls[prop].visible = false;
    }


    setTarget(e) {
        var pixiSprite = e.target;
        // TODO 테스트 코드
        window.target = window.t = pixiSprite;

        this.target = pixiSprite;
        this.removeTextureUpdateEvent();
        this.addTextureUpdateEvent();

        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
        this.c.mc.emit('mousedown', e);

        this.stageLayer.emit(TransformTool.SET_TARGET, pixiSprite);
    };


    releaseTarget() {
        this.hide();
        this.removeTextureUpdateEvent();
        this.target = null;
        this._targetTextureUpdateListener = null;
    }


    addTextureUpdateEvent() {
        this._targetTextureUpdateListener = this.onTextureUpdate.bind(this);
        this.target.on(VectorContainer.TEXTURE_UPDATE, this._targetTextureUpdateListener);
    }


    removeTextureUpdateEvent() {
        if (this._targetTextureUpdateListener !== null && this.target !== null) {
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
        var scaleSignX = this.target.scaleSignX;
        var scaleSignY = this.target.scaleSignY;
        var localBounds = this.target.getLocalBounds();
        var w = localBounds.width * scaleSignX;
        var h = localBounds.height * scaleSignY;
        var deleteButtonOffsetY = this.deleteButtonOffsetY * scaleSignY;
        //var rotationLineLength = this.rotationLineLength * scaleSignY;

        this.c.tl.localPoint = new PIXI.Point(0, 0);
        this.c.tr.localPoint = new PIXI.Point(w, 0);
        this.c.tc.localPoint = PointUtil.interpolate(this.c.tr.localPoint, this.c.tl.localPoint, .5);
        this.c.bl.localPoint = new PIXI.Point(0, h);
        this.c.br.localPoint = new PIXI.Point(w, h);
        this.c.bc.localPoint = PointUtil.interpolate(this.c.br.localPoint, this.c.bl.localPoint, .5);
        this.c.ml.localPoint = PointUtil.interpolate(this.c.bl.localPoint, this.c.tl.localPoint, .5);
        this.c.mr.localPoint = PointUtil.interpolate(this.c.br.localPoint, this.c.tr.localPoint, .5);
        this.c.mc.localPoint = PointUtil.interpolate(this.c.bc.localPoint, this.c.tc.localPoint, .5);
        this.c.de.localPoint = PointUtil.add(this.c.tl.localPoint.clone(), new PIXI.Point(0, deleteButtonOffsetY));
        //this.c.ro.localPoint = PointUtil.add(this.c.tc.localPoint.clone(), new PIXI.Point(0, rotationLineLength));

        var c = this.c;
        this.c.rde.localPoint = new PIXI.Point(c.de.localPoint.x, c.de.localPoint.y);
        this.c.rtl.localPoint = new PIXI.Point(c.tl.localPoint.x, c.tl.localPoint.y);
        this.c.rtc.localPoint = new PIXI.Point(c.tc.localPoint.x, c.tc.localPoint.y);
        this.c.rtr.localPoint = new PIXI.Point(c.tr.localPoint.x, c.tr.localPoint.y);
        this.c.rml.localPoint = new PIXI.Point(c.ml.localPoint.x, c.ml.localPoint.y);
        this.c.rmr.localPoint = new PIXI.Point(c.mr.localPoint.x, c.mr.localPoint.y);
        this.c.rbl.localPoint = new PIXI.Point(c.bl.localPoint.x, c.bl.localPoint.y);
        this.c.rbc.localPoint = new PIXI.Point(c.bc.localPoint.x, c.bc.localPoint.y);
        this.c.rbr.localPoint = new PIXI.Point(c.br.localPoint.x, c.br.localPoint.y);

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


    scaleCorner(e) {
        var currentControl = e.target;
        var currentMousePoint = e.currentMousePoint;

        var currentPoint = this.invertTransform.apply(currentMousePoint);
        var startPoint = this.invertTransform.apply(this.startMousePoint);
        var vector = PointUtil.subtract(currentPoint, startPoint);

        var currentControl = this.invertTransform.apply(currentControl.globalPoint);
        var centerPoint = this.invertTransform.apply(this.c.mc.globalPoint);
        var wh = PointUtil.subtract(currentControl, centerPoint);

        var w = wh.x * 2;
        var h = wh.y * 2;
        var scaleX = 1 + (vector.x / w);
        var scaleY = 1 + (vector.y / h);

        var abs_scalex = Math.abs(scaleX);
        var abs_scaley = Math.abs(scaleY);

        var op_scalex = scaleX > 0 ? 1 : -1;
        var op_scaley = scaleY > 0 ? 1 : -1;

        if (abs_scalex > abs_scaley)
            scaleY = abs_scalex * op_scaley;
        else
            scaleX = abs_scaley * op_scalex;

        this.target.scale = {x: scaleX, y: scaleY};
    }


    scaleMiddle(e, isScaleHorizontal = true) {
        var currentControl = e.target;
        var currentMousePoint = e.currentMousePoint;

        var scaleX = 1;
        var scaleY = 1;

        var currentPoint = this.invertTransform.apply(currentMousePoint);
        var startPoint = this.invertTransform.apply(this.startMousePoint);
        var vector = PointUtil.subtract(currentPoint, startPoint);

        var currentControl = this.invertTransform.apply(currentControl.globalPoint);
        var centerPoint = this.invertTransform.apply(this.c.mc.globalPoint);
        var wh = PointUtil.subtract(currentControl, centerPoint);

        var w = wh.x * 2;
        var h = wh.y * 2;

        if (isScaleHorizontal)
            scaleX = 1 + (vector.x / w);
        else
            scaleY = 1 + (vector.y / h);

        this.target.scale = {x: scaleX, y: scaleY};
    }


    move(e) {
        var change = e.changeMovement;
        this.target.x += change.x / this.diffScaleX;
        this.target.y += change.y / this.diffScaleY;
    }


    doTransform(e) {
        var control = e.target;
        switch (control.type) {
            case ToolControlType.TOP_LEFT:
            case ToolControlType.TOP_RIGHT:
            case ToolControlType.BOTTOM_LEFT:
            case ToolControlType.BOTTOM_RIGHT:
                this.scaleCorner(e);
                break;

            case ToolControlType.MIDDLE_LEFT:
            case ToolControlType.MIDDLE_RIGHT:
                this.scaleMiddle(e, true);
                break;

            case ToolControlType.TOP_CENTER:
            case ToolControlType.BOTTOM_CENTER:
                this.scaleMiddle(e, false);
                break;

            case ToolControlType.MIDDLE_CENTER:
                this.move(e);
                break;
        }
    }


    draw() {
        var g = this.g;
        g.visible = true;
        var transform = this.target.worldTransform.clone();
        var globalPoints = {
            de: this.deleteButtonPosition,
            //ro: this.rotateControlPosition,
            tl: transform.apply(this.c.tl.localPoint),
            tr: transform.apply(this.c.tr.localPoint),
            tc: transform.apply(this.c.tc.localPoint),
            bl: transform.apply(this.c.bl.localPoint),
            br: transform.apply(this.c.br.localPoint),
            bc: transform.apply(this.c.bc.localPoint),
            ml: transform.apply(this.c.ml.localPoint),
            mr: transform.apply(this.c.mr.localPoint),
            mc: transform.apply(this.c.mc.localPoint),
            rde: this.deleteButtonPosition,
            rtl: transform.apply(this.c.rtl.localPoint),
            rtc: transform.apply(this.c.rtc.localPoint),
            rtr: transform.apply(this.c.rtr.localPoint),
            rml: transform.apply(this.c.rml.localPoint),
            rmr: transform.apply(this.c.rmr.localPoint),
            rbl: transform.apply(this.c.rbl.localPoint),
            rbc: transform.apply(this.c.rbc.localPoint),
            rbr: transform.apply(this.c.rbr.localPoint),
        };

        g.clear();
        g.lineStyle(0.5, 0xFFFFFF);
        g.moveTo(globalPoints.tl.x, globalPoints.tl.y);
        g.lineTo(globalPoints.tr.x, globalPoints.tr.y);
        g.lineTo(globalPoints.br.x, globalPoints.br.y);
        g.lineTo(globalPoints.bl.x, globalPoints.bl.y);
        g.lineTo(globalPoints.tl.x, globalPoints.tl.y);
        g.moveTo(globalPoints.tc.x, globalPoints.tc.y);
        //g.lineTo(globalPoints.ro.x, globalPoints.ro.y);

        for (var prop in this.controls) {
            var p = globalPoints[prop];
            var c = this.controls[prop];
            c.x = p.x;
            c.y = p.y;
            c.visible = true;
        }
    }


    setPivotByLocalPoint(localPoint) {
        this.target.setPivot(localPoint);
        this.target.pivot = localPoint;
        this.adjustPosition();
    }


    setPivotByControl(control) {
        this.pivot = this.getPivot(control);
        this.target.setPivot(this.pivot.localPoint);
        this.adjustPosition();
    }


    adjustPosition() {
        var offsetX = this.lt.x - this.prevLtX;
        var offsetY = this.lt.y - this.prevLtY;
        var noScaleOffsetX = offsetX / this.diffScaleX;
        var noScaleOffsetY = offsetY / this.diffScaleY;
        var pivotOffsetX = offsetX - noScaleOffsetX;
        var pivotOffsetY = offsetY - noScaleOffsetY;
        this.target.x = this.target.x - offsetX + pivotOffsetX;
        this.target.y = this.target.y - offsetY + pivotOffsetY;
        this.updatePrevTargetLt();
    }


    getPivot(control) {
        switch (control.type) {
            case ToolControlType.DELETE:
                return this.c.mc;
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


    //////////////////////////////////////////////////////////////////////////
    // Cursor
    //////////////////////////////////////////////////////////////////////////


    enableCurrentStyleCursor() {
        if (this.target === null) return;

        this.target.buttonMode = false;
        this.target.interactive = false;
        this.target.defaultCursor = 'inherit';

        for(var prop in this.c) {
            var c = this.c[prop];
            c.buttonMode = false;
            c.interactive = false;
            c.defaultCursor = 'inherit';
        }

        this.stageLayer.buttonMode = true;
        this.stageLayer.interactive = true;
        this.stageLayer.defaultCursor = Mouse.currentCursorStyle;
    };


    disableCurrentStyleCursor() {
        if (this.target === null) return;

        this.target.buttonMode = true;
        this.target.interactive = true;
        this.target.defaultCursor = 'inherit';

        for(var prop in this.c) {
            var c = this.c[prop];
            c.buttonMode = true;
            c.interactive = true;
            c.defaultCursor = 'inherit';
        }

        this.stageLayer.buttonMode = false;
        this.stageLayer.interactive = false;
        this.stageLayer.defaultCursor = 'inherit';
    };


    onSetTarget(target) {
        if(this.target !== target) this.releaseTarget();
    }


    onDelete(e) {
        if(!this.target) return;
        this.target.emit(TransformTool.DELETE, this.target);
    }


    onRotateStart(e) {
        if(!this.target) return;
        this.downCnt++;
        this.setPivotByControl(e.target);
        this.enableCurrentStyleCursor();
    }


    onRotate(e) {
        if(!this.target) return;
        this.target.rotation += e.changeRadian;
        this.draw();
        this.updatePrevTargetLt();
    }


    onRotateEnd(e) {
        if(!this.target) return;
        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
        this.disableCurrentStyleCursor();
    }


    onControlMoveStart(e) {
        if(!this.target) return;
        this.downCnt++;
        this.startMousePoint = {x: e.currentMousePoint.x, y: e.currentMousePoint.y};
        this.setPivotByControl(e.target);
        this.updatePrevTargetLt();
        this.enableCurrentStyleCursor();
    }


    onControlMove(e) {
        if(!this.target) return;
        this.doTransform(e);
        this.draw();
        this.updatePrevTargetLt();
    }


    onControlMoveEnd(e) {
        if(!this.target) return;
        this.target.emit(TransformTool.TRANSFORM_COMPLETE);
        this.disableCurrentStyleCursor();
    }


    onChangeRotationCursor(cursor) {
        this.stageLayer.defaultCursor = cursor;
    }


    onTextureUpdate(e) {
        var target = e.target;
        var width = target.width;
        var height = target.height;
        this.setPivotByLocalPoint({x: 0, y: 0});
        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
    }


    get lt() {
        return this.target.toGlobal({x: 0, y: 0});
    }

    get deleteButtonPosition() {
        if (!this.c)
            return new PIXI.Point(0, 0);

        var transform = this.target.worldTransform.clone();
        var tl = transform.apply(this.c.tl.localPoint);
        var ml = transform.apply(this.c.ml.localPoint);
        //return PointUtil.getAddedInterpolate(tl, ml, this.deleteButtonOffsetY);
        return PointUtil.add(PointUtil.getAddedInterpolate(tl, ml, this.deleteButtonOffsetY), new PIXI.Point(-this.deleteButtonSize, -this.deleteButtonSize));
    }


    /**
     * NOT USE
     * 회전 컨트롤이 모든 컨트롤 뒤에 배치되도록 변경되어 사용하지 않습니다.
     * @returns {*}
     */
    get rotateControlPosition() {
        if (!this.c)
            return new PIXI.Point(0, 0);

        var transform = this.target.worldTransform.clone();
        var tc = transform.apply(this.c.tc.localPoint);
        var ro = transform.apply(this.c.ro.localPoint);
        return PointUtil.getAddedInterpolate(tc, ro, this.rotationLineLength);
    }


    get diffScaleX() {
        var matrix = this.target.worldTransform;
        return Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
    }

    get diffScaleY() {
        var matrix = this.target.worldTransform;
        return Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
    }


    get width() {
        return this.target.width * this.diffScaleX;
    }

    get height() {
        return this.target.height * this.diffScaleY;
    }

}
