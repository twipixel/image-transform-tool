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
        this.interactive = true;

        this.offscreenCanvas = document.createElement('CANVAS');
        this.offscreenCanvas.id = 'offscreen';
        this.offscreenContext = this.offscreenCanvas.getContext('2d');
        document.body.appendChild(this.offscreenCanvas);

        this.drawSvg(x, y, width, height);
        this.on('click', this.onClick.bind(this));
    };

    addEvent() {
        this.on(TransfromTool.TRANSFORM_COMPLETE, this.onTransformComplete);
    }

    drawSvg(x, y, w, h) {
        console.log('drawSvg(' + this.url + x + ', ' + y + ', ' + w + ', ' + h + ')');

        w = Math.abs(w);
        h = Math.abs(h);

        this.offscreenCanvas.width = w;
        this.offscreenCanvas.height = h;
        this.offscreenContext.drawSvg(this.url, x, y, w, h, {renderCallback: this.onDrawComplete.bind(this)});
    }

    onTransformComplete(e) {
        console.log('onTransformComplete()');
        this.drawSvg(0, 0, this.width, this.height);
    }

    onDrawComplete() {
        console.log('onDrawComplete');
        //this.texture = new PIXI.Texture.fromCanvas(this.offscreenCanvas);

        if(this.isFirstLoad === true) {
            console.log('**************************');
            console.log('FIRST LOAD()');
            this.isFirstLoad = false;
            this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.offscreenCanvas));
            this.addChild(this.image);
        } else {
            console.log('**************************');
            console.log('DESTROY()');
            //this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.offscreenCanvas));
            //this.pivot = {x:0, y:0};
            //this.worldTransform.scale(1, 1);
            //this.width = this.offscreenCanvas.width;
            //this.height = this.offscreenCanvas.height;
            window.target = this;
            this.updateTransform();

            console.dir(this);
            this.emit('textureUpdate', {target:this});
        }
    }

    onClick(e) {
        this.emit('stickerClick', {target:this});
    }


    toString() {
        console.log('');
        var localBounds = this.getLocalBounds();
        var imageLocalBounds = this.image.getLocalBounds();
        console.log('wh[' + Calc.digit(this.width) + ', ' + Calc.digit(this.height) + '], localBounds[' + localBounds.width + ', ' + localBounds.height + ']');
        console.log('image wh[' + Calc.digit(this.image.width), ', ' + Calc.digit(this.image.height) + '], localBounds[' + imageLocalBounds.width + ', ' + imageLocalBounds.height + ']');
    }
}
