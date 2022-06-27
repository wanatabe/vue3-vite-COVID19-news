import { App } from 'vue'

type EventShim = {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void
    }
  }
}

export type Install<T> = T & {
  install(app: App): void
} & EventShim

export function install<T>(options: T) {
  (options as Record<string, unknown>).install = (app: App) => {
    const { name } = options as unknown as { name: string }
    app.component(name, options)
  }

  return options as Install<T>
}
