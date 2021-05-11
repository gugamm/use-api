export type Listener = (data: any) => void
export type Unsubscribe = () => void

class SharedStore {
  private dataPerKey: { [K:string]: { data: any, listeners: Listener[] } } = {}

  subscribe(key: string, listener: Listener, initialState: any): Unsubscribe {
    if (this.dataPerKey[key]) {
      this.dataPerKey[key].listeners = [...this.dataPerKey[key].listeners, listener]
    } else {
      this.dataPerKey[key] = {
        data: initialState,
        listeners: [listener]
      }
    }

    return () => {
      this.dataPerKey[key].listeners = this.dataPerKey[key].listeners.filter(l => l !== listener)
    }
  }

  publish(key: string, data: any) {
    if (this.dataPerKey[key]) {
      this.dataPerKey[key].data = data
      this.dataPerKey[key].listeners.forEach(listener => listener(data))
    }
  }

  getState(key: string): any | null {
    if (!this.dataPerKey[key]) {
      return null
    }

    return this.dataPerKey[key].data
  }

  clearState(key: string): void {
    if (this.dataPerKey[key]) {
      delete this.dataPerKey[key]
    }
  }
}

export const sharedStore = new SharedStore()
