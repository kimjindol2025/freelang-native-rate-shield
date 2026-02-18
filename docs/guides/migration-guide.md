# Migration Guide: v1.x → v2.x

## Overview

This guide helps migrate existing FreeLang v1 projects to FreeLang v2.

**Scope**: Breaking changes, new features, deprecations
**Duration**: 30 minutes to 2 hours (depending on project size)

---

## Key Changes

### Version Numbers
```
v1.x (deprecated)   →   v2.x (current)
```

**Release Date**: 2026-02-18
**Support**: v1.x receives only security updates

---

## Breaking Changes

### 1. Type System Enhancements

#### v1 (Old)
```freelang
fn add(a, b) {
  return a + b
}

const result = add(5, 3)  // Type unknown
```

#### v2 (New)
```freelang
fn add(a: number, b: number): number {
  return a + b
}

const result: number = add(5, 3)  // Type explicit
```

**Migration**: Add type annotations to function parameters and return types.

---

### 2. Struct Syntax

#### v1 (Old)
```freelang
const User = {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
}
```

#### v2 (New)
```freelang
struct User {
  id: number,
  name: string,
  email: string
}

const user = User {
  id: 1,
  name: "Alice",
  email: "alice@example.com"
}
```

**Migration**: Replace object literals with `struct` definitions for data models.

---

### 3. Module System

#### v1 (Old)
```freelang
const utils = require("./utils")
module.exports = { add, subtract }
```

#### v2 (New)
```freelang
import { add, subtract } from "./utils.free"
export { add, subtract }
```

**Migration**: Replace `require/module.exports` with `import/export`.

---

### 4. Error Handling

#### v1 (Old)
```freelang
try {
  const result = riskyOperation()
} catch (error) {
  console.error(error)
}
```

#### v2 (New)
```freelang
try {
  const result: Result = riskyOperation()
} catch (error: Error) {
  console.error(`Error: ${error.message}`)
}
```

**Migration**: Add type annotations to error variables.

---

### 5. Array/Map Operations

#### v1 (Old)
```freelang
const numbers = [1, 2, 3, 4, 5]
const doubled = numbers.map(x => x * 2)
```

#### v2 (New)
```freelang
const numbers: number[] = [1, 2, 3, 4, 5]
const doubled: number[] = map(numbers, x => x * 2)
```

**Migration**: Use stdlib functions instead of methods. Import from `@freelang/collections`.

---

## New Features in v2

### 1. SmartREPL with 109+ Functions

**New**: Interactive REPL with advanced features
```bash
freelang repl
> const arr = [1, 2, 3, 4, 5]
> map(arr, x => x * 2)
[2, 4, 6, 8, 10]
> .type arr
number[]
```

---

### 2. Type Inference Cache (3-5x speedup)

v2 automatically caches type checking results.
```freelang
// v2 detects repeated patterns and speeds up
for (let i = 0; i < 1000000; i++) {
  // Type checking cached after first iteration
  processNumber(numbers[i])
}
```

**Benefit**: Automatic, no code changes needed.

---

### 3. Optimized Collections

v2 includes optimized implementations:
- Dynamic arrays (growth factor 1.5x vs 2.0x)
- HashMap with FNV-1a hashing
- Set operations
- Tree-based collections

```freelang
import { HashMap, Set } from "@freelang/collections"

const map = new HashMap()
const set = new Set([1, 2, 3])
```

---

### 4. Memory Allocator

v2 includes object pooling:
```freelang
import { MemoryAllocator } from "@freelang/memory"

const allocator = new MemoryAllocator(1000)
const obj = allocator.acquire()
// Use obj...
allocator.release(obj)  // Reuse
```

**Benefit**: 80-90% GC reduction.

---

### 5. Async/Await Support

```freelang
async fn fetchData(url: string): Promise<object> {
  const response = await fetch(url)
  return await response.json()
}

const data = await fetchData("https://api.example.com/data")
```

---

### 6. Better Error Messages

#### v1 (Old)
```
Error at line 5: Type mismatch
```

#### v2 (New)
```
Error at line 5, column 12:
  Type mismatch in function call
  Expected: number
  Got: string

  Suggestion: Use parseInt() to convert string to number

  Code:
    5:  const result = add("5", 3)
                           ^^^
```

---

### 7. Zero-Copy Tokenization

v1 allocated substrings during parsing.
v2 uses token offsets (30% memory reduction).

**No code changes** - automatic improvement.

---

## Migration Checklist

### Phase 1: Preparation (15 min)
- [ ] Back up v1 project
- [ ] Audit current code (run `freelang analyze`)
- [ ] Document custom libraries
- [ ] Check test coverage

