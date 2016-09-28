import {VectorContainer} from '../view/VectorContainer';
import {TransformTool} from '../transform/TransformTool';

export class StickerMain extends PIXI.utils.EventEmitter {

    static get DELETED() {
        return 'deleted';
    }

    static get SELECTED() {
        return 'selected';
    }

    static get DESELECTED() {
        return 'deselected';
    }

    constructor(renderer, stageLayer, stickerLayer) {
        super();
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
        sticker.pivot = {x: width / 2, y: height/2};
        sticker.x = x;
        sticker.y = y;
        sticker.rotation = -this.stickerLayer.rotation;
        sticker._stickerMouseDownListener = this.onStickerMouseDown.bind(this);
        sticker._stickerDeleteListener = this.onStickerDelete.bind(this);
        sticker._stickerSelectListener = this.onStickerSelect.bind(this);
        sticker._stickerDeselectListener = this.onStickerDeselect.bind(this);
        sticker._stickerLoadCompleteListener = this.onLoadComplete.bind(this);
        sticker.on('mousedown', sticker._stickerMouseDownListener);
        sticker.on(TransformTool.DELETE, sticker._stickerDeleteListener);
        sticker.on(TransformTool.SELECT, sticker._stickerSelectListener);
        sticker.on(TransformTool.DESELECT, sticker._stickerDeselectListener);
        sticker.on(VectorContainer.LOAD_COMPLETE, sticker._stickerLoadCompleteListener);
        sticker.load(url, 0, 0, width, height);
        return sticker;
    }


    deleteSticker(target) {
        if(target === null) return;

        target.off('mousedown', target._stickerMouseDownListener);
        target.off(TransformTool.DELETE, target._stickerDeleteListener);
        target.off(TransformTool.SELECT, target._stickerSelectListener);
        target.off(TransformTool.DESELECT, target._stickerDeselectListener);
        target.off(VectorContainer.LOAD_COMPLETE, target._stickerLoadCompleteListener);
        target._stickerMouseDownListener = null;
        target._stickerDeleteListener = null;
        target._stickerSelectListener = null;
        target._stickerDeselectListener = null;
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
            sticker._stickerDeleteListener = this.onStickerDelete.bind(this);
            sticker._stickerSelectListener = this.onStickerSelect.bind(this);
            sticker._stickerDeselectListener = this.onStickerDeselect.bind(this);
            sticker._stickerLoadCompleteListener = this.onLoadComplete.bind(this);
            sticker.on('mousedown', sticker._stickerMouseDownListener);
            sticker.on(TransformTool.DELETE, sticker._stickerDeleteListener);
            sticker.on(TransformTool.SELECT, sticker._stickerSelectListener);
            sticker.on(TransformTool.DESELECT, sticker._stickerDeselectListener);
            sticker.on(VectorContainer.LOAD_COMPLETE, sticker._stickerLoadCompleteListener);
            sticker.load(vo.url, vo.x, vo.y, vo.width, vo.height);
        }
    }


    updateTransformTool(){

        this.transformTool.updateGraphics();
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
        //if (target.checkAlphaPoint(e.data.global)) return;
        e.stopPropagation();
        this.onStickerClick(e);
    }


    onStickerDelete(target) {
        this.deleteSticker(target);
        this.emit(StickerMain.DELETED, target);
    }


    onStickerSelect(target) {
        this.emit(StickerMain.SELECTED, target);
    }


    onStickerDeselect(target) {
        this.emit(StickerMain.DESELECTED, target);
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
                this.deleteSticker(this.target);
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

        let children = this.stickerLayer.children;

        for( var i = children.length; i--; ){

            if( this.stickers.indexOf( children[i] ) != -1 )
                return children[i];
        }

        return null;
    }

    get target() {
        return this.transformTool.target;
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
        this.totalSticker = 10;

        for(var i=0; i<this.totalSticker; i++) {
            var randomIndex = parseInt(Math.random() * this.svgs.length);
            var url = this.svgs[randomIndex];
            var randomX = parseInt(Math.random() * 400);
            var randomY = parseInt(Math.random() * 400);
            var sticker = this.createSticker(url, randomX, randomY, 100, 100);
        }
    }
}

