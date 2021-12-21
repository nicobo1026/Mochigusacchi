//=============================================================================
// NYA_EventItemShowPicture.js
// ----------------------------------------------------------------------------
// (C) 2019 Nyatama
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.2.2 2019/06/03 プラグインコマンドのいくつかのエラーを修正しました＆ヘルプを少し追加
// 1.2.1 2019/05/24 <img>タグが無い場合にEmptyImageを表示できる機能を追加
// 1.2.0 2019/05/24 パラメータを一括してセットする機能を追加しました
//                  スクリプトコマンドからもパラメータを一括セットできます
// 1.1.5 2019/04/29 ピクチャ表示に関する全てのパラメータを初期値にリセットする機能を追加しました
//                  プラグインコマンド「EISP PictureScaleY_Reset」が動作しない問題を修正
//                  プラグインコマンド「EISP PicturePos」を「EISP PicturePosition」に変更
//                  プラグインコマンドに「不透明度」「ブレンドモード」を変更できる機能追加
// 1.1.4 2019/04/01 決定キャンセルボタンを押したときに自動的に消去する機能を
//                  プラグインコマンドで切り替えれるようにしました（default:ON）
// 1.1.3 2019/03/29 決定キーでピクチャが消えなかった問題を修正しました
// 1.1.2 2019/03/27 タグの無いアイテムで前のピクチャを削除するようにしました
// 1.1.1 2019/03/27 ピクチャIDや表示位置を変更できる機能を追加しました
// 1.1.0 2019/03/27 アイテム選択の処理に画像を追加する機能の表示状態を設定できるようにした
// 1.0.2 2019/03/13 リストに何も入ってないときにクラッシュする不具合を修正しました
// 1.0.1 2019/03/12 競合対策しました
// 1.0.0 2019/03/12 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/nyatama777/
//=============================================================================
/*:
 * @plugindesc アイテム選択の処理に「ピクチャの表示」機能で画像を表示します
 *
 * @author にゃたま
 *
 * @param TagName
 * @text タグ名
 * @desc タグ名
 * 初期値: img
 * @default img
 *
 * @param EmptyImage
 * @text 未タグ画像
 * @desc アイテムにタグが設定されてなかった場合に表示する画像
 * 設定しない場合常に非表示。<EmptyHidden>タグで個別非表示
 * @type file
 * @require 1
 * @dir img/pictures
 *
 * @param PictureId
 * @text ピクチャの番号
 * @desc ピクチャの番号
 * 初期値: 1
 * @default 1
 *
 * @param Origin
 * @text 原点の位置
 * @desc 原点の位置。０で左上、１で中央
 * 初期値: 1-中央
 * @type select
 * @option 左上
 * @value 0
 * @option 中央
 * @value 1
 * @default 1
 *
 * @param PositionX
 * @text 画面X座標
 * @desc ピクチャを表示する画面X座標(式有効)
 * 初期値: Graphics.boxWidth / 2
 * @default Graphics.boxWidth / 2
 *
 * @param PositionY
 * @text 画面Y座標
 * @desc ピクチャを表示する画面Y座標(式有効)
 * 初期値: 300
 * @default 300
 *
 * @param ScaleX
 * @text 幅の拡大膣
 * @desc 幅の拡大率。等倍なら100、2倍なら200
 * 初期値: 100
 * @default 100
 * 
 * @param ScaleY
 * @text 高さの拡大率
 * @desc 高さの拡大率。等倍なら100、2倍なら200
 * 初期値: 100
 * @default 100
 *
 * @param Opacity
 * @text 不透明度
 * @desc 不透明度。0～255の間の値
 * 初期値: 255
 * @type number
 * @max 255
 * @min 0
 * @default 255
 *
 * @param BlendMode
 * @text 合成方法
 * @desc 合成方法。初期値: 0-通常
 * 0で通常、1で加算、2で乗算、3でスクリーン
 * @type select
 * @option 通常
 * @value 0
 * @option 加算
 * @value 1
 * @option 乗算
 * @value 2
 * @option スクリーン
 * @value 3
 * @default 0
 *
 * @help
 * 当プラグインはアイテム選択の処理にピクチャを表示します。
 * アイテムのメモに<img:画像ファイル名>を指定するとそのファイルを表示します。
 * アイテムの画像ファイルはimg/pinctureフォルダに配置します。
 * 尚、タグ名(img)の名称をプラグインパラメータで変更できます。
 *
 * プラグインパラメータの未タグ画像(EmptyImage)を指定すると
 * <img>タグの指定が無いときに空の画像(EmptyImage)を表示します
 * 尚、アイテムメモ欄に<EmptyHidden>タグを記述すると
 * EmptyImageを非表示にします
 *
 * (new)
 * 必ずEISP PictureId_EditなどのEditコマンドを使用する場合
 * EISP PictureAll_Resetをして初期値にリセットしてください。
 * セーブして再起動してロードした場合変更した値がセーブされてませんので
 * 初期値にリセットされています。バグの原因になります。
 * 全リセット忘れを防ぐには以下の推奨コマンドを利用してください。
 * 文字列のとき初期値にリセットされ数値のときに値を変更できます。
 * EISP id origin x y scaleX scaleY opacity blendMode
 * 
 * 【プラグインコマンド】
 *
 * アイテム選択の処理でピクチャを表示させます
 * EISP ON
 * アイテム選択の処理でピクチャを表示させません
 * EISP OFF
 *
 * EmptyImageを'EmptyImg'に設定します
 * EISP EmptyImage_Edit EmptyImg
 * EmptyImageを初期値にリセットします
 * EISP EmptyImage_Reset
 *
 * ピクチャIDを10に設定します
 * EISP PictureId_Edit 10
 * ピクチャIDを初期値にリセットします
 * EISP PictureId_Reset
 *
 * ピクチャの原点の位置を1(中央)に設定します
 * EISP PictureOrigin_Edit 1
 * ピクチャの原点の位置を0(左上)に設定します
 * EISP PictureOrigin_Edit 0
 * ピクチャの原点の位置をリセットします
 * EISP PictureOrigin_Reset
 *
 * ピクチャの表示位置（X座標）を100に設定します
 * EISP PicturePositionX_Edit 100
 * ピクチャの表示位置（X座標）を初期値にリセットします
 * EISP PicturePositionX_Reset
 *
 * ピクチャの表示位置（Y座標）を100に設定します
 * EISP PicturePositionY_Edit 100
 * ピクチャの表示位置（Y座標）を初期値にリセットします
 * EISP PicturePositionY_Reset
 *
 * ピクチャのスケール（X座標）を100に設定します
 * EISP PictureScaleX_Edit 100
 * ピクチャのスケール（X座標）を初期値にリセットします
 * EISP PictureScaleX_Reset
 *
 * ピクチャのスケール（Y座標）を100に設定します
 * EISP PictureScaleY_Edit 100
 * ピクチャのスケール（Y座標）を初期値にリセットします
 * EISP PictureScaleY_Reset
 *
 * ピクチャの不透明度を100に設定します
 * EISP PictureOpacity_Edit 100
 * ピクチャの不透明度を初期値にリセットします
 * EISP PictureOpacity_Reset
 *
 * ピクチャのブレンドモードを1:加算に設定します
 * EISP PictureBlendMode_Edit 1
 * ピクチャのブレンドモードを初期値にリセットします
 * EISP PictureBlendMode_Reset
 *
 * ピクチャ表示に関する全てのパラメータを初期値にリセットします
 * EISP PictureAll_Reset
 *
 * (new)文字列にすると初期値リセットし整数にするとそのパラメータを変更できます
 * （以下のidなどの文字はわかりやすい単語に変更可能、例えばx→positionX等）
 * （EISP以降、８要素無い場合無効になります）（推奨します）
 * EISP id origin x y scaleX scaleY opacity blendMode
 *
 * 決定ボタンやキャンセルボタンでピクチャを自動的に消去します
 * EISP PictureAutoErase_On
 * ピクチャを自動的に消去しませんので手動でピクチャの消去コマンドを実施すること
 * EISP PictureAutoErase_Off
 *
 *
 * (new)【スクリプトコマンド】
 *
 * ピクチャ表示に関する全てのパラメータを初期値にリセットします
 * $gameScreen.EISP_setPicture();
 *
 * id:1 name:'test' に設定し、他全てを初期値にリセットします
 * nullやundefinedは未設定扱い(つまり初期値リセット)になります
 * $gameScreen.EISP_setPicture(1, 'test', null, undefined);
 * 
 * id:1 name:'test' origin:1 x:100 y:200 scaleX:100 
 * scaleY:100 opacity:255 blendMode:1 に設定します
 * $gameScreen.EISP_setPicture(1, 'test', 1, 100, 200, 100, 100, 255, 1);
 */

