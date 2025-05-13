export function getPositionName(positionCode: number | string): string {
    // if string, input to nbr
    const code =
      typeof positionCode === "string"
        ? parseInt(positionCode, 10)
        : positionCode;

    const positions: Record<number, string> = {
      0: "QB",
      1: "HB",
      2: "FB",
      3: "WR",
      4: "TE",
      5: "LT",
      6: "LG", 
      7: "C",
      8: "RG",
      9: "RT",
      10: "LE",
      11: "RE", 
      12: "DT",
      13: "LOLB",
      14: "MLB",
      15: "ROLB",
      16: "CB",
      17: "FS",
      18: "SS",
      19: "K",
      20: "P",
    };
    
    return positions[code] || "Unknown";
  }