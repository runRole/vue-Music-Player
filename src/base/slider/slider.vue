 <template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item, index) in dots" :class="{active:currentPageIndex === index}"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll'
  import {addClass} from 'common/js/dom'
  export default {
    data () {
      return {
        dots: [],
        currentPageIndex: 0
      }
    },
    props: {
      loop: {
        type: Boolean,
        default: true
      },
      autoPlay: {
        type: Boolean,
        default: true
      },
      interval: {
        type: Number,
        default: 4000
      }
    },
    mounted () {
      setTimeout(() => {
        this._setSilderWidth()
        this._initDots()
        this._initSlider()
        if (this.autoPlay) {
            this._play()
        }
      }, 20)
      window.addEventListener('resize', () => {
        if (!this.slider) {
          return
        }
        this._setSilderWidth(true)
        this.slider.refresh()
    })
    },
    methods: {
      _setSilderWidth (isResize) {
          this.children = this.$refs.sliderGroup.children
          let width = 0
          let sliderWidth = this.$refs.slider.clientWidth
          for (let i = 0; i < this.children.length; i++) {
              let child = this.children[i]
              addClass(child, 'slider-item')
              child.style.width = sliderWidth + 'px'
              width += sliderWidth
        }

        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _play () {
          let pageIndex = this.currentPageIndex + 1
          if (this.loop) {
            pageIndex += 1
          }
          this.timer = setTimeout(() => {
              this.slider.goToPage(pageIndex, 0, 400)
          }, this.interval)
      },
      _initDots () {
        this.dots = new Array(this.children.length)
      },
      _initSlider () {
          this.slider = new BScroll(this.$refs.slider, {
              scrollX: true,
              scrollY: false,
              momentum: false,
              // ***配置:在better-scroll版本0.1.15以前可用以下参数进行slide配置，但1.0.0版本以上需按照未注释前的方法使用***/
              // snap: true, // slide组件
              // snapLoop: this.loop, // 循环
              // snapThreshold: 0.3, //
              // snapSpeed: 400
              snap: {
                loop: this.loop,
                threshold: 0.3,
                speed: 400
              }
              // click 会与fastclick中的click冲突
              // click: true
          })
        this.slider.on('scrollEnd', () => {
            // 参考文档 https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/api-specific.html#getcurrentpage
              let pageIndex = this.slider.getCurrentPage().pageX
             if (this.loop) {
               pageIndex -= 1 // 因为设置自动播放之后，会自动在左右两侧copy两个子元素，所以在设置pageIndex时应减一
             }
              this.currentPageIndex = pageIndex
             if (this.autoPlay) {
                this._play()
             }
           })
           // 参考文档 https://ustbhuangyi.github.io/better-scroll/doc/zh-hans/events.html#beforescrollstart
           this.slider.on('beforeScrollStart', () => {
             if (this.autoPlay) {
                clearTimeout(this.timer)
             }
           })
          }
    },
    destroyed () {
      clearTimeout(this.timer)
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>