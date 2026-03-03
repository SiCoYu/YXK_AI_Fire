Page({
  data: {
    text: 'hello'
  },
  onIncense() {
    tt.showToast({ title: '上香', icon: 'none' })
  },
  onOffering() {
    tt.showToast({ title: '上供', icon: 'none' })
  },
  onDrum() {
    tt.showToast({ title: '敲鼓', icon: 'none' })
  }
})
