export abstract class UtilDate {
  /** 04/02/2026 */
  public static formatToFrString(dateString: string) {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }
}
