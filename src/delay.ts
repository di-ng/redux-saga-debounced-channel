
// Same as redux-saga's delay function, but since the API changed from v0 to v1 of redux-saga, we
// just rewrite it here.
export default function delay(ms: number, val: any = true): Promise<any> {
  return new Promise(resolve => {
    setTimeout(resolve, ms, val);
  });
}
