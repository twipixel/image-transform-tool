import {VectorContainer} from '../view/VectorContainer';
import {TransformTool} from '../transform/TransformTool';

export class StickerMain {
    constructor(renderer, stageLayer, stickerLayer) {
        this.renderer = renderer;
        this.stageLayer = stageLayer;
        this.stickerLayer = stickerLayer;

        this.initialize();
        this.addDebug();
    }


    initialize() {
        this.stickers = [];
        this.isRestore = false;
        this.stickerLayer.updateTransform();
        var options = { deleteButtonOffsetY: 0 };
        this.transformTool = new TransformTool(this.stageLayer, this.stickerLayer, options);
    }


    createSticker(url, x, y, width, height) {
        var sticker = new VectorContainer();
        this.stickerLayer.addChild(sticker);
        this.stickers.push(sticker);
        sticker.x = x;
        sticker.y = y;
        sticker._stickerMouseDownListener = this.onStickerMouseDown.bind(this);
        sticker._stickerDeleteClickListener = this.onStickerDeleteClick.bind(this);
        sticker._stickerSetTargetListener = this.onSetTarget.bind(this);
        sticker._stickerLoadCompleteListener = this.onLoadComplete.bind(this);
        sticker.on('mousedown', sticker._stickerMouseDownListener);
        sticker.on(TransformTool.DELETE, sticker._stickerDeleteClickListener);
        sticker.on(TransformTool.SET_TARGET, sticker._stickerSetTargetListener);
        sticker.on(VectorContainer.LOAD_COMPLETE, sticker._stickerLoadCompleteListener);
        sticker.load(url, 0, 0, width, height);
        return sticker;
    }


    deleteSticker(target) {
        if(target === null) return;

        target.off('mousedown', target._stickerMouseDownListener);
        target.off(TransformTool.DELETE, target._stickerDeleteClickListener);
        target.off(VectorContainer.LOAD_COMPLETE, target._stickerLoadCompleteListener);
        target._stickerMouseDownListener = null;
        target._stickerDeleteClickListener = null;
        target._stickerLoadCompleteListener = null;

        for(var i=0; i<this.stickers.length; i++) {
            var sticker = this.stickers[i];
            if(sticker === target) {
                this.stickers.splice(i, 1);
                this.stickerLayer.removeChild(sticker);
                this.transformTool.releaseTarget();
                sticker.delete();
                sticker = null;
            }
        }
    }


    restore(snapshot) {
        if(!snapshot) return;

        this.stickers = null;
        this.stickers = [];
        this.isRestore = true;
        this.restoreCount = 0;
        this.restoreTotal = snapshot.length;

        for(var i=0; i<snapshot.length; i++) {
            var vo = snapshot[i];
            var sticker = new VectorContainer();
            this.stickerLayer.addChild(sticker);
            this.stickers.push(sticker);

            var transform = vo.transform;
            sticker.x = transform.x;
            sticker.y = transform.y;
            sticker.scale.x = transform.scaleX;
            sticker.scale.y = transform.scaleY;
            sticker.rotation = transform.rotation;
            sticker.childIndex = vo.childIndex;
            sticker._stickerMouseDownListener = this.onStickerMouseDown.bind(this);
            sticker._stickerDeleteClickListener = this.onStickerDeleteClick.bind(this);
            sticker._stickerLoadCompleteListener = this.onLoadComplete.bind(this);
            sticker.on('mousedown', sticker._stickerMouseDownListener);
            sticker.on(TransformTool.DELETE, sticker._stickerDeleteClickListener);
            sticker.on(VectorContainer.LOAD_COMPLETE, sticker._stickerLoadCompleteListener);
            sticker.load(vo.url, vo.x, vo.y, vo.width, vo.height);
        }
    }


    releaseTarget() {
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
        var cloneStickers = this.stickers.slice(0);
        for(var i=0; i<cloneStickers.length; i++)
            this.deleteSticker(cloneStickers[i]);
    }


    update() {
        this.transformTool.update();
    }


    resize() {

    }


    onLoadComplete(e) {
        if(this.isRestore === false) {
            this.stickerLayer.updateTransform();
            this.transformTool.activeTarget(e.target);
        } else {
            if(++this.restoreCount == this.restoreTotal) this.isRestore = false;
        }
    }


    onStickerClick(e) {
        var target = e.target;
        this.stickerLayer.setChildIndex(target, this.stickerLayer.children.length - 1);
        this.transformTool.setTarget(e);
    }


    onStickerMouseDown(e) {
        var target = e.target;
        if (target.checkAlphaPoint(e.data.global)) return;
        e.stopPropagation();
        this.onStickerClick(e);
    }


    onStickerDeleteClick(target) {
        this.deleteSticker(target);
    }


    onSetTarget(target) {

    }


    onKeyUp(e) {
        switch (e.keyCode) {
            case 27: //consts.KeyCode.ESC:
                this.clear();
                break;
            case 32: //consts.KeyCode.SPACE:
                this.testCreateStickers();
                break;
            case 49: //consts.KeyCode.NUM_1:
                console.log('modefied:', this.modified);
                break;
            case 50: //consts.KeyCode.NUM_2:
                console.log('lastSticker:', this.lastSticker);
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


    get modified() {
        return this.stickers.length !== 0;
    }

    get lastSticker() {
        if(this.stickers.length === 0) return null;
        return this.stickerLayer.getChildAt( this.stickerLayer.children.length - 1 );
        //this.stickers[this.stickers.length - 1];
    }


    addDebug() {
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

        window.document.addEventListener('keyup', this.onKeyUp.bind(this));
    }


    testRandomCreateSticker() {
        var randomIndex = parseInt(Math.random() * this.svgs.length);
        var url = this.svgs[randomIndex];
        var randomX = parseInt(Math.random() * 400);
        var randomY = parseInt(Math.random() * 400);
        var sticker = this.createSticker(url, randomX, randomY, 100, 100);
    }


    testCreateStickers() {
        if(this.stickers.length !== 0) return;
        this.totalSticker = 4 + parseInt(Math.random() * this.svgs.length - 3);

        for(var i=0; i<this.totalSticker; i++) {
            var url = this.svgs[i];
            var randomX = parseInt(Math.random() * 400);
            var randomY = parseInt(Math.random() * 400);
            var sticker = this.createSticker(url, randomX, randomY, 100, 100);
        }
    }
}

