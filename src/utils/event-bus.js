export default class EventBus {
  constructor() {
    this.eventTypes = [];
  }

  eventAssembler = (type) => {
    return {
      type,
      listeners: [],
      hasFired: false,
      fireCount: 0,
      lastFireData: {},
    };
  };

  addEventListener = (id, type, fn, options = { fireIfHappened: false }) => {
    let eventType = this.getEventType(type);
    if (!eventType) {
      eventType = this.eventAssembler(type);
      this.eventTypes.push(eventType);
    }

    if (eventType.listeners.some((_) => _.id == id)) return false;

    eventType.listeners.push({ id, fn });
    if (options.fireIfHappened && eventType.hasFired) {
      return this.execListener(fn, { ...(eventType.lastFireData || {}), __eventType: type });
    }
    return true;
  };

  removeEventListener = (id, type) => {
    const eventType = this.getEventType(type);
    if (!eventType) return false;

    const index = eventType.listeners.findIndex((el) => el.id == id);
    if (index < 0) return false;

    eventType.listeners.splice(index, 1);
    return true;
  };

  removeAllEventListeners = (type) => {
    const eventType = this.getEventType(type);
    if (!eventType) return false;

    for (let i = eventType.listeners.length - 1; i >= 0; i--) {
      eventType.listeners.pop();
    }
    return true;
  };

  fireEvent = (type, data) => {
    let eventType = this.getEventType(type);
    if (!eventType) {
      eventType = this.eventAssembler(type);
      this.eventTypes.push(eventType);
    }

    eventType.lastFireData = data;
    eventType.fireCount++;
    eventType.hasFired = true;
    return this.execListeners(eventType, data);
  };

  getEventType = (type) => {
    return this.eventTypes.find((el) => el.type == type);
  };

  reloadEvent = (type) => {
    const eventType = this.getEventType(type);
    if (!eventType) return false;

    eventType.fireCount = 0;
    eventType.hasFired = false;
    return true;
  };

  getListeners = (type) => {
    const eventType = this.getEventType(type);
    if (!eventType) return false;

    return eventType.listeners;
  };

  execListener = async (fn, data) => {
    return (fn && (await fn(data))) || false;
  };

  execListeners = async (eventType, data = {}) => {
    const { type, listeners } = eventType;
    const results = [];
    for (let lIndex = 0; lIndex < listeners.length; lIndex++) {
      const fn = listeners[lIndex].fn;
      const _data = { ...data, __eventType: type };
      const result = await this.execListener(fn, _data);
      results.push(result);
      if (result?.stopListenerProcessing) break;
    }
    return results;
  };
}
