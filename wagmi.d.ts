import { type Config } from 'wagmi'

declare module 'wagmi' {
  interface Register {
    config: Config  // or typeof config if you export config from here
  }
}
