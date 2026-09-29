import type { DivisionKey } from "~/content/site";
import type { PageKey } from "~/lib/i18n";

/** Which division a page belongs to — drives the accent colour and the
 *  WhatsApp / call targets in the action bar. */
export function divisionOf(page: PageKey | undefined): DivisionKey | undefined {
  switch (page) {
    case "construction":
    case "plastering":
    case "scaffold":
    case "fabrication":
      return "construction";
    case "apartments":
      return "apartments";
    case "designs":
    case "training":
      return "designs";
    default:
      return undefined;
  }
}
