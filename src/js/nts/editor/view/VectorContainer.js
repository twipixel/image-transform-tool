import {Calc} from './../utils/Calculator';
import {TransformTool} from './../transform/TransformTool';

export class VectorContainer extends PIXI.Container {

    /**
     * VectorContainer 최대 넓이와 높이
     * 캔버스 최대 사이즈가 IE Mobile 에서는 4,096 픽셀이며 IE 에서는 8,192 픽셀입니다.
     */
    static get MAX_WIDTH() {
        return 4000;
    }

    static get MAX_HEIGHT() {
        return 4000;
    }

    /**
     * Vector가 처음 로드 되었을 때 이벤트
     * @returns {string}
     * @constructor
     */
    static get LOAD_COMPLETE() {
        return 'drawComplete';
    }

    /**
     * 처음 이후 업데이트 되었을 때 이벤트
     * @returns {string}
     * @constructor
     */
    static get TEXTURE_UPDATE() {
        return 'textureUpdate';
    }


    constructor() {
        super();
        this.initialize();
        this.addEvent();
    }


    initialize() {
        this.image = null;
        this.scaleSignX = 1;
        this.scaleSignY = 1;
        this.interactive = true;
        this.isFirstLoad = true;
        this.renderableObject = true;

        this.canvgCanvas = document.createElement('canvas');
        this.canvgCanvas.id = 'canvgCanvas';
        this.canvgContext = this.canvgCanvas.getContext('2d');

        this.setpixelated(this.canvgContext);
    };


    setpixelated(context) {
        context['imageSmoothingEnabled'] = false;
        /* standard */
        context['mozImageSmoothingEnabled'] = false;
        /* Firefox */
        context['oImageSmoothingEnabled'] = false;
        /* Opera */
        context['webkitImageSmoothingEnabled'] = false;
        /* Safari */
        context['msImageSmoothingEnabled'] = false;
        /* IE */
    }


    addEvent() {
        this.drawCompleteListener = this.onDrawComplete.bind(this);
        this.transformCompleteListener = this.onTransformComplete.bind(this);
        this.on(TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
    }


    removeEvent() {
        this.off(TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
        this.drawCompleteListener = null;
        this.transformCompleteListener = null;
    }


    load(url, x = 0, y = 0, width = 100, height = 100) {
        this.url = url;
        this.originW = width;
        this.originH = height;
        this.drawSvg(x, y, width, height);
    }


    setSVG(dom, x = 0, y = 0, width = 100, height = 100) {
        this.svg = dom;
        this.originW = width;
        this.originH = height;
        this.drawSvg(x, y, width, height);
    }


    setPivot(localPoint) {
        this.pivot = localPoint;
    }


    drawSvg(x, y, width, height) {
        this.drawX = x;
        this.drawY = y;
        this.drawWidth = width;
        this.drawHeight = height;

        var signX = (width < 0) ? -1 : 1;
        var signY = (height < 0) ? -1 : 1;
        this.scaleSignX = this.scaleSignX * signX;
        this.scaleSignY = this.scaleSignY * signY;
        width = Math.abs(width);
        height = Math.abs(height);
        width = (width > VectorContainer.MAX_WIDTH) ? VectorContainer.MAX_WIDTH : width;
        height = (height > VectorContainer.MAX_HEIGHT) ? VectorContainer.MAX_HEIGHT : height;
        this.canvgCanvas.width = width;
        this.canvgCanvas.height = height;
        this.canvgContext.drawSvg(this.url || this.svg, x, y, width, height, {
            renderCallback: this.drawCompleteListener.call(this)
        });
        // this.canvgContext.drawSvg(this.url || this.svg, x, y, width, height);
        //
        // if(this.image === null) {
        //     this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.canvgCanvas));
        //     this.image.renderableObject = true;
        //     this.addChild(this.image);
        //     this.emit(VectorContainer.LOAD_COMPLETE, {target: this});
        // }
    }


    delete() {
        this.removeEvent();
        this.interactive = false;

        if (this.image !== null) {
            this.image.texture.destroy();
            this.image.texture = null;
            this.removeChild(this.image);
            this.image.renderableObject = false;
            this.image.destroy();
            this.image = null;
        }

        this.destroy();
        if (this.svg && this.svg.parentNode) {
            this.svg.parentNode.removeChild(this.svg);
        }
        this.svg = null;
        this.canvgCanvas.svg = null;
        this.canvgCanvas = null;
        this.canvgContext = null;
        this.drawCompleteListener = null;
        this.transformCompleteListener = null;
    }


    checkAlphaPoint(globalMPoint) {
        let point = this.worldTransform.applyInverse(globalMPoint);
        let data = this.canvgContext.getImageData(point.x, point.y, 1, 1);

        if (data.data[3] == 0) {
            return true;
        }
        return false;
    }


    onTransformComplete(e) {
        this.drawSvg(0, 0, this.width, this.height);
    }


    onDrawComplete() {
        if (this.isFirstLoad === true) {
            this.isFirstLoad = false;
            this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.canvgCanvas));
            this.image.renderableObject = true;
            this.addChild(this.image);
            this.emit(VectorContainer.LOAD_COMPLETE, {target: this});
        } else {
            this.scale = {x: 1, y: 1};
            this.image.scale = {x: this.scaleSignX, y: this.scaleSignY};
            this.image.texture.update();
            this.image.updateTransform();
            this.emit(VectorContainer.TEXTURE_UPDATE, {
                target: this,
                scaleSignX: this.scaleSignX,
                scaleSignY: this.scaleSignY
            });
        }
    }

    //     this.scale = {x: 1, y: 1};
    //     this.image.scale = {x: this.scaleSignX, y: this.scaleSignY};
    //     this.image.texture.update();
    //     this.image.updateTransform();
    //     this.emit(VectorContainer.TEXTURE_UPDATE, {
    //         target: this,
    //         scaleSignX: this.scaleSignX,
    //         scaleSignY: this.scaleSignY
    //     });
    // }


    get ID() {
        return this._id;
    }

    set ID(id) {
        this._id = id;
    }

    get scaleForOrigin() {
        return {x: this.width / this.originW, y: this.height / this.originH};
    }

    get snapshot() {
        return {
            url: this.url, svg: this.svg,
            x: this.drawX, y: this.drawY, width: this.drawWidth, height: this.drawHeight,
            transform: {
                x: this.x,
                y: this.y,
                scaleX: this.scale.x,
                scaleY: this.scale.y,
                rotation: this.rotation,
                childIndex: this.parent.getChildIndex(this)
            }
        };
    }


    toString() {
        console.log('');
        var localBounds = this.getLocalBounds();
        var imageLocalBounds = this.image.getLocalBounds();
        console.log('wh[' + Calc.digit(this.width) + ', ' + Calc.digit(this.height) + '], localBounds[' + localBounds.width + ', ' + localBounds.height + ']');
        console.log('image wh[' + Calc.digit(this.image.width), ', ' + Calc.digit(this.image.height) + '], localBounds[' + imageLocalBounds.width + ', ' + imageLocalBounds.height + ']');
    }
}
