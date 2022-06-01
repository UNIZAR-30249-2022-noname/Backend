class estadoValidoException extends Error {
    public static WRONG_STATE_MSG =
      'El estado no existe.';
  
    constructor(public message: string) {
      super(message);
      this.name = 'UNKNOWN_STATE';
      this.stack = (<any>new Error()).stack;
    }
  }
  
  export default estadoValidoException;