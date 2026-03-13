import { config as tamaguiConfig } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

export const config = createTamagui(tamaguiConfig)

export default config

export type Conf = typeof config

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf { }
}