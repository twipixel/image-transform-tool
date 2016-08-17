import Vector3D from './Vector3D';

export class ControlPoint {

    static get ID_TOP_LEFT() {
        return 'topLeft';
    }

    static get ID_TOP_CENTER() {
        return 'topCenter';
    }

    static get ID_TOP_RIGHT() {
        return 'topRight';
    }

    static get ID_MIDDLE_LEFT() {
        return 'middleLeft';
    }

    static get ID_MIDDLE_CENTER() {
        return 'middleCenter';
    }

    static get ID_MIDDLE_RIGHT() {
        return 'middleRight';
    }

    static get ID_BOTTOM_LEFT() {
        return 'bottomLeft';
    }

    static get ID_BOTTOM_CENTER() {
        return 'bottomCenter';
    }

    static get ID_BOTTOM_RIGHT() {
        return 'bottomRight';
    }

    static get ID_ROTATION() {
        return 'rotation';
    }

    static get ID_CLOSE() {
        return 'close';
    }

    static get TYPE_VERTEX() {
        return 'vertex'
    }

    static get TYPE_SEGMENT() {
        return 'segement';
    }

    static get TYPE_ROTATION() {
        return 'rotation';
    }


    static interpolate(point1, point2, f) {
        return new PIXI.Point(point2.x + f * (point1.x - point2.x), point2.y + f * (point1.y - point2.y));
    }

    static add(point1, point2) {
        console.log('add', point1, point2);
        return new PIXI.Point(point1.x + point2.x, point1.y + point2.y);
    }

    static subtract(point1, point2) {
        return new PIXI.Point(point1.x - point2.x, point1.y - point2.y);
    }

    static normalize(point, thickness) {
        if (point.x == 0 && point.y == 0)
            return point;

        var norm = thickness / Math.sqrt(point.x * point.x + point.y * point.y);
        point.x *= norm;
        point.y *= norm;
        return point;
    }

    constructor(id, type, color = 0x000000) {
        this.id = id;
        this.type = type;
        this.color = color;
        this._matrix = new PIXI.Matrix();
        this._screenPosition = new PIXI.Point();
    }

    update() {
        if (this.type === ControlPoint.TYPE_ROTATION) {
            var centerPosition = this.matrix.apply(this.absCenterPosition);
            var topCenterScreenPosition = this.matrix.apply(this.absPosition);

            console.log('topCenterScreeenPosition:', topCenterScreenPosition);

            var offsetLength = ControlPoint.subtract(topCenterScreenPosition, centerPosition);

            console.log('offsetLength:', offsetLength);

            offsetLength = ControlPoint.normalize(offsetLength, 25);

            console.log('-> offsetLength:', offsetLength);

            this._screenPosition = this.matrix.apply(this.absPosition);
            this._screenPosition = ControlPoint.add(this._screenPosition, offsetLength);
        }
        else {
            this._screenPosition = this.matrix.apply(this.absPosition);
        }
    }




    draw(graphics) {
        var size = 5;
        var thickness = 1;
        var half = size / 2;
        var color = 0xFFFFFF;

        graphics.beginFill(color);

        if (this.type !== ControlPoint.TYPE_ROTATION) {
            graphics.lineStyle(thickness, color);
            //graphics.arc(this.screenPosition.x, this.screenPosition.y, size, 0, Math.PI * 2);
            graphics.drawCircle(this.screenPosition.x, this.screenPosition.y, size);
        } else {
            graphics.lineStyle(thickness, color);
            graphics.drawRect(this.screenPosition.x - half, this.screenPosition.y - half, size, size);
        }
        graphics.endFill();
    }

    getAppendedMatrix(mousePoint, isCtrlKey, isShiftKey) {
        var v, newAddedMatrix, centerPosition, mp2;
        var cloneMatrix = this.matrix.clone();

        if (this.type === ControlPoint.TYPE_ROTATION) {
            centerPosition = cloneMatrix.apply(this.absCenterPosition);
            v = this.subtract(mousePoint, centerPosition);
        } else {
            cloneMatrix.invert();
            mp2 = cloneMatrix.apply(mousePoint);
            v = this.subtract(mp2, this.absPosition);
        }
        newAddedMatrix = this._getAddedMatrixFromMouse(v, isCtrlKey, isShiftKey);
        return newAddedMatrix;
    }

