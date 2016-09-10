import {VectorContainer} from '../view/VectorContainer';
import {TransformTool} from '../transform/TransformTool';

export class StickerMain {
    constructor(renderer, stageLayer, stickerLayer) {
        console.log('StickerMain(' + stageLayer + ', ' + stickerLayer + ')');

        this.renderer = renderer;
        this.stageLayer = stageLayer;
        this.stickerLayer = stickerLayer;

        this.stickers = [];
        this.svgs = [
            './img/svg/amazon.svg',
            './img/svg/dribbble.svg',
            './img/svg/facebook.svg',
            './img/svg/foursquare.svg',
            './img/svg/periscope.svg',
            './img/svg/pinterest.svg',
            './img/svg/shutterstock.svg',
            './img/svg/skype.svg',
            './img/svg/whatsapp.svg',
            './img/svg/wordpress.svg'
        ];

        this.initialize();
        this.addDebug();
    }


    initialize() {
        this.isCreate = false;
        this.testCreateStickers();
    }


    createSticker(url, x, y, width, height) {
        var sticker = new VectorContainer();
        sticker.x = x;
        sticker.y = y;
        sticker._stickerMouseDownListener = this.onStickerMouseDown.bind(this);
        sticker._stickerDeleteClickListener = this.onStickerDeleteClick.bind(this);
        sticker._stickerLoadCompleteListener = this.onLoadComplete.bind(this);
        sticker.on('mousedown', sticker._stickerMouseDownListener);
        sticker.on(TransformTool.DELETE, sticker._stickerDeleteClickListener);
        sticker.on(VectorContainer.LOAD_COMPLETE, sticker._stickerLoadCompleteListener);
        sticker.load(url, 0, 0, width, height);
        this.stickerLayer.addChild(sticker);
        this.stickers.push(sticker);
        return sticker;
    }


    deleteSticker(target) {
        if(target === null) return;

        target.off('mousedown', target._stickerMouseDownListener);
        target.off(TransformTool.DELETE, target._stickerDeleteClickListener);
        target.off(VectorContainer.LOAD_COMPLETE, target._stickerLoadCompleteListener);

        for(var i=0; i<this.stickers.length; i++) {
            var sticker = this.stickers[i];
            if(sticker === target) {
                this.stickers.splice(i, 1);
                this.stickerLayer.removeChild(sticker);
                this.transformTool.releaseTarget();
                sticker.destroy();
            }
        }
    }


    restore(snapshot) {
        if(!snapshot) return;

        this.stickers = null;
        this.stickers = [];

        for(var i=0; i<snapshot.length; i++) {
            var vo = snapshot[i];
            var sticker = new VectorContainer();

            var transform = vo.transform;
            sticker.x = transform.x;
            sticker.y = transform.y;
            sticker.scale.x = transform.scaleX;
            sticker.scale.y = transform.scaleY;
            sticker.rotation = transform.rotation;
            sticker._stickerMouseDownListener = this.onStickerMouseDown.bind(this);
            sticker._stickerDeleteClickListener = this.onStickerDeleteClick.bind(this);
            sticker._stickerLoadCompleteListener = this.onLoadComplete.bind(this);
            sticker.on('mousedown', sticker._stickerMouseDownListener);
            sticker.on(TransformTool.DELETE, sticker._stickerDeleteClickListener);
            sticker.on(VectorContainer.LOAD_COMPLETE, sticker._stickerLoadCompleteListener);
            sticker.load(vo.url, vo.x, vo.y, vo.width, vo.height);
            this.stickerLayer.addChild(sticker);
            this.stickers.push(sticker);
        }
    }


    releaseTarget() {
        if(!this.transformTool) return;
        this.transformTool.releaseTarget();
    }


    show() {
        for(var i=0; i<this.stickers.length; i++)
            this.stickers[i].visible = true;
        this.transformTool.show();
    }


    hide() {
        for(var i=0; i<this.stickers.length; i++)
            this.stickers[i].visible = false;
        this.transformTool.hide();
    }


    clear() {
        console.log('           clear, this.stickers.length:', this.stickers.length);
        var cloneStickers = this.stickers.slice(0);
        for(var i=0; i<cloneStickers.length; i++)
            this.deleteSticker(cloneStickers[i]);

        console.log('           clear done, this.stickers.length:', this.stickers.length);
    }


    addDebug() {
        window.document.addEventListener('keyup', this.onKeyUp.bind(this));
    }


    startTest() {
        console.log('START TEST');
        this.stickerLayer.updateTransform();

        var options = {
            deleteButtonOffsetY: 0,
        };

        this.transformTool = new TransformTool(this.stageLayer, this.stickerLayer, options);
    }


    onLoadComplete(e) {
        if(++this.loadStickerCount == this.totalSticker)
            this.startTest();
    }


    onStickerClick(e) {
        var target = e.target;
        this.stickerLayer.setChildIndex(target, this.stickerLayer.children.length - 1);
        this.transformTool.setTarget(e);
    }


    onStickerMouseDown(e) {
        var target = e.target;
        //if (target.checkAlphaPoint(e.data.global)) return;
        e.stopPropagation();
        this.onStickerClick(e);
    }


    onStickerDeleteClick(target) {
        this.deleteSticker(target);
    }


    onKeyUp(e) {
        switch (e.keyCode) {
            case 27: //consts.KeyCode.ESC:
                break;
            case 32: //consts.KeyCode.SPACE:
                this.testRandomCreateSticker();
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
    }


    resize() {

    }


    get snapshot() {
        var snapshot = [];
        for(var i=0; i<this.stickers.length; i++) {
            var vo = this.stickers[i].snapshot;
            vo.childIndex = this.stickerLayer.getChildIndex(this.stickers[i]);
            snapshot[i] = vo;
        }

        snapshot.sort(function (a, b) {
            return a.childIndex < b.childIndex ? -1 : a.childIndex > b.childIndex ? 1 : 0;
        });

        return snapshot;
    }


    testRandomCreateSticker() {
        var randomIndex = parseInt(Math.random() * this.svgs.length);
        var url = this.svgs[randomIndex];
        var sticker = this.createSticker(url, 0, 0, 100, 100);
        sticker.x = parseInt(Math.random() * 800);
        sticker.y = parseInt(Math.random() * 600);
    }


    testCreateStickers() {
        if(this.isCreate === true) return;

        this.loadStickerCount = 0;
        this.totalSticker = 4 + parseInt(Math.random() * this.svgs.length - 3);
        console.log('createStickers(), totalSticker:', this.totalSticker);

        for(var i=0; i<this.totalSticker; i++) {
            var url = this.svgs[i];
            var sticker = this.createSticker(url, 0, 0, 100, 100);
            sticker.x = parseInt(Math.random() * 800);
            sticker.y = parseInt(Math.random() * 600);
        }

        this.isCreate = true;
    }
}

