import { install } from 'pkg/install'
import { baseType } from '@/appType'
import { defineComponent, ExtractPropTypes, PropType } from 'vue'

const selectProps = {
  classNames: String,
  width: String,
  height: String,
  optionData: Array as PropType<Array<baseType>>,
  option: {
    type: Object as PropType<baseType>,
    default: {
      key: 'id',
      value: 'value'
    }
  }
}

const select = defineComponent({
  name: 'VSelect',
  props: selectProps,
  setup(props) {
    const selectedMethod = (e: Event) => {
      console.log('e :>> ', e)
      console.log('e.target :>> ', e.target)
    }
    return () => {
      const {
        optionData,
        option: { key, value },
        width,
        height,
        classNames
      } = props

      return (
        <div class={['select', classNames]} style={{ width, height }}>
          <select onChange={selectedMethod}>
            {optionData &&
              optionData.map((item) => {
                return <option value={item[key]}>{item[value]}</option>
              })}
          </select>
        </div>
      )
    }
  }
})

const Select = install(select)
export type SelectProps = ExtractPropTypes<typeof selectProps>
export default Select
