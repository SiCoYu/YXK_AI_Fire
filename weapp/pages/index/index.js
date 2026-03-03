// 24帧序列帧数据：每帧定义各烟雾粒子的状态
const TOTAL_FRAMES = 24
const SMOKE_PARTICLES = 6

// 预计算24帧烟雾粒子数据
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
    // 火星：ember脉动
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
    const query = wx.createSelectorQuery()
    query.select('#incenseCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0]) return
      const canvas = res[0].node
      const dpr = wx.getSystemInfoSync().pixelRatio
      const w = res[0].width
      const h = res[0].height
      canvas.width = w * dpr
      canvas.height = h * dpr
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      this._ctx = ctx
      this._w = w
      this._h = h
      this._emberY = h * 0.48
      this._frameData = buildFrames(w, h, this._emberY)
      this._drawFrame(0)
    })
  },

  _drawFrame(frameIdx) {
    const ctx = this._ctx
    const w = this._w
    const h = this._h
    const emberY = this._emberY
    if (!ctx) return

    const frame = this._frameData[frameIdx]
    ctx.clearRect(0, 0, w, h)

    const cx = w / 2

    // ── 香柱（深棕色细杆）──
    ctx.save()
    ctx.strokeStyle = '#5C3317'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx, h - 8)
    ctx.lineTo(cx, emberY + 14)
    ctx.stroke()
    ctx.restore()

    // ── 燃烬灰白段 ──
    ctx.save()
    ctx.strokeStyle = '#BBBBBB'
    ctx.lineWidth = 5
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(cx, emberY + 14)
    ctx.lineTo(cx, emberY)
    ctx.stroke()
    ctx.restore()

    // ── 炭火：橙红渐变光晕 ──
    const glowR = 10 * frame.pulse
    const grd = ctx.createRadialGradient(cx, emberY, 0, cx, emberY, glowR * 2.5)
    grd.addColorStop(0, `rgba(255, 200, 30, ${0.95 * frame.pulse})`)
    grd.addColorStop(0.4, `rgba(255, 80, 0, ${0.7 * frame.pulse})`)
    grd.addColorStop(1, 'rgba(200, 0, 0, 0)')
    ctx.save()
    ctx.fillStyle = grd
    ctx.beginPath()
    ctx.arc(cx, emberY, glowR * 2.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // ── 烟雾粒子（6个，圆形渐变） ──
    frame.particles.forEach((p) => {
      if (p.alpha <= 0) return
      const sg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
      sg.addColorStop(0, `rgba(190, 190, 190, ${p.alpha})`)
      sg.addColorStop(1, `rgba(190, 190, 190, 0)`)
      ctx.save()
      ctx.fillStyle = sg
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    })
  },

  onIncense() {
    if (this.data.isPlaying) {
      clearInterval(this._timer)
      this._timer = null
      this.setData({ isPlaying: false })
      // 停止后回到第0帧静止画面
      this._drawFrame(0)
    } else {
      this.setData({ isPlaying: true })
      this._timer = setInterval(() => {
        this._frame = (this._frame + 1) % TOTAL_FRAMES
        this._drawFrame(this._frame)
      }, 1000 / 12) // 12fps，循环24帧 = 2秒一个周期
    }
  },

  onOffering() {
    wx.showToast({ title: '上供', icon: 'none' })
  },

  onDrum() {
    wx.showToast({ title: '敲鼓', icon: 'none' })
  },

  onUnload() {
    if (this._timer) clearInterval(this._timer)
  }
})