var Imported = Imported || {};
Imported.NYA_EventItemShowPicture = true;

(function() {
    'use strict';
    
    //プラグインマネージャーで設定されたパラメータを取得
    var parameters = PluginManager.parameters('NYA_EventItemShowPicture');
    
    //パラメータを変数へ
    var tagName = parameters['TagName'];
    var emptyImage = parameters['EmptyImage'];
    var picId = Number(parameters['PictureId']);
    var picOrigin = Number(parameters['Origin']);
    var picPositionX = String(parameters['PositionX']);
    var picPositionY = String(parameters['PositionY']);
    var picScaleX = Number(parameters['ScaleX']);
    var picScaleY = Number(parameters['ScaleY']);
    var picOpacity = Number(parameters['Opacity']);
    var picBlendMode = Number(parameters['BlendMode']);
    var enabled = true;
    var autoErase = true;
    
    var _Window_EventItem_item = Window_EventItem.prototype.item;
    Window_EventItem.prototype.item = function() {
        _Window_EventItem_item.call(this);
        
        var index = this.index();
        if(enabled === true){
            if(this._data[index] !== undefined){
                if(this._data[index].meta[tagName] !== undefined){
                    //アイテムのタグにtagNameの値が存在していたらそのタグ名の画像を表示
                    var picName = this._data[index].meta[tagName];
                    if(picName) { $gameScreen.showPicture(picId, picName, picOrigin, 
                                                            eval(picPositionX), eval(picPositionY), 
                                                            picScaleX, picScaleY, picOpacity, picBlendMode);
                    }
                }else{
                    if(emptyImage){
                        var emptyHidden = this._data[index].meta.emptyHidden;
                        if(emptyHidden){
                            //アイテムのタグにemptyHiddenがあったら画像を非表示
                            $gameScreen.erasePicture(picId);
                        }else{
                            //アイテムのタグにemptyHiddenがなければEmptyImageを表示
                            $gameScreen.showPicture(picId, emptyImage, picOrigin, 
                                                            eval(picPositionX), eval(picPositionY), 
                                                            picScaleX, picScaleY, picOpacity, picBlendMode);
                        }
                    }else{
                        $gameScreen.erasePicture(picId);
                    }
                }
            }
        }
        return this._data && index >= 0 ? this._data[index] : null;
    };
    
    var _Window_EventItem_onOk = Window_EventItem.prototype.onOk;
    Window_EventItem.prototype.onOk = function() {
        _Window_EventItem_onOk.call(this);
        if(enabled === true && autoErase === true){
            $gameScreen.erasePicture(picId);
        }
    };
    
    var _Window_EventItem_onCancel = Window_EventItem.prototype.onCancel;
    Window_EventItem.prototype.onCancel = function() {
        _Window_EventItem_onCancel.call(this);
        if(enabled === true && autoErase === true){
            $gameScreen.erasePicture(picId);
        }
    };
    
    Game_Screen.prototype.EISP_setPicture = function(pictureId, origin, x, y,
                                             scaleX, scaleY, opacity, blendMode) {
        if(pictureId) picId = pictureId;
        else picId = Number(parameters['PictureId']);
        
        if(origin) picOrigin = origin;
        else picOrigin = Number(parameters['Origin']);
        
        if(x) picPositionX = x;
        else picPositionX = String(parameters['PositionX']);
        
        if(y) picPositionY = y;
        else picPositionY = String(parameters['PositionY']);
        
        if(scaleX) picScaleX = scaleX;
        else picScaleX = Number(parameters['ScaleX']);
        
        if(scaleY) picScaleY = scaleY;
        else picScaleY = Number(parameters['ScaleY']);
        
        if(opacity) picOpacity = opacity;
        else picOpacity = Number(parameters['Opacity']);
        
        if(blendMode) picBlendMode = blendMode;
        else picBlendMode = Number(parameters['BlendMode']);
    }
    
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {

        _Game_Interpreter_pluginCommand.call(this, command, args);

        if (command.toUpperCase() === 'EISP') {
            
            //Enable
            if (args[0].toUpperCase() === 'OFF'){
                enabled = false;
            }
            if (args[0].toUpperCase() === 'ON'){
                enabled = true;
            }
            //EmptyImage
            if (args[0].toUpperCase() === 'EMPTYIMAGE_EDIT'){
                emptyImage = String(args[1]);
            }
            if (args[0].toUpperCase() === 'EMPTYIMAGE_RESET'){
                emptyImage = String(parameters['EmptyImage']);
            }
            //Id
            if (args[0].toUpperCase() === 'PICTUREID_EDIT'){
                picId = Number(args[1]);
            }
            if (args[0].toUpperCase() === 'PICTUREID_RESET'){
                picId = Number(parameters['PictureId']);
            }
            //Origin
            if (args[0].toUpperCase() === 'PICTUREORIGIN_EDIT'){
                picOrigin = Number(args[1]);
            }
            if (args[0].toUpperCase() === 'PICTUREORIGIN_RESET'){
                picOrigin = Number(parameters['Origin']);
            }
            //PositionX
            if (args[0].toUpperCase() === 'PICTUREPOSITIONX_EDIT'){
                picPositionX = String(args[1]);
            }
            if (args[0].toUpperCase() === 'PICTUREPOSITIONX_RESET'){
                picPositionX = String(parameters['PositionX']);
            }
            //PositionY
            if (args[0].toUpperCase() === 'PICTUREPOSITIONY_EDIT'){
                picPositionY = String(args[1]);
            }
            if (args[0].toUpperCase() === 'PICTUREPOSITIONY_RESET'){
                picPositionY = String(parameters['PositionY']);
            }
            //ScaleX
            if (args[0].toUpperCase() === 'PICTURESCALEX_EDIT'){
                picScaleX = Number(args[1]);
            }
            if (args[0].toUpperCase() === 'PICTURESCALEX_RESET'){
                picScaleX = Number(parameters['ScaleX']);
            }
            //ScaleY
            if (args[0].toUpperCase() === 'PICTURESCALEY_EDIT'){
                picScaleY = Number(args[1]);
            }
            if (args[0].toUpperCase() === 'PICTURESCALEY_RESET'){
                picScaleY = Number(parameters['ScaleY']);
            }
            //Opacity
            if (args[0].toUpperCase() === 'PICTUREOPACITY_EDIT'){
                picOpacity = Number(args[1]);
            }
            if (args[0].toUpperCase() === 'PICTUREOPACITY_RESET'){
                picOpacity = Number(parameters['Opacity']);
            }
            //BlendMode
            if (args[0].toUpperCase() === 'PICTUREBLENDMODE_EDIT'){
                picBlendMode = Number(args[1]);
            }
            if (args[0].toUpperCase() === 'PICTUREBLENDMODE_RESET'){
                picBlendMode = Number(parameters['BlendMode']);
            }
            //AllReset
            if (args[0].toUpperCase() === 'PICTUREALL_RESET'){
                picId = Number(parameters['PictureId']);
                picOrigin = Number(parameters['Origin']);
                picPositionX = String(parameters['PositionX']);
                picPositionY = String(parameters['PositionY']);
                picScaleX = Number(parameters['ScaleX']);
                picScaleY = Number(parameters['ScaleY']);
                picOpacity = Number(parameters['Opacity']);
                picBlendMode = Number(parameters['BlendMode']);
            }
            //AutoErase
            if (args[0].toUpperCase() === 'PICTUREAUTOERASE_ON'){
                autoErase = true;
            }
            if (args[0].toUpperCase() === 'PICTUREAUTOERASE_OFF'){
                autoErase = false;
            }
            //SetPicture
            if (args.length === 8) {
                var patternNumber = /^[\d]+$/;
                for(var i=0;i<args.length;i++){
                    //console.log('args['+i+']:'+args[i]);
                    if(patternNumber.test(args[i])) { args[i] = Number(args[i]); }
                    else { args[i] = null; }
                }
                $gameScreen.EISP_setPicture(args[0],args[1],args[2],args[3],args[4],args[5],args[6],args[7]);
            }
        }
    }

})();