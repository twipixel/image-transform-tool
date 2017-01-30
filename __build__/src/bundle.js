(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _Mouse = require('./nts/editor/utils/Mouse');

var _Calculator = require('./nts/editor/utils/Calculator');

var _StickerMain = require('./nts/editor/sticker/StickerMain');

var stage, stickerMain, rootLayer, stickerLayer, canvas, context, renderer;

window.onload = initailize.bind(undefined);

function initailize() {
    console.log('initialize');
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    renderer = new PIXI.CanvasRenderer(canvas.width, canvas.height, {
        view: canvas,
        autoResize: true,
        backgroundColor: 0x673AB7
        // backgroundColor: 0x8e44ad
        // backgroundColor: 0x9b59b6
        // backgroundColor: 0x222222
        // backgroundColor: 0xF9F9F9
        // backgroundColor: 0x333333
    });

    // 위치가 정수가 아닐경우 흐릿하게 보이는 문제가 있어
    // 렌더러의 위치를 정수로 연산될 수 있도록 한다.
    renderer.roundPixels = true;

    _Mouse.Mouse.renderer = renderer;
    stage = new PIXI.Container(0xE6E9EC);
    rootLayer = new PIXI.Container(0xE6E9EC);
    stickerLayer = new PIXI.Container(0xE6E9EC);

    // 컨테이너에 scale과 rotation 이 있을 때를 고려해서 만들었습니다
    //stickerLayer.scale = {x: 1.2, y: 1.2};
    // stickerLayer.rotation = Calc.toRadians(40);

    stage.addChild(stickerLayer);
    stage.addChild(rootLayer);

    stickerMain = new _StickerMain.StickerMain(renderer, rootLayer, stickerLayer);

    updateLoop();
    resizeWindow();
}

function updateLoop(ms) {
    update(ms);
    requestAnimFrame(updateLoop.bind(this));
};

function update(ms) {
    renderer.render(stage);
};

function resizeWindow() {
    var width = window.innerWidth;
    var height = window.innerHeight;

    /**
     * 캔버스 사이즈와 디스플레이 사이즈 설정
     * 레티나 그래픽 지원 코드
     */
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    /**
     * PIXI renderer 리사이즈
     * PIXI 에게 viewport 사이즈 변경 알림
     */
    renderer.resize(width, height);

    if (stickerMain) stickerMain.resize();
}

},{"./nts/editor/sticker/StickerMain":2,"./nts/editor/utils/Calculator":7,"./nts/editor/utils/Mouse":8}],2:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.StickerMain = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Calculator = require('../utils/Calculator');

var _VectorContainer = require('../view/VectorContainer');

var _TransformTool = require('../transform/TransformTool');

var _Painter = require('./../utils/Painter');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StickerMain = exports.StickerMain = function (_PIXI$utils$EventEmit) {
    _inherits(StickerMain, _PIXI$utils$EventEmit);

    _createClass(StickerMain, null, [{
        key: 'DELETED',
        get: function get() {
            return 'deleted';
        }
    }, {
        key: 'SELECTED',
        get: function get() {
            return 'selected';
        }
    }, {
        key: 'DESELECTED',
        get: function get() {
            return 'deselected';
        }
    }]);

    function StickerMain(renderer, stageLayer, stickerLayer) {
        _classCallCheck(this, StickerMain);

        var _this = _possibleConstructorReturn(this, _PIXI$utils$EventEmit.call(this));

        _this.renderer = renderer;
        _this.stageLayer = stageLayer;
        _this.stickerLayer = stickerLayer;

        _this.initialize();
        _this.addDebug();
        // this.initGUI();
        // this.testCreateStickers();

        _this.startGuide();
        return _this;
    }

    StickerMain.prototype.tapOrClick = function tapOrClick(event) {
        this.stopGuide();
        window.removeEventListener('mouseup', this._tapOrClickListener, false);
        window.removeEventListener('touchend', this._tapOrClickListener, false);

        this.loadingText = _Painter.Painter.getText('LOADING...', 0x1b1b1b, 0xf1c40f);
        this.loadingText.x = this.renderer.view.width / 2;
        this.loadingText.y = this.renderer.view.height / 2;
        this.stickerLayer.addChild(this.loadingText);

        setTimeout(this.delayTestStart.bind(this), 100);
    };

    StickerMain.prototype.delayTestStart = function delayTestStart() {
        this.initGUI();
        this.testCreateStickers();
    };

    StickerMain.prototype.initialize = function initialize() {
        this.stickers = [];
        this.isDemoMode = true;
        this.isRestore = false;
        this._cursorArea = false;
        this.stickerLayer.updateTransform();
        var options = { deleteButtonOffsetY: 0 };
        this.canvas = document.getElementById('canvas');
        this.transformTool = new _TransformTool.TransformTool(this.stageLayer, this.stickerLayer, options);
    };

    StickerMain.prototype.initGUI = function initGUI() {
        var gui = new dat.GUI();
        var title = gui.addFolder('커서 영역 화면에 표시');
        title.add(this, 'cursorArea');
        title.open();
        gui.close();
    };

    StickerMain.prototype.createSticker = function createSticker(url, x, y, width, height) {
        var visible = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

        var sticker = new _VectorContainer.VectorContainer();
        sticker.visible = visible;
        window['s' + this.stickers.length] = sticker;
        this.stickerLayer.addChild(sticker);
        this.stickers.push(sticker);
        sticker.pivot = { x: width / 2, y: height / 2 };
        sticker.x = x;
        sticker.y = y;
        sticker.rotation = -this.stickerLayer.rotation;
        sticker._stickerMouseDownListener = this.onStickerMouseDown.bind(this);
        sticker._stickerDeleteListener = this.onStickerDelete.bind(this);
        sticker._stickerSelectListener = this.onStickerSelect.bind(this);
        sticker._stickerDeselectListener = this.onStickerDeselect.bind(this);
        sticker._stickerLoadCompleteListener = this.onLoadComplete.bind(this);
        sticker.on('mousedown', sticker._stickerMouseDownListener);
        sticker.on(_TransformTool.TransformTool.DELETE, sticker._stickerDeleteListener);
        sticker.on(_TransformTool.TransformTool.SELECT, sticker._stickerSelectListener);
        sticker.on(_TransformTool.TransformTool.DESELECT, sticker._stickerDeselectListener);
        sticker.on(_VectorContainer.VectorContainer.LOAD_COMPLETE, sticker._stickerLoadCompleteListener);
        sticker.load(url, 0, 0, width, height);
        return sticker;
    };

    StickerMain.prototype.deleteSticker = function deleteSticker(target) {
        if (target === null) return;

        target.off('mousedown', target._stickerMouseDownListener);
        target.off(_TransformTool.TransformTool.DELETE, target._stickerDeleteListener);
        target.off(_TransformTool.TransformTool.SELECT, target._stickerSelectListener);
        target.off(_TransformTool.TransformTool.DESELECT, target._stickerDeselectListener);
        target.off(_VectorContainer.VectorContainer.LOAD_COMPLETE, target._stickerLoadCompleteListener);
        target._stickerMouseDownListener = null;
        target._stickerDeleteListener = null;
        target._stickerSelectListener = null;
        target._stickerDeselectListener = null;
        target._stickerLoadCompleteListener = null;

        for (var i = 0; i < this.stickers.length; i++) {
            var sticker = this.stickers[i];
            if (sticker === target) {
                this.stickers.splice(i, 1);
                this.stickerLayer.removeChild(sticker);
                this.transformTool.releaseTarget();
                sticker.delete();
                sticker = null;
            }
        }
    };

    StickerMain.prototype.restore = function restore(snapshot) {
        if (!snapshot) return;

        this.stickers = null;
        this.stickers = [];
        this.isRestore = true;
        this.restoreCount = 0;
        this.restoreTotal = snapshot.length;

        for (var i = 0; i < snapshot.length; i++) {
            var vo = snapshot[i];
            var sticker = new _VectorContainer.VectorContainer();
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
            sticker.on(_TransformTool.TransformTool.DELETE, sticker._stickerDeleteListener);
            sticker.on(_TransformTool.TransformTool.SELECT, sticker._stickerSelectListener);
            sticker.on(_TransformTool.TransformTool.DESELECT, sticker._stickerDeselectListener);
            sticker.on(_VectorContainer.VectorContainer.LOAD_COMPLETE, sticker._stickerLoadCompleteListener);
            sticker.load(vo.url, vo.x, vo.y, vo.width, vo.height);
        }
    };

    StickerMain.prototype.updateTransformTool = function updateTransformTool() {

        this.transformTool.updateGraphics();
    };

    StickerMain.prototype.releaseTarget = function releaseTarget() {
        this.transformTool.releaseTarget();
    };

    StickerMain.prototype.show = function show() {
        for (var i = 0; i < this.stickers.length; i++) {
            this.stickers[i].visible = true;
        }this.transformTool.show();
    };

    StickerMain.prototype.hide = function hide() {
        for (var i = 0; i < this.stickers.length; i++) {
            this.stickers[i].visible = false;
        }this.transformTool.hide();
    };

    StickerMain.prototype.clear = function clear() {
        var cloneStickers = this.stickers.slice(0);
        for (var i = 0; i < cloneStickers.length; i++) {
            this.deleteSticker(cloneStickers[i]);
        }
    };

    StickerMain.prototype.update = function update() {
        this.transformTool.update();
    };

    StickerMain.prototype.resize = function resize() {};

    StickerMain.prototype.onLoadComplete = function onLoadComplete(e) {
        if (this.isDemoMode) return;

        if (this.isRestore === false) {
            this.stickerLayer.updateTransform();
            this.transformTool.activeTarget(e.target);
        } else {
            if (++this.restoreCount == this.restoreTotal) this.isRestore = false;
        }
    };

    StickerMain.prototype.onStickerClick = function onStickerClick(e) {
        var target = e.target;
        this.stickerLayer.setChildIndex(target, this.stickerLayer.children.length - 1);
        this.transformTool.setTarget(e);
    };

    StickerMain.prototype.onStickerMouseDown = function onStickerMouseDown(e) {
        var target = e.target;
        //if (target.checkAlphaPoint(e.data.global)) return;
        e.stopPropagation();
        this.onStickerClick(e);
    };

    StickerMain.prototype.onStickerDelete = function onStickerDelete(target) {
        this.deleteSticker(target);
        this.emit(StickerMain.DELETED, target);
    };

    StickerMain.prototype.onStickerSelect = function onStickerSelect(target) {
        this.emit(StickerMain.SELECTED, target);
    };

    StickerMain.prototype.onStickerDeselect = function onStickerDeselect(target) {
        this.emit(StickerMain.DESELECTED, target);
    };

    StickerMain.prototype.onKeyUp = function onKeyUp(e) {
        switch (e.keyCode) {
            case 27:
                //consts.KeyCode.ESC:
                this.clear();
                break;
            case 32:
                //consts.KeyCode.SPACE:
                this.testCreateStickers();
                break;
            case 49:
                //consts.KeyCode.NUM_1:
                this.deleteSticker(this.target);
                break;
            case 50:
                //consts.KeyCode.NUM_2:
                break;
            case 51:
                //consts.KeyCode.NUM_3:
                break;
            case 52:
                //consts.KeyCode.NUM_4:
                break;
            case 53:
                //consts.KeyCode.NUM_5:
                break;
            case 54:
                //consts.KeyCode.NUM_6:
                break;
        }
    };

    StickerMain.prototype.addDebug = function addDebug() {
        this.svgs = ['./img/svg/airplane.svg', './img/svg/bank.svg', './img/svg/beacon.svg', './img/svg/beats.svg', './img/svg/bell.svg', './img/svg/bicycle.svg', './img/svg/box.svg', './img/svg/browser.svg', './img/svg/bulb.svg', './img/svg/casino.svg', './img/svg/chair.svg', './img/svg/config.svg', './img/svg/cup.svg', './img/svg/folder.svg', './img/svg/football.svg', './img/svg/headphones.svg', './img/svg/heart.svg', './img/svg/laptop.svg', './img/svg/letter.svg', './img/svg/like.svg', './img/svg/map.svg', './img/svg/medal.svg', './img/svg/mic.svg', './img/svg/milk.svg', './img/svg/pencil.svg', './img/svg/picture.svg', './img/svg/polaroid.svg', './img/svg/printer.svg', './img/svg/search.svg', './img/svg/shoppingbag.svg', './img/svg/speed.svg', './img/svg/stopwatch.svg', './img/svg/tweet.svg', './img/svg/watch.svg'];

        window.document.addEventListener('keyup', this.onKeyUp.bind(this));
    };

    StickerMain.prototype.testCreateStickers = function testCreateStickers() {
        if (this.stickers.length !== 0) return;

        var stickers = [];
        var defaultSize = 100;
        var defaultSticker = 3;
        var canvasWidth = this.canvas.width;
        var canvasHeight = this.canvas.height;
        // var totalSticker = defaultSticker + parseInt(Math.random() * (this.svgs.length - defaultSticker));
        var totalSticker = defaultSticker;

        for (var i = 0; i < totalSticker; i++) {
            var stickerSize = defaultSize + parseInt(Math.random() * 40);
            var direction = Math.random() < 0.5 ? -1 : 1;
            var rotation = _Calculator.Calc.toRadians(Math.random() * 360) * direction;
            var randomIndex = parseInt(Math.random() * this.svgs.length);
            var url = this.svgs.splice(randomIndex, 1)[0];
            var randomX = stickerSize + parseInt(Math.random() * (canvasWidth - stickerSize * 2));
            var randomY = stickerSize + parseInt(Math.random() * (canvasHeight - stickerSize * 2));
            randomX = Math.round(randomX);
            randomY = Math.round(randomY);

            var sticker = this.createSticker(url, randomX, randomY, stickerSize, stickerSize, false);
            sticker.scale.x = sticker.scale.y = 0;

            var stickerVO = {
                sticker: sticker,
                scale: 1,
                rotation: rotation,
                animationTime: 60
            };

            stickers.push(stickerVO);
        }

        this.addStickerWithMotion(stickers);
    };

    StickerMain.prototype.addStickerWithMotion = function addStickerWithMotion() {
        var stickerVOList = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

        if (stickerVOList != null) this.addStickerVOList = stickerVOList;
        if (!this.addStickerVOList || this.addStickerVOList.length <= 0) return;

        var displayTime = 4;
        var displayDuration = displayTime * this.addStickerVOList.length;

        cancelAnimFrame(this.addAniId);
        this.addAniId = animationLoop(this.startAddTween.bind(this, displayTime, stickerVOList), displayDuration, 'linear', function progress() {}, function complete() {}, this);

        /*var stickerVO = this.addStickerVOList.shift();
         stickerVO.sticker.visible = true;
         cancelAnimFrame(this.addAniId);
         this.addAniId =
         animationLoop(
         this.addTween.bind(this, stickerVO), 60, 'easeOutElastic',
         function progressHandler() {},
         this.addStickerWithMotion.bind(this),
         this
         );*/
    };

    StickerMain.prototype.roundPixelSticker = function roundPixelSticker(sticker) {
        sticker.scale.x = sticker.scale.y = 1;
    };

    StickerMain.prototype.activeLastTarget = function activeLastTarget(sticker) {
        this.transformTool.activeTarget(sticker);
        this.stickerLayer.setChildIndex(sticker, this.stickerLayer.children.length - 1);
    };

    StickerMain.prototype.startAddTween = function startAddTween(displayTime, stickerVOList, easeDecimal, stepDecimal, currentStep) {

        if (currentStep % displayTime == 0) {

            this.removeLoadingText();

            var stickerVO = stickerVOList.shift();
            var sticker = stickerVO.sticker;

            var completeCallBack = function completeCallBack() {};

            if (stickerVOList.length == 1) completeCallBack = this.activeLastTarget.bind(this, sticker);

            sticker.visible = true;

            animationLoop(this.addTween.bind(this, stickerVO), stickerVO.animationTime, 'easeOutElastic', function progress() {}, completeCallBack, this);
        }
    };

    StickerMain.prototype.addTween = function addTween(stickerVO, easeDecimal, stepDecimal, currentStep) {
        var vo = stickerVO;
        var sticker = vo.sticker;
        var scale = 0 + (vo.scale - 0) * easeDecimal;
        var rotation = 0 + (vo.rotation - 0) * easeDecimal;
        sticker.scale.x = sticker.scale.y = scale;
        sticker.rotation = rotation;

        if (currentStep == vo.animationTime) {
            sticker.scale.x = sticker.scale.y = vo.scale;
            // sticker.emit(TransformTool.TRANSFORM_COMPLETE);
        }
    };

    StickerMain.prototype.startGuide = function startGuide() {
        var _this2 = this;

        var delayTime = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 800;

        this.isGuide = false;
        this._guideId = setInterval(function () {
            _this2.doGuide();
        }, delayTime);

        this._tapOrClickListener = this.tapOrClick.bind(this);
        window.addEventListener('mouseup', this._tapOrClickListener, false);
        window.addEventListener('touchend', this._tapOrClickListener, false);
    };

    StickerMain.prototype.stopGuide = function stopGuide() {
        clearInterval(this._guideId);
        if (this.guideText) this.stickerLayer.removeChild(this.guideText);
    };

    StickerMain.prototype.removeLoadingText = function removeLoadingText() {
        if (this.loadingText) this.stickerLayer.removeChild(this.loadingText);
    };

    StickerMain.prototype.doGuide = function doGuide() {
        if (this.isGuide === false) {
            this.isGuide = true;

            if (!this.guideText) {
                this.guideText = _Painter.Painter.getText('TOUCH SCREEN', 0x1b1b1b, 0xf1c40f);
                // this.guideText = Painter.getText('TOUCH SCREEN', 0xFFFFFF, 0x9b59b6);
            }

            this.guideText.x = this.renderer.view.width / 2;
            this.guideText.y = this.renderer.view.height / 2;
            this.stickerLayer.addChild(this.guideText);
        } else {
            this.isGuide = false;
            if (this.guideText) this.stickerLayer.removeChild(this.guideText);
        }
    };

    _createClass(StickerMain, [{
        key: 'cursorArea',
        set: function set(value) {
            this._cursorArea = value;
            this.transformTool.visibleCursorArea(value);
        },
        get: function get() {
            return this._cursorArea;
        }
    }, {
        key: 'snapshot',
        get: function get() {
            var snapshot = [];
            for (var i = 0; i < this.stickers.length; i++) {
                var vo = this.stickers[i].snapshot;
                vo.childIndex = this.stickerLayer.getChildIndex(this.stickers[i]);
                snapshot[i] = vo;
            }

            snapshot.sort(function (a, b) {
                return a.childIndex < b.childIndex ? -1 : a.childIndex > b.childIndex ? 1 : 0;
            });

            return snapshot;
        }
    }, {
        key: 'modified',
        get: function get() {
            return this.stickers.length !== 0;
        }
    }, {
        key: 'lastSticker',
        get: function get() {

            if (this.stickers.length === 0) return null;

            var children = this.stickerLayer.children;

            for (var i = children.length; i--;) {

                if (this.stickers.indexOf(children[i]) != -1) return children[i];
            }

            return null;
        }
    }, {
        key: 'target',
        get: function get() {
            return this.transformTool.target;
        }
    }]);

    return StickerMain;
}(PIXI.utils.EventEmitter);

},{"../transform/TransformTool":6,"../utils/Calculator":7,"../view/VectorContainer":12,"./../utils/Painter":9}],3:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RotationControlType = exports.RotationControlType = function () {
    function RotationControlType() {
        _classCallCheck(this, RotationControlType);
    }

    _createClass(RotationControlType, null, [{
        key: 'NONE',
        get: function get() {
            return 'rotationNone';
        }
    }, {
        key: 'DELETE',
        get: function get() {
            return 'rotationDelete';
        }
    }, {
        key: 'TOP_LEFT',
        get: function get() {
            return 'rotationTopLeft';
        }
    }, {
        key: 'TOP_CENTER',
        get: function get() {
            return 'rotationTopCenter';
        }
    }, {
        key: 'TOP_RIGHT',
        get: function get() {
            return 'rotationTopRight';
        }
    }, {
        key: 'MIDDLE_LEFT',
        get: function get() {
            return 'rotationMiddleLeft';
        }
    }, {
        key: 'MIDDLE_RIGHT',
        get: function get() {
            return 'rotationMiddleRight';
        }
    }, {
        key: 'BOTTOM_LEFT',
        get: function get() {
            return 'rotationBottomLeft';
        }
    }, {
        key: 'BOTTOM_CENTER',
        get: function get() {
            return 'rotationBottomCenter';
        }
    }, {
        key: 'BOTTOM_RIGHT',
        get: function get() {
            return 'rotationBottomRight';
        }
    }]);

    return RotationControlType;
}();

},{}],4:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.ToolControl = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Mouse = require('./../utils/Mouse');

