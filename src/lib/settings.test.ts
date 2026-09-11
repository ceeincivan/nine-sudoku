import assert from "node:assert";
import { test } from "node:test";
import { useSettings } from "./settings.ts";

test("useSettings store updates state correctly", () => {
  const store = useSettings.getState();
  assert.strictEqual(typeof store.ink, "string");
  assert.strictEqual(typeof store.theme, "string");
  assert.strictEqual(typeof store.haptics, "boolean");

  store.setInk("mono");
  assert.strictEqual(useSettings.getState().ink, "mono");

  store.setTheme("light");
  assert.strictEqual(useSettings.getState().theme, "light");

  store.setHaptics(false);
  assert.strictEqual(useSettings.getState().haptics, false);
});
