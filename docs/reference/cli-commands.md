# CLI Commands Reference

## Overview

FreeLang provides a comprehensive command-line interface for compiling, running, and managing FreeLang programs.

**Version**: v2.2.0
**Module**: `src/cli/`
**Status**: Production Ready

---

## Installation

```bash
# npm
npm install -g @freelang/cli

# KPM
kpm install @freelang/cli

# Local
cd v2-freelang-ai
npm install
npm link  # Make freelang command available globally
```

## Usage

```bash
freelang [command] [options]
```

---

## Global Options

All commands support these options:

```bash
-v, --verbose              Detailed output (default: off)
-q, --quiet                Suppress output (default: off)
--config <path>            Use config file (default: .freelangrc)
--version                  Show version and exit
--help                     Show help message
```

---

## Commands

### 1. compile

Compile FreeLang source code to IR or binary.

```bash
freelang compile [files...] [options]
```

**Options:**
```bash
-o, --output <path>        Output file path (default: ./dist/out)
-t, --target <type>        Target: ir, c, wasm, llvm (default: ir)
-O, --optimize <level>     Optimization: 0 (none), 1 (safe), 2 (aggressive) (default: 1)
--type-check               Enable strict type checking (default: on)
--type-warnings            Show all type warnings (default: on)
-w, --watch                Watch files for changes (default: off)
--source-map              Generate source maps (default: off)
```

**Examples:**

```bash
# Compile single file
freelang compile main.free

# Compile multiple files
freelang compile src/*.free

# Compile to C code
freelang compile main.free -t c -o main.c

# Watch mode
freelang compile src/ -w

# Optimize aggressively
freelang compile main.free -O 2

# Disable type checking
freelang compile main.free --no-type-check
```

---

### 2. run

Execute FreeLang code directly (JIT mode).

```bash
freelang run <file> [args...] [options]
```

**Options:**
```bash
-m, --mode <mode>          Execution mode: jit, eval, repl (default: jit)
--profile                  Profile execution (show cycles, memory, time)
--trace                    Print trace of execution (default: off)
--max-cycles <n>           Max cycles allowed (default: 100000)
--memory-limit <mb>        Max memory allowed (default: 1024MB)
```

**Examples:**

```bash
# Run file directly
freelang run main.free

# Pass arguments
freelang run main.free arg1 arg2 arg3

# Profile execution
freelang run main.free --profile

# Trace execution
freelang run main.free --trace

# Set memory limit
freelang run main.free --memory-limit 512
```

---

### 3. repl

Start interactive REPL (Read-Eval-Print Loop).

```bash
freelang repl [options]
```

**Options:**
```bash
--history <file>           Load/save REPL history (default: ~/.freelang_history)
--no-history               Don't save REPL history
--syntax-highlight         Enable syntax highlighting (default: on)
--type-inference           Show type inference results (default: on)
--smart-completion         Enable smart autocompletion (default: on)
```

**Examples:**

```bash
# Start REPL
freelang repl

# REPL without history
freelang repl --no-history

# Disable autocompletion
freelang repl --no-smart-completion
```

**REPL Commands** (inside REPL):

```
.help                      Show REPL help
.exit                      Exit REPL
.clear                     Clear screen
.type <expr>               Show type of expression
.load <file>               Load file into REPL
.save <file>               Save session to file
.vars                      Show all variables
.functions                 Show all functions
.history                   Show command history
.recent [n]                Show last n commands
.reset                     Reset all variables
```

---

### 4. build

Build a complete FreeLang project.

```bash
freelang build [directory] [options]
```

**Options:**
```bash
-c, --config <file>        Build config file (default: freelang.config.json)
--production               Build for production (default: off)
--analyze                  Run static analysis (default: on)
--test                     Run tests after build (default: on)
--clean                    Clean build directory first (default: off)
```

**Examples:**

```bash
# Build current directory
freelang build

# Build specific directory
freelang build ./my-project

# Production build
freelang build --production

# Clean build
freelang build --clean

# Build without tests
freelang build --no-test
```

---

### 5. test

Run test suite.

```bash
freelang test [pattern] [options]
```

**Options:**
```bash
--reporter <type>         Reporter: spec, json, tap (default: spec)
--watch                   Watch files and re-run (default: off)
--coverage                Generate coverage report (default: off)
--coverage-threshold <n>  Min coverage % required (default: 80)
--bail                    Stop on first failure (default: off)
--timeout <ms>            Test timeout (default: 5000ms)
```

**Examples:**

```bash
# Run all tests
freelang test

# Run specific test file
freelang test utils.test.free

# Run with coverage
freelang test --coverage

# Watch mode
freelang test --watch

# Strict coverage
freelang test --coverage --coverage-threshold 90
```

---

### 6. analyze

Run static analysis and linting.

```bash
freelang analyze <files...> [options]
```

**Options:**
```bash
--strict                   Enable strict mode (default: off)
--fix                      Auto-fix issues (default: off)
--config <file>            Analysis config (default: .freelanglintrc)
--format <type>            Format: text, json, html (default: text)
```

**Examples:**

```bash
# Analyze files
freelang analyze src/*.free

# Auto-fix issues
freelang analyze src/*.free --fix

# Strict analysis
freelang analyze src/ --strict

# Generate HTML report
freelang analyze src/ --format html > report.html
```

---

### 7. format

Format FreeLang code.

```bash
freelang format <files...> [options]
```

**Options:**
```bash
--check                    Check formatting without modifying (default: off)
--config <file>            Format config (default: .freelangformat)
--line-width <n>           Line width (default: 100)
--indent <n>               Indent width (default: 2)
```

**Examples:**

