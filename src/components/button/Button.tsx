import { install } from 'pkg/install'
import { defineComponent, type ExtractPropTypes } from 'vue'

const buttonProps = {
  text: String,
  buttonClass: String,
  textClass: String
}

export type ButtonProps = ExtractPropTypes<typeof buttonProps>

export const button = defineComponent({
  name: 'VButton',
  props: buttonProps,
  setup(props, { emit }) {
    /** 点击事件 */
    const click = (e: MouseEvent) => {
      e.preventDefault()
      emit('onClick', e)
    }
    return () => {
      const { text, buttonClass, textClass } = props
      return (
        <div onClick={click} class={['defaultButton', buttonClass]}>
          <div class={textClass}>
            <span>{text}</span>
          </div>
        </div>
      )
    }
  }
})

const Button = install(button)

export default Button
