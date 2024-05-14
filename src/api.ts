const random = (size: number) => Math.floor(Math.random() * size);

type Item = {
    start: number;
    timeout: number;
    value: number;
}

export type Tick = {
    index: number;
    value: number;
    time: number;
    delay?: boolean;
}

export class TicksApi {
    private listeners: Record<string, Set<any>> = {};

    items: Item[] = [];

    getItemsCount() {
        return this.items.length;
    }

    public sign(index: number) {
        if (!this.items[index]) {
            const action = () => {
                const value = random(1000);
                const prev = this.items[index]?.start ?? 0;
                const prevValue = this.items[index]?.value ?? 0;
                const now = performance.now();
                const time = (now - prev) - prevValue
                this.trigger('tick', { index, value, time, delay: time > 10 });
                this.items[index] = {
                    start: now,
                    timeout: window.setTimeout(action, value),
                    value,
                };
            };
            action();
        }
    }

    public unSign(index?: number) {
        if (typeof index !== 'number') {
            this.items.forEach((item, index, arr) => {
                if (item?.timeout) {
                    clearTimeout(item.timeout)
                }
            });
            this.items = [];
        }
        else if (this.items[index]) {
            clearTimeout(this.items[index]?.timeout);
            this.items.splice(index, 1);
        }
    }

    public on(event: string, callback: (tick: Tick) => void) {
        this.listeners[event] = this.listeners[event] || new Set();
        this.listeners[event].add(callback);
    }

    public off(event: string, callback?: (tick: Tick) => void) {
        if (callback) {
            this.listeners[event]?.delete(callback);
        } else {
            this.listeners[event]?.clear();
        }
    }

    private trigger(event: 'tick', data: Tick) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((callback: any) => callback(data));
        }
    }
}