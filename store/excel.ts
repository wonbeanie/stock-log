import { excelData } from "@/lib/excel";
import { atomWithStorage } from "jotai/utils";

export const excelDatAtom = atomWithStorage<excelData[]>(
  "EXCEL_DATA", [], undefined, { getOnInit: true }
);
export const lastHashAtom = atomWithStorage<string>(
  "LAST_HASH", '', undefined, { getOnInit: true }
);