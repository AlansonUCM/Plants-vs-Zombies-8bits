function ZombieCono(game, x, y, spManager){
    Zombie.apply(this,[game, x, y, 'zombieCono', 12 * 2, 1, 30, 1, spManager]);

    this.iniLife = this.life;
    this.isTaken = false;
}
ZombieCono.prototype = Object.create(Zombie.prototype);
ZombieCono.constructor = ZombieCono;

ZombieCono.prototype.takeDamage = function(_damage){
    this.life -= _damage;
    if(this.life <= this.iniLife/2 && !this.isTaken){
        this.loadTexture('zombieComun');        
        this.animations.play('move',5,true);
    }
    if(this.life <= 0)
        this.manager.zombies.remove(this,true);  
}