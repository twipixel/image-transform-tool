import {StickerLoader} from './../ui/StickerLoader';
import {TransfromTool} from './../transform/TransformTool';

export class StickerMain {
    constructor(renderer, rootLayer, stickerLayer) {
        console.log('StickerMain(' + renderer, rootLayer + ', ' + stickerLayer + ')');

        this.canvas = renderer.view;
        this.rootLayer = rootLayer;
        this.stickerLayer = stickerLayer;

        this.stickers = [];
        this.svgs = [
            './img/svg-modify/amazon.svg',
            './img/svg-modify/dribbble.svg',
            './img/svg-modify/facebook.svg',
            './img/svg-modify/foursquare.svg',
            './img/svg-modify/periscope.svg',
            './img/svg-modify/pinterest.svg',
            './img/svg-modify/shutterstock.svg',
            './img/svg-modify/skype.svg',
            './img/svg-modify/whatsapp.svg',
            './img/svg-modify/wordpress.svg'
        ];

        this.initialize();
    }

    initialize() {
        this.createStickers();
        setTimeout(this.startTest.bind(this), 2000);
    };


    createStickers() {
        var count = 1 + parseInt(Math.random() * this.svgs.length);
        console.log('createStickers, count:', count);

        for(var i=0; i<count; i++) {
            var svgURL = this.svgs[i];
            var sticker = new StickerLoader(svgURL);
            this.stickers[i] = sticker;
            sticker.x = parseInt(Math.random() * 800);
            sticker.y = parseInt(Math.random() * 600);
            sticker.on('click', this.onStickerClick.bind(this));
            sticker.on('textureUpdate', this.onStickerTextureUpdate.bind(this));
            this.stickerLayer.addChild(sticker);
        }
    }


    startTest() {
        console.log('START TEST');
        // stickerLayer 변경 테스트
        //this.stickerLayer.rotation = 0.3;
        //this.stickerLayer.scale.x = 1.10;
        //this.stickerLayer.scale.y = 1.10;
        //this.stickerLayer.x = 160;
        //this.stickerLayer.y = 40;
        this.stickerLayer.updateTransform();

        var options = {
            canvasOffsetX: 0,
            canvasOffsetY: 0,
            scaleOffsetX: this.stickerLayer.scale.x - 1,
            scaleOffsetY: this.stickerLayer.scale.y - 1
        };

        this.transformTool = new TransfromTool(this.canvas, options, this.rootLayer, this.stickerLayer);
        //this.transformTool.setTarget(this.sticker);
    }


    onStickerTextureUpdate(e) {
        console.log('onStickerTextureUpdate');
        //this.stickerLayer.updateTransform();
    }


    onStickerClick(e) {
        var target = e.target;
        this.transformTool.setTarget(target);
    }


    resize() {

    };
}

