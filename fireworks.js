import FireworksCanvas from 'fireworks-canvas'

const container = document.getElementById('fireworks')
const _fireworks = new FireworksCanvas(container)

export function fireworks() {
  _fireworks.start()
  setTimeout(() => _fireworks.stop(), 3_000)
}

