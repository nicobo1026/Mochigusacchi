//=============================================================================
// NOM_MessageWindowPosition.js  2021/05/13
// The MIT License (MIT)
//=============================================================================

/*:
 * @plugindesc メッセージウィンドウ位置調整プラグイン
 * @author Nomoa
 *
 * @help このプラグインにはプラグインコマンドはありません。
 * 
 */

(function() {
    'use strict';

    var _Window_Message_updatePlacement = Window_Message.prototype.updatePlacement;
    Window_Message.prototype.updatePlacement = function() {
        this._positionType = $gameMessage.positionType();
        switch (this._positionType) {
            case 0:
                this.y = this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
                break;
            case 1:
                this.y = this.y = this._positionType * (Graphics.boxHeight - this.height) / 2;
                break;
            case 2:
                this.y = Graphics.boxHeight - 240;
                break;
            }
        
        this._goldWindow.y = this.y > 0 ? 0 : Graphics.boxHeight - this._goldWindow.height;
    };
    
    var _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {

    };

    var _Window_ChoiceList_updatePlacement = Window_ChoiceList.prototype.updatePlacement;
    Window_ChoiceList.prototype.updatePlacement = function() {
      _Window_ChoiceList_updatePlacement.call(this);
      var positionType = $gameMessage.choicePositionType();
      var messageY = this._messageWindow.y;
      this.width = this.windowWidth();
      this.height = this.windowHeight();
      switch (positionType) {
      case 0:
          this.x = 150;
          break;
      case 1:
          this.x = (Graphics.boxWidth - this.width) / 2;
          break;
      case 2:
          this.x = Graphics.boxWidth - 150 - this.width;
          break;
      }
      if (messageY >= Graphics.boxHeight / 2) {
          this.y = messageY - this.height;
      } else {
          this.y = messageY + this._messageWindow.height;
      }

      Window_Help.prototype.initialize = function(numLines) {
        var width = Graphics.boxWidth-100;
        var height = this.fittingHeight(1);
        Window_Base.prototype.initialize.call(this, 50, 0, width, height);
        this._text = '';
    };

    };
})();