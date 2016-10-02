import DATA from "scripts/data"

import Effect from "scripts/model/Effect.js"
import AnimatedSprite from "scripts/utility/AnimatedSprite.js"

import ShortID from "shortid"

export default class Monster {
    constructor(monster) {
        this.key = "monster" + "-" + ShortID.generate()
        this.color = monster.protomonster.color || DATA.COLORS.PINK

        this.game = monster.game

        this.position = monster.position
        this.transition = true

        this.health = monster.protomonster.health || 1
    }
    get sprite() {
        if(this.phase == true) {
            return DATA.IMAGES.GEL_ALPHA
        } else {
            return DATA.IMAGES.GEL_OMEGA
        }
    }
    action() {
        this.phase = this.phase || false
        this.phase = !this.phase

        this.animation = false

        if(this.phase == true) {
            var dx = this.game.adventurer.position.x - this.position.x
            var dy = this.game.adventurer.position.y - this.position.y

            if(Math.abs(dx) > Math.abs(dy)) {
                if(dx > 0) this.move({x: +1})
                if(dx < 0) this.move({x: -1})
            } else {
                if(dy > 0) this.move({y: +1})
                if(dy < 0) this.move({y: -1})
            }
        }
    }
    move(movement) {
        // initialization
        movement = movement || {}
        movement.x = movement.x || 0
        movement.y = movement.y || 0

        // collision with the camera
        if(movement.x < 0 && this.position.x + movement.x < 0
        || movement.y < 0 && this.position.y + movement.y < 0
        || movement.x > 0 && this.position.x + movement.x >= DATA.FRAME.WIDTH
        || movement.y > 0 && this.position.y + movement.y >= DATA.FRAME.HEIGHT) {
            movement.x = 0
            movement.y = 0
        }

        // collision with other monsters
        this.game.monsters.forEach((monster) => {
            if(monster != this) {
                if(monster.position.x == this.position.x + movement.x
                && monster.position.y == this.position.y + movement.y) {
                    movement.x = 0
                    movement.y = 0
                }
            }
        })

        // collsiion with adventurer
        if(this.position.x + movement.x == this.game.adventurer.position.x
        && this.position.y + movement.y == this.game.adventurer.position.y) {
            if(movement.x < 0 && movement.y == 0) {
                this.animation = "attack-westwards"
            } else if(movement.x > 0 && movement.y == 0) {
                this.animation = "attack-eastwards"
            } else if(movement.x == 0 && movement.y < 0) {
                this.animation = "attack-northwards"
            } else if(movement.x == 0 && movement.y > 0) {
                this.animation = "attack-southwards"
            }
            this.game.add("effects", new Effect({
                sprite: new AnimatedSprite({
                    images: DATA.IMAGES.SLASH,
                    isLoop: false,
                    timing: 20,
                }),
                position: {
                    x: this.position.x + movement.x,
                    y: this.position.y + movement.y,
                }
            }))
            movement.x = 0
            movement.y = 0
        }

        // translation
        this.position.x += movement.x
        this.position.y += movement.y
    }
    pursuit() {
          //Variables for the monster and hero positions
       var monX = this.position.x
       var monY = this.position.y
       var adX = this.game.adventurer.position.x 
       var adY = this.game.adventurer.position.y
       var dx = this.game.adventurer.position.x - this.position.x
       var dy = this.game.adventurer.position.y - this.position.y
       //Translate coordinates to movement directions
       if (monX <= adX && (Math.abs(dx) > Math.abs(dy)))  {      
           this.move({x: +1})
       }
       if (monX >= adX && (Math.abs(dx) > Math.abs(dy))) {         
           this.move({x: -1})
       }
       if (monY <= adY && (Math.abs(dy) > Math.abs(dx))) {         
           this.move({y: +1})
       }
       if (monY >= adY && (Math.abs(dy) > Math.abs(dx))) {      
           this.move({y: -1})
       }
   }
    handleAttack(damage) {
        this.health = this.health || 0
        this.health -= damage
        if(this.health <= 0) {
            this.game.remove("monsters", this)
        }
    }
}
