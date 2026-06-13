import { IAP, loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-framework';

export const AD_FREE_SKU = 'ait.0000022728.6f110e23.520faa57b1.8221815713';
export const AD_FREE_KEY = 'lunchroulette_ad_free';

export function isAdFree(): boolean {
  return localStorage.getItem(AD_FREE_KEY) === 'true';
}

export async function restoreAdFree(onUnlocked: () => void) {
  if (isAdFree()) { onUnlocked(); return; }
  try {
    const res = await IAP.getCompletedOrRefundedOrders();
    if (res?.orders.some(o => o.status === 'COMPLETED' && o.sku === AD_FREE_SKU)) {
      localStorage.setItem(AD_FREE_KEY, 'true');
      onUnlocked();
    }
  } catch {}
}

export function buyAdFree(onSuccess: () => void, onDone: () => void) {
  const cleanup = IAP.createOneTimePurchaseOrder({
    options: {
      sku: AD_FREE_SKU,
      processProductGrant: async () => {
        try { localStorage.setItem(AD_FREE_KEY, 'true'); onSuccess(); return true; }
        catch { return false; }
      },
    },
    onEvent: () => { cleanup(); onDone(); },
    onError: () => { cleanup(); onDone(); },
  });
}

export const INTERSTITIAL_AD_ID = 'ait.v2.live.49d62eb4399c4c43';
export const REWARDED_AD_ID = 'ait.v2.live.1375c26153aa4915';

// 전면/리워드 풀스크린 광고가 동시에 뜨지 않도록 (스택 방지)
let adInFlight = false;

export function showInterstitialAd(): Promise<void> {
  return new Promise((resolve) => {
    if (adInFlight || !loadFullScreenAd.isSupported()) { resolve(); return; }
    adInFlight = true;
    const finish = () => { adInFlight = false; resolve(); };
    const cleanup = loadFullScreenAd({
      options: { adGroupId: INTERSTITIAL_AD_ID },
      onEvent: (event) => {
        if (event.type === 'loaded') {
          showFullScreenAd({
            options: { adGroupId: INTERSTITIAL_AD_ID },
            onEvent: (e) => {
              if (e.type === 'dismissed') finish();
            },
            onError: () => finish(),
          });
        }
      },
      onError: () => finish(),
    });
    setTimeout(() => { cleanup(); finish(); }, 10000);
  });
}

export function isRewardedSupported(): boolean {
  return loadFullScreenAd.isSupported();
}

// 리워드 광고: 광고를 보여주되 끝나면(적립/닫힘 무관) resolve. best-effort.
export function showRewardedAd(): Promise<boolean> {
  return new Promise((resolve) => {
    if (adInFlight || !loadFullScreenAd.isSupported()) { resolve(false); return; }
    adInFlight = true;
    let settled = false;
    const timer: { id?: ReturnType<typeof setTimeout> } = {};
    const done = (c: () => void, result: boolean) => {
      if (settled) return;
      settled = true;
      adInFlight = false;
      clearTimeout(timer.id);
      c();
      resolve(result);
    };
    const cleanup = loadFullScreenAd({
      options: { adGroupId: REWARDED_AD_ID },
      onEvent: (event) => {
        if (event.type === 'loaded') {
          showFullScreenAd({
            options: { adGroupId: REWARDED_AD_ID },
            onEvent: (e) => {
              if (e.type === 'userEarnedReward') done(cleanup, true);
              else if (e.type === 'dismissed') done(cleanup, true);
            },
            onError: () => done(cleanup, false),
          });
        }
      },
      onError: () => done(cleanup, false),
    });
    timer.id = setTimeout(() => done(cleanup, false), 30000);
  });
}
