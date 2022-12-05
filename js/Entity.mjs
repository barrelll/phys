class Entity {
  constructor(name) {
    let id = name;
    let table = {};

    this.getId = () => {
      return id;
    };

    this.addComponent = (Component, ...args) => {
      if (!table.hasOwnProperty(Component.name)) {
        let component = new Component(this, ...args);
        table[Component.name] = component;
      }
    };

    this.removeComponent = (Component) => {
      if (table.hasOwnProperty(Component.name)) {
        delete table[Component.name];
      }
    };

    this.getComponent = (Component) => {
      return table[Component.name];
    };

    this.update = () => {
      for (const keys in table) {
        table[keys].update();
      }
    };
  }
}

export { Entity };
