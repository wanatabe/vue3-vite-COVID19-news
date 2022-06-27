import { defineComponent, ExtractPropTypes, PropType } from 'vue'
import { install } from 'pkg/install'

export interface CardOption {
  key: string
  value: string
}

const cardProps = {
  add: Boolean,
  cut: Boolean,
  data: {
    type: Object,
    default: {}
  },
  option: {
    type: Object as PropType<CardOption>,
    default: {
      key: 'id',
      value: 'value'
    }
  }
}

export type CardProps = ExtractPropTypes<typeof cardProps>

const card = defineComponent({
  name: 'VCard',
  props: cardProps,
  setup(props, {slots}) {
    return () => {
      const { add, cut, data, option } = props
      const { key, value } = option || {}
      return (
        <div class={['card']}>
          <div class={['subText']}>
            <p>
              {add && <span>+</span>}
              {cut && <span>-</span>}
              <span>{data[value]}</span>
            </p>
            <p>{data[key]}</p>
          </div>
        </div>
      )
    }
  }
})

const Card = install(card)
export default Card