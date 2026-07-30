type EventCallback<T = unknown> = (data: T) => void;

class EventBusService {
  private listeners: Map<string, Set<EventCallback>> = new Map();

  /**
   * Publishes an event to all active subscribers.
   * // TODO: Replace with Socket.IO implementation in production backend integration phase.
   */
  publish<T>(event: string, data: T): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  /**
   * Subscribes a listener function to a specific event topic.
   */
  subscribe<T>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const set = this.listeners.get(event)!;
    set.add(callback as EventCallback);

    return () => this.unsubscribe(event, callback as EventCallback);
  }

  /**
   * Unsubscribes a listener callback.
   */
  unsubscribe(event: string, callback: EventCallback): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }
}

export const eventBus = new EventBusService();

export const WORKFLOW_EVENTS = {
  ORDER_PLACED: 'order:placed',
  ORDER_ACCEPTED: 'order:accepted',
  ORDER_REJECTED: 'order:rejected',
  FORWARDED_TO_KITCHEN: 'order:forwarded_to_kitchen',
  PREPARATION_STARTED: 'order:preparation_started',
  PREPARATION_PAUSED: 'order:preparation_paused',
  PREPARATION_RESUMED: 'order:preparation_resumed',
  ORDER_READY: 'order:ready',
  ORDER_COLLECTED: 'order:collected',
};