var _Calculator = require('./../utils/Calculator');

var _ToolControlType = require('./ToolControlType');

var _RotationControlType = require('./RotationControlType');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToolControl = exports.ToolControl = function (_PIXI$Sprite) {
    _inherits(ToolControl, _PIXI$Sprite);

    _createClass(ToolControl, null, [{
        key: 'DELETE',
        get: function get() {
            return 'delete';
        }
    }, {
        key: 'MOVE_START',
        get: function get() {
            return 'moveStart';
        }
    }, {
        key: 'MOVE',
        get: function get() {
            return 'move';
        }
    }, {
        key: 'MOVE_END',
        get: function get() {
            return 'moveEnd';
        }
    }, {
        key: 'ROTATE_START',
        get: function get() {
            return 'rotateStart';
        }
    }, {
        key: 'ROTATE',
        get: function get() {
            return 'rotate';
        }
    }, {
        key: 'ROTATE_END',
        get: function get() {
            return 'rotateEnd';
        }
    }, {
        key: 'CHANGE_ROTATION_CURSOR',
        get: function get() {
            return 'changeRotationCursor';
        }
    }, {
        key: 'DBCLICK',
        get: function get() {
            return 'dbClick';
        }
    }, {
        key: 'DBCLICK_TIME',
        get: function get() {
            return 200;
        }
    }]);

    function ToolControl(type) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var rotationControlType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : _RotationControlType.RotationControlType.NONE;

        _classCallCheck(this, ToolControl);

        var _this = _possibleConstructorReturn(this, _PIXI$Sprite.call(this));

        _this.type = type;
        _this.options = options;
        _this.rotationControlType = rotationControlType;
        _this.rotationCursorList = options.rotationCursorList;
        _this._cursorIndex = _this.getCursorIndex();

        _this.currentRadian = 0;
        _this.currentRotation = 0;

        _this.buttonMode = true;
        _this.interactive = true;
        _this.defaultCursor = 'inherit';
        _this._localPoint = new PIXI.Point();
        _this.drawAlpha = 0.0;

        _this.initialize();
        _this.render();
        _this.addCursorEvent();
        _this.addMouseDownEvent();
        return _this;
    }

    ToolControl.prototype.initialize = function initialize() {
        this.g = this.graphics = new PIXI.Graphics();
        this.addChild(this.graphics);
    };

    ToolControl.prototype.render = function render() {
        switch (this.type) {
            case _ToolControlType.ToolControlType.TOP_LEFT:
            case _ToolControlType.ToolControlType.TOP_CENTER:
            case _ToolControlType.ToolControlType.TOP_RIGHT:
            case _ToolControlType.ToolControlType.MIDDLE_LEFT:
            case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
            case _ToolControlType.ToolControlType.BOTTOM_LEFT:
            case _ToolControlType.ToolControlType.BOTTOM_CENTER:
            case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                this.drawControl();
                break;

            case _ToolControlType.ToolControlType.MIDDLE_CENTER:
                this.drawControl();
                break;

            case _ToolControlType.ToolControlType.ROTATION:
                this.drawRotation();
                break;

            case _ToolControlType.ToolControlType.DELETE:
                this.drawDeleteButton();
                break;
        }
    };

    ToolControl.prototype.drawControl = function drawControl() {
        var innerRectSize = 3;
        var innerRectHalf = innerRectSize / 2;
        var outerRectSize = 5;
        var outerRectHalf = outerRectSize / 2;
        var buttonRectSize = 10;
        var buttonRectHalf = buttonRectSize / 2;

        this.g.clear();
        this.g.beginFill(0xFF33FF, this.drawAlpha);
        this.g.drawRect(-buttonRectHalf, -buttonRectHalf, buttonRectSize, buttonRectSize);
        this.g.beginFill(0xFFFFFF, 1);
        this.g.drawRect(-outerRectHalf, -outerRectHalf, outerRectSize, outerRectSize);
        this.g.beginFill(0x000000, 1);
        this.g.drawRect(-innerRectHalf, -innerRectHalf, innerRectSize, innerRectSize);
        this.g.endFill();
    };

    ToolControl.prototype.drawCenter = function drawCenter(rotation, width, height) {
        this.rotation = rotation;
        this.g.clear();
        this.g.beginFill(0xFF33FF, this.drawAlpha);
        this.g.drawRect(-(width / 2), -(height / 2), width, height);
        this.g.endFill();
    };

    ToolControl.prototype.drawRotation = function drawRotation() {
        var buttonRectSize = 22;
        var buttonRectHalf = buttonRectSize / 2;
        this.g.clear();
        this.g.beginFill(0xFF3300, this.drawAlpha);
        this.g.drawRect(-buttonRectHalf, -buttonRectHalf, buttonRectSize, buttonRectSize);
        this.g.endFill();
    };

    ToolControl.prototype.drawDeleteButton = function drawDeleteButton() {
        this.deleteTexture = PIXI.Texture.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAAB2UlEQVRIie2VTUsqYRTHj2M4MhHUIKLDCC58QxHdulHEnWsXfYco0kUUVHKDXqgJLtw2fYC+haDixpUgA8KIgsj4Hm1qTCf03EW3W9xL40yCtPC/eRbnPOd3Dvyf8+gA4AYWpJU/5/0CWCZiAZC/WsKWsK/DotEoPZlMjg0Gg25WIURMzwXLZrMPLpfrajQaHVutVoMSiCTJk7lgAAD1ev05Fov9arVaB6FQaP1jLBKJ0IiYttlsF7Is49wwgNcJE4nEbaFQ2Ha73dQbKJfLbdM0fSqK4lhNHR287kZV64plWbLZbO47nc7LWq22ZzabzwaDwYuauwBgWpmd8y5RFMcEQfxAxHQymbzTAAIAjdYPh8MbiJj2+/3XHMdtqnGpZpjRaCTsdrsxn8/v+Hw+rlKpPAWDwZ/D4fDQ4/GsEoS6nvUAEAeAoVJSPB43F4vFXYvFct5oNEaICP1+X65Wq7VMJrPF83xVEIQnREVDUjMNQlEUIUnSEcMw551OR/43HggE1kqlUtLr9XKCICg1rfyfsSxLSpJ05HA4Lnu93n8gAIByufyo1+tPeJ7fTaVSTqV6mqyvJIZhyG63O55Op5+laLO+ktrt9syH/X22/hL2LWFvbjQtAvYb9NC0/9Sr3AYAAAAASUVORK5CYII=');
        this.deleteOverTexture = PIXI.Texture.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAYAAACN1PRVAAABCElEQVRIie3UvWrDMBDA8VNtD8EfIojYwlPA0Rrw4HcIef9XyRAh9O/SlgaaWC4htGDBLcdJP4HupEQEedF6exW0Yiv2jzDnnIQQJMuy2YMgbVx5FMYYYozUdX23BiDLsofnfMRsAc45Yozs9/ub/OFwAEBrnQKlYSLCOI5479ntdjfQZrNJhdIxEUFrTYwRYwwAZVkugZZh39/odDot3rcIG4YBAGst1+s1tSmWYXmes91uAei6DqUU1lq897Rti1LqedjxeASgqqqb/DRNeO8ZxzEVfFxQFAXA3Tnr+54QwleX/hrTWgNgjJm9+eVy4Xw+P78bf4qmaWYvpD7FV6y/8+uv2Iq9A1yTczX16ka0AAAAAElFTkSuQmCC');
        this.texture = this.deleteTexture;
    };

    ToolControl.prototype.hideAllRotationCursor = function hideAllRotationCursor() {
        if (this.type !== _ToolControlType.ToolControlType.ROTATION) return;

        var n = this.rotationCursorList.length;
        for (var i = 0; i < n; i++) {
            this.rotationCursorList[i].visible = false;
        }
    };

    ToolControl.prototype.addCursorEvent = function addCursorEvent() {
        this.mouseover = this.onMouseOver.bind(this);
        this.mouseout = this.onMouseOut.bind(this);
        this.mousemove = this.onMouseOverMove.bind(this);
    };

    ToolControl.prototype.addMouseDownEvent = function addMouseDownEvent() {
        this._mouseDownListener = this.onMouseDown.bind(this);
        this.on('mousedown', this._mouseDownListener);
    };

    ToolControl.prototype.removeMouseDownEvent = function removeMouseDownEvent() {
        this.off('mousedown', this._mouseDownListener);
    };

    ToolControl.prototype.addMouseMoveEvent = function addMouseMoveEvent() {
        this._mouseMoveListener = this.onMouseMove.bind(this);
        this._mouseUpListener = this.onMouseUp.bind(this);

        window.document.addEventListener('mousemove', this._mouseMoveListener);
    };

    ToolControl.prototype.removeMouseMoveEvent = function removeMouseMoveEvent() {
        window.document.removeEventListener('mousemove', this._mouseMoveListener);
        window.document.removeEventListener('mouseup', this._mouseUpListener);
    };

    ToolControl.prototype.onMouseDown = function onMouseDown(e) {
        e.stopPropagation();

        var globalPoint = { x: e.data.global.x, y: e.data.global.y };

        this.prevMousePoint = this.currentMousePoint = globalPoint;
        this.targetPrevMousePoint = this.targetCurrentMousePoint = this.targetLayer.toLocal(globalPoint);

        var time = new Date().getTime();

        if (this.startTime && this.type == _ToolControlType.ToolControlType.MIDDLE_CENTER && this.downTarget && this.downTarget == this.target) {
            if (time - this.startTime < ToolControl.DBCLICK_TIME) {
                this.emit(ToolControl.DBCLICK);
                this.startTime = null;
                this.downTarget = null;
                return;
            }
        }
        this.startTime = time;
        this.downTarget = this.target;

        if (this.type === _ToolControlType.ToolControlType.ROTATION) {
            this.prevRotation = this.currentRotation = _Calculator.Calc.getRotation(this.centerPoint.globalPoint, {
                x: e.data.global.x,
                y: e.data.global.y
            });
            this.currentRadian = _Calculator.Calc.toRadians(this.currentRotation);

            this.emit(ToolControl.ROTATE_START, {
                target: this,
                type: this.type,
                currentRadian: this.currentRadian,
                currentRotation: this.currentRotation,
                currentMousePoint: this.currentMousePoint
            });
        } else {
            this.emit(ToolControl.MOVE_START, {
                target: this,
                type: this.type,
                currentMousePoint: this.currentMousePoint,
                targetCurrentMousePoint: this.targetCurrentMousePoint
            });
        }

        this.addMouseMoveEvent();
        window.document.addEventListener('mouseup', this._mouseUpListener);
        // this.removeMouseDownEvent();

        this.prevMousePoint = this.targetPrevMousePoint = null;
    };

    /**
     * mouse point p를 imageRect와 충돌 검사한다.
     * 1. 충돌하지 않은 경우 p가 어느쪽에 있는지 확인 후
     *    p0 -> p의 선분과 boundary를 이루는 4개의 선분의 교점을 찾아 반환한다.
     * 2. 충돌한 경우 p를 그대로 반환한다.
     * @param  {[type]} p  [description]
     * @param  {[type]} p0 [description]
     * @return {[type]}    [description]
     */
    ToolControl.prototype.hitTest = function hitTest(p, p0) {

        if (hitTestWithBoundary(p.x, p.y, ToolControl.imageRect)) return p;

        return getIntersectionWithlines(p0.x, p0.y, p.x, p.y, _lines) || p;
    };

    ToolControl.prototype.onMouseMove = function onMouseMove(e) {

        var globalPoint = _Mouse.Mouse.global;
        this.currentMousePoint = globalPoint;
        this.targetCurrentMousePoint = this.targetLayer.toLocal(globalPoint);

        this.prevMousePoint = this.prevMousePoint || this.currentMousePoint;
        this.targetPrevMousePoint = this.targetPrevMousePoint || this.targetCurrentMousePoint;

        //this.targetCurrentMousePoint = this.hitTest( this.targetCurrentMousePoint, ToolControl.imageRect.center );

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        this.targetChangeMovement = {
            x: this.targetCurrentMousePoint.x - this.targetPrevMousePoint.x,
            y: this.targetCurrentMousePoint.y - this.targetPrevMousePoint.y
        };

        this.moveRotationCursor();

        if (this.type === _ToolControlType.ToolControlType.ROTATION) {
            this.currentRotation = _Calculator.Calc.getRotation(this.centerPoint.globalPoint, _Mouse.Mouse.global);

            this.changeRotation = this.currentRotation - this.prevRotation;
            this.absChangeRotation = this.changeRotation < 0 ? this.changeRotation * -1 : this.changeRotation;

            if (this.absChangeRotation < 100) {
                this.emit(ToolControl.ROTATE, {
                    prevRotation: this.prevRotation,
                    changeRotation: this.changeRotation,
                    currentRotation: this.currentRotation,
                    currentRadian: _Calculator.Calc.toRadians(this.currentRotation),
                    changeRadian: _Calculator.Calc.toRadians(this.changeRotation)
                });
            }

            this.emit(ToolControl.CHANGE_ROTATION_CURSOR, this.getRotationCursor());
        } else {
            this.emit(ToolControl.MOVE, {
                target: this,
                type: this.type,
                prevMousePoint: this.prevMousePoint,
                changeMovement: this.changeMovement,
                currentMousePoint: this.currentMousePoint,
                targetPrevMousePoint: this.targetPrevMousePoint,
                targetChangeMovement: this.targetChangeMovement,
                targetCurrentMousePoint: this.targetCurrentMousePoint
            });
        }

        this.prevRotation = this.currentRotation;
        this.prevMousePoint = this.currentMousePoint;
        this.targetPrevMousePoint = this.targetCurrentMousePoint;
    };

    ToolControl.prototype.onMouseUp = function onMouseUp(e) {
        var globalPoint = _Mouse.Mouse.global;
        this.currentMousePoint = globalPoint;
        this.targetCurrentMousePoint = this.targetLayer.toLocal(globalPoint);

        this.prevMousePoint = this.prevMousePoint || this.currentMousePoint;
        this.targetPrevMousePoint = this.targetPrevMousePoint || this.targetCurrentMousePoint;

        this.changeMovement = {
            x: this.currentMousePoint.x - this.prevMousePoint.x,
            y: this.currentMousePoint.y - this.prevMousePoint.y
        };

        this.targetChangeMovement = {
            x: this.targetCurrentMousePoint.x - this.targetPrevMousePoint.x,
            y: this.targetCurrentMousePoint.y - this.targetPrevMousePoint.y
        };

        this.moveRotationCursor();

        if (this.type === _ToolControlType.ToolControlType.ROTATION) {

            this.currentRotation = _Calculator.Calc.getRotation(this.centerPoint.globalPoint, _Mouse.Mouse.global);

            this.changeRotation = this.currentRotation - this.prevRotation;
            this.absChangeRotation = this.changeRotation < 0 ? this.changeRotation * -1 : this.changeRotation;

            if (this.absChangeRotation < 100) {
                this.emit(ToolControl.ROTATE_END, {
                    target: this,
                    type: this.type,
                    prevRotation: this.prevRotation,
                    changeRotation: this.changeRotation,
                    currentRotation: this.currentRotation,
                    currentRadian: _Calculator.Calc.toRadians(this.currentRotation),
                    changeRadian: _Calculator.Calc.toRadians(this.changeRotation)
                });
            }
        } else {
            this.emit(ToolControl.MOVE_END, {
                target: this,
                type: this.type,
                prevMousePoint: this.prevMousePoint,
                changeMovement: this.changeMovement,
                currentMousePoint: this.currentMousePoint,
                targetPrevMousePoint: this.targetPrevMousePoint,
                targetChangeMovement: this.targetChangeMovement,
                targetCurrentMousePoint: this.targetCurrentMousePoint
            });
        }

        // this.addMouseDownEvent();
        this.removeMouseMoveEvent();
    };

    ToolControl.prototype.onMouseOver = function onMouseOver() {
        this.defaultCursor = this.getCursor();
        if (this.type === _ToolControlType.ToolControlType.DELETE) this.texture = this.deleteOverTexture;
        if (this.type === _ToolControlType.ToolControlType.ROTATION) {
            this.rotationCursor = this.rotationCursorList[this.cursorIndex];
            this.rotationCursorHalfWidth = this.rotationCursor.width / 2;
            this.rotationCursorHalfHeight = this.rotationCursor.height / 2;
            this.moveRotationCursor();
            this.rotationCursor.visible = true;
        }
    };

    ToolControl.prototype.onMouseOut = function onMouseOut() {
        if (this.type === _ToolControlType.ToolControlType.DELETE) this.texture = this.deleteTexture;

        if (_Mouse.Mouse.defaultCursor !== 'none') {
            this.rotationCursor = null;
            this.hideAllRotationCursor();
        }
    };

    ToolControl.prototype.onMouseOverMove = function onMouseOverMove() {
        if (this.type === _ToolControlType.ToolControlType.ROTATION) this.moveRotationCursor();
    };

    ToolControl.prototype.moveRotationCursor = function moveRotationCursor() {
        if (!this.rotationCursor || this.rotationCursor === null) return;

        var cursor = this.rotationCursorList[this.cursorIndex];

        if (this.rotationCursor !== cursor) {
            this.rotationCursor.visible = false;
            this.rotationCursor = cursor;
            this.rotationCursor.visible = true;
        }

        this.rotationCursor.x = _Mouse.Mouse.globalX;
        this.rotationCursor.y = _Mouse.Mouse.globalY;
    };

    ToolControl.prototype.getAngleIndex = function getAngleIndex() {
        var angle = this.angle;
        if (angle > 337.5 && angle <= 22.5) {
            return 0;
        } else if (angle > 22.5 && angle <= 67.5) {
            return 1;
        } else if (angle > 67.5 && angle <= 112.5) {
            return 2;
        } else if (angle > 112.5 && angle <= 157.5) {
            return 3;
        } else if (angle > 157.5 && angle <= 202.5) {
            return 4;
        } else if (angle > 202.5 && angle <= 247.5) {
            return 5;
        } else if (angle > 247.5 && angle <= 292.5) {
            return 6;
        } else if (angle > 292.5 && angle <= 337.5) {
            return 7;
        } else {
            return 0;
        }
    };

    ToolControl.prototype.getCursor = function getCursor() {
        switch (this.type) {
            case _ToolControlType.ToolControlType.TOP_LEFT:
            case _ToolControlType.ToolControlType.TOP_CENTER:
            case _ToolControlType.ToolControlType.TOP_RIGHT:
            case _ToolControlType.ToolControlType.MIDDLE_LEFT:
            case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
            case _ToolControlType.ToolControlType.BOTTOM_LEFT:
            case _ToolControlType.ToolControlType.BOTTOM_CENTER:
            case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                return this.getScaleCursor();
            case _ToolControlType.ToolControlType.ROTATION:
                return this.getRotationCursor();
            case _ToolControlType.ToolControlType.DELETE:
                return 'pointer';
            case _ToolControlType.ToolControlType.MIDDLE_CENTER:
                return 'move';
        }
    };

    ToolControl.prototype.getScaleCursor = function getScaleCursor() {
        switch (this.cursorIndex) {
            case 0:
                // 337.5-22.5, TOP_CENTER
                return 'ns-resize';
            case 1:
                // 22.5-67.5, TOP_RIGHT
                return 'nesw-resize';
            case 2:
                // 67.5-112.5, MIDDLE_RIGHT
                return 'ew-resize';
            case 3:
                // 112.5-157.5, BOTTOM_RIGHT
                return 'nwse-resize';
            case 4:
                // 157.5-202.5, BOTTOM_CENTER
                return 'ns-resize';
            case 5:
                // 202.5-247.5, BOTTOM_LEFT
                return 'nesw-resize';
            case 6:
                // 247.5-292.5, MIDDLE_LEFT
                return 'ew-resize';
            case 7:
                // 292.5-337.5, TOP_LEFT
                return 'nwse-resize';
        }
    };

    ToolControl.prototype.getRotationCursor = function getRotationCursor() {
        return 'none';

        /*switch (this.cursorIndex) {
            case 0: // 337.5-22.5, TOP_CENTER
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAyRJREFUOBGNVF1IU2EY9pz9z9YkRdaPIfhHiV4V3Sy80S4jijLqwvDGO/Uq6KLLqBtpN+G9SndJmSBZlDYbNjeGLWSW2CQxt0E65+bmfk7Pc/I7HRdELzx7v/d7f7/3fc+kiv8jSWemPyu6e/1Zd334qHemhrJwFDryctCWRNtyiHvyv0gflEohC0PKMmDQcZFcJCpBVwQEF/e40uLxjqQwmAggJ5PJ85AZnDACZsAK2IBKwK5DuWyBjvb0EzEY8xxkfR41IQ3MhULBt7y8fBHnI8BR4FhLS8uJ2dnZqxsbG4/hPJnNZkPAJ2BxZ2dnKhaLPfH7/bc7OztP0x5wACymErpr+Xz+Gc4mgDnUDjI7q7JDGUqn03PT09OXqqurTwaDwTu7u7tvw+Hw68HBwZnW1tavJpMpB1vFaDTmUcxqb2/vnM/newW/D5FIZKC9vf0U9LVLS0s39/b2/Llc7jlkdog5JDEjCpb9/X1vV1eXPDExkYbhWiKRqO3p6XEFAoEzkiQpCPYFSLhcrlw8HjejG1ULCwtni8Wiob6+/vvo6Gikra0tH41G39TV1V3v6+uTR0ZG4na7/Rbis9ACoPaXvXciySK40tHR8dnj8bwzGAwFh8ORHBoamkqlUu/R8nHYPALuAQ8hP81kMnNjY2OTNTU1Cfr29/d7Nzc3PzY1Na01NzdH0aFJ3LPNbKvWUias4mzAxZYpbrc7vLW15UWyBysrK43QcQ4cgQa85jiS3gW83d3d8/Q3m81q23UJuQ9qQjqSmKTEtqnSwY/NZitYLJYKVPyysbExSpsyKGhlDC3zYF7jw8PDRXQkhdHwASTlICb9tNh8prY0BwrtlZhpAAFmtre3ud5qS8D1JGNhrmBjZxoaGr5Bofnihavo2gvccWnULWUAgi81YPjzoVDoh6IoamBWhzmWEKgSlbPqAdwFwTWC7WUI97FEP9fX1/P0Ff7wkeCbxWbfgA3/HNTAomoZs3KjIhmJ1TskU6xWawmfAD8DIqNPiMCs+gKWxwBIhN4f4yjJspx2Op0sUn25SFbOoT9ENCYJ/lv68/svf72P8gunF5KUe/EFxQAAAABJRU5ErkJggg==') 14 7, auto";
            case 1: // 22.5-67.5, TOP_RIGHT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1Rjc3NTE3RDZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1Rjc3NTE3RTZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVGNzc1MTdCNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVGNzc1MTdDNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bXt2owAAA1tJREFUeNqsVt1LWmEY99XjR7ZNZ8yGC0YrG2ODddXNBjXGrlpjH25rhKj76Cbovqv9A4PddN9N7kLYYNiFoMyltmBusUqIIHJCzTJD0yzNr/1e9xrH0wfH2gsPnvfjPL/3eZ7f7zkSycFBJIePsuSEQ3oIAGHr0kKh8Ix3hkj+w6g652DKTCbzulQq+fEsh8lOAyIVRECdyTc2Nmy5XM5cLBbpvoKtS5mRegGlghTJV1dXX+bz+RddXV2XkS66pmJA1YhkvHdIvZHI1tfXLYSQp52dndfw3IR0Kbxe752RkRED9ht4gJwATFQtuGQyORiNRr16vT5GmaRQKHJjY2OeQCDgTqVS37HvmJ2d7W9vb7+A/XMMVM7LxvEgqMFV5P9nT0/PL0bVGuM4Lt/b2/tjfn6eAjodDsdtrJ+HNYoFqqQqHo8/3tra8uGmv6ljjUaTDIfDkx6Px2Wz2fxqtXqbrpvN5m+IanpmZsaMeZNYoP2iI12mRCLhp0BarTYBhk0vLS09B51H0+m0b3h4+AsFovubm5tTDEgHU7M6ETEaUaDgT2hEYFcILPOz3Csikcj1vb09u9vtnkC9shQI56bHx8dvYV9DtSVGT/sRIe8Pd3d3fWDXJLthRSNOp1MNoPcul2uCRmS1WgM4+7m1tbWZpY0TRQLmUJbNZh+Uy2WvQEuEAX0YGhqie+VQKOQJBoP9eNayaKRiKV0xgNwVaKFyibW1tRuIwKdSqTJ9fX1BSm9GgobTtqAaNiLSUYvF4qP0pjoCKYxYPyNgGpGIDe2QzwAB4yYHBgbSaD0c9JM0mUw3GQDH63WVs5xY70gdvaWJNk2wjsD5pY6ODtpiJKA5uYeB34vQUwFWVCqVJUjgE6SQFA2CnrYNoLhMJnuLQkfn5uY40L0Smd1u1+/s7EgxrhiNxkJ3d3cz2PkOAKnqDY81IRZlHYT5ta2tLSxsPy0tLX9isZh/ZWXFyprpPxLUC0JfRFd4RAULoEgVwGAwRMG6qcXFxTeYn2XdWnpSkIpgaWeotiAaAeaBhYWFQaYXVQ2V6wSpaUG019GI0MV9y8vLr1h7UfG6RAWEHOGIX/DjBEtTdx8+GnU63UfMi8z4tToxiETwCSZCx/y/UNwplF8+4v/YgVv/FWAAZA0E5twGSyUAAAAASUVORK5CYII=') 12.5 12.5, auto";
            case 2: // 67.5-112.5, MIDDLE_RIGHT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAztJREFUOBF9VN9rUnEU915NS5BV2JRqa7CYkOAeEgqmSTF7jC2IPfU22Nvajzehl6CHHmR/xN6FbCP6icsZgYrDLXFzNFcgONlQNyf+urfP+d77vdwN6sC53+/3nPM53/PrewWDQoK60qLf01mmj0ra3gQBNxTVPZ25jOwlMAE4iK0EJCKQEUxnYjoT9VTuqisHMyPh+PjYZ7ValyRJEsCiLMsCiD6cm41GY76vry9J3kDMgVipVB6mUqlVVUBCxoFAIAvA+vb2th+yC2AeibLp9XoC3QKFRgD9jEajjUQi8crlcm1oCnXDczwvN0xOTlZarVZ5YmJiC0p9wWgvs6uNRiPLhdDBYHDD5/NtLS4u+pFCfzwefwwxXUDFOxOViOIEMpnMO4BSp6en8aOjo3WbzVbzer25k5OTLwj1OkA28Jk8hWaz+aBer39tt9uxQqFwH45eh8Ph9zCUNzc3P62trT3F/gr4Ili7Weh0On4UZ71arXqhMO3u7t4G+BvaIc3NzcVKpdIS5NfAVtKDlZABukusCkho7Ha7kdHR0bzb7S7UarUVyBxgHq7AigPPaWIotB6iRQWPx1PZ2dkZtFgsN6AjhxprDYXwPNWcTmcLaZih4HkpIULwP6Dt4ODAbDKZaE7ZiOlWBYj8yCMnFg56ewujdnl4ePgPql2CUv9KlAGA8B7AT7BSBEKxWOyH8WAymbwzNjZWQrt+qUAOVgxRQbrxJQaawCa73f48EolUUSDj9PR0Y39//zvk/InxsA1sAMrl8gcMQezw8HCepgfgytDQ0G84S4yPjw8CSK2gQml1YSOXTqdXkM8exi0xNTX1AwYyJuZjPp9/gf1V8CUwry628KB/j5jROmTy7OxsHJO0il7exFl/G2sJu1b/HjFqNjS8HQqFzCjS52w22waQisILw3LU4oVCI7xDMx6yY2Bg4Fkul3sEhVYQbsQeMm6QEKIwMjKyBwXrI9pjmJmZEZeXlxdQuI7D4Xir6pgTZoQh9uJnFULIIjFASh6iKGEQJFEUe6j0G/ysUurtzICBIaCK8ZdOKZBnYuofjZ0+T/Vd6aYeBtwRtoy4A/2qAcmChafY/vNLYEZ/ARukibLGcoOhAAAAAElFTkSuQmCC') 7 14, auto";
            case 3: // 112.5-157.5, BOTTOM_RIGHT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA71JREFUSA2lVUlPU1EYhU6UYi1qJIGwYlghsIGVkQ0JG8QRg4YgjVNMmhB/gQv+gAsXpCtcgFEjJgoaQouFUuwCIYHCCoSSME9lKnR+nvPoNWD7kMYvOX33ft+999xvuk1P+z9JV9guHderjk9SHJOAUK2vrxfjq+Y4rlMih/nsIh+O5dqNjY070Wh0dHt7+xnmGYAGEGQYHk3kQQo/wgPN8vLyTa1W+6K6ulp9eHj4YHV19RHO0QH0SqxL4eijpX88wIF3fT7fUFFRkRcmKScnZ21paWlwcXHRgnkmkOARdGcSkqh3d3dv7ezsOAUBdEy0IBpAjp5jztAJjzA8u6QHAoEbCI2zsrLSYzKZfMA2tks6nS5oNBr3SLy1tTXo9/ufQJ86iSRJ1YAjFosNhsPhoWAw6J6bmxskSXt7ux0Hj+ICbtiGscYViUQaYKP3KYnICeOdOTMz02C323sxllwul83hcNRjfAnIArSAXGX8SVUY/xgQzc3NvdbZ2Zml0WgiZWVlpr6+vgnog0A4vuZEU0KXXBCec39ZZG/m5+dL9vb2nAaDwV9bW/sTffIB6y4AekDkQjFUNMgAwXXAHJ/jc6Tv7u42hEKhzpaWlu/QSR6PxzY+Pn4fYyPAMCkeDptsZAjVrCIQjCB5bDBBrIoTvLLZbD3QS01NTT9Q0t2oqsuYGwDmS5GEBhJo0WS3EYoBt9v9BdXyOL5RvbKycgUevO3t7e1ByQZYrgiTu6ur6yrWnAfY7TwjKYkg0LGT2WiFhYVzVqv1G8hebm5u3sPhr3Fjp8ViceAQiQTQD4+NjTVhzlyILj+VQIu3qJ5PBQjmeVBra6vd6/XaUDVfm5ubnXq93k+92Wx24SLuOEFCyWJNgpBZzRDFnwqZADr5qRBflGm4rq5uZHJy0g6PPnd0dDBEF4ETPYF5gjBJlHQkOQshSUPCWR2y1NTUTDQ2Nq4hNFJpaWk2utg7PT39qby83IFOD2AR+4GIAuJSGCaK7AnUmbOzs4+RE1deXt4y5lJbW1s/Xlar0+msR7nyj4mhyQZ4+6T/HdAniPCEt4gWFBR8nJqa0iDWDysqKiSVShU7ODjwVFVV9cMubix3O+bcwzGFY0VhuQk36XKwpKTkPXLzBkS/iouLI+joCPQMDZ+LEHCcTOyF+t/CkJGQnvFZMC4sLJjxtzqGPniKOfOkWP+wnSrHw8WFdJ83jeXn57/b398PZWRksP6pT+nWWK8o9Eh4xUdODU/YaEKvuPE0Azcnk2T6U5Ob7BCh+w13D8jLwsORsAAAAABJRU5ErkJggg==') 12.5 12.5, auto";
            case 4: // 157.5-202.5, BOTTOM_CENTER
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAy1JREFUOBF9VE1IG1EQdpNs/jQNiAlW0h8UYkEIWCN4EQ/V3irFXgoFLd682PRorz3YS6iXHjwK4qktLRWkhlKtqWColcSSotEmXiS2KElM1MRkt9+87ixbKX3wMfPmzcw3M5mNVPfnSJokYdTZrGoKS7az5BiWbGfJcSo7kJTy+XyXoij15XLZRJ5ms1m12+2KxWJRNdRgXpMkiaQ4qqp2VatVJyARzs7OTLVaTeTleJfLFYWzQgEWQJBBmp1O55Pd3V378fGxqAiJVYLP55O9Xm8jfJ4ayXAXB8VMnp6eVhBbApkJRQhCiu3s7LwMpx7NVZDSoxlwoLq3fr//B3QiFGhra0sXCoWlUql0FzbROaTxSLlcLlipVJYGBga+4EGPJf38/HwD0glwc6JDujQg6TsQpsmRgFEUjo6OPh8eHj7G3QoQoagekg/dLalUqufk5GQFpESgk+LnieN+CZABE1dMQTwKkdBqtVYwWtfY2JjZ4XAMFYvFUDqd9sJP+JI/Y2dn53pzc/MdJK/DaKl4/Wjj/atQSkDsLiSdR4eZ9vb2TDabXRsfH1+BXW1qavo1Ozs7jw6iWIw5JJ4EJoBnuL9GYZ/C4fACJpLHolSnpqY+9vX1faNY+FCHbkBMiMgIVJUNCeeGh4e909PTyt7e3svW1tZb8XhcHhkZuZHJZK4gWa27uzuJgnLoqLy/v29PJBIewE+dBIPB7zMzM1mPx/PTZrNdGxwcrI9EIgqm1Yv8ZaAK6IQOVPMGI4klk8n7sHsDgYBve3v7EX7bVZz3o6OjUVoq6gLvqizL5Y6OjlQoFFra3NyMYEIf1tfXH2LbWxYXF28jLnphacRPSB3Slsp4fHVwcHAPer0GF2Rjf3//1Vgs9gBvL7CxC9jmOJAANvDtzqPT58vLy0PovIX8AVqShq2trV6MfBU6jZM4JB6pkPThu93ur3jgQxWRI42cfmfSeVmg6ttI3xd1zaA/BtrUOuS8iZz650JEdC5K4azZ6Y2JWIoCYef1JwIiZcnxMInDd/2vjR8uSmMhTMKSfZnUKOmNScifdb0zDv6fZHLyMep6MtiN+j9z/Qasm4fFL/kTlgAAAABJRU5ErkJggg==') 14 7, auto";
            case 5: // 202.5-247.5, BOTTOM_LEFT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA6lJREFUSA2lVUlLW1EUNiZGY4zGxhoiIggqQqtLEVqo0KVYOqTowqYKHRFcdeOy/oFuCl260S5EkFYLYtLGTKTUKg3RhSixLpI4GzXikOH1+0KuxDHRHji8e84993xnuvfJss4n2Tlq6RxdRirFKSvhnF/BdC4AxPfUscvF7JRt4ZQ6gis3Nzfbtra2HmAtB4t9LK9GIhPhQADk+nw+YywWe65UKrOCwaDcYDB8heto0v21MiIIo80Da2dnZ1+vrKw4y8vLA1VVVX+RjQPyE+zlgBkI7a9EPMCDSrBmbm7u5fLysqusrCwIOdEPAm1vb9sB9gg6UTosM6fjLPx+f+fq6qqDGeB4AkB8q6urfbu7uxMHBwfs0ZUyoXEik3A43KpSqd7ZbLaV+fl5RTwezx4eHi4ZHx+v7+3t/a7X64/q6+ujjY2NBpx5L5PJRvHNiBKND4VChXK5XIVIP9XW1sorKioU+fn5deA4QLJMJpOk0+l+KhQKP4ZBgm2JJEkFAApnhAIjkQ1rzcaqwMV2u93ocrnGsZYA9G1jY+Mp1gxK2GOZGbHhYhzjWMfAHNPI0NCQp66uTovoowMDAxq1Wn0vxVacgerqxCiZEbPRoYyDLS0tk3l5eXs7Ozt2TN1t6FNHOJEVSncfepEhv2mJTnLB2snJybaZmRkL1lJXV5f16Ojo88jISD7kVIfZALEmp44BpgYB8XyiA9ZeXVlZqUcGXzo6OpyQpbGxsVEAfUgC0RmZk2jb39+3w/Yh5IwuLEEYEbMp6u/vv4OL6OaFxBNzYDabCTSwtLR0C/u8wKpIJOJoaGjw8sImXwbq02YksmFpbkxPTz/DdLkIBFnq7u7+gXG37+3tfVxYWGg9PDx0a7XaLfEE4a0zwi5tRgRhJDRUg3UAMmEQ3O3t7W7IEu5QuLOz02GxWMYWFxdtRUVFIerFE7S+vv4YMitCXxfSaaDiwcHBu6j7iNfrNTc3N//GeEdw+sTzQ7mpqekPLu3U2tpaDeRLQYieCsSxLkSkNz0eTxvHGz345XQ6zX19fRb06xD7Umlp6SrKNYH9V5DF5cXychJAPMCGsk8acHFPT0+N1Wo1ojdTGo1mlwCBQGACzX+LfQ5O2nLB5pgIlArGXvHfUwDWYXwT0wcAG17yLugYCINKO2GwOUOpYIySmakxwi78qm3owRvILGvayYJNRkRAAuXgMjpRshdYs0TXzgBnz5DISh6NRluxS0DymRLR8H/oovMnXul/F7SWjoEFkdEAAAAASUVORK5CYII=') 12.5 12.5, auto";
            case 6: // 247.5-292.5, MIDDLE_LEFT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAz9JREFUOBFtVN9LU3EU997b7nJrG+hkYWKGOEFBIhdIWFHMFx+iN4NASv+A8EXfetxTkD304rNo0INgVhhkybURbmuwcDCnDRNxOtT9cIr7cW+f83Xf23XswNn5nvP9fs4538/33Al1F0W46Nb0NIpeMmwRqFr5Nh3mSjHNCKQAAUUoxaWKTzEVWoaWKlavyCplMplei8UyoaqqVC6XRVhKUicIgiZJkkp6cnLiczgcQV6R2hAQ+LW3tzdjt9snhoeH1UgkcpWAENbm/Px8zOVyWeFTIV3IoUSWaDT65ODgwN/R0bEFn99NCwQCn5LJ5EPERNYKFkYRurq6lra3t98ripKUZblg3ORrDmR3RJB8saenR25ra/P6fL4CRLbZbDkCVO5KHehCQGKxHtqwvr7+Ynl5+QvW2tDQ0M/Dw8Mf7e3tiVAotJDL5e4jzguyhYyAzev1tubzeT8q/nU6nSmwqOC+Y9ls9juIWzw9Pb2Hc1SI/VC1y9CG1dXVp36/fxFrbXp6euH4+HgcaxnJHmuaFigWi3fh60Bik2huQta3IyMjK3izEqqtJBIJehJ2dwAfQe/AZ0JoE9QGdaGlz263+09fX1+kVCrNIMYnCEu0oWnks0wE5CqC/ubNzc3Wzs7ONKZni85WFAYHBYFG7z87FKMARABAwoTQ+2VZpMaPTiv2eOayyWQq7O7umhFz1MCwEJHCAcyenZ3t4I5XMKdNIMiNfX4Nut8tQqHdEK9IIOpdBe3xgYGBHQDdeDPnxsbGDcSldDrdC/sGhFlgBSOQvrlSPB5XRkdHi8guTE1N5XHX54h58Lm9wtQUAORc4Pg5SexJwGYzHv2rx+OJYkYzR0dHCk0PJioUDoc/VI8cZdFnFTP5bG1tbYmGoL+//zdaD2NfCwaDH1Op1INKIZhzAqhtmld7Y2Pjtf39/XeTk5Pf4OvkGb/HC/8A/NDs7Gy32Wy+Pjc3R9NUUzhQ34zFYjdbWlpeDg4OWvFpdesbWBi/R84QWQF/VretVutrMFpPrHIlgCiKKlQDUWMgTeFASkxruieRRJ2QZQMNy54Klv89qtVAVhkHeBIsmegEwaMk+mCz3SrfmJT2CcxF+wduL3Nt3V5HIgAAAABJRU5ErkJggg==') 7 14, auto";
            case 7: // 292.5-337.5, TOP_LEFT
                return "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA5hJREFUSA2lVklMU1EUtb/fTlIpihgIG2TYOCxYsGFDYsIGMYoTCVaKGKNpQly4YeOCuHehG5Yk6IKEhaKGUBT6EZtQJRJgQUgaSJgqQylQZvo9p/aZ30mmm9z8++5775x777vv5etOHE90Sbar8T4p3nGIcYRgeXnZhj3EodInFOZfOQ4JESSj0Vi1trZ2D/ZJqEwfNIboqCQCRNra2tKbzebnU1NT1QA3QkkWQ3QYkn/AURA9vvL6+rrkdrv9BoOhfmxsjEQm+qFcH5GDkGjBCcxIDVBGbQKJPD4+LhcXF+enp6c7RkdHWTrOcW1k734kgiASdXSzGV9LQ0NDtqIoVy0Wy+VwOCyhXNkgupCZmWn3+Xy3NSQwUwsJGAQjt0DT8/Lyznu93mp0VNvKyspAf39/V0tLi6u8vHwI82xdNTc3d2Z+fl5ZWlq6j3FM2TCOES3BKcycaW1tLQXw+5GRke7KykqvLMs78EeAtd+CgoKJYDCoBAKBm/CLksGMlXiCs4ODg3Zs9Dgcjm9YqppMplBtba3S1dX1aWJiwtXU1NRNPwkA3jc7O8tyabsslgEjkjBN1j4DBA8WFxf7CYCx6nQ6e5CRsr29/Rr+O6urqy+am5s/FxYW+piB3++/hXVsDJaaWAkisuCi0+3t7aWov4cEaNHNzs7OjwB/Nzc3dwnzkWbY2Nio93g8H0DWGy3RfzMgo8jCAuBziLjDbrd/h191uVwkeNXR0cEmEFHqdnd3H6qq6t3c3LwOP4nFHMzkQhJGYh0aGqoeHh52wVbRrl9B8DZKwDVUig4EDug12hrlXIKIBYyENzaDbVpRUfED92ANpVAmJycvwp8QJQjSEtCSOLQEPIu0xsbGIhziANu0rq6uLxQKvYFfe5gikyRwiS5GRuEm2iyVEZfrCkoVRL3lmpqaEFqyD/4D1RvrEoStegJgdyVJcu7t7UmwJTwThra2tgDn8vPzzTk5Oc92dnacer1e1el0Ybhf4vuF8wcVZqFHSR7hKXCzXa1W6ypadgt+FY/ess1mC5SUlAyjXZVoFx2qXAwkQoKvEW/Ok5mZGXdWVtZvEgglMS8aWvoGfCzbkUh4HpFbPj097QRRryAiAZ+K6E3e96IBJ6UwMnHwFgA+xWH3lJWV/WIGsPkWabsrJdB+E4KIGRlxTx6jEX4uLCxUYXysDOKJBRHrLuOMivA9cusKcILGSzIf1yT8T8VvTDX+A7nQiRk9jngZAAAAAElFTkSuQmCC') 12.5 12.5, auto";
        }*/
    };

    ToolControl.prototype.getCursorIndex = function getCursorIndex() {
        if (this.type === _ToolControlType.ToolControlType.ROTATION) return this.getRotationCursorIndex();

        var scaleSingX = this.target ? this.target.scaleSignX : 1;
        var scaleSingY = this.target ? this.target.scaleSignY : 1;

        if (scaleSingX === 1 && scaleSingY === 1) {
            switch (this.type) {
                case _ToolControlType.ToolControlType.TOP_CENTER:
                    return 0;
                case _ToolControlType.ToolControlType.TOP_RIGHT:
                    return 1;
                case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                    return 2;
                case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                    return 3;
                case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                    return 4;
                case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                    return 5;
                case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                    return 6;
                case _ToolControlType.ToolControlType.TOP_LEFT:
                    return 7;
            }
        } else if (scaleSingX === 1 && scaleSingY === -1) {
            switch (this.type) {
                case _ToolControlType.ToolControlType.TOP_CENTER:
                    return 4;
                case _ToolControlType.ToolControlType.TOP_RIGHT:
                    return 3;
                case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                    return 2;
                case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                    return 1;
                case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                    return 0;
                case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                    return 7;
                case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                    return 6;
                case _ToolControlType.ToolControlType.TOP_LEFT:
                    return 5;
            }
        } else if (scaleSingX === -1 && scaleSingY === -1) {
            switch (this.type) {
                case _ToolControlType.ToolControlType.TOP_CENTER:
                    return 4;
                case _ToolControlType.ToolControlType.TOP_RIGHT:
                    return 5;
                case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                    return 6;
                case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                    return 7;
                case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                    return 0;
                case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                    return 1;
                case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                    return 2;
                case _ToolControlType.ToolControlType.TOP_LEFT:
                    return 3;
            }
        } else {
            switch (this.type) {
                case _ToolControlType.ToolControlType.TOP_CENTER:
                    return 0;
                case _ToolControlType.ToolControlType.TOP_RIGHT:
                    return 7;
                case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                    return 6;
                case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                    return 5;
                case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                    return 4;
                case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                    return 3;
                case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                    return 2;
                case _ToolControlType.ToolControlType.TOP_LEFT:
                    return 1;
            }
        }
    };

    ToolControl.prototype.getRotationCursorIndex = function getRotationCursorIndex() {
        var scaleSingX = this.target ? this.target.scaleSignX : 1;
        var scaleSingY = this.target ? this.target.scaleSignY : 1;

        if (scaleSingX === 1 && scaleSingY === 1) {
            switch (this.rotationControlType) {
                case _RotationControlType.RotationControlType.TOP_CENTER:
                    return 0;
                case _RotationControlType.RotationControlType.TOP_RIGHT:
                    return 1;
                case _RotationControlType.RotationControlType.MIDDLE_RIGHT:
                    return 2;
                case _RotationControlType.RotationControlType.BOTTOM_RIGHT:
                    return 3;
                case _RotationControlType.RotationControlType.BOTTOM_CENTER:
                    return 4;
                case _RotationControlType.RotationControlType.BOTTOM_LEFT:
                    return 5;
                case _RotationControlType.RotationControlType.MIDDLE_LEFT:
                    return 6;
                case _RotationControlType.RotationControlType.TOP_LEFT:
                case _RotationControlType.RotationControlType.DELETE:
                    return 7;
            }
        } else if (scaleSingX === 1 && scaleSingY === -1) {
            switch (this.rotationControlType) {
                case _RotationControlType.RotationControlType.TOP_CENTER:
                    return 4;
                case _RotationControlType.RotationControlType.TOP_RIGHT:
                    return 3;
                case _RotationControlType.RotationControlType.MIDDLE_RIGHT:
                    return 2;
                case _RotationControlType.RotationControlType.BOTTOM_RIGHT:
                    return 1;
                case _RotationControlType.RotationControlType.BOTTOM_CENTER:
                    return 0;
                case _RotationControlType.RotationControlType.BOTTOM_LEFT:
                    return 7;
                case _RotationControlType.RotationControlType.MIDDLE_LEFT:
                    return 6;
                case _RotationControlType.RotationControlType.TOP_LEFT:
                case _RotationControlType.RotationControlType.DELETE:
                    return 5;
            }
        } else if (scaleSingX === -1 && scaleSingY === -1) {
            switch (this.rotationControlType) {
                case _RotationControlType.RotationControlType.TOP_CENTER:
                    return 4;
                case _RotationControlType.RotationControlType.TOP_RIGHT:
                    return 5;
                case _RotationControlType.RotationControlType.MIDDLE_RIGHT:
                    return 6;
                case _RotationControlType.RotationControlType.BOTTOM_RIGHT:
                    return 7;
                case _RotationControlType.RotationControlType.BOTTOM_CENTER:
                    return 0;
                case _RotationControlType.RotationControlType.BOTTOM_LEFT:
                    return 1;
                case _RotationControlType.RotationControlType.MIDDLE_LEFT:
                    return 2;
                case _RotationControlType.RotationControlType.TOP_LEFT:
                case _RotationControlType.RotationControlType.DELETE:
                    return 3;
            }
        } else {
            switch (this.rotationControlType) {
                case _RotationControlType.RotationControlType.TOP_CENTER:
                    return 0;
                case _RotationControlType.RotationControlType.TOP_RIGHT:
                    return 7;
                case _RotationControlType.RotationControlType.MIDDLE_RIGHT:
                    return 6;
                case _RotationControlType.RotationControlType.BOTTOM_RIGHT:
                    return 5;
                case _RotationControlType.RotationControlType.BOTTOM_CENTER:
                    return 4;
                case _RotationControlType.RotationControlType.BOTTOM_LEFT:
                    return 3;
                case _RotationControlType.RotationControlType.MIDDLE_LEFT:
                    return 2;
                case _RotationControlType.RotationControlType.TOP_LEFT:
                case _RotationControlType.RotationControlType.DELETE:
                    return 1;
            }
        }
    };

    _createClass(ToolControl, [{
        key: 'target',
        set: function set(value) {
            this._target = value;
        },
        get: function get() {
            return this._target;
        }
    }, {
        key: 'transform',
        set: function set(value) {
            this._transform = value;
        },
        get: function get() {
            return this._transform;
        }
    }, {
        key: 'localPoint',
        set: function set(value) {
            this._localPoint = value;
        },
        get: function get() {
            return this._localPoint;
        }
    }, {
        key: 'globalPoint',
        get: function get() {
            return this.transform.apply(this._localPoint);
        }
    }, {
        key: 'centerPoint',
        set: function set(value) {
            this._centerPoint = value;
        },
        get: function get() {
            return this._centerPoint;
        }
    }, {
        key: 'angle',
        get: function get() {
            var angle = _Calculator.Calc.getSkewX(this.target.worldTransform);
            angle = angle < 0 ? angle + 360 : angle;
            return angle;
        }
    }, {
        key: 'cursorIndex',
        get: function get() {
            return (this.getAngleIndex() + this.getCursorIndex()) % 8;
        }
    }, {
        key: 'targetLayer',
        set: function set(value) {
            this._targetLayer = value;
        },
        get: function get() {
            return this._targetLayer;
        }
    }]);

    return ToolControl;
}(PIXI.Sprite);

},{"./../utils/Calculator":7,"./../utils/Mouse":8,"./RotationControlType":3,"./ToolControlType":5}],5:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ToolControlType = exports.ToolControlType = function () {
    _createClass(ToolControlType, null, [{
        key: 'DELETE',
        get: function get() {
            return 'delete';
        }
    }, {
        key: 'ROTATION',
        get: function get() {
            return 'rotation';
        }
    }, {
        key: 'TOP_LEFT',
        get: function get() {
            return 'topLeft';
        }
    }, {
        key: 'TOP_CENTER',
        get: function get() {
            return 'topCenter';
        }
    }, {
        key: 'TOP_RIGHT',
        get: function get() {
            return 'topRight';
        }
    }, {
        key: 'MIDDLE_LEFT',
        get: function get() {
            return 'middleLeft';
        }
    }, {
        key: 'MIDDLE_CENTER',
        get: function get() {
            return 'middleCenter';
        }
    }, {
        key: 'MIDDLE_RIGHT',
        get: function get() {
            return 'middleRight';
        }
    }, {
        key: 'BOTTOM_LEFT',
        get: function get() {
            return 'bottomLeft';
        }
    }, {
        key: 'BOTTOM_CENTER',
        get: function get() {
            return 'bottomCenter';
        }
    }, {
        key: 'BOTTOM_RIGHT',
        get: function get() {
            return 'bottomRight';
        }
    }]);

    function ToolControlType() {
        _classCallCheck(this, ToolControlType);
    }

    return ToolControlType;
}();

},{}],6:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.TransformTool = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Mouse = require('./../utils/Mouse');

