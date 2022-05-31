class ReservaException extends Error {
  public static WRONG_RESERVE_MSG =
    'Parámetros incorrectos, reserva no realizable.';

  constructor(public message: string) {
    super(message);
    this.name = 'WrongCreationParameters';
    this.stack = (<any>new Error()).stack;
  }
}

export default ReservaException;