```bash
# Format files in-place
freelang format src/*.free

# Check formatting
freelang format src/ --check

# Custom line width
freelang format src/ --line-width 120

# Check before committing
freelang format src/ --check || echo "Format your code!"
```

---

### 8. install

Install FreeLang package from KPM or npm.

```bash
freelang install [package] [options]
```

**Options:**
```bash
--save                     Add to package.json (default: on)
--dev                      Add as dev dependency
--version <v>              Install specific version
--force                    Force reinstall (default: off)
```

**Examples:**

```bash
# Install package
freelang install @freelang/http

# Install as dev dependency
freelang install @freelang/test --dev

# Install specific version
freelang install @freelang/http@1.2.0

# Force reinstall
freelang install @freelang/crypto --force
```

---

### 9. publish

Publish package to KPM registry.

```bash
freelang publish [directory] [options]
```

**Options:**
```bash
--dry-run                  Test publish without uploading (default: off)
--tag <tag>                Publish with tag (default: latest)
--access <level>           Access: public, restricted (default: public)
--registry <url>           Registry URL (default: kpm registry)
```

**Examples:**

```bash
# Publish package
freelang publish

# Test publish
freelang publish --dry-run

# Publish as beta
freelang publish --tag beta

# Restricted access
freelang publish --access restricted
```

---

### 10. doc

Generate documentation.

```bash
freelang doc [files...] [options]
```

**Options:**
```bash
-o, --output <dir>        Output directory (default: ./docs)
--format <type>           Format: html, markdown, json (default: html)
--template <file>         Custom template
--include-private         Include private APIs (default: off)
--watch                   Watch and rebuild (default: off)
```

**Examples:**

```bash
# Generate docs
freelang doc src/*.free

# Generate markdown docs
freelang doc src/ --format markdown

# Custom output
freelang doc src/ -o ./api-docs

# Watch mode
freelang doc src/ --watch
```

---

### 11. version

Show version information.

```bash
freelang version [options]
```

**Options:**
```bash
--json                     JSON output (default: off)
--check                    Check for updates
```

**Examples:**

```bash
# Show version
freelang version

# Check for updates
freelang version --check

# JSON output
freelang version --json
```

---

### 12. help

Show help information.

```bash
freelang help [command]
```

**Examples:**

```bash
# General help
freelang help

# Command help
freelang help compile
freelang help run
freelang help test
```

---

## Configuration Files

### freelang.config.json

Project configuration file.

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My FreeLang project",
  "main": "src/main.free",
  "scripts": {
    "build": "freelang build",
    "test": "freelang test",
    "start": "freelang run src/main.free"
  },
  "dependencies": {
    "@freelang/http": "^1.0.0",
    "@freelang/orm": "^1.0.0"
  },
  "devDependencies": {
    "@freelang/test": "^1.0.0"
  },
  "compiler": {
    "target": "ir",
    "optimize": 1,
    "typeCheck": true,
    "sourceMap": true
  }
}
```

### .freelangrc

Runtime configuration (TOML format).

```toml
[compiler]
optimize = 1
type-check = true

[runtime]
max-cycles = 100000
memory-limit = "1024MB"

[repl]
history = "~/.freelang_history"
syntax-highlight = true
smart-completion = true
```

---

## Environment Variables

```bash
FREELANG_HOME             FreeLang installation directory
FREELANG_CONFIG           Config file path
FREELANG_VERBOSE          Verbose output (0=off, 1=on)
FREELANG_CACHE_DIR        Cache directory for compilation
FREELANG_TEMP_DIR         Temp directory for builds
```

---

## Exit Codes

```
0                         Success
1                         General error
2                         Compilation error
3                         Runtime error
4                         Configuration error
5                         File not found
```

---

## Examples

### Complete Workflow

```bash
# 1. Create project
mkdir my-app
cd my-app

# 2. Initialize
freelang build --init

# 3. Write code (src/main.free)
# ... write code ...

# 4. Test
freelang test

# 5. Format
freelang format src/

# 6. Analyze
freelang analyze src/

# 7. Build
freelang build --production

# 8. Run
freelang run dist/main

# 9. Publish
freelang publish
```

### Development Workflow

```bash
# Terminal 1: Watch and rebuild
freelang build --watch

# Terminal 2: Run tests
freelang test --watch

# Terminal 3: Start REPL for testing
freelang repl
```

---

## Common Patterns

### Running with Arguments

```bash
# Pass arguments to program
freelang run main.free arg1 arg2

# Inside main.free
fn main(args: string[]) {
  println(args.length);  // 2
  println(args[0]);      // "arg1"
}
```

### Type Checking Without Running

```bash
# Just check types, don't run
freelang compile main.free --no-output

# Strict checking
freelang analyze main.free --strict
```

### Profiling Performance

```bash
# Run with profiling
freelang run main.free --profile

# Output:
# Result: 42
# Cycles: 1,234
# Memory: 5.6 MB
# Time: 12.3ms
```

---

## Troubleshooting

### "Command not found: freelang"

```bash
# Install globally
npm install -g @freelang/cli

# Or use npx
npx @freelang/cli compile main.free

# Or link locally
cd v2-freelang-ai
npm link
```

### "Port already in use"

```bash
# Use Port Manager
npm run start -- --auto-port
```

### "Memory exceeded"

```bash
# Increase memory limit
freelang run main.free --memory-limit 2048
```

---

## Related Documentation

- [API Reference](../api/README.md)
- [Quick Reference](../QUICK-REFERENCE.md)
- [API Workflow Guide](../getting-started/api-workflow.md)
- [Language Tour](../guides/language-tour.md)

---

**Last Updated**: 2026-02-18
**Status**: Production Ready ✅
**CLI Version**: v2.2.0 ✅
