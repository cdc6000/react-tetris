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

  addEventListener = async (id, type, fn, options = { fireIfHappened: false }) => {
    const eventType = this.getEventType(type);
    if (!eventType) {
      const newEventType = this.eventAssembler(type);
      newEventType.listeners.push({ id, fn });
      this.eventTypes.push(newEventType);
    } else {
      eventType.listeners.push({ id, fn });
      if (options.fireIfHappened && eventType.hasFired) {
        fn && (await fn(eventType.lastFireData));
      }
    }
  };

  removeEventListener = (id, type) => {
    const eventType = this.getEventType(type);
    if (!eventType) return;

    const index = eventType.listeners.findIndex((el) => el.id == id);
    if (index < 0) return;

    eventType.listeners.splice(index, 1);
  };

  removeAllEventListeners = (type) => {
    const eventType = this.getEventType(type);
    if (!eventType) return;

    eventType.listeners = [];
  };

  fireEvent = async (type, data) => {
    const eventType = this.getEventType(type);
    if (!eventType) {
      const newEventType = this.eventAssembler(type);
      newEventType.fireCount++;
      newEventType.hasFired = true;
      newEventType.lastFireData = data;
      this.eventTypes.push(newEventType);
      return false;
    } else {
      eventType.lastFireData = data;
      let result;
      for (let lIndex = 0; lIndex < eventType.listeners.length; lIndex++) {
        const fn = eventType.listeners[lIndex].fn;
        result = fn && (await fn(data));
      }

      eventType.fireCount++;
      eventType.hasFired = true;

      return result;
    }
  };

  getEventType = (type) => {
    return this.eventTypes.find((el) => el.type == type);
  };

  reloadEvent = async (type) => {
    const eventType = this.getEventType(type);
    if (!eventType) return;

    eventType.fireCount = 0;
    eventType.hasFired = false;
  };
}
