const sleep = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

export { sleep };