    _getAddedMatrixFromMouse(mousePoint, isCtrlKey, isShiftKey) {
        var matrix = new PIXI.Matrix();

        if (this.type !== ControlPoint.TYPE_ROTATION) {
            var wh = this.subtract(this.absPosition, this.absCenterPosition);
            var w = wh.x * 2;
            var h = wh.y * 2;
            var wr = (mousePoint.x / w);
            var hr = (mousePoint.y / h);
            var scalex, scaley;
            var n = 1;

            console.log('wh:', wh, 'w:', w, 'h:', h, 'wr:', wr, 'hr:', hr);

            if (isCtrlKey) {
                n = 2;
            }

            scalex = 1 + (n * wr);
            scaley = 1 + (n * hr);

            if (isShiftKey && this.type === ControlPoint.TYPE_VERTEX) {
                var abs_scalex = Math.abs(scalex);
                var abs_scaley = Math.abs(scaley);

                var op_scalex = scalex > 0 ? 1 : -1;
                var op_scaley = scaley > 0 ? 1 : -1;

                if (abs_scalex > abs_scaley) {
                    scaley = abs_scalex * op_scaley;
                }
                else {
                    scalex = abs_scaley * op_scalex;
                }
                mousePoint.x = ( (scalex - 1) / n ) * w;
                mousePoint.y = ( (scaley - 1) / n ) * h;

            }

            console.log('scalex:', scalex, 'scaley:', scaley, 'v.x:', mousePoint.x, 'v.y:', mousePoint.y);
        }

        switch (this.id) {
            case ControlPoint.ID_TOP_LEFT:
                matrix.scale(scalex, scaley);
                matrix.translate(mousePoint.x, mousePoint.y);
                break;

            case ControlPoint.ID_TOP_CENTER:
                matrix.scale(1, scaley);
                matrix.translate(0, mousePoint.y);
                break;

            case ControlPoint.ID_TOP_RIGHT:
                matrix.scale(scalex, scaley);
                if (isCtrlKey) {
                    matrix.translate(-mousePoint.x, mousePoint.y);
                }
                else {
                    matrix.translate(0, mousePoint.y);
                }
                break;

            case ControlPoint.ID_MIDDLE_LEFT:
                matrix.scale(scalex, 1);
                matrix.translate(mousePoint.x, 0);
                break;

            case ControlPoint.ID_MIDDLE_CENTER:
                matrix.translate(mousePoint.x, mousePoint.y);
                break;

            case ControlPoint.ID_MIDDLE_RIGHT:
                matrix.scale(scalex, 1);
                if (isCtrlKey) {
                    matrix.translate(-mousePoint.x, 0);
                }
                break;

            case ControlPoint.ID_BOTTOM_LEFT:
                matrix.scale(scalex, scaley);
                if (isCtrlKey) {
                    matrix.translate(mousePoint.x, -mousePoint.y);
                }
                else {
                    matrix.translate(mousePoint.x, 0);
                }
                break;

            case ControlPoint.ID_BOTTOM_CENTER:
                matrix.scale(1, scaley);
                if (isCtrlKey) {
                    matrix.translate(0, -mousePoint.y);
                }
                break;

            case ControlPoint.ID_BOTTOM_RIGHT:
                matrix.scale(scalex, scaley);
                if (isCtrlKey) {
                    matrix.translate(-mousePoint.x, -mousePoint.y);
                }
                break;

            case ControlPoint.ID_ROTATION:
                var vec = new Vector3D(mousePoint.x, mousePoint.y, 0);
                var xAxis = new Vector3D(this.matrix.a, this.matrix.b, 0);
                var yAxis = new Vector3D(this.matrix.c, this.matrix.d, 0);
                var zAxis = xAxis.crossProduct(yAxis);
                yAxis.scaleBy(-1);
                vec.normalize();
                xAxis.normalize();
                yAxis.normalize();

                var vecDotY = vec.dotProduct(yAxis);
                var vecDotX = vec.dotProduct(xAxis);

                if (vecDotY > 1) vecDotY = 1;
                else if (vecDotY < -1) vecDotY = -1;

                if (vecDotX > 1) vecDotX = 1;
                else if (vecDotX < -1) vecDotX = -1;

                var theta = Math.acos(vecDotY);

                if (vecDotX < 0) {
                    theta *= -1;
                }

                if (zAxis.z < 0) {
                    theta *= -1;
                }

                matrix.rotate(theta);
                break;

            case ControlPoint.ID_CLOSE:
                break;
        }

        return matrix;
    }


    set absPosition(value) {
        this._absPosition = value;
    }

    get absPosition() {
        return this._absPosition;
    }

    set absCenterPosition(value) {
        this._absCenterPosition = value;
    }

    get absCenterPosition() {
        return this._absCenterPosition;
    }

    get screenPosition() {
        return this._screenPosition;
    }

    set matrix(value) {
        this._matrix = value;
    }

    get matrix() {
        return this._matrix;
    }
}