import { createPastPresentFutureSpread } from "../lib/reading-engine";

const spread = createPastPresentFutureSpread();

for (const position of spread.positions) {
  console.log(`## ${position.position} — ${position.symbol}\n`);
  console.log(`${position.reflection}\n`);
}

console.log("## Together\n");
console.log(spread.together);
