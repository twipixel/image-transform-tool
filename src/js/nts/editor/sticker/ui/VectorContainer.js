import {Calc} from './../utils/Calculator';
import {TransformTool} from './../transform/TransformTool';

export class VectorContainer extends PIXI.Container {

    /**
     * Vector가 처음 로드 되었을 때 이벤트
     * @returns {string}
     * @constructor
     */
    static LOAD_COMPLETE() {
        return 'drawComplete';
    }

    /**
     * 처음 이후 업데이트 되었을 때 이벤트
     * @returns {string}
     * @constructor
     */
    static TEXTURE_UPDATE() {
        return 'textureUpdate';
    }


    constructor() {
        super();
        this.initialize();
        this.addEvent();
    }


    initialize() {
        this.xScaleSign = 1;
        this.yScaleSign = 1;
        this.isFirstLoad = true;
        this.interactive = true;
        this.canvgCanvas = document.createElement('CANVAS');
        this.canvgCanvas.id = 'canvgCanvas';
        this.canvgContext = this.canvgCanvas.getContext('2d');
        document.body.appendChild(this.canvgCanvas);

        this.flipCanvas = document.createElement('CANVAS');
        this.flipCanvas.id = 'flipCanvas';
        this.flipContext = this.flipCanvas.getContext('2d');
        document.body.appendChild(this.flipCanvas);
    };


    addEvent() {
        this.on(TransformTool.TRANSFORM_COMPLETE, this.onTransformComplete);
    }


    load(url, x = 0, y = 0, width = 100, height = 100) {
        this.url = url;
        this.drawSvg(x, y, width, height);
    }


    drawSvg(x, y, w, h) {
        console.log('drawSvg(' + this.url + x + ', ' + y + ', ' + w + ', ' + h + ')');

        var signX = (w < 0) ? -1 : 1;
        var signY = (h < 0) ? -1 : 1;
        this.xScaleSign = this.xScaleSign * signX;
        this.yScaleSign = this.yScaleSign * signY;
        w = Math.abs(w);
        h = Math.abs(h);

        this.flipCanvas.width = w;
        this.flipCanvas.height = h;
        this.canvgCanvas.width = w;
        this.canvgCanvas.height = h;
        this.canvgContext.drawSvg(this.url, x, y, w, h, {renderCallback: this.onDrawComplete.bind(this)});
    }


    onTransformComplete(e) {
        this.drawSvg(0, 0, this.width, this.height);
    }


    onDrawComplete() {
        //TODO 테스트 코드
        window.target = this;

        if(this.isFirstLoad === true) {
            this.isFirstLoad = false;
            this.flipImage(this.xScaleSign, this.yScaleSign, this.canvgCanvas.width, this.canvgCanvas.height);
            this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.flipCanvas));
            this.addChild(this.image);
            this.emit(VectorContainer.LOAD_COMPLETE, {target:this});
        } else {
            //this.scale = {x:1 * this.xScaleSign, y:1 * this.yScaleSign};
            this.flipImage(this.xScaleSign, this.yScaleSign, this.canvgCanvas.width, this.canvgCanvas.height);
            this.scale = {x:1, y:1};
            this.image.texture.update();
            //this.updateTransform();
            this.emit(VectorContainer.TEXTURE_UPDATE, {target:this, xScaleSign:this.xScaleSign, yScaleSign:this.yScaleSign});
        }

        //this.flipTarget(this.xScaleSign, this.yScaleSign, this.canvgCanvas.width, this.canvgCanvas.height);
    }


    flipImage(signX, signY, width, height) {
        var posX = (signX < 0) ? width * -1 : 0;
        var posY = (signY < 0) ? height * -1 : 0;
        //console.log('flipImage(' + signX + ', ' + signY + ', ' + width + ', ' + height + '), posX:' + posX + ', posY:' + posY);
        this.flipContext.scale(signX, signY); // Set scale to flip the image
        this.flipContext.drawImage(this.canvgCanvas, posX, posY, width, height);
    }


    flipTarget(signX, signY, width, height) {
        var posX = (signX < 0) ? width * -1 : 0;
        var posY = (signY < 0) ? height * -1 : 0;
        this.x = this.x + posX;
        this.y = this.y + posY;
    }


    toString() {
        console.log('');
        var localBounds = this.getLocalBounds();
        var imageLocalBounds = this.image.getLocalBounds();
        console.log('wh[' + Calc.digit(this.width) + ', ' + Calc.digit(this.height) + '], localBounds[' + localBounds.width + ', ' + localBounds.height + ']');
        console.log('image wh[' + Calc.digit(this.image.width), ', ' + Calc.digit(this.image.height) + '], localBounds[' + imageLocalBounds.width + ', ' + imageLocalBounds.height + ']');
    }
}
