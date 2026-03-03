const TOTAL_FRAMES = 24
const SMOKE_PARTICLES = 6

function buildFrames(w, h, emberY) {
  const frames = []
  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const particles = []
    for (let i = 0; i < SMOKE_PARTICLES; i++) {
      const phase = (f + i * (TOTAL_FRAMES / SMOKE_PARTICLES)) % TOTAL_FRAMES
      const progress = phase / TOTAL_FRAMES
      const y = emberY - progress * (emberY - 16)
      const wave = Math.sin(progress * Math.PI * 4 + i * 1.3) * 22 * progress
      const alpha = (1 - progress) * 0.5
      const radius = 3 + progress * 18
      particles.push({ x: w / 2 + wave, y, alpha, radius })
    }
    const pulse = Math.sin((f / TOTAL_FRAMES) * Math.PI * 2) * 0.35 + 0.75
    frames.push({ particles, pulse })
  }
  return frames
}

Page({
  data: {
    text: 'hello',
    isPlaying: false
  },

  _frame: 0,
  _timer: null,
  _ctx: null,
  _w: 0,
  _h: 0,
  _emberY: 0,
  _frameData: null,

  onReady() {
    const ctx = tt.createCanvasContext('incenseCanvas', this)
    // 抖音使用旧版 canvas API，尺寸单位 px（按 rpx 换算 200rpx≈100px，360rpx≈180px）
    const dpr = tt.getSystemInfoSync().pixelRatio || 2
    const w = 100
    const h = 180
    this._ctx = ctx
    this._w = w
    this._h = h
    this._emberY = h * 0.48
    this._frameData = buildFrames(w, h, this._emberY)
    this._drawFrame(0)
  },

  _drawFrame(frameIdx) {
    const ctx = this._ctx
    const w = this._w
    const h = this._h
    const emberY = this._emberY
    if (!ctx) return

    const frame = this._frameData[frameIdx]
    const cx = w / 2

    ctx.clearRect(0, 0, w, h)

    // 香柱
    ctx.strokeStyle = '#5C3317'
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx, h - 4)
    ctx.lineTo(cx, emberY + 7)
    ctx.stroke()

    // 灰白燃烬段
    ctx.strokeStyle = '#BBBBBB'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(cx, emberY + 7)
    ctx.lineTo(cx, emberY)
    ctx.stroke()

    // 炭火光晕
    const glowR = 5 * frame.pulse
    const grd = ctx.createRadialGradient(cx, emberY, 0, cx, emberY, glowR * 2.5)
    grd.addColorStop(0, `rgba(255,200,30,${(0.95 * frame.pulse).toFixed(2)})`)
    grd.addColorStop(0.4, `rgba(255,80,0,${(0.7 * frame.pulse).toFixed(2)})`)
    grd.addColorStop(1, 'rgba(200,0,0,0)')
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.arc(cx, emberY, glowR * 2.5, 0, Math.PI * 2)
    ctx.fill()

    // 烟雾粒子
    frame.particles.forEach((p) => {
      if (p.alpha <= 0) return
      const sg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
      sg.addColorStop(0, `rgba(190,190,190,${p.alpha.toFixed(2)})`)
      sg.addColorStop(1, 'rgba(190,190,190,0)')
      ctx.fillStyle = sg
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
    })

    ctx.draw()
  },

  onIncense() {
    if (this.data.isPlaying) {
      clearInterval(this._timer)
      this._timer = null
      this.setData({ isPlaying: false })
      this._drawFrame(0)
    } else {
      this.setData({ isPlaying: true })
      this._timer = setInterval(() => {
        this._frame = (this._frame + 1) % TOTAL_FRAMES
        this._drawFrame(this._frame)
      }, 1000 / 12)
    }
  },

  onOffering() {
    tt.showToast({ title: '上供', icon: 'none' })
  },

  onDrum() {
    tt.showToast({ title: '敲鼓', icon: 'none' })
  },

  onUnload() {
    if (this._timer) clearInterval(this._timer)
  }
})
