

//Ejemplo LanzaGuisantes
function LanzaGuisantes(game, x, y, _boardRef){
  Plant.apply(this,[game, x, y, 'lanzaGuisantes', _boardRef]);

  
  this.bulletPool = _boardRef.spManager.bulletGroup.getChildAt(0);
  this.bulletType = NormalPea;
  this.firerate = 1430;
  this.timeCount = 0;
  this.animations.add('try', [0, 1, 0], 3, true);
  this.animations.add('shootin', [2, 0], 2, false);
  this._life = 300;
  this._force = 20;

  this.sfx=this.game.add.audio('shoot');
  this.sfx.volume=0.2;
  
  this.rayCast = this.createRaycast();

  this.isAttacking = false;

  this.animations.play('try');
}
LanzaGuisantes.prototype = Object.create(Plant.prototype);
LanzaGuisantes.constructor = LanzaGuisantes;
LanzaGuisantes.cost = 100;
LanzaGuisantes.coolDownTime = (7.5 * 1000);
//Metodos
LanzaGuisantes.prototype.checkRayCast = function(_zombiesArray){
  var aux = false;
  for(let i = 0; i < _zombiesArray.length && !aux; i++){
    var zomb = _zombiesArray.getChildAt(i);
    aux = this.game.physics.arcade.collide(this.rayCast, zomb,function rayCollides(obj1){
      obj1.collides = true;
    });
  }
}

LanzaGuisantes.prototype.shoot=function(){
  this.checkRayCast(this.boardRef.spManager.zombies.getChildAt(0));
  if(this.alive  && this.rayCast.collides && this.timeCount >= this.firerate){
    this.timeCount = 0;
    if(this.bulletPool.length == 0) {
      this.bulletPool.add(new this.bulletType(this.game, this.x + this.width, this.y , this.key + 'Bala', 350, this._force));
      this.bulletPool.getChildAt(0).kill();        
    }
    var i = 0;
    var shooted = false;
    while(i < this.bulletPool.length && !shooted) {      
    if(!this.bulletPool.getChildAt(i).alive){        
        this.animations.play('shootin');
        this.events.onAnimationComplete.add(function(){this.animations.play('try')}, this);
        this.bulletPool.getChildAt(i).revive();
        this.bulletPool.getChildAt(i).relocate(this._force,350,this.x + this.width,this.y);
      
        shooted=true;    
      }
      i++
    }
    if(!shooted)   {
    this.animations.play('shootin');
    this.events.onAnimationComplete.add(function(){this.animations.play('try')}, this);
    this.bulletPool.add(new this.bulletType(this.game, this.x + this.width, this.y , this.key + 'Bala', 350, this._force));
    }
    this.sfx.play();
  }else if (this.rayCast.collides){
    this.timeCount += this.game.time.elapsedMS; 
  }
  this.rayCast.collides = false;
}
LanzaGuisantes.prototype.createRaycast = function(){
  var cast = this.game.add.sprite(0, -this.height / 2,"void", 0);
  this.game.physics.arcade.enable(cast);

  cast.x = 0;
  cast.y = -this.height / 2;
  cast.width =  this.game._width - this.x;
  cast.height = 10;
  cast.collides = false;

  this.addChild(cast);

  return cast;
}