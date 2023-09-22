import translation from './en.json'
import { defineTranslation, setTranslation } from '.'

const locale = defineTranslation({
  lang: 'en',
  translation,
})

setTranslation(locale)

export default locale
