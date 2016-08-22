import {Mouse} from './nts/editor/utils/Mouse';
import {StickerMain} from './nts/editor/sticker/StickerMain';


var stage, stickerMain, rootLayer, stickerLayer, canvas, context, renderer;

window.onload = initailize.bind(this);


function initailize() {
    console.log('initialize');
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    renderer = new PIXI.CanvasRenderer(canvas.width, canvas.height, {
        view: canvas,
        autoResize: true,
        backgroundColor: 0xe5e5e5
    });

    Mouse.renderer = renderer;
    stage = new PIXI.Container(0xE6E9EC);
    rootLayer = new PIXI.Container(0xE6E9EC);
    stickerLayer = new PIXI.Container(0xE6E9EC);

    stage.addChild(stickerLayer);
    stage.addChild(rootLayer);

    stickerMain = new StickerMain(renderer, rootLayer, stickerLayer);

    updateLoop();
    resizeWindow();
}


function updateLoop (ms) {
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

    if(stickerMain)
        stickerMain.resize();
}
