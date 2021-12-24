//=============================================================================
// PD_8DirDash.js
//=============================================================================

/*:
 * @plugindesc Add to 8 direction move with graphic change.
 * @author Shio_inu
 *
 * @help 面倒なので誰か代わりに翻訳して。
 * last update : 13th Feb 2016 v1.01
 */

/*:ja
 * @plugindesc グラフィック変更を伴う8方向移動機能が追加されるプラグインです。
 * @author しおいぬ
 *
 * @help ファイル名の末尾に「_Q」の文字列が含まれる歩行グラフィックを
 * 8方向グラフィックとして扱います。
 * 同様に、ファイル名の末尾に「_D」の文字列が含まれる
 * 歩行グラフィックをダッシュグラフィックとして、
 * ファイル名の末尾に「_QD」の文字列が含まれる歩行グラフィックを
 * 8方向+ダッシュグラフィックとして扱います。
 * last update : 2016/02/13 v1.01
 */
(function(){

    Game_Player.prototype.getInputDirection = function() {
        return Input.dir8;
    };

    Game_Map.prototype.xWithDirection = function(x, d) {
        return x + ((d % 3) === 0 ? 1 : (d % 3) === 1 ? -1 : 0);
    };

    Game_Map.prototype.yWithDirection = function(y, d) {
        return y + (d <= 3 ? 1 : d >= 7 ? -1 : 0);
    };

    Game_Map.prototype.roundXWithDirection = function(x, d) {
        return this.roundX(x + ((d % 3) === 0 ? 1 : (d % 3) === 1 ? -1 : 0));
    };

    Game_Map.prototype.roundYWithDirection = function(y, d) {
        return this.roundY(y + (d <= 3 ? 1 : d >= 7 ? -1 : 0));
    };


    Sprite_Character.prototype.getAddX = function(d) {
        return ((d % 3) === 0 ? 1 : (d % 3) === 1 ? -1 : 0);
    };

    Sprite_Character.prototype.getAddY = function(d) {
        return (d <= 3 ? 1 : d >= 7 ? -1 : 0);
    };

    Sprite_Character.prototype.characterPatternX = function() {
        return this.shiftCharacterPatternX(0);
    };

    Sprite_Character.prototype.shiftCharacterPatternX = function(shift) {
        if(this._prevStopping){
            this._prevStopping = this._character.isStopping();
        }
        var fileName = this._characterName.substring(this._characterName.lastIndexOf( "_" ));
        if((fileName.indexOf("D") != -1) && this._character.isDashing() && !this._prevStopping){
            shift += 3;
        }
        this._prevStopping = this._character.isStopping();
        return this._character.pattern() + shift;
    };

    Sprite_Character.prototype.characterPatternY = function() {
        if(!this._prevDir){
            this._prevDir = 2;
        }
        var fileName = this._characterName.substring(this._characterName.lastIndexOf( "_" ));
        if((fileName.indexOf("Q") != -1) && (this._character.direction() % 2 != 0)){
            if(this._character.direction() < 5){
                return 4 + ((this._character.direction() - 1 ) / 2);
            } else {
                return 4 + ((this._character.direction() - 3 ) / 2);
            }
        }
        else{
            var i = 0;
            if(this._character.direction() % 2 != 0){
              if(this.getAddX(this._prevDir) === this.getAddX(this._character.direction()) * -1){
                  this._prevDir = this.reverseDirection(this._prevDir);
              } else if(this.getAddY(this._prevDir) === this.getAddY(this._character.direction()) * -1){
                  this._prevDir = this.reverseDirection(this._prevDir);
              }
              return (this._prevDir + i - 2) / 2;
            }
            this._prevDir = this._character.direction();
            return (this._character.direction() + i - 2) / 2;
        }
    };

    Sprite_Character.prototype.reverseDirection = function(dir) {
        switch (dir) {
        case 2:
            return 8;
        case 4:
            return 6;
        case 6:
            return 4;
        case 8:
            return 2;
        default:
            return 0;
        }
    };

    Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
        this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
        if (this.isMovementSucceeded()) {
            this._x = $gameMap.roundXWithDirection(this._x, horz);
            this._y = $gameMap.roundYWithDirection(this._y, vert);
            this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
            this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
            this.increaseSteps();
        }
        var fileName = this._characterName.substring(this._characterName.lastIndexOf( "_" ));
        if(this._characterName.indexOf("Q") != -1){
            switch (vert + horz) {
            case 6:
                this.setDirection(1);
                break;
            case 8:
                this.setDirection(3);
                break;
            case 12:
                this.setDirection(7);
                break;
            case 14:
                this.setDirection(9);
                break;
            default:
                return 0;
            }
        }
        else{
            if (this._direction === this.reverseDir(horz)) {
                this.setDirection(horz);
            }
            if (this._direction === this.reverseDir(vert)) {
                this.setDirection(vert);
            }
        }
    };

    Game_Character.prototype.findDirectionTo = function(goalX, goalY) {
        var searchLimit = this.searchLimit();
        var mapWidth = $gameMap.width();
        var nodeList = [];
        var openList = [];
        var closedList = [];
        var start = {};
        var best = start;

        if (this.x === goalX && this.y === goalY) {
            return 0;
        }

        start.parent = null;
        start.x = this.x;
        start.y = this.y;
        start.g = 0;
        var longdir = Math.max(Math.abs(goalX - start.x), Math.abs(goalY - start.y));
        var shortDir = Math.min(Math.abs(goalX - start.x), Math.abs(goalY - start.y));
        start.f = g2 + (shortDir * 1.5) + (longdir - shortDir);
        nodeList.push(start);
        openList.push(start.y * mapWidth + start.x);
        while (nodeList.length > 0) {
            var bestIndex = 0;
            for (var i = 0; i < nodeList.length; i++) {
                if (nodeList[i].f < nodeList[bestIndex].f) {
                    bestIndex = i;
                }
            }

            var current = nodeList[bestIndex];
            var x1 = current.x;
            var y1 = current.y;
            var pos1 = y1 * mapWidth + x1;
            var g1 = current.g;

            nodeList.splice(bestIndex, 1);
            openList.splice(openList.indexOf(pos1), 1);
            closedList.push(pos1);

            if (current.x === goalX && current.y === goalY) {
                best = current;
                goaled = true;
                break;
            }

            if (g1 >= searchLimit) {
                continue;
            }

            for (var j = 0; j < 9; j++) {
                var direction = j + 1;
                var x2 = $gameMap.roundXWithDirection(x1, direction);
                var y2 = $gameMap.roundYWithDirection(y1, direction);
                var pos2 = y2 * mapWidth + x2;

                if (closedList.contains(pos2)) {
                    continue;
                }
                if (!this.canPass(x1, y1, direction)) {
                    continue;
                }

                var g2 = (direction % 2 === 0)? g1 + 1 : g1 + 1.5;
                var index2 = openList.indexOf(pos2);

                if (index2 < 0 || g2 < nodeList[index2].g) {
                    var neighbor;
                    if (index2 >= 0) {
                        neighbor = nodeList[index2];
                    } else {
                        neighbor = {};
                        nodeList.push(neighbor);
                        openList.push(pos2);
                    }
                    neighbor.parent = current;
                    neighbor.x = x2;
                    neighbor.y = y2;
                    neighbor.g = g2;
                    var longdir = Math.max(Math.abs(goalX - neighbor.x), Math.abs(goalY - neighbor.y));
                    var shortDir = Math.min(Math.abs(goalX - neighbor.x), Math.abs(goalY - neighbor.y));
                    neighbor.f = g2 + (shortDir * 1.5) + (longdir - shortDir);
                    if (!best || neighbor.f - neighbor.g < best.f - best.g) {
                        best = neighbor;
                    }
                }
            }
        }

        var node = best;
        while (node.parent && node.parent !== start) {
            node = node.parent;
        }

        var deltaX1 = $gameMap.deltaX(node.x, start.x);
        var deltaY1 = $gameMap.deltaY(node.y, start.y);
        console.log("(" + deltaX1 + ", " + deltaY1 + ")");
        if (deltaY1 > 0) {
            if(deltaX1 > 0){
                return 3;
            } else if(deltaX1 < 0){
                return 1;
            } else {
                return 2;
            }
        } else if (deltaY1 < 0) {
            if(deltaX1 > 0){
                return 9;
            } else if(deltaX1 < 0){
                return 7;
            } else {
                return 8;
            }
        } else if (deltaX1 < 0) {
            return 4;
        } else if (deltaX1 > 0) {
            return 6;
        }

        var deltaX2 = this.deltaXFrom(goalX);
        var deltaY2 = this.deltaYFrom(goalY);
        if (deltaY2 < 0) {
            if(deltaX2 < 0){
                return 3;
            } else if(deltaX2 > 0){
                return 1;
            } else {
                return 2;
            }
        } else if (deltaY2 > 0) {
            if(deltaX2 < 0){
                return 9;
            } else if(deltaX2 > 0){
                return 7;
            } else {
                return 8;
            }
        } else if (deltaX2 > 0) {
            return 4;
        } else if (deltaX2 < 0) {
            return 6;
        }

        return 0;
    };

    Game_Map.prototype.isPassable = function(x, y, d) {
        if(d % 2 === 0){
            return this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f);
        } else {
            switch(d){
            case 1:
                return this.checkPassage(x, y, (1 << (2 / 2 - 1)) & 0x0f) && this.checkPassage(x, y, (1 << (4 / 2 - 1)) & 0x0f);
            case 3:
                return this.checkPassage(x, y, (1 << (2 / 2 - 1)) & 0x0f) && this.checkPassage(x, y, (1 << (6 / 2 - 1)) & 0x0f);
            case 7:
                return this.checkPassage(x, y, (1 << (8 / 2 - 1)) & 0x0f) && this.checkPassage(x, y, (1 << (4 / 2 - 1)) & 0x0f);
            case 9:
                return this.checkPassage(x, y, (1 << (8 / 2 - 1)) & 0x0f) && this.checkPassage(x, y, (1 << (6 / 2 - 1)) & 0x0f);
            }
        }
    };


})();