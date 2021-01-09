const cfg = require('./mapConfig')

const mapGenerator = function generateMap() {
    const map = []
    for (let i = 0; i<Math.pow(cfg.map_size,2); i++){
        map.push(0)
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); // случайный индекс от 0 до i

            [array[i], array[j]] = [array[j], array[i]];
        }
        return array
    }

    function addGround(map,ground) {
        for (let i=0; i<ground; i++){
            map.push({
                owner:'World',
                type: 'Ground'
            })
            map.shift()
        }
    }

    addGround(map,cfg.map_ground)
    shuffle(map)

    return map
}

module.exports = mapGenerator