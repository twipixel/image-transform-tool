import 'babel-polyfill';
import {Mouse} from './nts/editor/utils/Mouse';
import Config from './nts/editor/config/Config';
import {Calc} from './nts/editor/utils/Calculator';
import {StickerMain} from './nts/editor/sticker/StickerMain';


var stage, stickerMain, rootLayer, stickerLayer, canvas, context, renderer;

window.onload = initailize.bind(this);


function initailize() {
    canvas = document.getElementById('canvas');

    renderer = new PIXI.CanvasRenderer(canvas.width, canvas.height, {
        view: canvas,
        autoResize: true,
        backgroundColor: 0x673AB7
    });

    /*renderer = new PIXI.WebGLRenderer(canvas.width, canvas.height, {
        view: canvas,
        autoResize: true,
        backgroundColor: 0x673AB7
    });*/

    // 위치가 정수가 아닐경우 흐릿하게 보이는 문제가 있어
    // 렌더러의 위치를 정수로 연산될 수 있도록 한다.
    renderer.roundPixels = true;

    Config.renderer = renderer;
    Mouse.renderer = renderer;
    stage = new PIXI.Container(0xE6E9EC);
    rootLayer = new PIXI.Container(0xE6E9EC);
    stickerLayer = new PIXI.Container(0xE6E9EC);

    // 컨테이너에 scale과 rotation 이 있을 때를 고려해서 만들었습니다
    //stickerLayer.scale = {x: 1.2, y: 1.2};
    // stickerLayer.rotation = Calc.toRadians(40);

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
