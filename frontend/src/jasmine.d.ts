declare namespace jasmine {
  type SpyObj<T> = any;
  function createSpyObj<T = any>(name: string, methodNames: string[], properties?: Record<string, any>): any;
  function createSpy(name?: string): any;
  function objectContaining(obj: Record<string, any>): any;
}
