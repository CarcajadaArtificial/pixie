export interface Size {
  width: number;
  height: number;
  /**
   * The result of width/height.
   * * =1 means it is a sqare.
   * * >1 means it is a horizontal rectange.
   * * <1 means it is a vertical rectange.
   */
  ratio: number;
  /**
   * This number represents the difference between a recommended ratio and the comparing ratio.
   * * -1 means it is the comparing ratio.
   * * 0 means it is a perfect match
   * * >0 means the percentage of difference between the two ratios.
   */
  difference: number;
}
