//=============================================================================
// NOM_MessageWindowPosition.js  2021/05/13
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc 文字の縁取り幅変更プラグイン
 * @author Nomoa
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 
 */

(function () {
    'use strict';
    var _Window_Base_createContents = Window_Base.prototype.createContents;
    Window_Base.prototype.createContents = function() {
        _Window_Base_createContents.apply(this, arguments);
        this.contents.outlineColor = 'black';
        this.contents.outlineWidth = 1;
    };
})();