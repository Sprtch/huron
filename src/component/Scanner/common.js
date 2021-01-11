import { ScannerType, ScannerMode } from "../../models/Scanner";

export const typeName = (x) => {
  switch (x) {
    case ScannerType.Undefined:
      return "Undefined";
    case ScannerType.Debug:
      return "'Debug'";
    case ScannerType.Testing:
      return "'testing'";
    case ScannerType.Serial:
      return "'Serial'";
    case ScannerType.USB:
      return "'USB'";
  }
};

export const modeName = (x) => {
  switch (x) {
    case ScannerMode.Print:
      return "Print mode";
    case ScannerMode.Inventory:
      return "Inventory mode";
    default:
      return "Undefined";
  }
};
