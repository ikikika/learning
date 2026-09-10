export type GridPoint = {
  gridX: number
  gridY: number
}

export type ScreenPoint = {
  x: number
  y: number
}

export type IsometricGridConfig = {
  /** Horizontal span of one diamond tile in screen pixels */
  tileWidth: number
  /** Vertical span of one diamond tile in screen pixels */
  tileHeight: number
  /** Columns along the grid X axis */
  cols: number
  /** Rows along the grid Y axis */
  rows: number
  /** Screen origin of grid cell (0, 0) */
  originX: number
  originY: number
}
