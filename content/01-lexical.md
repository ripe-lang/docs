# Lexical Syntax

The encoding is UTF-8.

Identifiers: `[A-Za-z_][A-Za-z0-9_]*`

## Comments

- A line comment: `// hello `
- A block comment: `/* world */`

## Whitespace

This isn't Python, **whitespace is ignored** except as a token separator.

## Semicolon

No more worrying about a random semicolon on line 500 being missing!
**They're optional.** The lexer inserts one at line end when the line ends
with `identifier`, `literal`, `)`, `]`, `}`, `++`, `--`. I am following [Go's style](https://boldlygo.tech/archive/2023-01-11-lexical-elements-semicolons/) for semicolons.

```
let x = 1
let y = 2 // no semicolons!
```