### Phase 2: Syntax Updates (30 min)
- [ ] Replace `require` → `import`
- [ ] Replace `module.exports` → `export`
- [ ] Replace object literals → `struct`
- [ ] Add type annotations to functions
- [ ] Update error handling

### Phase 3: API Updates (30 min)
- [ ] Replace `.map()` → `map()` from stdlib
- [ ] Replace `.filter()` → `filter()` from stdlib
- [ ] Update collection usage
- [ ] Test array operations

### Phase 4: Testing (30 min)
- [ ] Run test suite: `freelang test`
- [ ] Check type checking: `freelang analyze --strict`
- [ ] Profile performance: `freelang run --profile`
- [ ] Update tests for new APIs

### Phase 5: Deployment (15 min)
- [ ] Build: `freelang build --production`
- [ ] Verify: `freelang test --coverage`
- [ ] Deploy to staging
- [ ] Smoke tests in staging
- [ ] Deploy to production

---

## Common Migration Patterns

### Pattern 1: Function Exports

**v1:**
```freelang
const utils = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
}

module.exports = utils
```

**v2:**
```freelang
export fn add(a: number, b: number): number {
  return a + b
}

export fn subtract(a: number, b: number): number {
  return a - b
}
```

---

### Pattern 2: Data Models

**v1:**
```freelang
const createUser = (id, name, email) => ({
  id, name, email, createdAt: new Date()
})
```

**v2:**
```freelang
struct User {
  id: number,
  name: string,
  email: string,
  createdAt: string
}

fn createUser(id: number, name: string, email: string): User {
  return User {
    id: id,
    name: name,
    email: email,
    createdAt: now()
  }
}
```

---

### Pattern 3: Array Processing

**v1:**
```freelang
const numbers = [1, 2, 3]
const doubled = numbers.map(x => x * 2)
const filtered = doubled.filter(x => x > 2)
```

**v2:**
```freelang
import { map, filter } from "@freelang/collections"

const numbers: number[] = [1, 2, 3]
const doubled = map(numbers, x => x * 2)
const filtered = filter(doubled, x => x > 2)
```

---

### Pattern 4: Error Handling

**v1:**
```freelang
try {
  const data = JSON.parse(jsonString)
} catch (e) {
  console.error(e)
}
```

**v2:**
```freelang
try {
  const data: object = json.parse(jsonString)
} catch (error: Error) {
  console.error(`Parse error: ${error.message}`)
}
```

---

## Performance Improvements Expected

| Operation | v1 | v2 | Improvement |
|-----------|-----|-----|-------------|
| Type Checking | baseline | 3-5x faster (cached) | 3-5x |
| Parsing | baseline | 30% faster (zero-copy) | 1.3x |
| Memory Usage | baseline | 50% less (pooling) | 2x |
| GC Overhead | baseline | 80-90% less | 5-10x |

---

## Troubleshooting

### Error: "Cannot find module"
```freelang
// v1 style (wrong in v2)
const utils = require("./utils")

// v2 style (correct)
import { add } from "./utils.free"
```

---

### Error: "Type mismatch"
```freelang
// v1 style (ambiguous types)
fn process(data) { ... }

// v2 style (explicit types)
fn process(data: object): Result { ... }
```

---

### Error: "Method not found"
```freelang
// v1 style
const arr = [1, 2, 3]
arr.map(x => x * 2)

// v2 style
import { map } from "@freelang/collections"
const arr: number[] = [1, 2, 3]
map(arr, x => x * 2)
```

---

## Support & Resources

- **Documentation**: [API Reference](../api/README.md)
- **Quick Reference**: [Quick Reference Guide](../QUICK-REFERENCE.md)
- **Issues**: Report to GitHub Issues
- **Community**: GitHub Discussions

---

## v2 Highlights

```
✅ Type Safety (optional → explicit)
✅ Performance (3-5x in many cases)
✅ Memory Efficiency (50% reduction)
✅ Better Errors (helpful messages)
✅ SmartREPL (109+ functions)
✅ Zero-Copy Operations
✅ Advanced Collections
✅ Async/Await Support
```

---

## Timeline

| Date | Event |
|------|-------|
| 2026-02-18 | v2.0.0 Release |
| 2026-03-18 | v1.x End of Support |
| 2026-06-18 | v1.x Removed from Registry |

**Recommendation**: Migrate by 2026-03-18 to ensure support.

---

## Getting Help

```bash
# Check migration status
freelang analyze --strict --report migration

# Get help with specific command
freelang help <command>

# Start interactive tutorial
freelang repl
> .tutorial migration
```

---

**Ready to migrate?** Start with the checklist above and reference the common patterns as needed.
