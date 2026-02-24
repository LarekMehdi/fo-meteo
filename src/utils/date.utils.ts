export abstract class UtilDate {
  /** 04/02/2026 */
  public static formatToFrString(dateString: string) {
    return new Date(dateString).toLocaleDateString('fr-FR');
  }

  /** jeudi 5 févr. **/
  public static formatToFrFullName(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'short' });
  }

  public static isCurrentHour(time: string): boolean {
    const now = new Date();
    const hourDate = new Date(time);

    return (
      now.getFullYear() === hourDate.getFullYear() &&
      now.getMonth() === hourDate.getMonth() &&
      now.getDate() === hourDate.getDate() &&
      now.getHours() === hourDate.getHours()
    );
  }
}
