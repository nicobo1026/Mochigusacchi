//=============================================================================
// NOM_MessageWindowPosition.js  2021/05/13
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc 文字サイズ調整プラグイン
 * @author Nomoa
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 
 */

(function() {
    'use strict';
    Window_Base.prototype.standardFontSize = function() {
        return 24;
    };
    Window_Base.prototype.lineHeight = function() {
        return 32;
    };

})();