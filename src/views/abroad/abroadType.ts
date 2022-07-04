import { baseType } from '@/appType'
import { ListItem } from '../home/HomeType'

export interface AbroadState {
  cardList?: ListItem[]
  tabs?: baseType[]
  tab?: baseType
  countryData?: baseType[]
  continentData: baseType[]
  cardData: baseType
}
