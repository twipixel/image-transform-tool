import {ImageEditor} from './nts/editor/ImageEditor';



var editor;
var image = document.getElementById('image');
var texture = document.getElementById('texture');

//window.onload = initailize.bind(this);
window.onload = fastInitailize.bind(this);
window.onresize = resizeWindow.bind(this);


function fastInitailize() {
    if(image && texture) {
        var context = texture.getContext('2d');
        texture.width = image.width;
        texture.height = image.height;
        context.drawImage(image, 0, 0, image.width, image.height);
        document.body.removeChild(image);
        document.body.removeChild(texture);

        //beginWithImageElement(image);
        beginWithCanvas(texture, image);
    }
}


function beginWithImageElement(image) {
    editor = new ImageEditor(image);
    resizeWindow();
}


function beginWithCanvas(texture, imageElement) {
    editor = new ImageEditor(texture, imageElement);
    resizeWindow();
}


function resizeWindow() {
    if(editor)
        editor.resize();
}
