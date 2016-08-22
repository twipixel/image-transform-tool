export class Calc {

    static interpolate(point1, point2, f) {
        return new PIXI.Point(point2.x + f * (point1.x - point2.x), point2.y + f * (point1.y - point2.y));
    }

    static add(point1, point2) {
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

    static calcDistance(point1, point2) {
        return Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
    }

    static calcAngle(p1, p2, p3 = null) {
        if (p3 == null)
            return Math.atan2(p1.y - p2.y, p1.x - p2.x);

        var a1 = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        var a2 = Math.atan2(p2.y - p3.y, p2.x - p3.x);
        return a2 - a1;
    }


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
    };

    static toDegrees(radians) {
        return radians * Calc.RAD_TO_DEG;
    };

    static getRotation(centerPoint, mousePoint) {
        var dx = mousePoint.x - centerPoint.x;
        var dy = mousePoint.y - centerPoint.y;
        var radians = Math.atan2(dy, dx);
        return Calc.toDegrees(radians);
    };


    //////////////////////////////////////////////////////////////////////////
    // Utils
    //////////////////////////////////////////////////////////////////////////


    static digit(convertNumber, digitNumber = 1) {
        if (digitNumber === 0)
            digitNumber = 1;

        var pow = Math.pow(10, digitNumber);
        return parseInt(convertNumber * pow) / pow;
    };


    static leadingZero(number, digits = 4) {
        var zero = '';
        number = number.toString();

        if (number.length < digits) {
            for (var i = 0; i < digits - number.length; i++)
                zero += '0';
        }
        return zero + number;
    };


    static trace(number) {
        return Calc.leadingZero(parseInt(number))
    };


    static set refMatrix(value) {
        this._refMatrix = value;
    }

    static get refMatrix() {
        return this._refMatrix;
    }

    static setRefMatrix(m) {
        Calc.refMatrix = m;
    }


    static absScaleAroundPoint(point, xscale, yscale, uAngle = 0, vAngle = 0) {
        var skewAngle = uAngle - vAngle + Math.PI / 2;

        spriteMatrix = Calc.refMatrix.clone();
        spriteMatrix.translate(-point.x, -point.y);
        spriteMatrix.rotate(-uAngle);
        spriteMatrix.concat(new Matrix(1, 0, Math.tan(-skewAngle), 1));
        spriteMatrix.scale(xscale, yscale);
        spriteMatrix.concat(new Matrix(1, 0, Math.tan(skewAngle), 1));
        spriteMatrix.rotate(uAngle);
        spriteMatrix.translate(point.x, point.y);

        return spriteMatrix;
    }

    static absRotateAroundPoint(point, radianAngle) {
        spriteMatrix = Calc.refMatrix.clone();

        spriteMatrix.translate(-point.x, -point.y);
        spriteMatrix.rotate(radianAngle);
        spriteMatrix.translate(point.x, point.y);

        return spriteMatrix;
    }

    static move(dx, dy) {
        spriteMatrix = Calc.refMatrix.clone();

        spriteMatrix.translate(dx, dy);

        return spriteMatrix;
    }


    constructor() {

    }

}
