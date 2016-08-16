(function () {
    'use strict';

    var utils = usenamespace('editor.es5.utils');
    var consts = usenamespace('editor.es5.consts');

    var Calc = {};
    Calc.LIMIT_LEFT = -100000;
    Calc.LIMIT_TOP = -100000;
    Calc.LIMIT_RIGHT = 100000;
    Calc.LIMIT_BOTTOM = 100000;
    Calc._DEG_TO_RAD = Math.PI / 180;
    Calc._RAD_TO_DEG = 180 / Math.PI;
    Calc._RADIAN_1 = 1 * Calc._DEG_TO_RAD;
    Calc._RADIAN_45 = 45 * Calc._DEG_TO_RAD;
    Calc._RADIAN_90 = 90 * Calc._DEG_TO_RAD;
    Calc._RADIAN_180 = 180 * Calc._DEG_TO_RAD;
    Calc._RADIAN_360 = 360 * Calc._DEG_TO_RAD;
    Calc.EPSILON = 2.2204460492503130808472633361816E-16;

    Object.defineProperty(Calc, 'DEG_TO_RAD', {get: function () {return Calc._DEG_TO_RAD;}});
    Object.defineProperty(Calc, 'RAD_TO_DEG', {get: function () {return Calc._RAD_TO_DEG;}});
    Object.defineProperty(Calc, 'RADIAN_1', {get: function () {return Calc._RADIAN_1;}});
    Object.defineProperty(Calc, 'RADIAN_45', {get: function () {return Calc._RADIAN_45;}});
    Object.defineProperty(Calc, 'RADIAN_90', {get: function () {return Calc._RADIAN_90;}});
    Object.defineProperty(Calc, 'RADIAN_180', {get: function () {return Calc._RADIAN_180;}});
    Object.defineProperty(Calc, 'RADIAN_360', {get: function () {return Calc._RADIAN_360;}});


    /**
     * 대각선 길이를 구합니다.
     * @param width 사각형의 넓이
     * @param height 사각형의 높이
     * @returns {number} 대각선 길이
     */
    Calc.getDiagonal = function (width, height) {
        return Math.sqrt(width * width + height * height);
    };

    /**
     * 종횡비 유지한 높이 구하기
     * @param originalWidth
     * @param originalHeight
     * @param newWidth
     * @returns {number}
     */
    Calc.getHeightMaintainAspectRatio = function (originalWidth, originalHeight, newWidth) {
        return newWidth * originalHeight / originalWidth;
    };

    // 종횡비 유지 높이 구하기 약식 버전
    Calc.getY2 = function (x1, y1, x2) {
        return x2 / (x1 / y1);
    };

    /**
     * 종횡비 유지한 넓이 구하기
     * @param originalWidth
     * @param originalHeight
     * @param newHeight
     * @returns {number}
     */
    Calc.getWidthMaintainAspectRatio = function (originalWidth, originalHeight, newHeight) {
        return newHeight * originalWidth / originalHeight;
    };

    // 종횡비 유지 넓이 구하기 약식 버전
    Calc.getX2 = function (x1, y1, y2) {
        return (x1 / y1) * y2;
    };

    // 종횡비로 넓이 구하기
    Calc.getWidthByAspectRatio = function (aspectRatio, newHeight) {
        return newHeight * aspectRatio;
    };

    // 종횡비로 높이 구하기
    Calc.getHeightByAspectRatio = function (aspectRatio, newWidth) {
        return newWidth / aspectRatio;
    };

    /**
     * 종횡비 구하기 (소숫점 2자리로 변경)
     * @param width 16
     * @param height 9
     * @returns {number}
     */
    Calc.getAspectRatio = function (width, height) {
        var result = width / height || 0;
        return Calc.digit(result, 2);
    };

    Calc.getAspectRatioBackup = function (originalWidth, originalHeight, isHorizotal) {
        var result;

        if(isHorizotal)
            result = Math.max(originalWidth, originalHeight) / Math.min(originalWidth, originalHeight) || 0;
        else
            result = Math.min(originalWidth, originalHeight) / Math.max(originalWidth, originalHeight) || 0;

        return Calc.digit(result, 2);
    };

    Calc.toRadians = function (degree) {
        return degree * Calc.DEG_TO_RAD;
    };

    Calc.toDegrees = function (radians) {
        return radians * Calc.RAD_TO_DEG;
    };


    /**
     * Degrees 로 바꾸고 round 처리 하는 이유는
     * 각도가 90, 180, 270로 딱 안떨어지고 +, - 오차가 나는 경우가 있어 round 처리하면 딱 떨어집니다.
     * @param radians
     * @returns {number}
     */
    Calc.toRoundDegreesByRadians = function (radians) {
        return Math.round(Calc.toDegrees(radians));
    };

    Calc.toRoundRadiansByRadians = function (radians) {
        return Calc.toRadians(Calc.toRoundDegreesByRadians(radians));
    };

    Calc.getMinimunDegress = function (radians) {
        return Calc.toRoundDegreesByRadians(radians) % 360;
    };


    /**
     * 제곱근
     * @param x
     * @returns {number}
     */
    Calc.sqr = function (x) {
        return x * x;
    };

    /**
     * 거리 구하기
     * @param a
     * @param b
     * @returns {number}
     */
    Calc.dist2 = function (a, b) {
        return Calc.sqr(a.x - b.x) + Calc.sqr(a.y - b.y);
    };

    /**
     * 바운드와 사이즈의 최소, 최대 비율을 구합니다.
     * @param denominator 분모로 사용할 사이즈
     * @param numerator 분자로 사용할 사이즈
     * @returns {*} 최대, 최소 비율
     */
    Calc.getScale = function (numerator, denominator) {
        var scaleX = denominator.width / numerator.width;
        var scaleY = denominator.height / numerator.height;
        if (scaleX < scaleY)
            return {min: scaleX, max: scaleY};
        else
            return {min: scaleY, max: scaleX};
    };


    /**
     * outBounds  안에 inBounds 를 비율에 맞춰 넣을 수 있도록 사이즈를 반환합니다
     * @param inBounds 바운즈안에 넣을 화면(이미지) 사이즈
     * @param outBounds 바운드 넓이와 높이
     * @returns {{width: number, height: number}}
     */
    Calc.getSizeFitInBounds = function (inBounds, outBounds) {
        var scale = Calc.getScale(inBounds, outBounds);
        var min = scale.min;
        var resizeWidth = min * inBounds.width;
        var resizeHeight = min * inBounds.height;
        return {x: 0, y: 0, width: resizeWidth, height: resizeHeight};
    };


    Calc.getRotation = function (centerPoint, mousePoint) {
        var dx = mousePoint.x - centerPoint.x;
        var dy = mousePoint.y - centerPoint.y;
        var radians = Math.atan2(dy, dx);
        var rotation = Calc.toDegrees(radians);
        //var rotation = Calculator.getDegrees(radians) + Calculator.getDegrees(Math.PI);
        //rotation = (rotation <= 0) ? 180 : -180;
        return rotation;
    };


    /**
     * 삼각형 면적 구하기
     * 삼각형면적공식이 정말 면적을 구하는 경우가 아니라면,
     * 2로 나누는 연산(실수 연산이므로 부하가 있다)은 대체로 필요없는 경우가 대부분이다.
     * 따라서, 2로 나누지 않고 사용하는 경우가 많다.
     * 사실 최적화라고 할 것도 없다.
     * Area(A, B, C) = ((Bx - Ax) * (Cy - Ay) - (By - Ay) * (Cx - Ax)) / 2
     * 위 공식을 아래와 같이 바꾸면 된다.
     * Area2(A, B, C) = ((Bx - Ax) * (Cy - Ay) - (By - Ay) * (Cx - Ax))
     *
     * @param p0 삼각형 좌표(Point)
     * @param p1 삼각형 좌표(Point)
     * @param p2 삼각형 좌표(Point)
     * @returns {number} 삼각형의 면적
     */
    Calc.triangleArea = function (p0, p1, p2) {
        return (p2.x * p1.y - p1.x * p2.y) - (p2.x * p0.y - p0.x * p2.y) + (p1.x * p0.y - p0.x * p1.y);
    };

    /**
     * 점 C가 직선 AB 위에 존재하는지 검사
     * 세 점이 한 직선상에 있거나 어느 두 점이 동일한 위치의 점이면,
     * 세 점이 이루는 삼각형의 면적은 0이므로 한 직선상에 있다고 볼 수 있다.
     *
     * OnLineAB(A,B,rb) = (Area2(A,B,rb) = 0)
     *
     * 점 C가 직선 AB로 나뉘는 두 평면 중 어느 쪽 평면에 속하는가?
     * 세 점의 두르기 방향에 따라 면적이 양수 또는 음수가 산출되는 사실을 이용한 것이다.
     * 2차 공간에서 직선 AB는 직선의 진행방향을 기준으로 평면을 왼쪽 평면과 우측 평면으로 분활한다.
     * 이 때 점 C가 왼쪽평면에 속하는지 우측평면에 속하는지 알려면
     * 삼각 ABC의 면적이 양수인지 음수인지 검사하면 된다.
     *
     * isLeftOfAB(A,B,rb) = (Area2(A,B,rb) > 0)
     * isRightOfAB(A,B,rb) = (Area2(A,B,rb) < 0)
     *
     * 삼각형의 면적이 양수이면 점 C는 왼쪽에
     * 삼각형의 면적이 음수이면 점 C는 오른쪽에 있다.
     *
     * 사각형안에 점이 있는지 판단은
     * 사각형의 좌,우,상,하의 선분과 한 점의 이용해 삼각형의 면적을 구해서
     * 모두 0이거나 0보다 작으면 우측, 즉 사각형 안에 점이 있는 것이고
     * 하나라도 양수가 나오면 사각형 안에 점이 없는 것이 된다.
     *
     * @param point 체크하고 싶은 포인트
     * @param lt 사각형 좌상단 포인트
     * @param rt 사각형 우상단 포인트
     * @param rb 사각형 우한단 포인트
     * @param lb 사각형 좌하단 포인트
     * @returns {boolean} 사각형안에 포인트가 있는지 여부
     */
    Calc.isInsideSquare = function (point, lt, rt, rb, lb) {
        if (Calc.triangleArea(point, lt, rt) > 0 || Calc.triangleArea(point, rt, rb) > 0 || Calc.triangleArea(point, rb, lb) > 0 || Calc.triangleArea(point, lb, lt) > 0)
            return false;
        return true;
    };

    Calc.isHit = function (uiCorner, imageLine) {
        if (Calc.triangleArea(uiCorner, imageLine.s, imageLine.e) > 0)
            return true;
        return false;
    };

    /**
     * 이미지 좌우상하 어디에 히트 되었는지 체크 하는 샘플 코드입니다.
     */
    Calc.sampleCodeHitTest = function (point, lt, rt, rb, lb) {
        var result = {isHitLeft: false, isHitRight: false, isHitTop: false, isHitBottom: false};
        if (Calc.triangleArea(point, lt, rt) > 0)
            result.isHitTop = true;
        if (Calc.triangleArea(point, rt, rb) > 0)
            result.isHitRight = true;
        if (Calc.triangleArea(point, rb, lb) > 0)
            result.isHitBottom = true;
        if (Calc.triangleArea(point, lb, lt) > 0)
            result.isHitLeft = true;
        return result;
    };


    Calc.getPointsByBounds = function (bounds) {
        return {
            tl: {x: bounds.x, y: bounds.y},
            tr: {x: bounds.x + bounds.width, y: bounds.y},
            bl: {x: bounds.x + bounds.width, y: bounds.y + bounds.height},
            br: {x: bounds.x, y: bounds.y + bounds.height}
        }
    };


    Calc.getOneToOne = function (x, a, b, c, d) {
        return (d - c) / (b - a) * (x - a) + c;
    };

    Calc.getTweenValue = function (from, to, easeDecimal) {
        return from + (to - from) * easeDecimal;
    };

    Calc.getTweenValueByObject = function (prop, from, to, easeDecimal) {
        return from[prop] + (to[prop] - from[prop]) * easeDecimal;
    };


    /**
     * 회전하는 좌표 구하기
     * @param pivot 사각형의 중심점
     * @param point 계산하고 싶은 포인트
     * @param degrees 회전각 degrees
     * @returns {{x: (number|*), y: (number|*)}}
     */
    Calc.getRotationPoint = function (pivot, point, degrees) {
        var diffX = point.x - pivot.x;
        var diffY = point.y - pivot.y;
        var dist = Math.sqrt(diffX * diffX + diffY * diffY);
        var ca = Math.atan2(diffY, diffX) * Calc._RAD_TO_DEG;
        var na = ((ca + degrees) % 360) * Calc._DEG_TO_RAD;
        var x = (pivot.x + dist * Math.cos(na) + 0.5) | 0;
        var y = (pivot.y + dist * Math.sin(na) + 0.5) | 0;
        return {x: x, y: y};
    };


    /**
     * 회전각과 사각형의 포인트를 넘겨주면 회전된 사각형의 포인트를 전달합니다.
     * @param pivot 사각형의 pivot(anchor) 포인트
     * @param rectanglePoints 사각형 좌표 (leftTop, rightTop, rightBottom, leftBottom)
     * @param degrees 각도 degress
     * @returns {{lt: ({x, y}|{x: (number|*), y: (number|*)}), rt: ({x, y}|{x: (number|*), y: (number|*)}), rb: ({x, y}|{x: (number|*), y: (number|*)}), lb: ({x, y}|{x: (number|*), y: (number|*)})}}
     */
    Calc.getRotationPoints = function (pivot, rectanglePoints, degrees) {
        var lt = Calc.getRotationPoint(pivot, rectanglePoints.tl, degrees);
        var rt = Calc.getRotationPoint(pivot, rectanglePoints.tr, degrees);
        var rb = Calc.getRotationPoint(pivot, rectanglePoints.bl, degrees);
        var lb = Calc.getRotationPoint(pivot, rectanglePoints.br, degrees);
        return {tl: lt, tr: rt, bl: rb, br: lb};
    };


    /**
     * 사각형의 좌표를 가지고 바운드를 계산합니다.
     * @param rotationPoints 사각형 좌표 (leftTop, rightTop, rightBottom, leftBottom)
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    Calc.getBoundsByRotationPoints = function (rotationPoints) {
        var x1 = Math.min(rotationPoints.tl.x, rotationPoints.tr.x, rotationPoints.bl.x, rotationPoints.br.x);
        var y1 = Math.min(rotationPoints.tl.y, rotationPoints.tr.y, rotationPoints.bl.y, rotationPoints.br.y);
        var x2 = Math.max(rotationPoints.tl.x, rotationPoints.tr.x, rotationPoints.bl.x, rotationPoints.br.x);
        var y2 = Math.max(rotationPoints.tl.y, rotationPoints.tr.y, rotationPoints.bl.y, rotationPoints.br.y);
        return {x: x1, y: y1, width: x2 - x1, height: y2 - y1};
    };

    Calc.getBoundsByPoints = function (points) {
        return {x: points.tl.x, y: points.tl.y, width: points.bl.x - points.tl.x, height: points.bl.y - points.tl.y};
    };

    /**
     * 점과 선에서 가장 가까운 거리가 되는 점을 반환합니다.
     * @param point 점 좌표
     * @param lineStartPoint 라인 좌표
     * @param lineEndPoint 라인 좌표
     * @returns {*} 점과 선에서 가장 가까운 거리가 되는 점의 좌표
     */
    Calc.getShortestDistancePoint = function (point, lineStartPoint, lineEndPoint) {
        var l2 = Calc.dist2(lineStartPoint, lineEndPoint);
        if (l2 == 0) return lineStartPoint;
        var t = ((point.x - lineStartPoint.x) * (lineEndPoint.x - lineStartPoint.x) + (point.y - lineStartPoint.y) * (lineEndPoint.y - lineStartPoint.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return {
            x: lineStartPoint.x + t * (lineEndPoint.x - lineStartPoint.x),
            y: lineStartPoint.y + t * (lineEndPoint.y - lineStartPoint.y)
        };
    };

    /**
     * 점과 선에서 가장 가까운 점을 반환 받아 거리를 계산해서 반환합니다.
     * @param point
     * @param lineStartPoint
     * @param lineEndPoint
     * @returns {*}
     */
    Calc.distToSegmentSquared = function (point, lineStartPoint, lineEndPoint) {
        var distPoint = Calc.getShortestDistancePoint(point, lineStartPoint, lineEndPoint);
        return Calc.dist2(point, distPoint);
    };

    /**
     * 한 점과 한 라인 사이에 가장 가까운 거리를 구합니다.
     * @param point 점 좌표
     * @param lineStartPoint 라인 좌표
     * @param lineEndPoint 라인 좌표
     * @returns {number} 점과 선의 가장 가까운 거리값
     */
    Calc.distToSegment = function (point, lineStartPoint, lineEndPoint) {
        return Math.sqrt(Calc.distToSegmentSquared(point, lineStartPoint, lineEndPoint));
    };

    /**
     * 두 점 사이의 차를 반환합니다.
     * @param point
     * @param distancePoint
     * @returns {{x: number, y: number}}
     */
    Calc.getReturnPoint = function (point, distancePoint) {
        return {x: point.x - distancePoint.x, y: point.y - distancePoint.y};
    };


    /**
     * 이미지 회전 충돌 시 총돌한 점과 선의 거리를 구하고 거리만큼 이미지를 이동 시킵니다.
     * @param image 회전 이미지
     * @param uiPoints 충돌 체크할 점
     * @param imageSideLine 충돌 체크할 선
     */
    Calc.goByCollision = function (image, uiPoints, imageSideLine, spaceX, spaceY) {
        spaceX = utils.Func.getDefaultParameters(spaceX, 0);
        spaceY = utils.Func.getDefaultParameters(spaceY, 0);
        var distancePoint = Calc.getShortestDistancePoint(uiPoints, imageSideLine.s, imageSideLine.e);
        var returnPoint = Calc.getReturnPoint(uiPoints, distancePoint);
        image.x = image.x + returnPoint.x + spaceX;
        image.y = image.y + returnPoint.y + spaceY;
    };


    Calc.goByCollisionNoSpace = function (image, uiPoints, imageSideLine) {
        var distancePoint = Calc.getShortestDistancePoint(uiPoints, imageSideLine.s, imageSideLine.e);
        var returnPoint = Calc.getReturnPoint(uiPoints, distancePoint);
        image.x = image.x + returnPoint.x;
        image.y = image.y + returnPoint.y;
    };


    Calc.pointsUpdateByCollision = function (imagePoints, uiPoints, imageSideLine, spaceX, spaceY) {
        spaceX = utils.Func.getDefaultParameters(spaceX, 0);
        spaceY = utils.Func.getDefaultParameters(spaceY, 0);
        var distancePoint = Calc.getShortestDistancePoint(uiPoints, imageSideLine.s, imageSideLine.e);
        var returnPoint = Calc.getReturnPoint(uiPoints, distancePoint);

        var dx = returnPoint.x + spaceX;
        var dy = returnPoint.y + spaceY;

        return Calc.translate(imagePoints, dx, dy);
    };


    /**
     * 객체 회전 각도에 따라 다음 이동할 좌표를 구합니다.
     * @param centerX
     * @param centerY
     * @param radius
     * @param rotation
     * @returns {{x: *, y: *}}
     */
    Calc.getNextMovePosition = function (centerX, centerY, radius, rotation) {
        //distance *= 0.4;
        var x = centerX + radius * Math.cos(rotation);
        var y = centerY + radius * Math.sin(rotation);
        return {x: x, y: y};
    };


    /**
     * 리사이즈 UI 선택 영역의 실제 픽셀 사이즈 구하기
     * @param originalImageWidth 이미지 원래 넓이
     * @param originalImageHeight 이미지 원래 높이
     * @param image 이미지 인스턴스
     * @param ui ResizeUI 인스턴스
     * @returns {{width: number, height: number}}
     */
    Calc.getActualPixelSize = function (originalImageWidth, originalImageHeight, image, ui) {
        var uiBounds = ui.bounds;
        var imageScaleX = image.width / originalImageWidth;
        var imageScaleY = image.height / originalImageHeight;
        var actualPixelWidth = uiBounds.width / imageScaleX;
        var acturalPixelHeight = uiBounds.height / imageScaleY;
        return {width:actualPixelWidth, height:acturalPixelHeight};
    };

    /**
     * 사용하지 않는 함수
     * intersection 과 비슷하나 intersection 은 충돌점이 없으면 null 을 반환하고
     * getLineIntersection 은 언젠가 만나는 점을 계산해서 반환합니다.
     * @param line1StartPoint
     * @param line1EndPoint
     * @param line2StartPoint
     * @param line2EndPoint
     * @returns {{x: null, y: null, onLine1: boolean, onLine2: boolean}}
     */
    Calc.getLineIntersection = function (line1StartPoint, line1EndPoint, line2StartPoint, line2EndPoint) {
        var line1StartX = line1StartPoint.x;
        var line1StartY = line1StartPoint.y;
        var line1EndX = line1EndPoint.x;
        var line1EndY = line1EndPoint.y;
        var line2StartX = line2StartPoint.x;
        var line2StartY = line2StartPoint.y;
        var line2EndX = line2EndPoint.x;
        var line2EndY = line2EndPoint.y;

        var a, b, numerator1, numerator2;

        var result = {
            x: null,
            y: null,
            onLine1: false,
            onLine2: false
        };

        var denominator = ((line2EndY - line2StartY) * (line1EndX - line1StartX)) - ((line2EndX - line2StartX) * (line1EndY - line1StartY));

        if (denominator == 0) {
            return result;
        }

        a = line1StartY - line2StartY;
        b = line1StartX - line2StartX;
        numerator1 = ((line2EndX - line2StartX) * a) - ((line2EndY - line2StartY) * b);
        numerator2 = ((line1EndX - line1StartX) * a) - ((line1EndY - line1StartY) * b);
        a = numerator1 / denominator;
        b = numerator2 / denominator;

        result.x = line1StartX + (a * (line1EndX - line1StartX));
        result.y = line1StartY + (a * (line1EndY - line1StartY));

        if (a > 0 && a < 1) {
            result.onLine1 = true;
        }

        if (b > 0 && b < 1) {
            result.onLine2 = true;
        }

        return result;
    };

    Calc.intersection = function (line1StartPoint, line1EndPoint, line2StartPoint, line2EndPoint) {
        var line1StartX = line1StartPoint.x,
            line1StartY = line1StartPoint.y,
            line1EndX = line1EndPoint.x,
            line1EndY = line1EndPoint.y,
            line2StartX = line2StartPoint.x,
            line2StartY = line2StartPoint.y,
            line2EndX = line2EndPoint.x,
            line2EndY = line2EndPoint.y,
            d1x = line1EndX - line1StartX,
            d1y = line1EndY - line1StartY,
            d2x = line2EndX - line2StartX,
            d2y = line2EndY - line2StartY,
            d = d1x * d2y - d2x * d1y,
            px, py,
            s, t;

        if (d == 0.0)
            return null;

        px = line1StartX - line2StartX;
        py = line1StartY - line2StartY;
        s = (d1x * py - d1y * px) / d;

        if (s >= 0 && s <= 1) {
            t = (d2x * py - d2y * px) / d;
            if (t >= 0 && t <= 1) {
                return {
                    x: line1StartX + (t * d1x),
                    y: line1StartY + (t * d1y)
                }
            }
        }
        return null;
    };

    Calc.translate = function (points, dx, dy) {
        points.tl.x += dx;
        points.tl.y += dy;
        points.tr.x += dx;
        points.tr.y += dy;
        points.bl.x += dx;
        points.bl.y += dy;
        points.br.x += dx;
        points.br.y += dy;
        points.leftLine = {s: points.br, e: points.tl};
        points.topLine = {s: points.tl, e: points.tr};
        points.rightLine = {s: points.tr, e: points.bl};
        points.bottomLine = {s: points.br, e: points.bl};
        return points;
    };

    Calc.rotate = function (rotation, points) {
        var cos = Math.cos(rotation);
        var sin = Math.sin(rotation);

        for(var i = 0; i < points.length; i++) {
            var pt = points[i];
            var x = pt.x;
            var y = pt.y;
            pt.x = cos * x - sin * y;
            pt.y = sin * x + cos * y;
        }
    };

    Calc.getRotationPionts = function(pivot, points, degrees) {
        return {
            tl: Calc.getRotationPoint(pivot, points.tl, degrees),
            tr: Calc.getRotationPoint(pivot, points.tr, degrees),
            bl: Calc.getRotationPoint(pivot, points.bl, degrees),
            br: Calc.getRotationPoint(pivot, points.br, degrees)
        };
    };

    Calc.getRotationBox = function(pivot, points, degrees) {
        var rotatePoints = Calc.getRotationPionts(pivot, points, degrees);

        return {
            left: Calc.getLeftPoint(rotatePoints).x,
            right: Calc.getRightPoint(rotatePoints).x,
            top: Calc.getTopPoint(rotatePoints).y,
            bottom: Calc.getBottomPoint(rotatePoints).y
        }
    };


    Calc.getLeftPoint = function (points) {
        var pt = points.tl;
        for(var prop in points)
            if(pt.x > points[prop].x) pt = points[prop];
        return pt;
    };


    Calc.getTopPoint = function (points) {
        var pt = points.tl;
        for(var prop in points)
            if(pt.y > points[prop].y) pt = points[prop];
        return pt
    };


    Calc.getRightPoint = function (points) {
        var pt = points.tl;
        for(var prop in points)
            if(pt.x > points[prop].x) pt = points[prop];
        return pt;
    };


    Calc.getBottomPoint = function (points) {
        var pt = points.tl;
        for(var prop in points)
            if(pt.y < points[prop].y) pt = points[prop];
        return pt;
    };


    Calc.getNearPoint = function (target, property, data) {
        if(!data || data.length === 0) return null;
        var value, result, abs = 0, near = null, min = 9007199254740991;
        for(var i=0; i < data.length; i++){
            value = data[i][property];
            result = value - target[property];
            abs = (result < 0) ? -result : result;
            if(abs < min){
                min = abs;
                near = data[i];
            }
        }
        return near;
    };

    Calc.getNear = function (target, data) {
        var value, result, abs = 0, near = 0, min = 9007199254740991;
        for(var i=0; i < data.length; i++){
            value = data[i];
            result = value - target;
            abs = (result < 0) ? -result : result;
            if(abs < min){
                min = abs;
                near = value;
            }
        }
        return near;
    };

    Calc.fixLimit = function (x, y, limit) {
        var left, right, top, bottom,
            lt = limit.tl,
            rt = limit.tr,
            rb = limit.bl,
            lb = limit.br,
            x1, x2, y1, y2,
            limitLeft, limitTop, limitRight, limitBottom;

        // limitLeft 설정
        x1 = (lt !== null && lt.x !== null) ? lt.x.x : Calc.LIMIT_LEFT;
        x2 = (lb !== null && lb.x !== null) ? lb.x.x : Calc.LIMIT_LEFT;
        limitLeft = Math.max(x1, x2);

        // limitTop 설정
        y1 = (lt !== null && lt.y !== null) ? lt.y.y : Calc.LIMIT_TOP;
        y2 = (rt !== null && rt.y !== null) ? rt.y.y : Calc.LIMIT_TOP;
        limitTop = Math.max(y1, y2);

        // limitRight 설정
        x1 = (rt !== null && rt.x !== null) ? rt.x.x : Calc.LIMIT_RIGHT;
        x2 = (rb !== null && rb.x !== null) ? rb.x.x : Calc.LIMIT_RIGHT;
        limitRight = Math.min(x1, x2);

        // limitBottom 설정
        y1 = (lb !== null && lb.y !== null) ? lb.y.y : Calc.LIMIT_BOTTOM;
        y2 = (rb !== null && rb.y !== null) ? rb.y.y : Calc.LIMIT_BOTTOM;
        limitBottom = Math.min(y1, y2);

        x = (x < limitLeft) ? limitLeft : x;
        x = (x > limitRight) ? limitRight : x;
        y = (y < limitTop) ? limitTop : y;
        y = (y > limitBottom) ? limitBottom : y;

        return {x:x, y:y};
    };


    //////////////////////////////////////////////////////////////////////////
    // Utils
    //////////////////////////////////////////////////////////////////////////


    Calc.digit = function (convertNumber, digitNumber) {
        digitNumber = utils.Func.getDefaultParameters(digitNumber, 1);

        if (digitNumber === 0)
            digitNumber = 1;

        var pow = Math.pow(10, digitNumber);
        return parseInt(convertNumber * pow) / pow;
    };


    Calc.leadingZero = function (number, digits) {
        digits = utils.Func.getDefaultParameters(digits, 4);

        var zero = '';
        number = number.toString();

        if (number.length < digits) {
            for (var i = 0; i < digits - number.length; i++)
                zero += '0';
        }
        return zero + number;
    };


    Calc.trace = function (number) {
        return Calc.leadingZero(parseInt(number))
    };


    Calc.copyObject = function (obj) {
        var copy = {};
        for (var prop in obj)
            copy[prop] = obj[prop];
        return copy;
    };


    Calc.getLeftHeight = function(points) {
        return points.br.y - points.tl.y || 0;
    };


    Calc.getRightHeight = function(points) {
        return points.bl.y - points.tr.y || 0;
    };


    Calc.round = function(objects) {
        for(var prop in objects) {
            objects[prop] = Math.round(objects[prop]);
        }
        return objects;
    };


    //////////////////////////////////////////////////////////////////////////
    // Test
    //////////////////////////////////////////////////////////////////////////


    // TODO Image 에 isFitBounds 와 동일 (리펙토링 필요)
    Calc.getIsFitImageToBounds = function (imagePoints, uiPoints) {
        var points = [uiPoints.tl, uiPoints.tr, uiPoints.bl, uiPoints.br];
        for (var i = 0; i < points.length; i++) {
            if (Calc.isInsideSquare(points[i], imagePoints.tl, imagePoints.tr, imagePoints.bl, imagePoints.br) === false)
                return false;
        }
        return true;
    };


    // TODO Image 에 getHitSide 와 동일 (리펙토링 필요)
    Calc.getHitSide = function (imagePoints, uiPoints) {
        var lt = imagePoints.tl;
        var rt = imagePoints.tr;
        var rb = imagePoints.bl;
        var lb = imagePoints.br;

        var hitSide = consts.HitSide.NONE;

        // 왼쪽 도달
        if (Calc.triangleArea(uiPoints.tl, lb, lt) > 0 || Calc.triangleArea(uiPoints.br, lb, lt) > 0)
            hitSide = consts.HitSide.LEFT;

        // 오른쪽 도달
        if (Calc.triangleArea(uiPoints.tr, rt, rb) > 0 || Calc.triangleArea(uiPoints.bl, rt, rb) > 0)
            hitSide = consts.HitSide.RIGHT;

        // 상단
        if (Calc.triangleArea(uiPoints.tl, lt, rt) > 0 || Calc.triangleArea(uiPoints.tr, lt, rt) > 0)
            hitSide = (hitSide === consts.HitSide.NONE) ? consts.HitSide.TOP : hitSide += '-' + consts.HitSide.TOP;

        // 하단
        if (Calc.triangleArea(uiPoints.bl, rb, lb) > 0 || Calc.triangleArea(uiPoints.br, rb, lb) > 0)
            hitSide = (hitSide === consts.HitSide.NONE) ? consts.HitSide.BOTTOM : hitSide += '-' + consts.HitSide.BOTTOM;

        return hitSide;
    };


    // TODO Image 에 있는 isPassedLeftLine 와 동일 (리펙토링 필요)
    Calc.isPassedLeftLine = function (imagePoints, uiPoint) {
        if (Calc.triangleArea(uiPoint, imagePoints.br, imagePoints.tl) > 0)
            return true;
        return false;
    };

    // TODO Image 에 있는 isPassedTopLine 와 동일 (리펙토링 필요)
    Calc.isPassedTopLine = function (imagePoints, uiPoint) {
        if (Calc.triangleArea(uiPoint, imagePoints.tl, imagePoints.tr) > 0)
            return true;
        return false;
    };

    // TODO Image 에 있는 isPassedRightLine 와 동일 (리펙토링 필요)
    Calc.isPassedRightLine = function (imagePoints, uiPoint) {
        if (Calc.triangleArea(uiPoint, imagePoints.tr, imagePoints.bl) > 0)
            return true;
        return false;
    };

    // TODO Image 에 있는 isPassedBottomLine 와 동일 (리펙토링 필요)
    Calc.isPassedBottomLine = function (imagePoints, uiPoint) {
        if (Calc.triangleArea(uiPoint, imagePoints.bl, imagePoints.br) > 0)
            return true;
        return false;
    };

    usenamespace('editor.utils').Calc = Calc;
})();




