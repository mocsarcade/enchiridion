export default class Camera {
    constructor(camera = new Object()) {
        this.position = camera.position || {x: 0, y: 0}
    }
    lookAt(entity) {
        this.position.x = entity.position.x + ((entity.width || 1) / 2)
        this.position.y = entity.position.y + ((entity.height || 1) / 2)
    }
}
