// pages/drawingboard/drawingboard.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 画笔的配置
   */
  penConfig:{
    color:"#000",
    fontSize:4
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
      wx.getSystemInfo({
        success: (res) => {
          let canvasWidth = (res.screenWidth-10)*2
          let canvasHeight = (res.screenHeight-200)*2
          console.log(canvasHeight)
          
          that.setData({
            canvasWidth:canvasWidth,
            canvasHeight:canvasHeight,
            screenWidth:canvasWidth/2,
            screenHeight:canvasHeight/2
          })

          that.canvasContext=wx.createCanvasContext("myCanvas")
          that.canvasContext.drawImage("/images/bg.jpg",0,0,this.data.screenWidth,this.data.screenHeight)
          // that.canvasContext.drawImage("/images/bg.jpg",0,0,canvasWidth,canvasHeight)
          that.canvasContext.draw()
        },
      })

      this.setData({
        curColor:"#000000",
        curSize:"4"
      })
  },

  /**
   * 开始画笔
   */
  touchStart:function(e){
    //获取当前画笔（手触摸的位置）的x,y坐标
    this.startX = e.changedTouches[0].x
    this.startY = e.changedTouches[0].y

    // console.log("startX: ",this.startX)
    // console.log("startY: ",this.startY)

    //设置画笔
    this.canvasContext.setStrokeStyle(this.penConfig.color)
    this.canvasContext.setLineWidth(this.penConfig.fontSize)
    this.canvasContext.setLineCap('round')
    this.canvasContext.beginPath()
  },

  /**
   * 开始画线条
   */
  touchMove:function(e){
    let tmpX = e.changedTouches[0].x
    let tmpY = e.changedTouches[0].y

    this.canvasContext.moveTo(this.startX,this.startY)
    this.canvasContext.lineTo(tmpX,tmpY)
    this.canvasContext.stroke()

    this.startX=tmpX
    this.startY=tmpY

    //生成到canvas上
    var tmpActions = this.canvasContext.getActions()
    wx.drawCanvas({
      canvasId:'myCanvas',
      reserve:true,
      actions:tmpActions
    })
  },

  /**
   * 画笔的颜色选择
   */
  colorSelect:function(e){
      let color = e.currentTarget.dataset.p
      console.log(color)
      this.penConfig.color=color
      this.setData({
        curColor:color
      })
  },

  /**
   * 画笔的粗细选择
   */
  penSizeSelect:function(e){
    let ps = e.currentTarget.dataset.p
    console.log(ps)
    this.penConfig.fontSize=ps
    this.setData({
      curSize:ps
    })
  },

  /**
   * 清除画布
   */
  clearCanvas: function(){
      let canvasWidth = this.data.canvasWidth
      let canvasHeight = this.data.canvasHeight
      let tmpPenData = this.penConfig
      this.canvasContext.drawImage('/images/bg.jpg',0,0,this.data.screenWidth,this.data.screenHeight)
      this.canvasContext.draw()
      //还原画笔设置
      this.penConfig = tmpPenData
  },

  /**
   * 插入图片
   */
  insertImage:function(){
      var that = this;
      wx.chooseImage({
        count: 1,
        sourceType:['album','camera'],
        sizeType:['original'],
        success:res=>{
          var tmpFilePaths = res.tempFilePaths;
          console.log("res: ",res)
          console.log("tmpFilePaths: ",tmpFilePaths)
          that.setData({
            imageUrl:tmpFilePaths[0]
          })


          wx.getImageInfo({
            src: this.data.imageUrl,
            success:data => {
              var imgWidth = data.width;
              var imgHeight = data.height;
              that.setData({
                imgWidth:imgWidth,
                imgHeight:imgHeight
              })
            }
          })

          let canvasWidth = this.data.canvasWidth
          let canvasHeight = this.data.canvasHeight
          let imgWidth = this.data.imgWidth
          let imgHeight = this.data.imgHeight
          let screenWidth = this.data.screenWidth
          let screenHeight = this.data.screenHeight
          console.log("data: ",this.data)
          console.log("img: ",imgWidth,imgHeight)
          console.log("canvas: ",canvasWidth,canvasHeight)
          console.log("screen: ",screenWidth,screenHeight)

          if(imgWidth <= screenWidth && imgHeight <= screenHeight){
            this.canvasContext.drawImage(this.data.imageUrl,0,0,imgWidth,imgHeight,0,0,imgWidth,imgHeight)
          }else{
             this.canvasContext.drawImage(this.data.imageUrl,0,0,imgWidth,imgHeight,0,0,this.data.screenWidth,this.data.screenHeight)
          }
          this.canvasContext.draw()
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})