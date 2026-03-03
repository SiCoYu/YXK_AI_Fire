Page({
  data: {
    text: 'hello'
  },
  onIncense() {
    wx.showToast({ title: '上香', icon: 'none' })
  },
  onOffering() {
    wx.showToast({ title: '上供', icon: 'none' })
  },
  onDrum() {
    wx.showToast({ title: '敲鼓', icon: 'none' })
  }
})
