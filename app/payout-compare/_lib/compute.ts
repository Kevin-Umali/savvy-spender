import type { PayoutPlatform, PayoutResult } from "./types";

/**
 * Net PHP a PH freelancer actually receives for a foreign payout, after the
 * platform's receiving fee, FX markup, and cash-out fee.
 */
export function computeNet(
  platform: PayoutPlatform,
  gross: number,
  phpPerUnit: number
): PayoutResult {
  const grossPhpMid = gross * phpPerUnit;

  const receiveFeeForeign = gross * (platform.receivePct / 100) + platform.receiveFixed;
  const afterReceiveForeign = Math.max(0, gross - receiveFeeForeign);

  const phpMid = afterReceiveForeign * phpPerUnit;
  const afterFx = phpMid * (1 - platform.fxMarkupPct / 100);
  const fxCostPhp = phpMid - afterFx;

  const withdrawFeePhp = afterFx * (platform.withdrawPct / 100) + platform.withdrawFixedPhp;
  const netPhp = Math.max(0, afterFx - withdrawFeePhp);

  const totalFeePhp = grossPhpMid - netPhp;
  const effectiveCostPct = grossPhpMid > 0 ? (totalFeePhp / grossPhpMid) * 100 : 0;

  return {
    platform,
    grossPhpMid,
    receiveFeeForeign,
    fxCostPhp,
    withdrawFeePhp,
    netPhp,
    totalFeePhp,
    effectiveCostPct,
  };
}
