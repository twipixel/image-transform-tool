import Mouse from './../utils/Mouse';
import {Calc} from './../utils/Calculator';
import {PointUtil} from './../utils/PointUtil';
import {ToolControl} from './ToolControl';
import {ToolControlType} from './ToolControlType';
import {RotationControlType} from './RotationControlType';
import {VectorContainer} from './../view/VectorContainer';
import {map, each} from "../utils/lambda";


const _collection = {

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

const _dragRange = 10;


export class TransformTool extends PIXI.utils.EventEmitter {

    static get DELETE() {
        return 'delete';
    }

    static get SET_TARGET() { 
        return 'setTarget'; 
    }

    static get TRANSFORM_COMPLETE() {
        return 'transformComplete';
    }

    static get SELECT(){
        return 'select';
    }

    static get DESELECT(){
        return 'deselect';
    }

    static get REQ_INPUT(){
        return 'requestInput';
    }

    static get DBCLICK(){
        return 'dbClick';
    }


    constructor(stageLayer, targetLayer, options) {
        super();
        this.stageLayer = stageLayer;
        this.targetLayer = targetLayer;

        this.options = options || { deleteButtonOffsetY: 0, useSnap: true, snapAngle: 2 };
        this.deleteButtonSize = 28;
        this.deleteButtonOffsetY = options.deleteButtonOffsetY;
        this.useSnap = options.useSnap || true;
        this.snapAngle = options.snapAngle || 5;

        this.initialize();
        this.addEvent();

        this._px = 0;
        this._py = 0;
    };


    initialize() {
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
        this.rotationCursorList = [
            new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAyRJREFUOBGNVF1IU2EY9pz9z9YkRdaPIfhHiV4V3Sy80S4jijLqwvDGO/Uq6KLLqBtpN+G9SndJmSBZlDYbNjeGLWSW2CQxt0E65+bmfk7Pc/I7HRdELzx7v/d7f7/3fc+kiv8jSWemPyu6e/1Zd334qHemhrJwFDryctCWRNtyiHvyv0gflEohC0PKMmDQcZFcJCpBVwQEF/e40uLxjqQwmAggJ5PJ85AZnDACZsAK2IBKwK5DuWyBjvb0EzEY8xxkfR41IQ3MhULBt7y8fBHnI8BR4FhLS8uJ2dnZqxsbG4/hPJnNZkPAJ2BxZ2dnKhaLPfH7/bc7OztP0x5wACymErpr+Xz+Gc4mgDnUDjI7q7JDGUqn03PT09OXqqurTwaDwTu7u7tvw+Hw68HBwZnW1tavJpMpB1vFaDTmUcxqb2/vnM/newW/D5FIZKC9vf0U9LVLS0s39/b2/Llc7jlkdog5JDEjCpb9/X1vV1eXPDExkYbhWiKRqO3p6XEFAoEzkiQpCPYFSLhcrlw8HjejG1ULCwtni8Wiob6+/vvo6Gikra0tH41G39TV1V3v6+uTR0ZG4na7/Rbis9ACoPaXvXciySK40tHR8dnj8bwzGAwFh8ORHBoamkqlUu/R8nHYPALuAQ8hP81kMnNjY2OTNTU1Cfr29/d7Nzc3PzY1Na01NzdH0aFJ3LPNbKvWUias4mzAxZYpbrc7vLW15UWyBysrK43QcQ4cgQa85jiS3gW83d3d8/Q3m81q23UJuQ9qQjqSmKTEtqnSwY/NZitYLJYKVPyysbExSpsyKGhlDC3zYF7jw8PDRXQkhdHwASTlICb9tNh8prY0BwrtlZhpAAFmtre3ud5qS8D1JGNhrmBjZxoaGr5Bofnihavo2gvccWnULWUAgi81YPjzoVDoh6IoamBWhzmWEKgSlbPqAdwFwTWC7WUI97FEP9fX1/P0Ff7wkeCbxWbfgA3/HNTAomoZs3KjIhmJ1TskU6xWawmfAD8DIqNPiMCs+gKWxwBIhN4f4yjJspx2Op0sUn25SFbOoT9ENCYJ/lv68/svf72P8gunF5KUe/EFxQAAAABJRU5ErkJggg=='),
            new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1Rjc3NTE3RDZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1Rjc3NTE3RTZEQTcxMUU2OTkwNzk1ODBGOTZCN0JBOSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjVGNzc1MTdCNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjVGNzc1MTdDNkRBNzExRTY5OTA3OTU4MEY5NkI3QkE5Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+bXt2owAAA1tJREFUeNqsVt1LWmEY99XjR7ZNZ8yGC0YrG2ODddXNBjXGrlpjH25rhKj76Cbovqv9A4PddN9N7kLYYNiFoMyltmBusUqIIHJCzTJD0yzNr/1e9xrH0wfH2gsPnvfjPL/3eZ7f7zkSycFBJIePsuSEQ3oIAGHr0kKh8Ix3hkj+w6g652DKTCbzulQq+fEsh8lOAyIVRECdyTc2Nmy5XM5cLBbpvoKtS5mRegGlghTJV1dXX+bz+RddXV2XkS66pmJA1YhkvHdIvZHI1tfXLYSQp52dndfw3IR0Kbxe752RkRED9ht4gJwATFQtuGQyORiNRr16vT5GmaRQKHJjY2OeQCDgTqVS37HvmJ2d7W9vb7+A/XMMVM7LxvEgqMFV5P9nT0/PL0bVGuM4Lt/b2/tjfn6eAjodDsdtrJ+HNYoFqqQqHo8/3tra8uGmv6ljjUaTDIfDkx6Px2Wz2fxqtXqbrpvN5m+IanpmZsaMeZNYoP2iI12mRCLhp0BarTYBhk0vLS09B51H0+m0b3h4+AsFovubm5tTDEgHU7M6ETEaUaDgT2hEYFcILPOz3Csikcj1vb09u9vtnkC9shQI56bHx8dvYV9DtSVGT/sRIe8Pd3d3fWDXJLthRSNOp1MNoPcul2uCRmS1WgM4+7m1tbWZpY0TRQLmUJbNZh+Uy2WvQEuEAX0YGhqie+VQKOQJBoP9eNayaKRiKV0xgNwVaKFyibW1tRuIwKdSqTJ9fX1BSm9GgobTtqAaNiLSUYvF4qP0pjoCKYxYPyNgGpGIDe2QzwAB4yYHBgbSaD0c9JM0mUw3GQDH63WVs5xY70gdvaWJNk2wjsD5pY6ODtpiJKA5uYeB34vQUwFWVCqVJUjgE6SQFA2CnrYNoLhMJnuLQkfn5uY40L0Smd1u1+/s7EgxrhiNxkJ3d3cz2PkOAKnqDY81IRZlHYT5ta2tLSxsPy0tLX9isZh/ZWXFyprpPxLUC0JfRFd4RAULoEgVwGAwRMG6qcXFxTeYn2XdWnpSkIpgaWeotiAaAeaBhYWFQaYXVQ2V6wSpaUG019GI0MV9y8vLr1h7UfG6RAWEHOGIX/DjBEtTdx8+GnU63UfMi8z4tToxiETwCSZCx/y/UNwplF8+4v/YgVv/FWAAZA0E5twGSyUAAAAASUVORK5CYII='),
            new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAztJREFUOBF9VN9rUnEU915NS5BV2JRqa7CYkOAeEgqmSTF7jC2IPfU22Nvajzehl6CHHmR/xN6FbCP6icsZgYrDLXFzNFcgONlQNyf+urfP+d77vdwN6sC53+/3nPM53/PrewWDQoK60qLf01mmj0ra3gQBNxTVPZ25jOwlMAE4iK0EJCKQEUxnYjoT9VTuqisHMyPh+PjYZ7ValyRJEsCiLMsCiD6cm41GY76vry9J3kDMgVipVB6mUqlVVUBCxoFAIAvA+vb2th+yC2AeibLp9XoC3QKFRgD9jEajjUQi8crlcm1oCnXDczwvN0xOTlZarVZ5YmJiC0p9wWgvs6uNRiPLhdDBYHDD5/NtLS4u+pFCfzwefwwxXUDFOxOViOIEMpnMO4BSp6en8aOjo3WbzVbzer25k5OTLwj1OkA28Jk8hWaz+aBer39tt9uxQqFwH45eh8Ph9zCUNzc3P62trT3F/gr4Ili7Weh0On4UZ71arXqhMO3u7t4G+BvaIc3NzcVKpdIS5NfAVtKDlZABukusCkho7Ha7kdHR0bzb7S7UarUVyBxgHq7AigPPaWIotB6iRQWPx1PZ2dkZtFgsN6AjhxprDYXwPNWcTmcLaZih4HkpIULwP6Dt4ODAbDKZaE7ZiOlWBYj8yCMnFg56ewujdnl4ePgPql2CUv9KlAGA8B7AT7BSBEKxWOyH8WAymbwzNjZWQrt+qUAOVgxRQbrxJQaawCa73f48EolUUSDj9PR0Y39//zvk/InxsA1sAMrl8gcMQezw8HCepgfgytDQ0G84S4yPjw8CSK2gQml1YSOXTqdXkM8exi0xNTX1AwYyJuZjPp9/gf1V8CUwry628KB/j5jROmTy7OxsHJO0il7exFl/G2sJu1b/HjFqNjS8HQqFzCjS52w22waQisILw3LU4oVCI7xDMx6yY2Bg4Fkul3sEhVYQbsQeMm6QEKIwMjKyBwXrI9pjmJmZEZeXlxdQuI7D4Xir6pgTZoQh9uJnFULIIjFASh6iKGEQJFEUe6j0G/ysUurtzICBIaCK8ZdOKZBnYuofjZ0+T/Vd6aYeBtwRtoy4A/2qAcmChafY/vNLYEZ/ARukibLGcoOhAAAAAElFTkSuQmCC'),
            new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA71JREFUSA2lVUlPU1EYhU6UYi1qJIGwYlghsIGVkQ0JG8QRg4YgjVNMmhB/gQv+gAsXpCtcgFEjJgoaQouFUuwCIYHCCoSSME9lKnR+nvPoNWD7kMYvOX33ft+999xvuk1P+z9JV9guHderjk9SHJOAUK2vrxfjq+Y4rlMih/nsIh+O5dqNjY070Wh0dHt7+xnmGYAGEGQYHk3kQQo/wgPN8vLyTa1W+6K6ulp9eHj4YHV19RHO0QH0SqxL4eijpX88wIF3fT7fUFFRkRcmKScnZ21paWlwcXHRgnkmkOARdGcSkqh3d3dv7ezsOAUBdEy0IBpAjp5jztAJjzA8u6QHAoEbCI2zsrLSYzKZfMA2tks6nS5oNBr3SLy1tTXo9/ufQJ86iSRJ1YAjFosNhsPhoWAw6J6bmxskSXt7ux0Hj+ICbtiGscYViUQaYKP3KYnICeOdOTMz02C323sxllwul83hcNRjfAnIArSAXGX8SVUY/xgQzc3NvdbZ2Zml0WgiZWVlpr6+vgnog0A4vuZEU0KXXBCec39ZZG/m5+dL9vb2nAaDwV9bW/sTffIB6y4AekDkQjFUNMgAwXXAHJ/jc6Tv7u42hEKhzpaWlu/QSR6PxzY+Pn4fYyPAMCkeDptsZAjVrCIQjCB5bDBBrIoTvLLZbD3QS01NTT9Q0t2oqsuYGwDmS5GEBhJo0WS3EYoBt9v9BdXyOL5RvbKycgUevO3t7e1ByQZYrgiTu6ur6yrWnAfY7TwjKYkg0LGT2WiFhYVzVqv1G8hebm5u3sPhr3Fjp8ViceAQiQTQD4+NjTVhzlyILj+VQIu3qJ5PBQjmeVBra6vd6/XaUDVfm5ubnXq93k+92Wx24SLuOEFCyWJNgpBZzRDFnwqZADr5qRBflGm4rq5uZHJy0g6PPnd0dDBEF4ETPYF5gjBJlHQkOQshSUPCWR2y1NTUTDQ2Nq4hNFJpaWk2utg7PT39qby83IFOD2AR+4GIAuJSGCaK7AnUmbOzs4+RE1deXt4y5lJbW1s/Xlar0+msR7nyj4mhyQZ4+6T/HdAniPCEt4gWFBR8nJqa0iDWDysqKiSVShU7ODjwVFVV9cMubix3O+bcwzGFY0VhuQk36XKwpKTkPXLzBkS/iouLI+joCPQMDZ+LEHCcTOyF+t/CkJGQnvFZMC4sLJjxtzqGPniKOfOkWP+wnSrHw8WFdJ83jeXn57/b398PZWRksP6pT+nWWK8o9Eh4xUdODU/YaEKvuPE0Azcnk2T6U5Ob7BCh+w13D8jLwsORsAAAAABJRU5ErkJggg=='),
            new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAOCAYAAAA8E3wEAAAAAXNSR0IArs4c6QAAAy1JREFUOBF9VE1IG1EQdpNs/jQNiAlW0h8UYkEIWCN4EQ/V3irFXgoFLd682PRorz3YS6iXHjwK4qktLRWkhlKtqWColcSSotEmXiS2KElM1MRkt9+87ixbKX3wMfPmzcw3M5mNVPfnSJokYdTZrGoKS7az5BiWbGfJcSo7kJTy+XyXoij15XLZRJ5ms1m12+2KxWJRNdRgXpMkiaQ4qqp2VatVJyARzs7OTLVaTeTleJfLFYWzQgEWQJBBmp1O55Pd3V378fGxqAiJVYLP55O9Xm8jfJ4ayXAXB8VMnp6eVhBbApkJRQhCiu3s7LwMpx7NVZDSoxlwoLq3fr//B3QiFGhra0sXCoWlUql0FzbROaTxSLlcLlipVJYGBga+4EGPJf38/HwD0glwc6JDujQg6TsQpsmRgFEUjo6OPh8eHj7G3QoQoagekg/dLalUqufk5GQFpESgk+LnieN+CZABE1dMQTwKkdBqtVYwWtfY2JjZ4XAMFYvFUDqd9sJP+JI/Y2dn53pzc/MdJK/DaKl4/Wjj/atQSkDsLiSdR4eZ9vb2TDabXRsfH1+BXW1qavo1Ozs7jw6iWIw5JJ4EJoBnuL9GYZ/C4fACJpLHolSnpqY+9vX1faNY+FCHbkBMiMgIVJUNCeeGh4e909PTyt7e3svW1tZb8XhcHhkZuZHJZK4gWa27uzuJgnLoqLy/v29PJBIewE+dBIPB7zMzM1mPx/PTZrNdGxwcrI9EIgqm1Yv8ZaAK6IQOVPMGI4klk8n7sHsDgYBve3v7EX7bVZz3o6OjUVoq6gLvqizL5Y6OjlQoFFra3NyMYEIf1tfXH2LbWxYXF28jLnphacRPSB3Slsp4fHVwcHAPer0GF2Rjf3//1Vgs9gBvL7CxC9jmOJAANvDtzqPT58vLy0PovIX8AVqShq2trV6MfBU6jZM4JB6pkPThu93ur3jgQxWRI42cfmfSeVmg6ttI3xd1zaA/BtrUOuS8iZz650JEdC5K4azZ6Y2JWIoCYef1JwIiZcnxMInDd/2vjR8uSmMhTMKSfZnUKOmNScifdb0zDv6fZHLyMep6MtiN+j9z/Qasm4fFL/kTlgAAAABJRU5ErkJggg=='),
            new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA6lJREFUSA2lVUlLW1EUNiZGY4zGxhoiIggqQqtLEVqo0KVYOqTowqYKHRFcdeOy/oFuCl260S5EkFYLYtLGTKTUKg3RhSixLpI4GzXikOH1+0KuxDHRHji8e84993xnuvfJss4n2Tlq6RxdRirFKSvhnF/BdC4AxPfUscvF7JRt4ZQ6gis3Nzfbtra2HmAtB4t9LK9GIhPhQADk+nw+YywWe65UKrOCwaDcYDB8heto0v21MiIIo80Da2dnZ1+vrKw4y8vLA1VVVX+RjQPyE+zlgBkI7a9EPMCDSrBmbm7u5fLysqusrCwIOdEPAm1vb9sB9gg6UTosM6fjLPx+f+fq6qqDGeB4AkB8q6urfbu7uxMHBwfs0ZUyoXEik3A43KpSqd7ZbLaV+fl5RTwezx4eHi4ZHx+v7+3t/a7X64/q6+ujjY2NBpx5L5PJRvHNiBKND4VChXK5XIVIP9XW1sorKioU+fn5deA4QLJMJpOk0+l+KhQKP4ZBgm2JJEkFAApnhAIjkQ1rzcaqwMV2u93ocrnGsZYA9G1jY+Mp1gxK2GOZGbHhYhzjWMfAHNPI0NCQp66uTovoowMDAxq1Wn0vxVacgerqxCiZEbPRoYyDLS0tk3l5eXs7Ozt2TN1t6FNHOJEVSncfepEhv2mJTnLB2snJybaZmRkL1lJXV5f16Ojo88jISD7kVIfZALEmp44BpgYB8XyiA9ZeXVlZqUcGXzo6OpyQpbGxsVEAfUgC0RmZk2jb39+3w/Yh5IwuLEEYEbMp6u/vv4OL6OaFxBNzYDabCTSwtLR0C/u8wKpIJOJoaGjw8sImXwbq02YksmFpbkxPTz/DdLkIBFnq7u7+gXG37+3tfVxYWGg9PDx0a7XaLfEE4a0zwi5tRgRhJDRUg3UAMmEQ3O3t7W7IEu5QuLOz02GxWMYWFxdtRUVFIerFE7S+vv4YMitCXxfSaaDiwcHBu6j7iNfrNTc3N//GeEdw+sTzQ7mpqekPLu3U2tpaDeRLQYieCsSxLkSkNz0eTxvHGz345XQ6zX19fRb06xD7Umlp6SrKNYH9V5DF5cXychJAPMCGsk8acHFPT0+N1Wo1ojdTGo1mlwCBQGACzX+LfQ5O2nLB5pgIlArGXvHfUwDWYXwT0wcAG17yLugYCINKO2GwOUOpYIySmakxwi78qm3owRvILGvayYJNRkRAAuXgMjpRshdYs0TXzgBnz5DISh6NRluxS0DymRLR8H/oovMnXul/F7SWjoEFkdEAAAAASUVORK5CYII='),
            new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAcCAYAAABRVo5BAAAAAXNSR0IArs4c6QAAAz9JREFUOBFtVN9LU3EU997b7nJrG+hkYWKGOEFBIhdIWFHMFx+iN4NASv+A8EXfetxTkD304rNo0INgVhhkybURbmuwcDCnDRNxOtT9cIr7cW+f83Xf23XswNn5nvP9fs4538/33Al1F0W46Nb0NIpeMmwRqFr5Nh3mSjHNCKQAAUUoxaWKTzEVWoaWKlavyCplMplei8UyoaqqVC6XRVhKUicIgiZJkkp6cnLiczgcQV6R2hAQ+LW3tzdjt9snhoeH1UgkcpWAENbm/Px8zOVyWeFTIV3IoUSWaDT65ODgwN/R0bEFn99NCwQCn5LJ5EPERNYKFkYRurq6lra3t98ripKUZblg3ORrDmR3RJB8saenR25ra/P6fL4CRLbZbDkCVO5KHehCQGKxHtqwvr7+Ynl5+QvW2tDQ0M/Dw8Mf7e3tiVAotJDL5e4jzguyhYyAzev1tubzeT8q/nU6nSmwqOC+Y9ls9juIWzw9Pb2Hc1SI/VC1y9CG1dXVp36/fxFrbXp6euH4+HgcaxnJHmuaFigWi3fh60Bik2huQta3IyMjK3izEqqtJBIJehJ2dwAfQe/AZ0JoE9QGdaGlz263+09fX1+kVCrNIMYnCEu0oWnks0wE5CqC/ubNzc3Wzs7ONKZni85WFAYHBYFG7z87FKMARABAwoTQ+2VZpMaPTiv2eOayyWQq7O7umhFz1MCwEJHCAcyenZ3t4I5XMKdNIMiNfX4Nut8tQqHdEK9IIOpdBe3xgYGBHQDdeDPnxsbGDcSldDrdC/sGhFlgBSOQvrlSPB5XRkdHi8guTE1N5XHX54h58Lm9wtQUAORc4Pg5SexJwGYzHv2rx+OJYkYzR0dHCk0PJioUDoc/VI8cZdFnFTP5bG1tbYmGoL+//zdaD2NfCwaDH1Op1INKIZhzAqhtmld7Y2Pjtf39/XeTk5Pf4OvkGb/HC/8A/NDs7Gy32Wy+Pjc3R9NUUzhQ34zFYjdbWlpeDg4OWvFpdesbWBi/R84QWQF/VretVutrMFpPrHIlgCiKKlQDUWMgTeFASkxruieRRJ2QZQMNy54Klv89qtVAVhkHeBIsmegEwaMk+mCz3SrfmJT2CcxF+wduL3Nt3V5HIgAAAABJRU5ErkJggg=='),
            new PIXI.Sprite.fromImage('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAAXNSR0IArs4c6QAAA5hJREFUSA2lVklMU1EUtb/fTlIpihgIG2TYOCxYsGFDYsIGMYoTCVaKGKNpQly4YeOCuHehG5Yk6IKEhaKGUBT6EZtQJRJgQUgaSJgqQylQZvo9p/aZ30mmm9z8++5775x777vv5etOHE90Sbar8T4p3nGIcYRgeXnZhj3EodInFOZfOQ4JESSj0Vi1trZ2D/ZJqEwfNIboqCQCRNra2tKbzebnU1NT1QA3QkkWQ3QYkn/AURA9vvL6+rrkdrv9BoOhfmxsjEQm+qFcH5GDkGjBCcxIDVBGbQKJPD4+LhcXF+enp6c7RkdHWTrOcW1k734kgiASdXSzGV9LQ0NDtqIoVy0Wy+VwOCyhXNkgupCZmWn3+Xy3NSQwUwsJGAQjt0DT8/Lyznu93mp0VNvKyspAf39/V0tLi6u8vHwI82xdNTc3d2Z+fl5ZWlq6j3FM2TCOES3BKcycaW1tLQXw+5GRke7KykqvLMs78EeAtd+CgoKJYDCoBAKBm/CLksGMlXiCs4ODg3Zs9Dgcjm9YqppMplBtba3S1dX1aWJiwtXU1NRNPwkA3jc7O8tyabsslgEjkjBN1j4DBA8WFxf7CYCx6nQ6e5CRsr29/Rr+O6urqy+am5s/FxYW+piB3++/hXVsDJaaWAkisuCi0+3t7aWov4cEaNHNzs7OjwB/Nzc3dwnzkWbY2Nio93g8H0DWGy3RfzMgo8jCAuBziLjDbrd/h191uVwkeNXR0cEmEFHqdnd3H6qq6t3c3LwOP4nFHMzkQhJGYh0aGqoeHh52wVbRrl9B8DZKwDVUig4EDug12hrlXIKIBYyENzaDbVpRUfED92ANpVAmJycvwp8QJQjSEtCSOLQEPIu0xsbGIhziANu0rq6uLxQKvYFfe5gikyRwiS5GRuEm2iyVEZfrCkoVRL3lmpqaEFqyD/4D1RvrEoStegJgdyVJcu7t7UmwJTwThra2tgDn8vPzzTk5Oc92dnacer1e1el0Ybhf4vuF8wcVZqFHSR7hKXCzXa1W6ypadgt+FY/ess1mC5SUlAyjXZVoFx2qXAwkQoKvEW/Ok5mZGXdWVtZvEgglMS8aWvoGfCzbkUh4HpFbPj097QRRryAiAZ+K6E3e96IBJ6UwMnHwFgA+xWH3lJWV/WIGsPkWabsrJdB+E4KIGRlxTx6jEX4uLCxUYXysDOKJBRHrLuOMivA9cusKcILGSzIf1yT8T8VvTDX+A7nQiRk9jngZAAAAAElFTkSuQmCC'),
        ];

        for(var i=0; i<this.rotationCursorList.length; i++) {
            var cursor = this.rotationCursorList[i];
            cursor.visible = false;
            cursor.anchor = {x:0.5, y:0.5};
            this.stageLayer.addChild(cursor);
        }

        var controlOptions = {};
        var rotationOptions = {
            rotationCursorList: this.rotationCursorList
        };
        var deleteButtonOptions = {};

        this.c = this.controls = {
            de: new ToolControl(ToolControlType.DELETE, deleteButtonOptions),
            tl: new ToolControl(ToolControlType.TOP_LEFT, controlOptions),
            tc: new ToolControl(ToolControlType.TOP_CENTER, controlOptions),
            tr: new ToolControl(ToolControlType.TOP_RIGHT, controlOptions),
            ml: new ToolControl(ToolControlType.MIDDLE_LEFT, controlOptions),
            mr: new ToolControl(ToolControlType.MIDDLE_RIGHT, controlOptions),
            bl: new ToolControl(ToolControlType.BOTTOM_LEFT, controlOptions),
            bc: new ToolControl(ToolControlType.BOTTOM_CENTER, controlOptions),
            br: new ToolControl(ToolControlType.BOTTOM_RIGHT, controlOptions),
            mc: new ToolControl(ToolControlType.MIDDLE_CENTER, controlOptions),
            rde: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.DELETE),
            rtl: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.TOP_LEFT),
            rtc: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.TOP_CENTER),
            rtr: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.TOP_RIGHT),
            rml: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.MIDDLE_LEFT),
            rmr: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.MIDDLE_RIGHT),
            rbl: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.BOTTOM_LEFT),
            rbc: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.BOTTOM_CENTER),
            rbr: new ToolControl(ToolControlType.ROTATION, rotationOptions, RotationControlType.BOTTOM_RIGHT)
        };

        // 맨 아래에 위치시킵니다.
        this.stageLayer.addChild(this.c.mc);
        this.c.mc.on(ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
        this.c.mc.on(ToolControl.MOVE, this.onControlMove.bind(this));
        this.c.mc.on(ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));
        this.c.mc.on(ToolControl.DBCLICK, this.onControlDBClick.bind(this));

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
                case ToolControlType.DELETE:
                    this.stageLayer.addChild(control);
                    control.on('click', this.onDelete.bind(this));
                    break;

                case ToolControlType.ROTATION:
                    //this.stageLayer.addChild(control);
                    control.on(ToolControl.ROTATE_START, this.onRotateStart.bind(this));
                    control.on(ToolControl.ROTATE, this.onRotate.bind(this));
                    control.on(ToolControl.ROTATE_END, this.onRotateEnd.bind(this));
                    control.on(ToolControl.CHANGE_ROTATION_CURSOR, this.onChangeRotationCursor.bind(this));
                    break;

                case ToolControlType.TOP_LEFT:
                case ToolControlType.TOP_RIGHT:
                case ToolControlType.TOP_CENTER:
                case ToolControlType.MIDDLE_LEFT:
                case ToolControlType.MIDDLE_RIGHT:
                case ToolControlType.BOTTOM_LEFT:
                case ToolControlType.BOTTOM_RIGHT:
                case ToolControlType.BOTTOM_CENTER:
                    this.stageLayer.addChild(control);
                    control.on(ToolControl.MOVE_START, this.onControlMoveStart.bind(this));
                    control.on(ToolControl.MOVE, this.onControlMove.bind(this));
                    control.on(ToolControl.MOVE_END, this.onControlMoveEnd.bind(this));
                    break;
            }
        }
    };


    addEvent() {

        this.stageLayer.on(TransformTool.SET_TARGET, this.onSetTarget.bind(this));
        //this.stageLayer.root.on( "mousedown", this.onMouseDown, this );
        //this.stageLayer.root.on( 'mouseup', this.onMouseUp, this );

        window.document.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.document.addEventListener('mouseup', this.onMouseUp.bind(this));

        window.document.addEventListener('touchstart', this.onMouseDown.bind(this));
        window.document.addEventListener('touchend', this.onMouseUp.bind(this));
        this.downCnt = 0;
    }

    onMouseDown(e){

        //if( e.data.originalEvent.target != this.stageLayer.renderer.view ) return;

        this._px = Mouse.global.x;
        this._py = Mouse.global.y;
    }

    onMouseUp(e){

        //if( e.data.originalEvent.target != this.stageLayer.renderer.view ) return;

        this.downCnt--;

        if ( this.downCnt < 0 && this.target ){

            let dx = Mouse.globalX - this._px,
                dy = Mouse.globalX - this._py;

            if( dx * dx + dy * dy <= _dragRange * _dragRange ){

                this.target.emit(TransformTool.DESELECT);
                this.target.visible = true;
                this.releaseTarget();
            }
        }

        this.downCnt = 0;
    }


    show() {

        if (!this.controls || this.g.visible) return;

        this.g.visible = true;

        each( this.controls, e => e.visible = true );
    }


    hide() {
        if (!this.controls || this.g.visible === false) return;

        this.g.visible = false;

        each( this.controls, e => e.visible = false );
    }


    activeTarget(target){
        this.target = target;
        this.removeTextureUpdateEvent();
        this.addTextureUpdateEvent();

        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
        this.target.emit(TransformTool.SELECT, target);
        this.stageLayer.emit(TransformTool.SET_TARGET, target);
    }


    setTarget(e) {
        var pixiSprite = e.target;
        pixiSprite.emit(TransformTool.SET_TARGET, pixiSprite);
        this.activeTarget(pixiSprite);
        this.c.mc.emit('mousedown', e);
    };


    releaseTarget() {
        if(this.target === null) return;
        this.hide();
        this.removeTextureUpdateEvent();
        this.target = null;
    }


    addTextureUpdateEvent() {
        this.target._targetTextureUpdateListener = this.onTextureUpdate.bind(this);
        this.target.on(VectorContainer.TEXTURE_UPDATE, this.target._targetTextureUpdateListener);
    }


    removeTextureUpdateEvent() {
        if (this.target !== null && this.target._targetTextureUpdateListener !== null) {
            this.target.off(VectorContainer.TEXTURE_UPDATE, this.target._targetTextureUpdateListener);
            this.target._targetTextureUpdateListener = null;
        }
    }


    update() {
        if(this.target === null) return;
        this.setControls();
        this.updateTransform();
        this.draw();
        this.updatePrevTargetLt();
    }


    visibleCursorArea(isVisiable) {
        var drawAlpha = (isVisiable) ? 0.3 : 0.0;

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.drawAlpha = drawAlpha;
            control.render();
        }
    }


    setControls() {
        var scaleSignX = this.target.scaleSignX;
        var scaleSignY = this.target.scaleSignY;
        var localBounds = this.target.getLocalBounds();
        var w = localBounds.width * scaleSignX;
        var h = localBounds.height * scaleSignY;
        var deleteButtonOffsetY = this.deleteButtonOffsetY * scaleSignY;
        //var rotationLineLength = this.rotationLineLength * scaleSignY;

        this.c.tl.localPoint = new PIXI.Point(0, 0);
        this.c.tr.localPoint = new PIXI.Point(w, 0);
        this.c.tc.localPoint = PointUtil.interpolate(this.c.tr.localPoint, this.c.tl.localPoint, .5);
        this.c.bl.localPoint = new PIXI.Point(0, h);
        this.c.br.localPoint = new PIXI.Point(w, h);
        this.c.bc.localPoint = PointUtil.interpolate(this.c.br.localPoint, this.c.bl.localPoint, .5);
        this.c.ml.localPoint = PointUtil.interpolate(this.c.bl.localPoint, this.c.tl.localPoint, .5);
        this.c.mr.localPoint = PointUtil.interpolate(this.c.br.localPoint, this.c.tr.localPoint, .5);
        this.c.mc.localPoint = PointUtil.interpolate(this.c.bc.localPoint, this.c.tc.localPoint, .5);
        this.c.de.localPoint = PointUtil.add(this.c.tl.localPoint.clone(), new PIXI.Point(0, deleteButtonOffsetY));
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
    }


    updateTransform() {
        this.transform = this.target.worldTransform.clone();
        this.invertTransform = this.transform.clone();
        this.invertTransform.invert();

        for (var prop in this.controls) {
            var control = this.controls[prop];
            control.transform = this.transform;
        }
    }


    updatePrevTargetLt() {
        if(this.target === null) return;
        this.prevLtX = this.lt.x;
        this.prevLtY = this.lt.y;
    }


    scaleCorner(e) {
        var currentControl = e.target;
        var currentMousePoint = e.currentMousePoint;

        var currentPoint = this.invertTransform.apply(currentMousePoint);
        var startPoint = this.invertTransform.apply(this.startMousePoint);
        var vector = PointUtil.subtract(currentPoint, startPoint);

        var currentControl = this.invertTransform.apply(currentControl.globalPoint);
        var centerPoint = this.invertTransform.apply(this.c.mc.globalPoint);
        var wh = PointUtil.subtract(currentControl, centerPoint);

        var w = wh.x * 2;
        var h = wh.y * 2;
        var scaleX = 1 + (vector.x / w);
        var scaleY = 1 + (vector.y / h);

        var abs_scalex = Math.abs(scaleX);
        var abs_scaley = Math.abs(scaleY);

        var op_scalex = scaleX > 0 ? 1 : -1;
        var op_scaley = scaleY > 0 ? 1 : -1;

        if (abs_scalex > abs_scaley)
            scaleY = abs_scalex * op_scaley;
        else
            scaleX = abs_scaley * op_scalex;

        this.target.scale = {x: scaleX, y: scaleY};
    }


    scaleMiddle(e, isScaleHorizontal = true) {
        var currentControl = e.target;
        var currentMousePoint = e.currentMousePoint;

        var scaleX = 1;
        var scaleY = 1;

        var currentPoint = this.invertTransform.apply(currentMousePoint);
        var startPoint = this.invertTransform.apply(this.startMousePoint);
        var vector = PointUtil.subtract(currentPoint, startPoint);

        var currentControl = this.invertTransform.apply(currentControl.globalPoint);
        var centerPoint = this.invertTransform.apply(this.c.mc.globalPoint);
        var wh = PointUtil.subtract(currentControl, centerPoint);

        var w = wh.x * 2;
        var h = wh.y * 2;

        if (isScaleHorizontal)
            scaleX = 1 + (vector.x / w);
        else
            scaleY = 1 + (vector.y / h);

        this.target.scale = {x: scaleX, y: scaleY};
    }


    /**
     * 타겟 객체 이동
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    move(e) {

        var change = e.targetChangeMovement;

        this.target.x += change.x;
        this.target.y += change.y;
    }


    doTransform(e) {
        var control = e.target;
        switch (control.type) {
            case ToolControlType.TOP_LEFT:
            case ToolControlType.TOP_RIGHT:
            case ToolControlType.BOTTOM_LEFT:
            case ToolControlType.BOTTOM_RIGHT:
                this.scaleCorner(e);
                break;

            case ToolControlType.MIDDLE_LEFT:
            case ToolControlType.MIDDLE_RIGHT:
                this.scaleMiddle(e, true);
                break;

            case ToolControlType.TOP_CENTER:
            case ToolControlType.BOTTOM_CENTER:
                this.scaleMiddle(e, false);
                break;

            case ToolControlType.MIDDLE_CENTER:
                this.move(e);
                break;
        }
    }


    draw() {

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
            rbr: transform.apply(this.c.rbr.localPoint),
        };

        g.clear();
        // g.lineStyle(0.5, 0xFFFFFF);
        g.lineStyle(1, 0xFFFFFF);

        this.drawRect( g, globalPoints );

        for (var prop in this.controls) {
            var p = globalPoints[prop];
            var c = this.controls[prop];
            c.x = p.x;
            c.y = p.y;
            c.visible = true;
        }
    }

    /**
     * 트랜스폼 툴의 선과 컨트롤 객체 위치를 업데이트한다.
     * 1. target이 있는 경우에만 업데이트한다.
     * 2. target의 worldTransform을 통해 global 좌표를 계산한다.
     * @return {[type]} [description]
     */
    updateGraphics(){

        if( !this.target ) return;

        this.stageLayer.updateTransform();

        this.g.visible = true;

        let locals = this.c,
            transform = this.target.worldTransform,
            globals = map( _collection, (e, key)=> transform.apply( locals[key].localPoint ) );

        globals.de =
        globals.rde = this.deleteButtonPosition;

        this.g.clear();
        this.g.lineStyle(0.5, 0xFFFFFF);

        this.drawRect( this.g, globals );

        each( this.controls, (e, key)=>{

            e.x = globals[key].x;
            e.y = globals[key].y;

            e.visible = true;
        });
    }

    /**
     * 주어진 graphics 객체를 사용하여 사각형을 그린다.
     * 1. points 객체에 좌상단(tl), 우상단(tr), 우하단(br), 좌하단(bl) 4개의 points가 있다.
     * @param  {[type]} g      [description]
     * @param  {[type]} points [description]
     * @return {[type]}        [description]
     */
    drawRect( g, points ){

        g.moveTo(points.tl.x, points.tl.y);
        g.lineTo(points.tr.x, points.tr.y);
        g.lineTo(points.br.x, points.br.y);
        g.lineTo(points.bl.x, points.bl.y);
        g.lineTo(points.tl.x, points.tl.y);
    }


    setPivotByLocalPoint(localPoint) {
        this.target.setPivot(localPoint);
        this.target.pivot = localPoint;
        this.adjustPosition();
    }


    setPivotByControl(control) {
        this.pivot = this.getPivot(control);
        this.target.setPivot(this.pivot.localPoint);
        this.adjustPosition();
    }


    adjustPosition() {
        var offsetX = this.lt.x - this.prevLtX;
        var offsetY = this.lt.y - this.prevLtY;
        var noScaleOffsetX = offsetX / this.diffScaleX;
        var noScaleOffsetY = offsetY / this.diffScaleY;
        var pivotOffsetX = offsetX - noScaleOffsetX;
        var pivotOffsetY = offsetY - noScaleOffsetY;
        this.target.x = this.target.x - offsetX + pivotOffsetX;
        this.target.y = this.target.y - offsetY + pivotOffsetY;
        this.updatePrevTargetLt();
    }


    getPivot(control) {
        switch (control.type) {
            case ToolControlType.DELETE:
                return this.c.mc;
            case ToolControlType.ROTATION:
                return this.c.mc;
            case ToolControlType.TOP_LEFT:
                return this.c.br;
            case ToolControlType.TOP_CENTER:
                return this.c.bc;
            case ToolControlType.TOP_RIGHT:
                return this.c.bl;
            case ToolControlType.MIDDLE_LEFT:
                return this.c.mr;
            case ToolControlType.MIDDLE_RIGHT:
                return this.c.ml;
            case ToolControlType.BOTTOM_LEFT:
                return this.c.tr;
            case ToolControlType.BOTTOM_CENTER:
                return this.c.tc;
            case ToolControlType.BOTTOM_RIGHT:
                return this.c.tl;
            case ToolControlType.MIDDLE_CENTER:
                return this.c.mc;
        }
    }


    //////////////////////////////////////////////////////////////////////////
    // Cursor
    //////////////////////////////////////////////////////////////////////////


    enableCurrentStyleCursor() {
        if (this.target === null) return;

        this.target.buttonMode = false;
        this.target.interactive = false;
        this.target.defaultCursor = 'inherit';

        for(var prop in this.c) {
            var c = this.c[prop];
            c.buttonMode = false;
            c.interactive = false;
            c.defaultCursor = 'inherit';
        }

        this.stageLayer.buttonMode = true;
        this.stageLayer.interactive = true;
        this.stageLayer.defaultCursor = Mouse.currentCursorStyle;
    };


    disableCurrentStyleCursor() {
        if (this.target === null) return;

        this.target.buttonMode = true;
        this.target.interactive = true;
        this.target.defaultCursor = 'inherit';

        for(var prop in this.c) {
            var c = this.c[prop];
            c.buttonMode = true;
            c.interactive = true;
            c.defaultCursor = 'inherit';
        }

        this.stageLayer.buttonMode = false;
        this.stageLayer.interactive = false;
        this.stageLayer.defaultCursor = 'inherit';
    };


    onSetTarget(target) {
        if(this.target !== target) this.releaseTarget();
    }


    onDelete(e) {
        if(!this.target) return;
        this.target.emit(TransformTool.DELETE, this.target);
    }


    onRotateStart(e) {
        if(!this.target) return;
        this.downCnt++;
        this.target._rotation = this.target.rotation;
        this.setPivotByControl(e.target);
        this.enableCurrentStyleCursor();
    }


    onRotate(e) {
        if(!this.target) return;

        if(this.useSnap) {
            var rotation = this.target._rotation + e.changeRadian;
            var angle = Calc.toDegrees(rotation);
            var absAngle = Math.round(Math.abs(angle) % 90);

            if(absAngle < this._startSnapAngle || absAngle > this._endSnapAngle) {
                this.target.rotation = Calc.toRadians(Calc.snapTo(angle, 90));
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
    }


    onRotateEnd(e) {
        if(!this.target) return;
        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
        this.disableCurrentStyleCursor();
    }


    onControlMoveStart(e) {
        if(!this.target) return;
        this.downCnt++;
        this.startMousePoint = {x: e.currentMousePoint.x, y: e.currentMousePoint.y};
        this.setPivotByControl(e.target);
        this.updatePrevTargetLt();
        this.enableCurrentStyleCursor();
    }


    onControlMove(e) {
        if(!this.target) return;
        this.doTransform(e);
        this.draw();
        this.updatePrevTargetLt();
    }


    onControlMoveEnd(e) {
        if(!this.target) return;
        this.target.emit(TransformTool.TRANSFORM_COMPLETE);
        this.disableCurrentStyleCursor();
    }


    onControlDBClick(e){
        if(!this.target) return;
        this.target.emit(TransformTool.DBCLICK, {target: this.target});
    }


    onChangeRotationCursor(cursor) {
        this.stageLayer.defaultCursor = cursor;
    }


    onTextureUpdate(e) {
        var target = e.target;
        var width = target.width;
        var height = target.height;
        this.setPivotByLocalPoint({x: 0, y: 0});
        this.update();
        this.c.mc.drawCenter(this.target.rotation, this.width, this.height);
    }


    get lt() {
        this.target.displayObjectUpdateTransform();
        var transform = this.target.worldTransform.clone();
        transform.rotate(-this.targetLayer.rotation);
        return transform.apply({x: 0, y: 0});
    }

    get deleteButtonPosition() {
        if (!this.c)
            return new PIXI.Point(0, 0);

        var transform = this.target.worldTransform.clone();
        var tl = transform.apply(this.c.tl.localPoint);
        var ml = transform.apply(this.c.ml.localPoint);
        //return PointUtil.getAddedInterpolate(tl, ml, this.deleteButtonOffsetY);
        return PointUtil.add(PointUtil.getAddedInterpolate(tl, ml, this.deleteButtonOffsetY), new PIXI.Point(-this.deleteButtonSize, -this.deleteButtonSize));
    }


    /**
     * NOT USE
     * 회전 컨트롤이 모든 컨트롤 뒤에 배치되도록 변경되어 사용하지 않습니다.
     * @returns {*}
     */
    get rotateControlPosition() {
        if (!this.c)
            return new PIXI.Point(0, 0);

        var transform = this.target.worldTransform.clone();
        var tc = transform.apply(this.c.tc.localPoint);
        var ro = transform.apply(this.c.ro.localPoint);
        return PointUtil.getAddedInterpolate(tc, ro, this.rotationLineLength);
    }


    get diffScaleX() {
        var matrix = this.target.worldTransform;
        return Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
    }

    get diffScaleY() {
        var matrix = this.target.worldTransform;
        return Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
    }


    get width() {
        return this.target.width * this.diffScaleX;
    }

    get height() {
        return this.target.height * this.diffScaleY;
    }


    set useSnap(value) {
        this._useSnap = value;
    }

    get useSnap() {
        return this._useSnap;
    }

    set snapAngle(value) {
        this._snapAngle = value;
        this._startSnapAngle = value;
        this._endSnapAngle = 90 - value;
    }

    get snapAngle() {
        return this._snapAngle;
    }

}
