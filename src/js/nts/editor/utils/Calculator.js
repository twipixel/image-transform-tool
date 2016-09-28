export class Calc {

    static get DEG_TO_RAD() {
        if (!this._DEG_TO_RAD)
            this._DEG_TO_RAD = Math.PI / 180;
        return this._DEG_TO_RAD;
    }

    static get RAD_TO_DEG() {
        if (!this._RAD_TO_DEG)
            this._RAD_TO_DEG = 180 / Math.PI;
        return this._RAD_TO_DEG;
    }

    static toRadians(degree) {
        return degree * Calc.DEG_TO_RAD;
    }

    static toDegrees(radians) {
        return radians * Calc.RAD_TO_DEG;
    }

    static getRotation(centerPoint, mousePoint) {
        var dx = mousePoint.x - centerPoint.x;
        var dy = mousePoint.y - centerPoint.y;
        var radians = Math.atan2(dy, dx);
        return Calc.toDegrees(radians);
    }

    static deltaTransformPoint(matrix, point) {
        var dx = point.x * matrix.a + point.y * matrix.c + 0;
        var dy = point.x * matrix.b + point.y * matrix.d + 0;
        return {x: dx, y: dy};
    }

    static getSkewX(matrix) {
        var px = Calc.deltaTransformPoint(matrix, {x:0, y:1});
        return ((180 / Math.PI) * Math.atan2(px.y, px.x) - 90);
    }

    static getSkewY(matrix) {
        var py = Calc.deltaTransformPoint(matrix, {x:1, y:0});
        return ((180 / Math.PI) * Math.atan2(py.y, py.x));
    }

    static snapTo(num, snap) {
        return Math.round(num / snap) * snap;
    }

    //////////////////////////////////////////////////////////////////////////
    // Utils
    //////////////////////////////////////////////////////////////////////////


    static digit(convertNumber, digitNumber = 1) {
        if (digitNumber === 0)
            digitNumber = 1;

        var pow = Math.pow(10, digitNumber);
        return parseInt(convertNumber * pow) / pow;
    }


    static leadingZero(number, digits = 4) {
        var zero = '';
        number = number.toString();

        if (number.length < digits) {
            for (var i = 0; i < digits - number.length; i++)
                zero += '0';
        }
        return zero + number;
    }


    static trace(number) {
        return Calc.leadingZero(parseInt(number))
    }


    constructor() {

    }

}
