export class OutOfBoundsError extends Error {
  constructor(message = 'Position is out of bounds') {
    super(message);
  }
}

export class PositionAlreadyOccupiedError extends Error {
  constructor(message = 'Position is already occupied') {
    super(message);
  }
}

export class BoardIsFullError extends Error {
  constructor(message = 'Board is full') {
    super(message);
  }
}

export class IllegalStartError extends Error {
  constructor(message = 'Illegal start') {
    super(message);
  }
}

export class DuplicateCardError extends Error {
  constructor(message = 'Card is already in play') {
    super(message);
  }
}

export class IllegalMoveError extends Error {
  constructor(message = 'Illegal move') {
    super(message);
  }
}

export class CardNotFoundError extends Error {
  constructor(message = 'Card not found') {
    super(message);
  }
}

export class InvalidDirectionError extends Error {
  constructor(message = 'Invalid direction') {
    super(message);
  }
}

export class InsufficientLevelRangeError extends Error {
  constructor(
    message = 'Cannot build hand from level range. Allow duplicates or expand range.',
  ) {
    super(message);
  }
}
