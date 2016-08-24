import {Calc} from './../utils/Calculator';
import {TransfromTool} from './../transform/TransformTool';

export class StickerLoader extends PIXI.Container {
    constructor(url, x = 0, y = 0, width = 100, height = 100) {
        console.log('StickerLoader(' + url + ')');
        super();

        this.initialize(url, x, y, width, height);
        this.addEvent();
    }

    initialize(url, x, y, width, height) {
        this.url = url;
        this.isFirstLoad = true;
        this.offscreenCanvas = document.createElement('CANVAS');
        this.offscreenCanvas.id = 'offscreen';
        this.offscreenContext = this.offscreenCanvas.getContext('2d');
        document.body.appendChild(this.offscreenCanvas);

        this.drawSvg(x, y, width, height);
    };

    addEvent() {
        this.on(TransfromTool.TRANSFORM_COMPLETE, this.onTransformComplete);
    }

    drawSvg(x, y, w, h) {
        console.log('drawSvg(' + this.url + x + ', ' + y + ', ' + w + ', ' + h + ')');
        this.textureWidth = w;
        this.textureHeight = h;
        this.offscreenCanvas.width = w;
        this.offscreenCanvas.height = h;
        this.offscreenContext.drawSvg(this.url, x, y, w, h, {renderCallback: this.onDrawComplete.bind(this)});
    }

    onTransformComplete(e) {
        var localBounds = this.getLocalBounds();
        console.log('localBounds', Calc.digit(localBounds.width), Calc.digit(localBounds.height));

        if(this.width > localBounds.width || this.height > localBounds.height) {
            this.drawSvg(0, 0, this.width, this.height);
        }
    }

    onDrawComplete() {
        this.texture = new PIXI.Texture.fromCanvas(this.offscreenCanvas);

        if(this.isFirstLoad === true) {
            this.isFirstLoad = false;
            this.image = new PIXI.Sprite(this.texture);
            this.image.interactive = true;
            this.image.on('click', this.onClick.bind(this));
            this.addChild(this.image);
        } else {
            //this.scale.x = 1;
            //this.scale.y = 1;
            //this.texture.width = this.textureWidth;
            //this.texture.height = this.textureHeight;
            //this.texture.update();
        }
    }

    onClick(e) {
        console.log(this.url + '.' + 'onClick');
        this.emit('click', {target:this});
    }

}
