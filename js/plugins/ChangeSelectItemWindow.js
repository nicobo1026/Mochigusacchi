//=============================================================================
// ChangeSelectItemWindow.js
//=============================================================================
/*:
 * @plugindesc Change the number of rows and/or cols of item selecting window.
 * @author Sasuke KANNAZUKI
 *
 * @help This plugin does not provide plugin commands.
 *
 * @param Switch ID
 * @desc this plugin's setting is valid only when the switch is ON.
 * @default 67
 *
 * @param Max Columns
 * @desc the number of the max columns. System setting is 2.
 * @default 1
 *
 * @param Visible Rows
 * @desc the number of visible rows. System setting is 4.
 * @default 8
 */
/*:ja
 * @plugindesc 『アイテム選択の処理』のウィンドウの行数と列数を変更します。
 * @author 神無月サスケ
 *
 * @help このプラグインには、プラグインコマンドはありません。
 *
 * @param Switch ID
 * @desc このIDのスイッチがONの時だけ、設定が働きます。
 * @default 67
 *
 * @param Max Columns
 * @desc 表示する列数です。通常のシステムでは2列です。
 * @default 1
 *
 * @param Visible Rows
 * @desc 表示する行数です。通常のシステムでは4行です。
 * @default 8
 */
(function() {
  //
  // process parameters
  //
  var parameters = PluginManager.parameters('ChangeSelectItemWindow');
  var switchID = Number(parameters['Switch ID'] || 67);
  var cols = Number(parameters['Max Columns'] || 1);
  var rows = Number(parameters['Visible Rows'] || 8);

  Window_EventItem.prototype.initialize = function(messageWindow) {
    this._messageWindow = messageWindow;
    var width = Graphics.boxWidth;
    var height = this.windowHeight();
    Window_ItemList.prototype.initialize.call(this, 0, 0, width, height);
    this.openness = 0;
    if($gameSwitches.value(switchID)){
      this.opacity = 0;
    }
    this.deactivate();
    this.setHandler('ok',     this.onOk.bind(this));
    this.setHandler('cancel', this.onCancel.bind(this));
};

  var _Window_EventItem_maxCols = Window_EventItem.prototype.maxCols;
  Window_EventItem.prototype.maxCols = function() {
    if($gameSwitches.value(switchID)){
      return cols;
    } else {
      return _Window_EventItem_maxCols.call(this);
    }
  };

  var _Window_EventItem_numVisibleRows = 
    Window_EventItem.prototype.numVisibleRows;
  Window_EventItem.prototype.numVisibleRows = function() {
    if($gameSwitches.value(switchID)){
      return rows;
    } else {
      return _Window_EventItem_numVisibleRows.call(this);
    }
  };

  var _Window_EventItem_start = Window_EventItem.prototype.start;
  Window_EventItem.prototype.start = function() {
    this.height = this.windowHeight();
    _Window_EventItem_start.call(this);
  };

})();
