# Types

Since this is a statically typed language, let's talk about types!
I might have to name my language TypeRipe. Also, keep in mind that this might change.

## Primitives

| Category | Types                                 |
| -------- | ------------------------------------- |
| Boolean  | `bool` (`true`, `false`)              |
| Signed   | `i8` `i16` `i32` `i64` `i128` `isize` |
| Unsigned | `u8` `u16` `u32` `u64` `u128` `usize` |
| Floating | `f32` `f64`                           |
| Pointer  | `*T`, `*nonnull T`, `*volatile T`     |

If it wasn't clear, the **type** is volatile, not the pointer. In
`volatile T`, the `volatile` qualifier applies to `T` (the pointed-to type).

## Special

| Type    | Description                |
| ------- | -------------------------- |
| `void`  | No value returned          |
| `never` | Diverges (does not return) |
| `null`  | Null pointer value         |

## Pointers

The easiest definition that you'll ever hear, but the hardest concept to
wrap your head around. Sorry Monads.

A pointer is a variable that stores the memory address of another variable.

| Type          | Description                           | Safety                                     |
| ------------- | ------------------------------------- | ------------------------------------------ |
| `*nonull T`   | A pointer guaranteed to never be null | No null check required                     |
| `*T`          | A nullable pointer                    | Checked at runtime / panics on null access |
| `*volatile T` | Used for memory mapped I/O            | Prevents compiler optimizations            |

```
*nonnull i32 // never null, no null check
*i32         // nullable, checked at runtime
*volatile u8 // volatile, for MMIO
```

### Using Pointers

Pointers are created using the address-of operator `&` and access using
the dereference operator `*`.

```
var x: i32 = 10
let p: *nonnull i32 = &x;
let value = *p; // 10
```

### Null Safety

The standard pointer `*T` is nullable. Accessing a nullable pointer triggers
a runtime check.

```
let p: *i32 = null
let x = *p // runtime panic: null pointer reference

@unsafe {
    let y = *p // no check: UB
}
```

### Dereferencing
