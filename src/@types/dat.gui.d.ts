declare module 'dat.gui' {
    export class GUI {
      add(object: any, property: string, min?: number, max?: number, step?: number): any;
      addFolder(name: string): any;
      destroy(): void;
    }
  }