import { install } from 'pkg/install'
import { defineComponent, ExtractPropTypes, InputHTMLAttributes, nextTick, PropType, ref, VueElement } from 'vue'

export type InputType = 'text' | 'password'

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target: T
}

const inputProps = () => ({
  id: String,
  name: String,
  type: String as PropType<InputType>,
  placeholder: String,
  class: String,
  value: String,
  disabled: {
    type: Boolean,
    default: null
  },
  readonly: {
    type: Boolean,
    default: null
  }
})

export type InputProps = ExtractPropTypes<typeof inputProps>

export const input = defineComponent({
  name: 'VInput',
  props: inputProps(),

  setup(props, { emit }) {
    const inputRef = ref<HTMLInputElement>()
    const createIcon = (type: 'prefix' | 'suffix') => {
      return <div></div>
    }
    const clearInputValue = () => {
      if (inputRef.value?.getAttribute('type') === 'password' && inputRef.value.hasAttribute('value')) {
        inputRef.value.removeAttribute('value')
      }
    }

    const onBlur = (event: FocusEvent) => {
      emit('onBlur', event)
      nextTick(clearInputValue)
    }
    const onFocus = (event: FocusEvent) => {
      emit('onFocus', event)
      nextTick(clearInputValue)
    }
    const onChange = (event: HTMLElementEvent<HTMLInputElement>): void => {
      emit('onChange', event)
      nextTick(clearInputValue)
    }
    const onInput = (event: HTMLElementEvent<HTMLInputElement>) => {
      emit('onInput', event)
      nextTick(clearInputValue)
    }

    const onKeydown = (event: KeyboardEvent) => {
      const key = event.keyCode || event.key
      if (key.toString() === '13') {
        emit('onKeydown', event)
        nextTick(clearInputValue)
      }
    }

    const inputEvent = {
      onBlur,
      onFocus,
      onChange,
      onKeydown,
      onInput
    } as InputHTMLAttributes

    return () => {
      return (
        <div class={['fsy-input', props.class]}>
          {/* {props.prefix && createIcon('prefix')} */}
          <input {...props} {...inputEvent} ref={inputRef} />
          {/* {props.suffix && createIcon('suffix')} */}
        </div>
      )
    }
  }
})

const Input = install(input)
export default Input