var _Calculator = require('./../utils/Calculator');

var _PointUtil = require('./../utils/PointUtil');

var _ToolControl = require('./ToolControl');

var _ToolControlType = require('./ToolControlType');

var _RotationControlType = require('./RotationControlType');

var _VectorContainer = require('./../view/VectorContainer');

var _lambda = require('../utils/lambda');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _collection = {

    tl: null,
    tr: null,
    tc: null,
    bl: null,
    br: null,
    bc: null,
    ml: null,
    mr: null,
    mc: null,

    rtl: null,
    rtc: null,
    rtr: null,
    rml: null,
    rmr: null,
    rbl: null,
    rbc: null,
    rbr: null
};

var _dragRange = 10;

var TransformTool = exports.TransformTool = function (_PIXI$utils$EventEmit) {
    _inherits(TransformTool, _PIXI$utils$EventEmit);

    _createClass(TransformTool, null, [{
        key: 'DELETE',
        get: function get() {
            return 'delete';
        }
    }, {
        key: 'SET_TARGET',
        get: function get() {

            return 'setTarget';
        }
    }, {
        key: 'TRANSFORM_COMPLETE',
        get: function get() {
            return 'transformComplete';
        }
    }, {
        key: 'SELECT',
        get: function get() {
            return 'select';
        }
    }, {
        key: 'DESELECT',
        get: function get() {
            return 'deselect';
        }
    }, {
        key: 'REQ_INPUT',
        get: function get() {
            return 'requestInput';
        }
    }, {
        key: 'DBCLICK',
        get: function get() {
            return 'dbClick';
        }
    }]);

    function TransformTool(stageLayer, targetLayer, options) {
        _classCallCheck(this, TransformTool);

        var _this = _possibleConstructorReturn(this, _PIXI$utils$EventEmit.call(this));

        _this.stageLayer = stageLayer;
        _this.targetLayer = targetLayer;

        _this.options = options || { deleteButtonOffsetY: 0, useSnap: true, snapAngle: 2 };
        _this.deleteButtonSize = 28;
        _this.deleteButtonOffsetY = options.deleteButtonOffsetY;
        _this.useSnap = options.useSnap || true;
        _this.snapAngle = options.snapAngle || 5;

        _this.initialize();
        _this.addEvent();

        _this._px = 0;
        _this._py = 0;
        return _this;
    }

    TransformTool.prototype.initialize = function initialize() {
        this.target = null;
        this.transform = new PIXI.Matrix();
        this.invertTransform = new PIXI.Matrix();

        this.g = this.graphics = new PIXI.Graphics();
        this.stageLayer.addChild(this.graphics);

        /**
         * 커서 생성
         * 0: TOP_CENTER
         * 1: TOP_RIGHT
         * 2: MIDDLE_RIGHT
         * 3: BOTTOM_RIGHT
         * 4: BOTTOM_CENTER
         * 5: BOTTOM_LEFT
         * 6: MIDDLE_LEFT
         * 7: TOP_LEFT
         */
        this.rotationCursorList = [new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAyRJREFUOBGNVF1IU2EY9pz9z9YkRdaPIfhHiV4V3Sy80S4jijLqwvDGO/Uq6KLLqBtpN+G9SndJmSBZlDYbNjeGLWSW2CQxt0E65+bmfk7Pc/I7HRdELzx7v/d7f7/3fc+kiv8jSWemPyu6e/1Zd334qHemhrJwFDryctCWRNtyiHvyv0gflEohC0PKMmDQcZFcJCpBVwQEF/e40uLxjqQwmAggJ5PJ85AZnDACZsAK2IBKwK5DuWyBjvb0EzEY8xxkfR41IQ3MhULBt7y8fBHnI8BR4FhLS8uJ2dnZqxsbG4/hPJnNZkPAJ2BxZ2dnKhaLPfH7/bc7OztP0x5wACymErpr+Xz+Gc4mgDnUDjI7q7JDGUqn03PT09OXqqurTwaDwTu7u7tvw+Hw68HBwZnW1tavJpMpB1vFaDTmUcxqb2/vnM/newW/D5FIZKC9vf0U9LVLS0s39/b2/Llc7jlkdog5JDEjCpb9/X1vV1eXPDExkYbhWiKRqO3p6XEFAoEzkiQpCPYFSLhcrlw8HjejG1ULCwtni8Wiob6+/vvo6Gikra0tH41G39TV1V3v6+uTR0ZG4na7/Rbis9ACoPaXvXciySK40tHR8dnj8bwzGAwFh8ORHBoamkqlUu/R8nHYPALuAQ8hP81kMnNjY2OTNTU1Cfr29/d7Nzc3PzY1Na01NzdH0aFJ3LPNbKvWUias4mzAxZYpbrc7vLW15UWyBysrK43QcQ4cgQa85jiS3gW83d3d8/Q3m81q23UJuQ9qQjqSmKTEtqnSwY/NZitYLJYKVPyysbExSpsyKGhlDC3zYF7jw8PDRXQkhdHwASTlICb9tNh8prY0BwrtlZhpAAFmtre3ud5qS8D1JGNhrmBjZxoaGr5Bofnihavo2gvccWnULWUAgi81YPjzoVDoh6IoamBWhzmWEKgSlbPqAdwFwTWC7WUI97FEP9fX1/P0Ff7wkeCbxWbfgA3/HNTAomoZs3KjIhmJ1TskU6xWawmfAD8DIqNPiMCs+gKWxwBIhN4f4yjJspx2Op0sUn25SFbOoT9ENCYJ/lv68/svf72P8gunF5KUe/EFxQAAAABJRU5ErkJggg=='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1Rjc3NTE3RDZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1Rjc3NTE3RTZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVGNzc1MTdCNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVGNzc1MTdDNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bXt2owAAA1tJREFUeNqsVt1LWmEY99XjR7ZNZ8yGC0YrG2ODddXNBjXGrlpjH25rhKj76Cbovqv9A4PddN9N7kLYYNiFoMyltmBusUqIIHJCzTJD0yzNr/1e9xrH0wfH2gsPnvfjPL/3eZ7f7zkSycFBJIePsuSEQ3oIAGHr0kKh8Ix3hkj+w6g652DKTCbzulQq+fEsh8lOAyIVRECdyTc2Nmy5XM5cLBbpvoKtS5mRegGlghTJV1dXX+bz+RddXV2XkS66pmJA1YhkvHdIvZHI1tfXLYSQp52dndfw3IR0Kbxe752RkRED9ht4gJwATFQtuGQyORiNRr16vT5GmaRQKHJjY2OeQCDgTqVS37HvmJ2d7W9vb7+A/XMMVM7LxvEgqMFV5P9nT0/PL0bVGuM4Lt/b2/tjfn6eAjodDsdtrJ+HNYoFqqQqHo8/3tra8uGmv6ljjUaTDIfDkx6Px2Wz2fxqtXqbrpvN5m+IanpmZsaMeZNYoP2iI12mRCLhp0BarTYBhk0vLS09B51H0+m0b3h4+AsFovubm5tTDEgHU7M6ETEaUaDgT2hEYFcILPOz3Csikcj1vb09u9vtnkC9shQI56bHx8dvYV9DtSVGT/sRIe8Pd3d3fWDXJLthRSNOp1MNoPcul2uCRmS1WgM4+7m1tbWZpY0TRQLmUJbNZh+Uy2WvQEuEAX0YGhqie+VQKOQJBoP9eNayaKRiKV0xgNwVaKFyibW1tRuIwKdSqTJ9fX1BSm9GgobTtqAaNiLSUYvF4qP0pjoCKYxYPyNgGpGIDe2QzwAB4yYHBgbSaD0c9JM0mUw3GQDH63WVs5xY70gdvaWJNk2wjsD5pY6ODtpiJKA5uYeB34vQUwFWVCqVJUjgE6SQFA2CnrYNoLhMJnuLQkfn5uY40L0Smd1u1+/s7EgxrhiNxkJ3d3cz2PkOAKnqDY81IRZlHYT5ta2tLSxsPy0tLX9isZh/ZWXFyprpPxLUC0JfRFd4RAULoEgVwGAwRMG6qcXFxTeYn2XdWnpSkIpgaWeotiAaAeaBhYWFQaYXVQ2V6wSpaUG019GI0MV9y8vLr1h7UfG6RAWEHOGIX/DjBEtTdx8+GnU63UfMi8z4tToxiETwCSZCx/y/UNwplF8+4v/YgVv/FWAAZA0E5twGSyUAAAAASUVORK5CYII='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAztJREFUOBF9VN9rUnEU915NS5BV2JRqa7CYkOAeEgqmSTF7jC2IPfU22Nvajzehl6CHHmR/xN6FbCP6icsZgYrDLXFzNFcgONlQNyf+urfP+d77vdwN6sC53+/3nPM53/PrewWDQoK60qLf01mmj0ra3gQBNxTVPZ25jOwlMAE4iK0EJCKQEUxnYjoT9VTuqisHMyPh+PjYZ7ValyRJEsCiLMsCiD6cm41GY76vry9J3kDMgVipVB6mUqlVVUBCxoFAIAvA+vb2th+yC2AeibLp9XoC3QKFRgD9jEajjUQi8crlcm1oCnXDczwvN0xOTlZarVZ5YmJiC0p9wWgvs6uNRiPLhdDBYHDD5/NtLS4u+pFCfzwefwwxXUDFOxOViOIEMpnMO4BSp6en8aOjo3WbzVbzer25k5OTLwj1OkA28Jk8hWaz+aBer39tt9uxQqFwH45eh8Ph9zCUNzc3P62trT3F/gr4Ili7Weh0On4UZ71arXqhMO3u7t4G+BvaIc3NzcVKpdIS5NfAVtKDlZABukusCkho7Ha7kdHR0bzb7S7UarUVyBxgHq7AigPPaWIotB6iRQWPx1PZ2dkZtFgsN6AjhxprDYXwPNWcTmcLaZih4HkpIULwP6Dt4ODAbDKZaE7ZiOlWBYj8yCMnFg56ewujdnl4ePgPql2CUv9KlAGA8B7AT7BSBEKxWOyH8WAymbwzNjZWQrt+qUAOVgxRQbrxJQaawCa73f48EolUUSDj9PR0Y39//zvk/InxsA1sAMrl8gcMQezw8HCepgfgytDQ0G84S4yPjw8CSK2gQml1YSOXTqdXkM8exi0xNTX1AwYyJuZjPp9/gf1V8CUwry628KB/j5jROmTy7OxsHJO0il7exFl/G2sJu1b/HjFqNjS8HQqFzCjS52w22waQisILw3LU4oVCI7xDMx6yY2Bg4Fkul3sEhVYQbsQeMm6QEKIwMjKyBwXrI9pjmJmZEZeXlxdQuI7D4Xir6pgTZoQh9uJnFULIIjFASh6iKGEQJFEUe6j0G/ysUurtzICBIaCK8ZdOKZBnYuofjZ0+T/Vd6aYeBtwRtoy4A/2qAcmChafY/vNLYEZ/ARukibLGcoOhAAAAAElFTkSuQmCC'), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA71JREFUSA2lVUlPU1EYhU6UYi1qJIGwYlghsIGVkQ0JG8QRg4YgjVNMmhB/gQv+gAsXpCtcgFEjJgoaQouFUuwCIYHCCoSSME9lKnR+nvPoNWD7kMYvOX33ft+999xvuk1P+z9JV9guHderjk9SHJOAUK2vrxfjq+Y4rlMih/nsIh+O5dqNjY070Wh0dHt7+xnmGYAGEGQYHk3kQQo/wgPN8vLyTa1W+6K6ulp9eHj4YHV19RHO0QH0SqxL4eijpX88wIF3fT7fUFFRkRcmKScnZ21paWlwcXHRgnkmkOARdGcSkqh3d3dv7ezsOAUBdEy0IBpAjp5jztAJjzA8u6QHAoEbCI2zsrLSYzKZfMA2tks6nS5oNBr3SLy1tTXo9/ufQJ86iSRJ1YAjFosNhsPhoWAw6J6bmxskSXt7ux0Hj+ICbtiGscYViUQaYKP3KYnICeOdOTMz02C323sxllwul83hcNRjfAnIArSAXGX8SVUY/xgQzc3NvdbZ2Zml0WgiZWVlpr6+vgnog0A4vuZEU0KXXBCec39ZZG/m5+dL9vb2nAaDwV9bW/sTffIB6y4AekDkQjFUNMgAwXXAHJ/jc6Tv7u42hEKhzpaWlu/QSR6PxzY+Pn4fYyPAMCkeDptsZAjVrCIQjCB5bDBBrIoTvLLZbD3QS01NTT9Q0t2oqsuYGwDmS5GEBhJo0WS3EYoBt9v9BdXyOL5RvbKycgUevO3t7e1ByQZYrgiTu6ur6yrWnAfY7TwjKYkg0LGT2WiFhYVzVqv1G8hebm5u3sPhr3Fjp8ViceAQiQTQD4+NjTVhzlyILj+VQIu3qJ5PBQjmeVBra6vd6/XaUDVfm5ubnXq93k+92Wx24SLuOEFCyWJNgpBZzRDFnwqZADr5qRBflGm4rq5uZHJy0g6PPnd0dDBEF4ETPYF5gjBJlHQkOQshSUPCWR2y1NTUTDQ2Nq4hNFJpaWk2utg7PT39qby83IFOD2AR+4GIAuJSGCaK7AnUmbOzs4+RE1deXt4y5lJbW1s/Xlar0+msR7nyj4mhyQZ4+6T/HdAniPCEt4gWFBR8nJqa0iDWDysqKiSVShU7ODjwVFVV9cMubix3O+bcwzGFY0VhuQk36XKwpKTkPXLzBkS/iouLI+joCPQMDZ+LEHCcTOyF+t/CkJGQnvFZMC4sLJjxtzqGPniKOfOkWP+wnSrHw8WFdJ83jeXn57/b398PZWRksP6pT+nWWK8o9Eh4xUdODU/YaEKvuPE0Azcnk2T6U5Ob7BCh+w13D8jLwsORsAAAAABJRU5ErkJggg=='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAy1JREFUOBF9VE1IG1EQdpNs/jQNiAlW0h8UYkEIWCN4EQ/V3irFXgoFLd682PRorz3YS6iXHjwK4qktLRWkhlKtqWColcSSotEmXiS2KElM1MRkt9+87ixbKX3wMfPmzcw3M5mNVPfnSJokYdTZrGoKS7az5BiWbGfJcSo7kJTy+XyXoij15XLZRJ5ms1m12+2KxWJRNdRgXpMkiaQ4qqp2VatVJyARzs7OTLVaTeTleJfLFYWzQgEWQJBBmp1O55Pd3V378fGxqAiJVYLP55O9Xm8jfJ4ayXAXB8VMnp6eVhBbApkJRQhCiu3s7LwMpx7NVZDSoxlwoLq3fr//B3QiFGhra0sXCoWlUql0FzbROaTxSLlcLlipVJYGBga+4EGPJf38/HwD0glwc6JDujQg6TsQpsmRgFEUjo6OPh8eHj7G3QoQoagekg/dLalUqufk5GQFpESgk+LnieN+CZABE1dMQTwKkdBqtVYwWtfY2JjZ4XAMFYvFUDqd9sJP+JI/Y2dn53pzc/MdJK/DaKl4/Wjj/atQSkDsLiSdR4eZ9vb2TDabXRsfH1+BXW1qavo1Ozs7jw6iWIw5JJ4EJoBnuL9GYZ/C4fACJpLHolSnpqY+9vX1faNY+FCHbkBMiMgIVJUNCeeGh4e909PTyt7e3svW1tZb8XhcHhkZuZHJZK4gWa27uzuJgnLoqLy/v29PJBIewE+dBIPB7zMzM1mPx/PTZrNdGxwcrI9EIgqm1Yv8ZaAK6IQOVPMGI4klk8n7sHsDgYBve3v7EX7bVZz3o6OjUVoq6gLvqizL5Y6OjlQoFFra3NyMYEIf1tfXH2LbWxYXF28jLnphacRPSB3Slsp4fHVwcHAPer0GF2Rjf3//1Vgs9gBvL7CxC9jmOJAANvDtzqPT58vLy0PovIX8AVqShq2trV6MfBU6jZM4JB6pkPThu93ur3jgQxWRI42cfmfSeVmg6ttI3xd1zaA/BtrUOuS8iZz650JEdC5K4azZ6Y2JWIoCYef1JwIiZcnxMInDd/2vjR8uSmMhTMKSfZnUKOmNScifdb0zDv6fZHLyMep6MtiN+j9z/Qasm4fFL/kTlgAAAABJRU5ErkJggg=='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA6lJREFUSA2lVUlLW1EUNiZGY4zGxhoiIggqQqtLEVqo0KVYOqTowqYKHRFcdeOy/oFuCl260S5EkFYLYtLGTKTUKg3RhSixLpI4GzXikOH1+0KuxDHRHji8e84993xnuvfJss4n2Tlq6RxdRirFKSvhnF/BdC4AxPfUscvF7JRt4ZQ6gis3Nzfbtra2HmAtB4t9LK9GIhPhQADk+nw+YywWe65UKrOCwaDcYDB8heto0v21MiIIo80Da2dnZ1+vrKw4y8vLA1VVVX+RjQPyE+zlgBkI7a9EPMCDSrBmbm7u5fLysqusrCwIOdEPAm1vb9sB9gg6UTosM6fjLPx+f+fq6qqDGeB4AkB8q6urfbu7uxMHBwfs0ZUyoXEik3A43KpSqd7ZbLaV+fl5RTwezx4eHi4ZHx+v7+3t/a7X64/q6+ujjY2NBpx5L5PJRvHNiBKND4VChXK5XIVIP9XW1sorKioU+fn5deA4QLJMJpOk0+l+KhQKP4ZBgm2JJEkFAApnhAIjkQ1rzcaqwMV2u93ocrnGsZYA9G1jY+Mp1gxK2GOZGbHhYhzjWMfAHNPI0NCQp66uTovoowMDAxq1Wn0vxVacgerqxCiZEbPRoYyDLS0tk3l5eXs7Ozt2TN1t6FNHOJEVSncfepEhv2mJTnLB2snJybaZmRkL1lJXV5f16Ojo88jISD7kVIfZALEmp44BpgYB8XyiA9ZeXVlZqUcGXzo6OpyQpbGxsVEAfUgC0RmZk2jb39+3w/Yh5IwuLEEYEbMp6u/vv4OL6OaFxBNzYDabCTSwtLR0C/u8wKpIJOJoaGjw8sImXwbq02YksmFpbkxPTz/DdLkIBFnq7u7+gXG37+3tfVxYWGg9PDx0a7XaLfEE4a0zwi5tRgRhJDRUg3UAMmEQ3O3t7W7IEu5QuLOz02GxWMYWFxdtRUVFIerFE7S+vv4YMitCXxfSaaDiwcHBu6j7iNfrNTc3N//GeEdw+sTzQ7mpqekPLu3U2tpaDeRLQYieCsSxLkSkNz0eTxvHGz345XQ6zX19fRb06xD7Umlp6SrKNYH9V5DF5cXychJAPMCGsk8acHFPT0+N1Wo1ojdTGo1mlwCBQGACzX+LfQ5O2nLB5pgIlArGXvHfUwDWYXwT0wcAG17yLugYCINKO2GwOUOpYIySmakxwi78qm3owRvILGvayYJNRkRAAuXgMjpRshdYs0TXzgBnz5DISh6NRluxS0DymRLR8H/oovMnXul/F7SWjoEFkdEAAAAASUVORK5CYII='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAz9JREFUOBFtVN9LU3EU997b7nJrG+hkYWKGOEFBIhdIWFHMFx+iN4NASv+A8EXfetxTkD304rNo0INgVhhkybURbmuwcDCnDRNxOtT9cIr7cW+f83Xf23XswNn5nvP9fs4538/33Al1F0W46Nb0NIpeMmwRqFr5Nh3mSjHNCKQAAUUoxaWKTzEVWoaWKlavyCplMplei8UyoaqqVC6XRVhKUicIgiZJkkp6cnLiczgcQV6R2hAQ+LW3tzdjt9snhoeH1UgkcpWAENbm/Px8zOVyWeFTIV3IoUSWaDT65ODgwN/R0bEFn99NCwQCn5LJ5EPERNYKFkYRurq6lra3t98ripKUZblg3ORrDmR3RJB8saenR25ra/P6fL4CRLbZbDkCVO5KHehCQGKxHtqwvr7+Ynl5+QvW2tDQ0M/Dw8Mf7e3tiVAotJDL5e4jzguyhYyAzev1tubzeT8q/nU6nSmwqOC+Y9ls9juIWzw9Pb2Hc1SI/VC1y9CG1dXVp36/fxFrbXp6euH4+HgcaxnJHmuaFigWi3fh60Bik2huQta3IyMjK3izEqqtJBIJehJ2dwAfQe/AZ0JoE9QGdaGlz263+09fX1+kVCrNIMYnCEu0oWnks0wE5CqC/ubNzc3Wzs7ONKZni85WFAYHBYFG7z87FKMARABAwoTQ+2VZpMaPTiv2eOayyWQq7O7umhFz1MCwEJHCAcyenZ3t4I5XMKdNIMiNfX4Nut8tQqHdEK9IIOpdBe3xgYGBHQDdeDPnxsbGDcSldDrdC/sGhFlgBSOQvrlSPB5XRkdHi8guTE1N5XHX54h58Lm9wtQUAORc4Pg5SexJwGYzHv2rx+OJYkYzR0dHCk0PJioUDoc/VI8cZdFnFTP5bG1tbYmGoL+//zdaD2NfCwaDH1Op1INKIZhzAqhtmld7Y2Pjtf39/XeTk5Pf4OvkGb/HC/8A/NDs7Gy32Wy+Pjc3R9NUUzhQ34zFYjdbWlpeDg4OWvFpdesbWBi/R84QWQF/VretVutrMFpPrHIlgCiKKlQDUWMgTeFASkxruieRRJ2QZQMNy54Klv89qtVAVhkHeBIsmegEwaMk+mCz3SrfmJT2CcxF+wduL3Nt3V5HIgAAAABJRU5ErkJggg=='), new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA5hJREFUSA2lVklMU1EUtb/fTlIpihgIG2TYOCxYsGFDYsIGMYoTCVaKGKNpQly4YeOCuHehG5Yk6IKEhaKGUBT6EZtQJRJgQUgaSJgqQylQZvo9p/aZ30mmm9z8++5775x777vv5etOHE90Sbar8T4p3nGIcYRgeXnZhj3EodInFOZfOQ4JESSj0Vi1trZ2D/ZJqEwfNIboqCQCRNra2tKbzebnU1NT1QA3QkkWQ3QYkn/AURA9vvL6+rrkdrv9BoOhfmxsjEQm+qFcH5GDkGjBCcxIDVBGbQKJPD4+LhcXF+enp6c7RkdHWTrOcW1k734kgiASdXSzGV9LQ0NDtqIoVy0Wy+VwOCyhXNkgupCZmWn3+Xy3NSQwUwsJGAQjt0DT8/Lyznu93mp0VNvKyspAf39/V0tLi6u8vHwI82xdNTc3d2Z+fl5ZWlq6j3FM2TCOES3BKcycaW1tLQXw+5GRke7KykqvLMs78EeAtd+CgoKJYDCoBAKBm/CLksGMlXiCs4ODg3Zs9Dgcjm9YqppMplBtba3S1dX1aWJiwtXU1NRNPwkA3jc7O8tyabsslgEjkjBN1j4DBA8WFxf7CYCx6nQ6e5CRsr29/Rr+O6urqy+am5s/FxYW+piB3++/hXVsDJaaWAkisuCi0+3t7aWov4cEaNHNzs7OjwB/Nzc3dwnzkWbY2Nio93g8H0DWGy3RfzMgo8jCAuBziLjDbrd/h191uVwkeNXR0cEmEFHqdnd3H6qq6t3c3LwOP4nFHMzkQhJGYh0aGqoeHh52wVbRrl9B8DZKwDVUig4EDug12hrlXIKIBYyENzaDbVpRUfED92ANpVAmJycvwp8QJQjSEtCSOLQEPIu0xsbGIhziANu0rq6uLxQKvYFfe5gikyRwiS5GRuEm2iyVEZfrCkoVRL3lmpqaEFqyD/4D1RvrEoStegJgdyVJcu7t7UmwJTwThra2tgDn8vPzzTk5Oc92dnacer1e1el0Ybhf4vuF8wcVZqFHSR7hKXCzXa1W6ypadgt+FY/ess1mC5SUlAyjXZVoFx2qXAwkQoKvEW/Ok5mZGXdWVtZvEgglMS8aWvoGfCzbkUh4HpFbPj097QRRryAiAZ+K6E3e96IBJ6UwMnHwFgA+xWH3lJWV/WIGsPkWabsrJdB+E4KIGRlxTx6jEX4uLCxUYXysDOKJBRHrLuOMivA9cusKcILGSzIf1yT8T8VvTDX+A7nQiRk9jngZAAAAAElFTkSuQmCC')];

        for (var i = 0; i < this.rotationCursorList.length; i++) {
            var cursor = this.rotationCursorList[i];
            cursor.visible = false;
            cursor.anchor = { x: 0.5, y: 0.5 };
            this.stageLayer.addChild(cursor);
        }

        var controlOptions = {};
        var rotationOptions = {
            rotationCursorList: this.rotationCursorList
        };
        var deleteButtonOptions = {};

        this.c = this.controls = {
            de: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.DELETE, deleteButtonOptions),
            tl: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.TOP_LEFT, controlOptions),
            tc: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.TOP_CENTER, controlOptions),
            tr: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.TOP_RIGHT, controlOptions),
            ml: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.MIDDLE_LEFT, controlOptions),
            mr: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.MIDDLE_RIGHT, controlOptions),
            bl: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.BOTTOM_LEFT, controlOptions),
            bc: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.BOTTOM_CENTER, controlOptions),
            br: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.BOTTOM_RIGHT, controlOptions),
            mc: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.MIDDLE_CENTER, controlOptions),
            rde: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.DELETE),
            rtl: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.TOP_LEFT),
            rtc: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.TOP_CENTER),
            rtr: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.TOP_RIGHT),
            rml: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.MIDDLE_LEFT),
            rmr: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.MIDDLE_RIGHT),
            rbl: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.BOTTOM_LEFT),
            rbc: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.BOTTOM_CENTER),
            rbr: new _ToolControl.ToolControl(_ToolControlType.ToolControlType.ROTATION, rotationOptions, _RotationControlType.RotationControlType.BOTTOM_RIGHT)
        };

        // 맨 아래에 위치시킵니다.
        this.stageLayer.addChild(this.c.mc);
        this.c.mc.on(_ToolControl.ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
        this.c.mc.on(_ToolControl.ToolControl.MOVE, this.onControlMove.bind(this));
        this.c.mc.on(_ToolControl.ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));
        this.c.mc.on(_ToolControl.ToolControl.DBCLICK, this.onControlDBClick.bind(this));

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
            control.targetLayer = this.targetLayer;

            switch (control.type) {
                case _ToolControlType.ToolControlType.DELETE:
                    this.stageLayer.addChild(control);
                    control.on('click', this.onDelete.bind(this));
                    break;

                case _ToolControlType.ToolControlType.ROTATION:
                    //this.stageLayer.addChild(control);
                    control.on(_ToolControl.ToolControl.ROTATE_START, this.onRotateStart.bind(this));
                    control.on(_ToolControl.ToolControl.ROTATE, this.onRotate.bind(this));
                    control.on(_ToolControl.ToolControl.ROTATE_END, this.onRotateEnd.bind(this));
                    control.on(_ToolControl.ToolControl.CHANGE_ROTATION_CURSOR, this.onChangeRotationCursor.bind(this));
                    break;

                case _ToolControlType.ToolControlType.TOP_LEFT:
                case _ToolControlType.ToolControlType.TOP_RIGHT:
                case _ToolControlType.ToolControlType.TOP_CENTER:
                case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                    this.stageLayer.addChild(control);
                    control.on(_ToolControl.ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
                    control.on(_ToolControl.ToolControl.MOVE, this.onControlMove.bind(this));
                    control.on(_ToolControl.ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));
                    break;
            }
        }
    };

    TransformTool.prototype.addEvent = function addEvent() {

        this.stageLayer.on(TransformTool.SET_TARGET, this.onSetTarget.bind(this));
        //this.stageLayer.root.on( "mousedown", this.onMouseDown, this );
        //this.stageLayer.root.on( 'mouseup', this.onMouseUp, this );

        window.document.addEventListener('mousedown', this.onMouseUp.bind(this));
        window.document.addEventListener('mouseup', this.onMouseUp.bind(this));
        this.downCnt = 0;
    };

    TransformTool.prototype.onMouseDown = function onMouseDown(e) {

        //if( e.data.originalEvent.target != this.stageLayer.renderer.view ) return;

        this._px = e.data.global.x;
        this._py = e.data.global.y;
    };

    TransformTool.prototype.onMouseUp = function onMouseUp(e) {

        //if( e.data.originalEvent.target != this.stageLayer.renderer.view ) return;

        this.downCnt--;

        if (this.downCnt < 0 && this.target) {

            var dx = _Mouse.Mouse.globalX - this._px,
                dy = _Mouse.Mouse.globalX - this._py;

            if (dx * dx + dy * dy <= _dragRange * _dragRange) {

                this.target.emit(TransformTool.DESELECT);
                this.target.visible = true;
                this.releaseTarget();
            }
        }

        this.downCnt = 0;
    };

    TransformTool.prototype.show = function show() {

        if (!this.controls || this.g.visible) return;

        this.g.visible = true;

        (0, _lambda.each)(this.controls, function (e) {
            return e.visible = true;
        });
    };

    TransformTool.prototype.hide = function hide() {
        if (!this.controls || this.g.visible === false) return;

        this.g.visible = false;

        (0, _lambda.each)(this.controls, function (e) {
            return e.visible = false;
        });
    };

    TransformTool.prototype.activeTarget = function activeTarget(target) {
        this.target = target;
        this.removeTextureUpdateEvent();
        this.addTextureUpdateEvent();

        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
        this.target.emit(TransformTool.SELECT, target);
        this.stageLayer.emit(TransformTool.SET_TARGET, target);
    };

    TransformTool.prototype.setTarget = function setTarget(e) {
        var pixiSprite = e.target;
        pixiSprite.emit(TransformTool.SET_TARGET, pixiSprite);
        this.activeTarget(pixiSprite);
        this.c.mc.emit('mousedown', e);
    };

    TransformTool.prototype.releaseTarget = function releaseTarget() {
        if (this.target === null) return;
        this.hide();
        this.removeTextureUpdateEvent();
        this.target = null;
    };

    TransformTool.prototype.addTextureUpdateEvent = function addTextureUpdateEvent() {
        this.target._targetTextureUpdateListener = this.onTextureUpdate.bind(this);
        this.target.on(_VectorContainer.VectorContainer.TEXTURE_UPDATE, this.target._targetTextureUpdateListener);
    };

    TransformTool.prototype.removeTextureUpdateEvent = function removeTextureUpdateEvent() {
        if (this.target !== null && this.target._targetTextureUpdateListener !== null) {
            this.target.off(_VectorContainer.VectorContainer.TEXTURE_UPDATE, this.target._targetTextureUpdateListener);
            this.target._targetTextureUpdateListener = null;
        }
    };

    TransformTool.prototype.update = function update() {
        if (this.target === null) return;
        this.setControls();
        this.updateTransform();
        this.draw();
        this.updatePrevTargetLt();
    };

    TransformTool.prototype.visibleCursorArea = function visibleCursorArea(isVisiable) {
        var drawAlpha = isVisiable ? 0.3 : 0.0;

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.drawAlpha = drawAlpha;
            control.render();
        }
    };

    TransformTool.prototype.setControls = function setControls() {
        var scaleSignX = this.target.scaleSignX;
        var scaleSignY = this.target.scaleSignY;
        var localBounds = this.target.getLocalBounds();
        var w = localBounds.width * scaleSignX;
        var h = localBounds.height * scaleSignY;
        var deleteButtonOffsetY = this.deleteButtonOffsetY * scaleSignY;
        //var rotationLineLength = this.rotationLineLength * scaleSignY;

        this.c.tl.localPoint = new PIXI.Point(0, 0);
        this.c.tr.localPoint = new PIXI.Point(w, 0);
        this.c.tc.localPoint = _PointUtil.PointUtil.interpolate(this.c.tr.localPoint, this.c.tl.localPoint, .5);
        this.c.bl.localPoint = new PIXI.Point(0, h);
        this.c.br.localPoint = new PIXI.Point(w, h);
        this.c.bc.localPoint = _PointUtil.PointUtil.interpolate(this.c.br.localPoint, this.c.bl.localPoint, .5);
        this.c.ml.localPoint = _PointUtil.PointUtil.interpolate(this.c.bl.localPoint, this.c.tl.localPoint, .5);
        this.c.mr.localPoint = _PointUtil.PointUtil.interpolate(this.c.br.localPoint, this.c.tr.localPoint, .5);
        this.c.mc.localPoint = _PointUtil.PointUtil.interpolate(this.c.bc.localPoint, this.c.tc.localPoint, .5);
        this.c.de.localPoint = _PointUtil.PointUtil.add(this.c.tl.localPoint.clone(), new PIXI.Point(0, deleteButtonOffsetY));
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
            control.target = this.target;
        }
    };

    TransformTool.prototype.updateTransform = function updateTransform() {
        this.transform = this.target.worldTransform.clone();
        this.invertTransform = this.transform.clone();
        this.invertTransform.invert();

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.transform = this.transform;
        }
    };

    TransformTool.prototype.updatePrevTargetLt = function updatePrevTargetLt() {
        if (this.target === null) return;
        this.prevLtX = this.lt.x;
        this.prevLtY = this.lt.y;
    };

    TransformTool.prototype.scaleCorner = function scaleCorner(e) {
        var currentControl = e.target;
        var currentMousePoint = e.currentMousePoint;

        var currentPoint = this.invertTransform.apply(currentMousePoint);
        var startPoint = this.invertTransform.apply(this.startMousePoint);
        var vector = _PointUtil.PointUtil.subtract(currentPoint, startPoint);

        var currentControl = this.invertTransform.apply(currentControl.globalPoint);
        var centerPoint = this.invertTransform.apply(this.c.mc.globalPoint);
        var wh = _PointUtil.PointUtil.subtract(currentControl, centerPoint);

        var w = wh.x * 2;
        var h = wh.y * 2;
        var scaleX = 1 + vector.x / w;
        var scaleY = 1 + vector.y / h;

        var abs_scalex = Math.abs(scaleX);
        var abs_scaley = Math.abs(scaleY);

        var op_scalex = scaleX > 0 ? 1 : -1;
        var op_scaley = scaleY > 0 ? 1 : -1;

        if (abs_scalex > abs_scaley) scaleY = abs_scalex * op_scaley;else scaleX = abs_scaley * op_scalex;

        this.target.scale = { x: scaleX, y: scaleY };
    };

    TransformTool.prototype.scaleMiddle = function scaleMiddle(e) {
        var isScaleHorizontal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

        var currentControl = e.target;
        var currentMousePoint = e.currentMousePoint;

        var scaleX = 1;
        var scaleY = 1;

        var currentPoint = this.invertTransform.apply(currentMousePoint);
        var startPoint = this.invertTransform.apply(this.startMousePoint);
        var vector = _PointUtil.PointUtil.subtract(currentPoint, startPoint);

        var currentControl = this.invertTransform.apply(currentControl.globalPoint);
        var centerPoint = this.invertTransform.apply(this.c.mc.globalPoint);
        var wh = _PointUtil.PointUtil.subtract(currentControl, centerPoint);

        var w = wh.x * 2;
        var h = wh.y * 2;

        if (isScaleHorizontal) scaleX = 1 + vector.x / w;else scaleY = 1 + vector.y / h;

        this.target.scale = { x: scaleX, y: scaleY };
    };

    /**
     * 타겟 객체 이동
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */


    TransformTool.prototype.move = function move(e) {

        var change = e.targetChangeMovement;

        this.target.x += change.x;
        this.target.y += change.y;
    };

    TransformTool.prototype.doTransform = function doTransform(e) {
        var control = e.target;
        switch (control.type) {
            case _ToolControlType.ToolControlType.TOP_LEFT:
            case _ToolControlType.ToolControlType.TOP_RIGHT:
            case _ToolControlType.ToolControlType.BOTTOM_LEFT:
            case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                this.scaleCorner(e);
                break;

            case _ToolControlType.ToolControlType.MIDDLE_LEFT:
            case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                this.scaleMiddle(e, true);
                break;

            case _ToolControlType.ToolControlType.TOP_CENTER:
            case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                this.scaleMiddle(e, false);
                break;

            case _ToolControlType.ToolControlType.MIDDLE_CENTER:
                this.move(e);
                break;
        }
    };

    TransformTool.prototype.draw = function draw() {

        this.stageLayer.updateTransform();

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
            rbr: transform.apply(this.c.rbr.localPoint)
        };

        g.clear();
        // g.lineStyle(0.5, 0xFFFFFF);
        g.lineStyle(1, 0xFFFFFF);

        this.drawRect(g, globalPoints);

        for (var prop in this.controls) {
            var p = globalPoints[prop];
            var c = this.controls[prop];
            c.x = p.x;
            c.y = p.y;
            c.visible = true;
        }
    };

    /**
     * 트랜스폼 툴의 선과 컨트롤 객체 위치를 업데이트한다.
     * 1. target이 있는 경우에만 업데이트한다.
     * 2. target의 worldTransform을 통해 global 좌표를 계산한다.
     * @return {[type]} [description]
     */


    TransformTool.prototype.updateGraphics = function updateGraphics() {

        if (!this.target) return;

        this.stageLayer.updateTransform();

        this.g.visible = true;

        var locals = this.c,
            transform = this.target.worldTransform,
            globals = (0, _lambda.map)(_collection, function (e, key) {
            return transform.apply(locals[key].localPoint);
        });

        globals.de = globals.rde = this.deleteButtonPosition;

        this.g.clear();
        this.g.lineStyle(0.5, 0xFFFFFF);

        this.drawRect(this.g, globals);

        (0, _lambda.each)(this.controls, function (e, key) {

            e.x = globals[key].x;
            e.y = globals[key].y;

            e.visible = true;
        });
    };

    /**
     * 주어진 graphics 객체를 사용하여 사각형을 그린다.
     * 1. points 객체에 좌상단(tl), 우상단(tr), 우하단(br), 좌하단(bl) 4개의 points가 있다.
     * @param  {[type]} g      [description]
     * @param  {[type]} points [description]
     * @return {[type]}        [description]
     */


    TransformTool.prototype.drawRect = function drawRect(g, points) {

        g.moveTo(points.tl.x, points.tl.y);
        g.lineTo(points.tr.x, points.tr.y);
        g.lineTo(points.br.x, points.br.y);
        g.lineTo(points.bl.x, points.bl.y);
        g.lineTo(points.tl.x, points.tl.y);
    };

    TransformTool.prototype.setPivotByLocalPoint = function setPivotByLocalPoint(localPoint) {
        this.target.setPivot(localPoint);
        this.target.pivot = localPoint;
        this.adjustPosition();
    };

    TransformTool.prototype.setPivotByControl = function setPivotByControl(control) {
        this.pivot = this.getPivot(control);
        this.target.setPivot(this.pivot.localPoint);
        this.adjustPosition();
    };

    TransformTool.prototype.adjustPosition = function adjustPosition() {
        var offsetX = this.lt.x - this.prevLtX;
        var offsetY = this.lt.y - this.prevLtY;
        var noScaleOffsetX = offsetX / this.diffScaleX;
        var noScaleOffsetY = offsetY / this.diffScaleY;
        var pivotOffsetX = offsetX - noScaleOffsetX;
        var pivotOffsetY = offsetY - noScaleOffsetY;
        this.target.x = this.target.x - offsetX + pivotOffsetX;
        this.target.y = this.target.y - offsetY + pivotOffsetY;
        this.updatePrevTargetLt();
    };

    TransformTool.prototype.getPivot = function getPivot(control) {
        switch (control.type) {
            case _ToolControlType.ToolControlType.DELETE:
                return this.c.mc;
            case _ToolControlType.ToolControlType.ROTATION:
                return this.c.mc;
            case _ToolControlType.ToolControlType.TOP_LEFT:
                return this.c.br;
            case _ToolControlType.ToolControlType.TOP_CENTER:
                return this.c.bc;
            case _ToolControlType.ToolControlType.TOP_RIGHT:
                return this.c.bl;
            case _ToolControlType.ToolControlType.MIDDLE_LEFT:
                return this.c.mr;
            case _ToolControlType.ToolControlType.MIDDLE_RIGHT:
                return this.c.ml;
            case _ToolControlType.ToolControlType.BOTTOM_LEFT:
                return this.c.tr;
            case _ToolControlType.ToolControlType.BOTTOM_CENTER:
                return this.c.tc;
            case _ToolControlType.ToolControlType.BOTTOM_RIGHT:
                return this.c.tl;
            case _ToolControlType.ToolControlType.MIDDLE_CENTER:
                return this.c.mc;
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // Cursor
    //////////////////////////////////////////////////////////////////////////


    TransformTool.prototype.enableCurrentStyleCursor = function enableCurrentStyleCursor() {
        if (this.target === null) return;

        this.target.buttonMode = false;
        this.target.interactive = false;
        this.target.defaultCursor = 'inherit';

        for (var prop in this.c) {
            var c = this.c[prop];
            c.buttonMode = false;
            c.interactive = false;
            c.defaultCursor = 'inherit';
        }

        this.stageLayer.buttonMode = true;
        this.stageLayer.interactive = true;
        this.stageLayer.defaultCursor = _Mouse.Mouse.currentCursorStyle;
    };

    TransformTool.prototype.disableCurrentStyleCursor = function disableCurrentStyleCursor() {
        if (this.target === null) return;

        this.target.buttonMode = true;
        this.target.interactive = true;
        this.target.defaultCursor = 'inherit';

        for (var prop in this.c) {
            var c = this.c[prop];
            c.buttonMode = true;
            c.interactive = true;
            c.defaultCursor = 'inherit';
        }

        this.stageLayer.buttonMode = false;
        this.stageLayer.interactive = false;
        this.stageLayer.defaultCursor = 'inherit';
    };

    TransformTool.prototype.onSetTarget = function onSetTarget(target) {
        if (this.target !== target) this.releaseTarget();
    };

    TransformTool.prototype.onDelete = function onDelete(e) {
        if (!this.target) return;
        this.target.emit(TransformTool.DELETE, this.target);
    };

    TransformTool.prototype.onRotateStart = function onRotateStart(e) {
        if (!this.target) return;
        this.downCnt++;
        this.target._rotation = this.target.rotation;
        this.setPivotByControl(e.target);
        this.enableCurrentStyleCursor();
    };

    TransformTool.prototype.onRotate = function onRotate(e) {
        if (!this.target) return;

        if (this.useSnap) {
            var rotation = this.target._rotation + e.changeRadian;
            var angle = _Calculator.Calc.toDegrees(rotation);
            var absAngle = Math.round(Math.abs(angle) % 90);

            if (absAngle < this._startSnapAngle || absAngle > this._endSnapAngle) {
                this.target.rotation = _Calculator.Calc.toRadians(_Calculator.Calc.snapTo(angle, 90));
            } else {
                this.target.rotation = rotation;
            }

            this.target._rotation = rotation;
        } else {
            this.target.rotation += e.changeRadian;
            this.target._rotation = this.target.rotation;
        }

        this.draw();
        this.updatePrevTargetLt();
    };

    TransformTool.prototype.onRotateEnd = function onRotateEnd(e) {
        if (!this.target) return;
        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
        this.disableCurrentStyleCursor();
    };

    TransformTool.prototype.onControlMoveStart = function onControlMoveStart(e) {
        if (!this.target) return;
        this.downCnt++;
        this.startMousePoint = { x: e.currentMousePoint.x, y: e.currentMousePoint.y };
        this.setPivotByControl(e.target);
        this.updatePrevTargetLt();
        this.enableCurrentStyleCursor();
    };

    TransformTool.prototype.onControlMove = function onControlMove(e) {
        if (!this.target) return;
        this.doTransform(e);
        this.draw();
        this.updatePrevTargetLt();
    };

    TransformTool.prototype.onControlMoveEnd = function onControlMoveEnd(e) {
        if (!this.target) return;
        this.target.emit(TransformTool.TRANSFORM_COMPLETE);
        this.disableCurrentStyleCursor();
    };

    TransformTool.prototype.onControlDBClick = function onControlDBClick(e) {
        if (!this.target) return;
        this.target.emit(TransformTool.DBCLICK, { target: this.target });
    };

    TransformTool.prototype.onChangeRotationCursor = function onChangeRotationCursor(cursor) {
        this.stageLayer.defaultCursor = cursor;
    };

    TransformTool.prototype.onTextureUpdate = function onTextureUpdate(e) {
        var target = e.target;
        var width = target.width;
        var height = target.height;
        this.setPivotByLocalPoint({ x: 0, y: 0 });
        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
    };

    _createClass(TransformTool, [{
        key: 'lt',
        get: function get() {
            this.target.displayObjectUpdateTransform();
            var transform = this.target.worldTransform.clone();
            transform.rotate(-this.targetLayer.rotation);
            return transform.apply({ x: 0, y: 0 });
        }
    }, {
        key: 'deleteButtonPosition',
        get: function get() {
            if (!this.c) return new PIXI.Point(0, 0);

            var transform = this.target.worldTransform.clone();
            var tl = transform.apply(this.c.tl.localPoint);
            var ml = transform.apply(this.c.ml.localPoint);
            //return PointUtil.getAddedInterpolate(tl, ml, this.deleteButtonOffsetY);
            return _PointUtil.PointUtil.add(_PointUtil.PointUtil.getAddedInterpolate(tl, ml, this.deleteButtonOffsetY), new PIXI.Point(-this.deleteButtonSize, -this.deleteButtonSize));
        }

        /**
         * NOT USE
         * 회전 컨트롤이 모든 컨트롤 뒤에 배치되도록 변경되어 사용하지 않습니다.
         * @returns {*}
         */

    }, {
        key: 'rotateControlPosition',
        get: function get() {
            if (!this.c) return new PIXI.Point(0, 0);

            var transform = this.target.worldTransform.clone();
            var tc = transform.apply(this.c.tc.localPoint);
            var ro = transform.apply(this.c.ro.localPoint);
            return _PointUtil.PointUtil.getAddedInterpolate(tc, ro, this.rotationLineLength);
        }
    }, {
        key: 'diffScaleX',
        get: function get() {
            var matrix = this.target.worldTransform;
            return Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        }
    }, {
        key: 'diffScaleY',
        get: function get() {
            var matrix = this.target.worldTransform;
            return Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
        }
    }, {
        key: 'width',
        get: function get() {
            return this.target.width * this.diffScaleX;
        }
    }, {
        key: 'height',
        get: function get() {
            return this.target.height * this.diffScaleY;
        }
    }, {
        key: 'useSnap',
        set: function set(value) {
            this._useSnap = value;
        },
        get: function get() {
            return this._useSnap;
        }
    }, {
        key: 'snapAngle',
        set: function set(value) {
            this._snapAngle = value;
            this._startSnapAngle = value;
            this._endSnapAngle = 90 - value;
        },
        get: function get() {
            return this._snapAngle;
        }
    }]);

    return TransformTool;
}(PIXI.utils.EventEmitter);

},{"../utils/lambda":11,"./../utils/Calculator":7,"./../utils/Mouse":8,"./../utils/PointUtil":10,"./../view/VectorContainer":12,"./RotationControlType":3,"./ToolControl":4,"./ToolControlType":5}],7:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Calc = exports.Calc = function () {
    Calc.toRadians = function toRadians(degree) {
        return degree * Calc.DEG_TO_RAD;
    };

    Calc.toDegrees = function toDegrees(radians) {
        return radians * Calc.RAD_TO_DEG;
    };

    Calc.getRotation = function getRotation(centerPoint, mousePoint) {
        var dx = mousePoint.x - centerPoint.x;
        var dy = mousePoint.y - centerPoint.y;
        var radians = Math.atan2(dy, dx);
        return Calc.toDegrees(radians);
    };

    Calc.deltaTransformPoint = function deltaTransformPoint(matrix, point) {
        var dx = point.x * matrix.a + point.y * matrix.c + 0;
        var dy = point.x * matrix.b + point.y * matrix.d + 0;
        return { x: dx, y: dy };
    };

    Calc.getSkewX = function getSkewX(matrix) {
        var px = Calc.deltaTransformPoint(matrix, { x: 0, y: 1 });
        return 180 / Math.PI * Math.atan2(px.y, px.x) - 90;
    };

    Calc.getSkewY = function getSkewY(matrix) {
        var py = Calc.deltaTransformPoint(matrix, { x: 1, y: 0 });
        return 180 / Math.PI * Math.atan2(py.y, py.x);
    };

    Calc.snapTo = function snapTo(num, snap) {
        return Math.round(num / snap) * snap;
    };

    //////////////////////////////////////////////////////////////////////////
    // Utils
    //////////////////////////////////////////////////////////////////////////


    Calc.digit = function digit(convertNumber) {
        var digitNumber = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

        if (digitNumber === 0) digitNumber = 1;

        var pow = Math.pow(10, digitNumber);
        return parseInt(convertNumber * pow) / pow;
    };

    Calc.leadingZero = function leadingZero(number) {
        var digits = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

        var zero = '';
        number = number.toString();

        if (number.length < digits) {
            for (var i = 0; i < digits - number.length; i++) {
                zero += '0';
            }
        }
        return zero + number;
    };

    Calc.trace = function trace(number) {
        return Calc.leadingZero(parseInt(number));
    };

    _createClass(Calc, null, [{
        key: 'DEG_TO_RAD',
        get: function get() {
            if (!this._DEG_TO_RAD) this._DEG_TO_RAD = Math.PI / 180;
            return this._DEG_TO_RAD;
        }
    }, {
        key: 'RAD_TO_DEG',
        get: function get() {
            if (!this._RAD_TO_DEG) this._RAD_TO_DEG = 180 / Math.PI;
            return this._RAD_TO_DEG;
        }
    }]);

    function Calc() {
        _classCallCheck(this, Calc);
    }

    return Calc;
}();

},{}],8:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mouse = exports.Mouse = function () {
    function Mouse() {
        _classCallCheck(this, Mouse);
    }

    _createClass(Mouse, null, [{
        key: "renderer",
        set: function set(value) {
            this._renderer = value;
        },
        get: function get() {
            return this._renderer;
        }
    }, {
        key: "global",
        get: function get() {
            return Mouse.renderer.plugins.interaction.mouse.global;
        }
    }, {
        key: "globalX",
        get: function get() {
            return Mouse.renderer.plugins.interaction.mouse.global.x;
        }
    }, {
        key: "globalY",
        get: function get() {
            return Mouse.renderer.plugins.interaction.mouse.global.y;
        }
    }, {
        key: "currentCursorStyle",
        set: function set(value) {
            Mouse.renderer.plugins.interaction.currentCursorStyle = value;
        },
        get: function get() {
            return Mouse.renderer.plugins.interaction.currentCursorStyle;
        }
    }]);

    return Mouse;
}();

},{}],9:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Painter = exports.Painter = function () {
    function Painter() {
        _classCallCheck(this, Painter);
    }

    Painter.getRect = function getRect() {
        var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 4;
        var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFF3300;
        var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        var half = size / 2;
        var rect = new PIXI.Graphics();
        rect.beginFill(color, alpha);
        rect.drawRect(-half, -half, size, size);
        rect.endFill();
        return rect;
    };

    Painter.getCircle = function getCircle() {
        var radius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
        var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFF3300;
        var alpha = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

        var cicle = new PIXI.Graphics();
        cicle.beginFill(color, alpha);
        cicle.drawCircle(0, 0, radius);
        cicle.endFill();
        return cicle;
    };

    Painter.drawBounds = function drawBounds(graphics, bounds) {
        var initClear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var thickness = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0xFF3300;
        var alpha = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.7;

        if (initClear) graphics.clear();

        graphics.lineStyle(thickness, color, alpha);
        graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height);
        graphics.endFill();
    };

    Painter.drawPoints = function drawPoints(graphics, points) {
        var initClear = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
        var thickness = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0xFF3300;
        var alpha = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0.7;

        if (initClear) graphics.clear();

        var lt = points.lt;
        var rt = points.rt;
        var rb = points.rb;
        var lb = points.lb;

        graphics.lineStyle(thickness, color, alpha);
        graphics.moveTo(lt.x, lt.y);
        graphics.lineTo(rt.x, rt.y);
        graphics.lineTo(rb.x, rb.y);
        graphics.lineTo(lb.x, lb.y);
        graphics.lineTo(lt.x, lt.y);
        graphics.endFill();
    };

    Painter.drawCircle = function drawCircle(graphics, point) {
        var radius = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;
        var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0xFF3300;
        var alpha = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0.7;
        var initClear = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;

        if (initClear) graphics.clear();

        graphics.beginFill(color, alpha);
        graphics.drawCircle(point.x, point.y, radius);
        graphics.endFill();
    };

    Painter.drawGrid = function drawGrid(graphics, width, height) {
        var lightLineAlpha = 0.1;
        var heavyLineAlpha = 0.3;

        for (var x = 0.5; x < width; x += 10) {
            if ((x - 0.5) % 50 === 0) graphics.lineStyle(1, 0x999999, heavyLineAlpha);else graphics.lineStyle(1, 0xdddddd, lightLineAlpha);

            graphics.moveTo(x, 0);
            graphics.lineTo(x, height);
        }

        for (var y = 0.5; y < height; y += 10) {
            if ((y - 0.5) % 50 === 0) graphics.lineStyle(1, 0x999999, heavyLineAlpha);else graphics.lineStyle(1, 0xdddddd, lightLineAlpha);

            graphics.moveTo(0, y);
            graphics.lineTo(width, y);
        }

        graphics.endFill();
    };

    Painter.drawDistToSegment = function drawDistToSegment(graphics, point, lineA, lineB, distancePoint) {
        // 1. 라인 그리기
        // 2. distancePoint -> point 연결하기
        // 3. distancePoint -> returnPoint 연결하기

        var radius = 3;
        var lineAlpha = 0.1;
        var shapeAlpha = 0.2;

        // 1
        graphics.beginFill(0x00CC33, shapeAlpha);
        graphics.lineStyle(1, 0x009933, lineAlpha);
        graphics.moveTo(lineA.x, lineA.y);
        graphics.lineTo(lineB.x, lineB.y);
        graphics.drawCircle(lineA.x, lineA.y, radius);
        graphics.drawCircle(lineB.x, lineB.y, radius);

        // 2
        /*graphics.beginFill(0xCCCCFF, shapeAlpha);
         graphics.lineStyle(1, 0x660099, 0.1);
         graphics.moveTo(distancePoint.x, distancePoint.y);
         graphics.lineTo(point.x, point.y);
         graphics.drawCircle(point.x, point.y, radius);
         graphics.beginFill(0xFF3300, 0.4);
         graphics.drawCircle(distancePoint.x, distancePoint.y, radius);*/

        // 3
        graphics.beginFill(0xFFCCFF, shapeAlpha);
        graphics.lineStyle(1, 0xCC99CC, lineAlpha);
        graphics.moveTo(point.x, point.y);
        graphics.lineTo(point.x, distancePoint.y);
        graphics.lineTo(distancePoint.x, distancePoint.y);
        graphics.drawCircle(point.x, point.y, radius);
        graphics.drawCircle(distancePoint.x, distancePoint.y, radius);

        graphics.endFill();
    };

    Painter.drawLine = function drawLine(graphics, p1, p2) {
        var thickness = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
        var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0xFF3300;
        var alpha = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;

        //graphics.beginFill(color, alpha);
        graphics.lineStyle(thickness, color, alpha);
        graphics.moveTo(p1.x, p1.y);
        graphics.lineTo(p2.x, p2.y);
        //graphics.endFill();
    };

    Painter.drawTriagle = function drawTriagle(graphics, p0, p1, p2) {
        var thickness = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
        var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0xFF3300;
        var alpha = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 1;
        var isFill = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : false;

        if (isFill) graphics.beginFill(color, alpha);

        graphics.lineStyle(thickness, color, alpha);
        graphics.moveTo(p0.x, p0.y);
        graphics.lineTo(p1.x, p1.y);
        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(p0.x, p0.y);

        if (isFill) graphics.endFill();
    };

    Painter.getText = function getText(str) {
        var textColor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0xFFFFFF;
        var backgroundColor = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0xFFFFFF;

        var container = new PIXI.Sprite();

        var text = new PIXI.Text(str, { fontSize: 14, fill: textColor });
        text.x = -text.width / 2;
        text.y = -text.height / 2;

        var bg = new PIXI.Graphics();
        bg.beginFill(backgroundColor);
        bg.drawRect(text.x, text.y, text.width, text.height);
        bg.endFill();

        container.addChild(bg);
        container.addChild(text);

        return container;
    };

    return Painter;
}();

},{}],10:[function(require,module,exports){
"use strict";

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PointUtil = exports.PointUtil = function () {
    PointUtil.add = function add(point1, point2) {
        return new PIXI.Point(point1.x + point2.x, point1.y + point2.y);
    };

    PointUtil.subtract = function subtract(point1, point2) {
        return new PIXI.Point(point1.x - point2.x, point1.y - point2.y);
    };

    PointUtil.distance = function distance(point1, point2) {
        return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
    };

    PointUtil.calcDistance = function calcDistance(point1, point2) {
        return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
    };

    PointUtil.getAddedInterpolate = function getAddedInterpolate(tc, bc, addLength) {
        var h = PointUtil.calcDistance(tc, bc);
        var f = (h + addLength) / h;
        return PointUtil.interpolate(tc, bc, f);
    };

    /**
     * 지정한 두 점 사이에서 한 점을 정합니다.
     * http://help.adobe.com/ko_KR/as2/reference/flashlite/WS5A22C182-B974-4b7e-9979-5BD0B43389F0.html
     * @param point1
     * @param point2
     * @param f
     * @returns {PIXI.Point|*}
     */


    PointUtil.interpolate = function interpolate(point1, point2, f) {
        return new PIXI.Point(point2.x + f * (point1.x - point2.x), point2.y + f * (point1.y - point2.y));
    };

    /**
     * (0,0)과 현재 포인트 사이의 선분을 설정된 길이로 조절합니다.
     * http://help.adobe.com/ko_KR/as2/reference/flashlite/WSB22C5AE6-750E-4274-BBF4-C10BD879207C.html
     * @param point
     * @param length
     * @returns {*}
     */


    PointUtil.normalize = function normalize(point, length) {
        if (point.x == 0 && point.y == 0) return point;

        var norm = length / Math.sqrt(point.x * point.x + point.y * point.y);
        point.x *= norm;
        point.y *= norm;
        return point;
    };

    function PointUtil() {
        _classCallCheck(this, PointUtil);
    }

    return PointUtil;
}();

},{}],11:[function(require,module,exports){
"use strict";

exports.__esModule = true;
exports.each = each;
exports.every = every;
exports.map = map;
exports.filter = filter;
exports.reduce = reduce;
exports.indexOf = indexOf;


/**
 * array일 경우 array.forEach, 
 * Object일 경우 for..in 문을 이용 iterator callback을 실행
 * iterator 반환값이 true일 경우 for loop를 빠져나온다. 
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
function each(collection, iterator) {

	if (collection instanceof Array) {

		collection.forEach(iterator);
	} else {

		for (var s in collection) {

			if (iterator(collection[s], s, collection)) break;
		}
	}
}

/**
 * array.every
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
function every(collection, iterator) {

	if (collection instanceof Array) return collection.every(iterator);

	for (var s in collection) {

		if (!iterator(collection[s], s, collection)) return false;
	}

	return true;
}

/**
 * Array.map
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
function map(collection, iterator) {

	var o = void 0;

	if (collection instanceof Array) {

		return collection.map(iterator);
	} else {

		o = {};

		each(collection, function (e, key, collection) {

			o[key] = iterator(e, key, collection);
		});
	}

	return o;
}

/**
 * Array.filter
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @return {[type]}            [description]
 */
function filter(collection, iterator) {

	if (collection instanceof Array) {

		return collection.filter(iterator);
	} else {
		(function () {

			var o = {};

			each(collection, function (e, key, collection) {

				if (iterator(e, key, collection0)) {
					o[key] = e;
				}
			});
		})();
	}

	return o;
}

/**
 * array일 경우 array.reduce
 * object일 경우 pollyfill
 * @param  {[type]} collection [description]
 * @param  {[type]} iterator   [description]
 * @param  {[type]} initValue  [description]
 * @return {[type]}            [description]
 */
function reduce(collection, iterator) {
	var initValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;


	if (collection instanceof Array) {

		return collection.reduce(iterator, initValue);
	}

	var i = initValue;

	each(collection, function (n, key) {

		i = iterator(n, i, key);
	});

	return i;
}

/**
 * object의 indexOf 구현. 
 * 포함된 속성이라면 key( property name )을 반환한다. 
 * @param  {[type]} collection [description]
 * @param  {[type]} element    [description]
 * @return {[type]}            [description]
 */
function indexOf(collection, element) {

	if (collection instanceof Array) {
		return collection.indexOf(element);
	}

	var name = null;

	each(collection, function (e, key) {

		if (e == element) {

			name = key;

			return true;
		}
	});

	return name;
}

},{}],12:[function(require,module,exports){
'use strict';

exports.__esModule = true;
exports.VectorContainer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Calculator = require('./../utils/Calculator');

var _TransformTool = require('./../transform/TransformTool');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var VectorContainer = exports.VectorContainer = function (_PIXI$Container) {
    _inherits(VectorContainer, _PIXI$Container);

    _createClass(VectorContainer, null, [{
        key: 'MAX_WIDTH',


        /**
         * VectorContainer 최대 넓이와 높이
         * 캔버스 최대 사이즈가 IE Mobile 에서는 4,096 픽셀이며 IE 에서는 8,192 픽셀입니다.
         */
        get: function get() {
            return 4000;
        }
    }, {
        key: 'MAX_HEIGHT',
        get: function get() {
            return 4000;
        }

        /**
         * Vector가 처음 로드 되었을 때 이벤트
         * @returns {string}
         * @constructor
         */

    }, {
        key: 'LOAD_COMPLETE',
        get: function get() {
            return 'drawComplete';
        }

        /**
         * 처음 이후 업데이트 되었을 때 이벤트
         * @returns {string}
         * @constructor
         */

    }, {
        key: 'TEXTURE_UPDATE',
        get: function get() {
            return 'textureUpdate';
        }
    }]);

    function VectorContainer() {
        _classCallCheck(this, VectorContainer);

        var _this = _possibleConstructorReturn(this, _PIXI$Container.call(this));

        _this.initialize();
        _this.addEvent();
        return _this;
    }

    VectorContainer.prototype.initialize = function initialize() {
        this.image = null;
        this.scaleSignX = 1;
        this.scaleSignY = 1;
        this.interactive = true;
        this.isFirstLoad = true;
        this.renderableObject = true;

        this.canvgCanvas = document.createElement('CANVAS');
        this.canvgCanvas.id = 'canvgCanvas';
        this.canvgContext = this.canvgCanvas.getContext('2d');

        this.setpixelated(this.canvgContext);
    };

    VectorContainer.prototype.setpixelated = function setpixelated(context) {
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
    };

    VectorContainer.prototype.addEvent = function addEvent() {
        this.drawCompleteListener = this.onDrawComplete.bind(this);
        this.transformCompleteListener = this.onTransformComplete.bind(this);
        this.on(_TransformTool.TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
    };

    VectorContainer.prototype.removeEvent = function removeEvent() {
        this.off(_TransformTool.TransformTool.TRANSFORM_COMPLETE, this.transformCompleteListener);
        this.drawCompleteListener = null;
        this.transformCompleteListener = null;
    };

    VectorContainer.prototype.load = function load(url) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
        var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 100;

        this.url = url;
        this.originW = width;
        this.originH = height;
        this.drawSvg(x, y, width, height);
    };

    VectorContainer.prototype.setSVG = function setSVG(dom) {
        var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
        var width = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 100;
        var height = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 100;

        this.svg = dom;
        this.originW = width;
        this.originH = height;
        this.drawSvg(x, y, width, height);
    };

    VectorContainer.prototype.setPivot = function setPivot(localPoint) {
        this.pivot = localPoint;
    };

    VectorContainer.prototype.drawSvg = function drawSvg(x, y, width, height) {
        this.drawX = x;
        this.drawY = y;
        this.drawWidth = width;
        this.drawHeight = height;

        var signX = width < 0 ? -1 : 1;
        var signY = height < 0 ? -1 : 1;
        this.scaleSignX = this.scaleSignX * signX;
        this.scaleSignY = this.scaleSignY * signY;
        width = Math.abs(width);
        height = Math.abs(height);
        width = width > VectorContainer.MAX_WIDTH ? VectorContainer.MAX_WIDTH : width;
        height = height > VectorContainer.MAX_HEIGHT ? VectorContainer.MAX_HEIGHT : height;
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
    };

    VectorContainer.prototype.delete = function _delete() {
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
    };

    VectorContainer.prototype.checkAlphaPoint = function checkAlphaPoint(globalMPoint) {
        var point = this.worldTransform.applyInverse(globalMPoint);
        var data = this.canvgContext.getImageData(point.x, point.y, 1, 1);

        if (data.data[3] == 0) {
            return true;
        }
        return false;
    };

    VectorContainer.prototype.onTransformComplete = function onTransformComplete(e) {
        this.drawSvg(0, 0, this.width, this.height);
    };

    VectorContainer.prototype.onDrawComplete = function onDrawComplete() {
        if (this.isFirstLoad === true) {
            this.isFirstLoad = false;
            this.image = new PIXI.Sprite(new PIXI.Texture.fromCanvas(this.canvgCanvas));
            this.image.renderableObject = true;
            this.addChild(this.image);
            this.emit(VectorContainer.LOAD_COMPLETE, { target: this });
        } else {
            this.scale = { x: 1, y: 1 };
            this.image.scale = { x: this.scaleSignX, y: this.scaleSignY };
            this.image.texture.update();
            this.image.updateTransform();
            this.emit(VectorContainer.TEXTURE_UPDATE, {
                target: this,
                scaleSignX: this.scaleSignX,
                scaleSignY: this.scaleSignY
            });
        }
    };

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


    VectorContainer.prototype.toString = function toString() {
        console.log('');
        var localBounds = this.getLocalBounds();
        var imageLocalBounds = this.image.getLocalBounds();
        console.log('wh[' + _Calculator.Calc.digit(this.width) + ', ' + _Calculator.Calc.digit(this.height) + '], localBounds[' + localBounds.width + ', ' + localBounds.height + ']');
        console.log('image wh[' + _Calculator.Calc.digit(this.image.width), ', ' + _Calculator.Calc.digit(this.image.height) + '], localBounds[' + imageLocalBounds.width + ', ' + imageLocalBounds.height + ']');
    };

    _createClass(VectorContainer, [{
        key: 'ID',
        get: function get() {
            return this._id;
        },
        set: function set(id) {
            this._id = id;
        }
    }, {
        key: 'scaleForOrigin',
        get: function get() {
            return { x: this.width / this.originW, y: this.height / this.originH };
        }
    }, {
        key: 'snapshot',
        get: function get() {
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
    }]);

    return VectorContainer;
}(PIXI.Container);

},{"./../transform/TransformTool":6,"./../utils/Calculator":7}]},{},[1]);
