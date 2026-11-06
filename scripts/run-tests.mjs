/* Runs every *.test.js under src/ as its own Node process and fails if any
   file exits non-zero. The existing calculator tests are standalone scripts
   that print their own summary and set the exit code. */
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return walk(p)
    return p.endsWith('.test.js') ? [p] : []
  })
}

const files = walk(join(root, 'src')).sort()
let failed = 0
for (const file of files) {
  const rel = relative(root, file)
  console.log(`\n▶ ${rel}`)
  const r = spawnSync(process.execPath, [file], { stdio: 'inherit', cwd: root })
  if (r.status !== 0) {
    failed++
    console.error(`✗ ${rel} exited with ${r.status}`)
  }
}
console.log(`\n${files.length} test files, ${failed} failed`)
process.exit(failed ? 1 : 0)
