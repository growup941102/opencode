import { run as runTui, type TuiInput } from "@self-opencode/tui"
import { Global } from "@self-opencode/core/global"
import { Effect } from "effect"

export function run(input: TuiInput) {
  return runTui(input).pipe(Effect.provide(Global.defaultLayer))
}
