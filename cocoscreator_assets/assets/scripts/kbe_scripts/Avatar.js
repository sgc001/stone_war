/*-----------------------------------------------------------------------------------------
												entity
-----------------------------------------------------------------------------------------*/

var KBEngine = require("kbengine");

KBEngine.Avatar = KBEngine.Entity.extend({
        __init__ : function()
        {
            this._super();
            if(this.isPlayer()) {
                if(window.wx != undefined)
                    this.decodeEncryptedData();
                KBEngine.Event.fire("enterScene");
            }
        },

        decodeEncryptedData: function()
        {
            var encryptedData = cc.sys.localStorage.getItem("encryptedData");
            var iv = cc.sys.localStorage.getItem("iv");
            if(encryptedData && iv) {
                this.baseCall("decodeEncryptedData", encryptedData, iv);
            }
        },
                   
        onEnterWorld : function()
        {
            this._super();
            if(this.isPlayer()) {
                KBEngine.Event.fire("onAvatarEnterWorld", this);
            }		
        },

        startWalk: function(moveFlag)
        {
            KBEngine.INFO_MSG("avatar " + this.id + " start walk: " + moveFlag);
            this.cellCall("startWalk", moveFlag);
        },

        onStartWalk: function(moveFlag)
        {
            KBEngine.INFO_MSG("other avatar " + this.id + " on start walk: " + moveFlag);
            KBEngine.Event.fire("otherAvatarOnStartWalk", this.id, moveFlag);
        },

        stopWalk: function(pos)
        {
            cc.log("avatar %d stop walk, pos(%f, %f)", this.id, pos.x, pos.y);   
            var vec3 = new KBEngine.Vector3();
            vec3.x = pos.x;
            vec3.y = pos.y;
            vec3.z = 0.0;
            this.cellCall("stopWalk", pos);
        },

        onStopWalk: function(pos)
        {
            var v2 = new cc.Vec2();
            v2.x = pos.x;
            v2.y = pos.y;
            cc.log("other avatar %d stop walk, pos(%f, %f)", this.id, v2.x, v2.y);   
            KBEngine.Event.fire("otherAvatarOnStopWalk", this.id, v2);
        },

        jump : function()
	    {
            cc.log("avatar %d cell jump", this.id);
		    this.cellCall("jump");
        }, 

        onJump : function()
	    {
            cc.log("other avatar %d on jump", this.id);
		    KBEngine.Event.fire("otherAvatarOnJump", this);
        }, 

        rightJump: function()
        {
            this.cellCall("rightJump");
            KBEngine.INFO_MSG("avatar " + this.id + " right jump");
        },

        onRightJump: function()
        {
            KBEngine.Event.fire("otherAvatarOnRightJump", this.id);
        },

        leftJump: function()
        {
            this.cellCall("leftJump");
            KBEngine.INFO_MSG("avatar " + this.id + " left jump");
        },

        onLeftJump: function()
        {
            KBEngine.Event.fire("otherAvatarOnLeftJump", this.id);
        },

        onPickUpItem : function(itemID, positon)
        {
            var point = new cc.Vec2(positon.x, positon.y);
            KBEngine.Event.fire("otherAvatarOnPickUpItem", this.id, itemID, point);
        },

        pickUpItem : function(itemID, pos)
	    {
            var vec3 = new KBEngine.Vector3();
            vec3.x = pos.x;
            vec3.y = pos.y;
            vec3.z = 0.0;
            this.cellCall("pickUpItem", itemID, vec3);
        }, 
                    
        throwItem : function(itemID, force)
        {
            var vec3 = new KBEngine.Vector3();
            vec3.x = force.x;
            vec3.y = force.y;
            vec3.z = 0.0;
            this.cellCall("throwItem", itemID, vec3);
        },
         
        onThrowItem : function(itemID, force)
        {
            var v2 = new cc.Vec2(force.x, force.y);
            KBEngine.Event.fire("otherAvatarThrowItem", this.id, itemID, v2);
        },

        onNewTurn : function(eid, second)
	    {
            KBEngine.INFO_MSG("avatar " + eid + " on new turn");
		    KBEngine.Event.fire("newTurn", eid, second);
        }, 

        newTurn : function()
	    {
            this.cellCall("newTurn");
        }, 

        //捡起石头，时间到了，不扔石头，就还原石头的位置
        recoverItem: function(itemID)
        {
            this.cellCall("recoverItem", itemID);
        },

        onRecoverItem: function(itemID)
        {
            KBEngine.Event.fire("otherAvatarRecoverItem", this.id, itemID);
        },

        recvDamage: function(itemID)
        {
            this.cellCall("recvDamage", itemID);
            KBEngine.INFO_MSG("avatar " + this.id + " recvDamage from item=" + itemID);
        },

        onRecvDamage: function(avatarID, harm, hp)
        {
            KBEngine.INFO_MSG("avatar " + avatarID + " recv harm=" + harm + " hp=" + hp);
            KBEngine.Event.fire("onRecvDamage", avatarID, harm, hp);
        },

        onDie: function(avatarID)
        {
            KBEngine.INFO_MSG("avatar " + avatarID + " die");
            KBEngine.Event.fire("onAvatarDie", avatarID);
        },

        onGameOver: function(isWin, hitRate, totalTime, totalHarm, score)
        {
            KBEngine.INFO_MSG("Game is over: avatar " + this.id + "win= " + isWin.toString());
            KBEngine.Event.fire("onGameOver", this.id, isWin, hitRate, totalTime, totalHarm, score);
        },

        //石头出界，重置石头
        resetItem: function(itemID)
        {
            KBEngine.INFO_MSG("reset item ......");
            this.cellCall("resetItem", itemID);
        },

        onResetItem: function(itemID, position)
        {
            KBEngine.INFO_MSG("on reset item position(" + position.x + ", " + position.y + ", " + position.z + ")");
            KBEngine.Event.fire("onResetItem", itemID, position);
        },

        //没石头扔，就产生石头
        addItem: function(left)
        {
            KBEngine.INFO_MSG("add item ......: " + left.toString());
            this.cellCall("addItem", left);
        },

        continueGame: function()
        {
            this.cellCall("continueGame");
            KBEngine.INFO_MSG("avatar " + this.id + " continue game");
        },

        onContinueGame: function(avatarID)
        {
            KBEngine.INFO_MSG("avatar " + avatarID + "on continue game, local avatarID=" + this.id);
            KBEngine.Event.fire("onAvatarEnterWorld", KBEngine.app.entity_uuid, this.id, this);
        },

        joinRoom: function()
        {
            KBEngine.INFO_MSG("avatar " + this.id + " join room");
            this.baseCall("joinRoom");
        }
    });
    
    
    