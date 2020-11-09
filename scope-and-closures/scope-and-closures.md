# You don't know JS : Scope and closures

## Summary

- [What's the scope ?](#what's-the-scope-?)
- [JS Compilation process](#js-compilation-process)
- [How scope is processed in the compilation](#how-scope-is-processed-in-the-compilation)
- [Lexical Scope](#lexical-scope)
- [Illustrating lexical scope](#illustrating-lexical-scope)
    - [Marbles and buckets](#marbles-and-buckets)
    - [A conversation among friends](#a-conversation-among-friends)
    - [Building on metaphors](#building-on-metaphors)
- [The Scope Chain](#the-scope-chain)
- [Shadowing](#shadowing)
- [Function name scope](#function-name-scope)
- [Global scope](#global-scope)
- [Lifecycle of variables](#lifecycle-of-variables)
    - [Hoisting](#hoisting)
    - [Re-declaration](#re-declaration)
    - [Temporal Dead Zone (TDZ)](#temporal-dead-zone-(tdz))
- [Scope exposure](#scope-exposure)
    - [Immediately Invoked Function Expression (IIFE)](#immediately-invoked-function-expression-(IIFE))
    - [Scope with blocks](#scope-with-blocks)
    - [var and let](#var-and-let)
    - [Try...Catch](#try...catch)
    - [Function Declarations in Blocks (FiB)](#function-declarations-in-blocks-(FiB))
- [Closures](#closures)
- [Modules](#modules)
    - [Classic module](#classic-module)
    - [CommonJS Module](#commonJS-module)
    - [ES Module (ESM)](#es-module-(ESM))
- [Implied Scopes](#implied-scopes)
- [Anonymous vs Named function](#anonymous-vs-named-function)
- [Benefits of hoisting](#benefits-of-hoisting)


## What's the scope ?

How does Js know which variables are accessible by any given statements, and how does it handle 2 variables of the same name ?

JS is parser/compiled in a separate phase **before execution begins**.

The code author's decisions on where place **variables, functions and blocks with respect to each other are analyzed according to the rules of scope, during the initial parsing/compilation phase**. The resulting scope structure is generally unaffected by runtime conditions.

Scope is primarly determined during compilation.

## JS Compilation process

A program is processed by a compiler in 3 basic stages :
 - Tokenizing/Lexing: breaking up a string of characters into meaningful (to the language) chunks, called tokens. The difference between tokenizing and lexing is that the first one is based on tokens identified in a stateless way and the second one in a stateful way.
 - Parsing: taking a stream (array) of tokens, and turning it into a tree of nested elements, which collectively the grammatical structure of the program. This is called an **Abstract Syntax Tree (AST)**.
- Code Generation: taking an AST and turning it into executable code.

JS compilation doesn't happen in a build step ahead of time, as with other languages. It happen in mere microsends right before the code is executed. So for performance purpose, JS engines use all kinds of tricks to improve is (like JITs, which lazy compile and even hot re-compile).

The processing of JS programs occurs in (at least) **2 phases: parsing/compilation first, then execution**.

You can observe 3 program characteristics to observe it : **syntax errors, early errors and hoisting**.

In spirit and practice, what the engine is doing in processing JS programs **is much more alike compilation** than not.

## How scope is processed in the compilation

How the JS engine identifies variables and determines the scope of a program as it is compiled.

Other than declarations, all occurances of variables/identifiers in a program serve in one of 2 "roles: either they're the **target of an assignement or they're the source of a value**.

**If there is a value that is being assigned to it, it's a target. If not, then the variable is a source.**

JS engine must first label each occurence of a variable as target or source.

The declaration is handled entirely at compile time and is thus irrelevant during the execution.

For a function, **the identifier is declared (at compile time)** but the = *function(...)* part is also handled at compilation; **the association between the identifier and the function is automatically set up at the beginning of the scope** rather than waiting for an *=* assignement statement to be executed.

Scope is **determined as the program is compiled**, and **should not generally be affected by runtime conditions**.

In non strict mode there are technically still 2 ways to cheat this rule (both dangerous and confusing) :
- The *eval(..)* function receives a string of code to compile and execute on fly during the program runtime. If that string has a *var* or *function* declaration in it, those declaration will modify the current scope.
- The *with* keyword, which dinamically turns an object into a local scope-its properties are treated as identifiers in that new scope's block.

## Lexical Scope

JS's scope is determined at compile time; the term for this kind of scope is **"lexical scope"** (associated with the lexing stage of compilation).

The key idea of "lexical scope" is that **it's controlled entirely by the placement of functions, blocks, and variable declarations, in relation to one another**.

If you place a variable declaration inside a function, the compiler handles this declaration as it's parsing the function, and associates that delcaration with the function's scope. If a variable is block-scope declared (*let*/*const*), then it's associated with the nearest enclosing *{ .. }* block, rather than its enclosing function (as with *var*).

A reference for **a variable must be resolved as coming from one of the scopes that are lexically available to it**; otherwise the variable is said to be "undeclared".

**If the variable is not declared in the current scope, the next outer/enclosing scope is consulted and so on** until a matching variable can be found.

**Compilation creates a map of all the lexical scopes** that lays out what the program will need while it executes.

**Scopes are identified during compilation, they're not actually created until runtime, each time a scope needs to run.**

## Illustrating lexical scope

### Marbles and buckets

The **marbles are the variables** in our program. The **buckets are scopes (functions and blocks)**, which we just conceptually assign individual color.

**Scope bubbles are determined during compilation based on where the functions/blocks of scope are written**, the nesting inside each other, and so on. **Each scope bubble is entirely contained within its parent scope bubble.** A scope is never partially in 2 different scopes.

**Each marble (variable/identifier) is coloured based on which bubble (bucket) it's declared in.**

Scope can be nest to any depth of nesting your program needs.

References (non-declaration) to variables/identifiers are allowed if there's a matching declaration either in the current scope, or any scope above/outside the current scope, but not with declarations from lower/nested scopes.

**We can conceptualize the process of determining these non-delcaration marble colors during runtime as lookup (not in reality).**

Key take-aways :
- Variables are declared in specific scopes
- Any variable reference that appears in the scope where it was declared, or appears in any deeper nested scopes, will be labeled a marble of that same color.
- The determination of colored buckets and the marbles they contain, happens during compilation. This information is used for variable (marble color) "lookups" during code execution.

### A conversation among friends

The members of the JS engine that will have conversations as they process of our program :
- **Engine**: responsible for start-to-finish compilation and execution of our JavaScript program.
- **Compiler**: one of Engine's friends; hadnles all the dirty work of parsing and code-generation.
- **Scope manager**: Another friend of Engine; collects and maintains a lookup list of all the declared variables/identifiers, and enforces a set of rules as to how there are accessible to currently executing code.

JS treats the program in **2 distinct operations**, one which *Compiler* will handle it during compilation, and the other which *Engine* will handle it during execution.

The first thing compiler will do with this program is perform lexing to break it downs into tokens, which it will then parse into a tree (AST).

The compiler will also follow 2 steps to parse/compile the code :
- When encoutering a variable, *Compiler* will ask *Scope Manager* to see if a variable with the same name already exists for that particular scope buclet. If so, *Compiler* would ignore this declaration and move on. Otherwise, *Compiler* will produce their code that asks *Scope Manager* to create a new variable in that scope bucket.
- *Compiler* then produces code for *Engine* to later execute, to handle the variable assignment. The code *Engine* runs will first ask *Scope Manager* if there is a variable with this name accessible in the current scope bucket. If not, *Engine* keeps looking in the outer scopes. Once *Engine* finds a variable, it assigns the value reference to it.

The conversation between the *Compiler*/*Scope Manager* (at compilation time) and the *Engine*/*Scope Manager* (at execution time) is a question-and-answer exchange.

To summarize the process:
1. ***Compiler* sets up the delcaration of the scope variable** (since it wasn't previously declared in the current scope).
2. **While *Engine* is executing, to process the assignment part of the statement, *Engine* asks *Scope Manager* to look up the variable, initializes it to undefined so it's ready to use, and then assigns the value to it**.

**Each scope gets its own *Scope Manager* instance** each time that scope is executed (one or more times). **Each scope automatically has all its identifiers registered at the start of the scope** being executed ("variable hoisting").

If any identifiers came **from a *function* declaration, that variable is automatically initialized** to its associated function reference.

If any identifiers came **from a *var* declaration, that variable is automatically initialized to undefined** so that it can be used.

If any identifiers came **from a *let*/*const* declaration the variable remains uninitialized (in its TDZ)** and cannot be used until its full declaration-and-initialization are executed.

One of the key aspects of lexical scope is that any time an identifier reference cannot be found in the current scope, the next outer scope in the nesting is consulted; that process is repeated until an answer is found or there are no more scopes to consult.

**If the variable is a source/target is considered undeclared it will results in a ReferenceError being thrown** (in strict mode for the target).

In the JS erros (or even for the typeof) "not defined" of undeclared variable really means "not declared".

If the variable is a target and strict mode is not in effect, *Scope Manager* will just create an **accidental global variable** to fulfill that target assignment (really bad!).

### Building on metaphors

You resolve a target or source variable reference by first looking on the current floor, and if you don't find it, taking the elevator to the next floor (i.e an outer scope), looking there, then the next, and so on.

## The Scope Chain

**The connections between scopes that are nested withih other scopes is called the scope chain**, which determines the path along which variables can be accessed. **The chain is directed**, meaning the lookup moves upward/outward only.

The suggestion of a runtime lookup process work well for conceptual understanding, but it's not actually how things usually work in practice. **It is usually determined during the initial compilation processing.**

Since the variable origin is known from the compilation and it's immutable, this information would likely be stored with (or at least accessible from) each variable's entry in the AST.

**It means doesn't need to lookup through a bunch of scopes to figure out which scope a variable come from.** It is a key optimization benefit of lexical scope.

As the variable reference could determines in the shared global scope between programs, **the ultimate determination of whether the variable was ever appropriately discovered need to be deferred to the runtime**.

**This lookup would only be needed once per variable at most** as nothing during the runtime could change the variable origin.

## Shadowing

**A single scope cannot have two or more variables with the same name.**

**You can shadow a variable from an outer scope.** It means **a variable name is repeated at different levels of the scope.** So the re-assignment of the variable affects only the inner variable, not the outer variable.

**It's lexically impossible to reference the outer variable from inside the scope where the variable is shadowed.**

Trick to unshadow a global variable:
 - use the window object to access of the outer variable (mirror of the outer variable, not a separate snapshot copy).

If you put a value in another container, shadowing no longer applies (unless another was shadowed too). But that doesn't mean we are accessing the parameter; it means we're accessing the copy of the value it had at that moment.

***let* (in an inner scope) can shadow an outer scope's *var*, but *var* (in an inner scope) can only shadow an outer scope's *let* if there is a function boundary in between**. Otherwise, it raises a SyntaxError because the *var* is trying to "cross the boundary".

## Function name scope

One major difference between *function* declarations and *function* expressions is what happens to the name identifier of the function.

**The function identifier is declared as an identifier inside the function itself and it's read-only** if it's a *function* expression.

When we used the strict mode, the assignment failure is reported as a TypeError (in non strict mode it fails silently).

**An anonymous function expression clearly have no name identifier that affects either scope.**

**Arrow functions are lexically anonymous, meaning they have no directly related identifier that references the function.**

The assignement to a variable **creates an inferred name**, but that's not the same thing as being non-anonymous.

## Global scope

If you're direclty using **ES modules**, these files are loaded individually by the JS environment. Each module then imports references to whichever other modules it needs to access. **The separate module files cooperate with each other exclusively trough thses shared imports, without needing any shared outer scope**.

If you're using **a bundler in your build** process all the files are typically concatenated together before delivery to the browser and JS engine, which then only precesses one big file. **The entire contents of the file can be wrapped in the single enclosing scope, such as a wrapper function, universal module.** **Each piece can register itself for access from other pieces by way of local variables in that shared scope**.
It acts as a sort of **"application-wide scope"**, not a full environment global scope.

If **a bundler tool is used for an application, or whether the files are simply loaded in the browser individually**, and there is no surrounding scope encompassing all the pieces, **the global scope is the only way for them to cooperate with each other.**

The global scope is also where:
- Js exposes its built-ins:
    - primitives: undefined, null, Infinity, NaN
    - natives: Dates(), Object(), String(), etc
    - global functions: eval(), parseInt(), etc
    - namespaces: Math, Atomics, JSON
    - friends of JS: Intl, WebAssembly
- The environment hoisting the JS engine exposes its own built-ins:
    - console (and its methods)
    - the DOM (window, document, etc)
    - timers (setTimeout(..), etc)
    - web platforms APIs: navigator, history, geolocation, WebRTC, etc.

The **global scope shouldn't be a dumping ground for every variable** in your application but it's an important *glue*.

Different JS environments handle the global scope of your programs differently :
 - *window* for the browser. It's the most pure environment. If you access the global object you'll find properties of those name declared globally. Never use the global variables from the DOM, even though silently automatically created.
 - Web worker, which are a web platform extension on top of browser-JS behavior, uses *self* for referencing the global object.
 - Node, the only way to access or add properties on the real global scope is with *global* (defined by Node, not by JS).
 - *new Function("return this")* trick
 - With ES2020, JS has defined a standardized reference to the global scope object, called *globalThis*.


 **Always using *var* or *function* for our global variable declaration**, which does not shadow the pre-defined name gloablly property. *var* and *function* declarations create mirrored properties on the global object.

 **Developer tools**, while optimized to be convenient and useful for a variety of developer activities, **are not suitable environments to determine or verify explicitly and nuanced behaviors of an actual JS program context**. Observable differences in behavior may include:
 - the behavior of the global scope
 - hositing
 - block-scoping declarators when used in the outermost scope

 **ESM** uses impact an important change of the behavior for the top-level scope in a file. **They are not global variables, but module-wide, or "module-global"**.

 **ESM encourages a minimization of reliance on the global scope**, where you import whatever modules you may need for the current module to operate.

 For **Node module, the top level of your Node program is never actually the global scope**. Before processing, **Node wraps the *var* and *function* declarations in a function**, not treated as global variables. **They are also declared in the module scope, as ESM.**

 We could attempt to define a cross-environment polyfill that's safer across pre-globalThis JS environment.

## Lifecycle of variables

**Every identifier is created at the beginning of the scope and belongs to every time that scope is entered.**

### Hoisting

A variable being visible from the beginning of its enclosing scope, event though its declaration may appear further down in the scope is called **hoisting**.

Both **function hoisting and var variable hoisting attach their name identifiers to the nearest enclosing function scope** (or if none, the global scope), not a block scope.

*let* and *const* do hoisting but these 2 declaration forms attach to their enclosing block rather than just an enclosing function as with *var* and *function* declarations.

***Function hoisting* only applies to formal function declarations** not to function expression assignments. A TypeError is raised for a function expression (with "undefined/identifier is not a function" message).

**A function declaration is hoisted and initialized to its function value. A var variable is also hoisted, and then auto-initialized to undefined.**

The hoisting (metaphor) proposes that JS **pre-processes the original program and re-arranges it a bit, so that all the declarations have been moved to the top of their respective scopes.** Moreover, the hoisting metaphor asserts that ***function* declarations are, in their entirely, hoisted to the top of each scope.**

The "rule" of hoisting metaphor is that ***function* declarations are hoisted first, then variables are hoisted imeediately after all the functions**.

Hoisting should be used to refer to **the compile-time operation** of generating runtime instructins for the **automatic registration of a variable at the beginning of its scope, each time that scope is entered**.

Hoisting is more a metaphor than an explicit mechanism of the JS engine. It offers useful structure for thinking about the life cycle of a variable - when it's created, when it's available to use, when it goes away.

### Re-declaration

The only way to **re-declare a variable is to use *var* for all (2 or more) of its declarations**. *Let* and *const* cannot be repeated with the same identifier in the same scope.

The *const* keyword requires a variable to be initialized, so omitting an assignment from the declaration results in a SyntaxError. *const* declarations creates variables that cannot be re-assigned as well. It will raise a TypeError.

*let* re-declaration is disallowed as well for consistency.

All the rules of scope (including re-declaration of let-created variables) are **applied per scope instance**. **Each loop is its own new scope instance, and within each scope instance, the *let* variable is only created once.** Son, no attpeted re-declarationn and thus no error.

If it would have a *var* declaration in the loop, if would be attached to the global scope or function scope, not the block scope. **So just one variable, no re-declaration neither.**

Same thing for the *const* is **being run once within each loop iteration, no re-declaration.** Except for the for-loop it will have a TypeError because it has a re-assignment each time the variable is incremented.

### Temporal Dead Zone (TDZ)

The temporal dead zone is the time window where a variable exists but is still unintialized, and therefore cannot be accessed in any way.

As the *let/const* declarations are **auto-registered at the top of the scope (hoisting) but do not automatically initialize at the beginning of the scope** (as *var* declaration does), it appears a temporal dead zone error. They defer the auto-initialization of their variables until the original declaration appeared.

To avoid TDZ, **always put your *let* and *const* declarations at the top of any scope.**

## Scope exposure

**"The Principle of Least Privilege" (POLP)**: components of the system should be designed to function with least privilege, least access, least exposure.

If POLP focuses on system-level component design, the POLE Exposure ("Least Exposure") variant focuses on a lower level. It means we want to **minimize the exposure of the variables registered in each scope.**

When this principle is not respected, the program is exposed to 3 main hazards:
- Naming collisions: If you use a common variable/function name in 2 different parts of the program, but the identifier comes from one shared scope (ex: global scope).
- Unexpected behavior: If you expose variables/functions whose usage is otherwise private to a piece of the program, it allows other developers to use them in ways you didn't intend, which can vilate expected behavior and cause bugs.
- Unintended dependency: If you expose variables/functions unnecessarily, it invites other developers to use anddepend on those otherwise private pieces.

POLE as applied to variable/function scoping is **exposing the bare minimum necessary**, keeping everything else as private as possible. **Declare variables in as small and deeply nested of scopes as possible.**

If you follow the principle consistently even in the small cases, it will serve you more as your programs grow.

### Immediately Invoked Function Expression (IIFE)

An IIFE is when we are **defining a function expression and immediately invoke it**. It is **useful when we want to create a scope to hide variables/functions.**

If an IIFE is wrapped around a code with a *return* statement, **the *return* would now refer to the IIFE's function**.
**Non-arrow function IIFEs also change the binding of a this keyword**.
***Break* and *continue* statement won't operate across an IIFE function** boundary to control an outer loop or block.

If the code you need to wrap a scope around has *return*, *this*, *break*, *continue* in it, an IIFE is probably not the best approach.

### Scope with blocks

**A block only becomes a scope if necessary, to contain its block-scoped declarations (let or const)**.

Use explicit block scoping to narrow the exposure of identifiers to the minimum practical.

An explicit block scope can be useful even inside of another block (whether the outer block is a scope or not).

For instance, if the *let* declaration isn't needed in the first half of the block, you should use an inner explicit block scope to further narrow its exposure.

### var and let

*Var* should be **reserved for use in the top-level scope of a function**.

*Var* **communicates better function-scoped** than *let* does, and *let* **communicates and achieves block-scoping** where var is insufficient.

Best advice: Reserve *var* for (mostly) only a top-level function scope and most other declarations should use *let*.

What is the most minimal scope exposure that's sufficient for this variable?

If a declaration belong in a block scope, use *let*. If it belongs in the function scope, use *var*.

In a loop the i variable defined **should always be used only inside the loop**, so it should be declared with *let* instead of *var*. Except only if you relying on accessing the loop's iterator (i) outside/after the loop (a better approach would be to have an external variable to manage that).

### Try...Catch

The *err* variable declared by the *catch* clause is block-scoped to that block. This *catch* clause block can hold other block scoped declaration via *let*.

ES2019 changed recently *catch* clauses so thier declaration is optional; if the declaration is omitted, the *catch* block is no longer (by default) a scope.

### Function Declarations in Blocks (FiB)

The JS specification says that *function* declarations inside of blocks are block-scoped. So it means we can't call the function outside of the block and it will fail with a ReferenceError.

However, most browser-based JS engines (v8, aka Chrome and Node), **the identifier is scoped outside the block but the function value is not automatically initialized, so it remains undefined.**

To avoid this behavior of FiB is to simply avoid FiB entirely. **Never place a *function* declaration directly inside any block.**

But you can place a *function* **expression**, not a declaration, inside a block statement. It's perfectly fine and valid.


## Closures

Functions **remember these references scoped variables via closure**.

It is a behavior of functions and only functions.

**For closure to be observed a function must be invoked, and specifically it must be invoked in a different branch of the scope chain from where it was originally defined.**

Each of those **references from the inner function to the variable in an outer scope** is called a closure. The variable stay around in memory.

Arrow function can get in on the closure party.

**Every time the outer function is called, a new inner function instance is created, and for each new instacne, a new closure.**

Closure is baseon the lexical scope, is **handled at compile time**, and observed as a runtime characteristic of function instances.

Closure is actually a **live link, preserving access to the full variable itself.** It means closed-over variable can be updated (re-assigned) and keep using that variable as long as that function reference exists in the program and from anywhere we want to invoke that function.

Closure is most commonly encountered with callbacks. Event handlers are another common usage of closure.

Global scope variables cannot be (observably) closed over, because they're always accessible from anywhere.

Key parts of an obervable closure :
- Must be a function involved
- Must reference at least one variable from an outer scope (not the global scope)
- Must be invoked in a different branch of the scope chain from the variable(s)

Since closure is inherently tied to a function instance, its **closure lives as long as there is still a reference to that function**. It's **important to discard function references (and their closures) when they're not needed anymore.**

For the overall health and efficiency of the program, unsubscribing an event handler when it's no longer needed can be even more important that the inital subscription.

Closure is **per variable** rather than per scope. Many modern JS engines do apply an optimization that removes any variables from a closure scope that aren't explicitly references. So, it means closure must be per scope, implementation wise, and then an optional optimisation trims down the scope to only what was closed over (a similar outcome as per variable closure).

Better to manually discard the value unused rather than relying on closure optimisation (with *unset*).

It's important ot know where closures appear in our programs, and what variables are included. We should manage these closures carefully so we're only holding onto what's minimally needed and not wasting memory.

An alternative model de-emphasizes closure "functions as first-class values" and instead embraces how functions (like all non-primitive values) **are held by reference in JS, and assigned/passed by reference copy**. In this model, since the function instance itself never moved, **it still has natural access to its scope chain.** The alternative model could be descirbed as a bit more implementation focused, **how JS actually works.**

Closure permit as well to **limit the scope exposure of the variable closed-over** to a more appropriate subset of the program.

We can also create an external function-with-stroed-information which can be applied in the outer function, which make the definition more reusable acorss the program.

Benefits of the closure:
- Improve the efficiency by allowing a function instance to remember previously determined information instead of having to compute each time.
- Imporve code readability, bounding scope-exposure by encapsulating variable(s) inside function instances, while still making sure the information in those variables is accessible for future use.

## Modules

Modules are inherently **built from lexical scope and closure**.

Understanding and mastering scope and closure is **key** in properly **structuring and organizing** the code.

The goal of **encapsulation** is the bundling or **co-location of information (data) and behavior (functions) that together serve a common purpose**.

A **module** is a **collection of related data and functions** (often referred to as methods in this context), **characterized by a division between hidden private details and public accessible details**, usually called the "public API".

If you grouping a set of related functions together without data (**stateless functions**) is a **namespace**.

If you bundle data and stateful functions together, and you're **not limiting the visibility** of any of it, then you're stopping short of the POLE aspect of encapsulation. So it's a **data structure** not a module.

### Classic module

The **classic module** features a public API with methods which are able to access the private hidden data. The instance of a classic module is created by an IIFE being executed (singleton). You don't need to return an object you can also return a function directly.

Instead of defining an IIFE, we can also define it as a normal standalone function, a **"module factory" function**. It allows to support multiple module instances.

Key points of a classic module:
- There must be an outer scope, typically from a module factory function running at least once.
- The module's inner scope must have at least one piece of hidden information that represents state for the module.
- The module must return on its public API a reference to at least one function that has closure over the hidden module state (so that this state is actually preserved).

### CommonJS Module

**CommonJS module** is the format used by Node. CommonJS modules are **file-based; one module per file**. Everything by default is private and identifiers in the top-level scope are not in the global scope.

To expose something on the public API, you need to add a property to the empty object **module.exports**.

For style purposes, it could be nice to put all the "exports" at the top and the implementation at the bottom.

If you want to assign multiple exports at once, using object literal style definition :
```js
Object.assign(module.exports, {exports});
```

It's performing a **shallow copy of all those properties** onto the existing *module.exports*.

To include another module instance into your module/program, use **Node's *require(..)* method**.

CommonJS module **behave as singleton instances**, no matter how many times you *require(..)* the same module, you just get additional references to the single shared module instance.

*require(..)* is an all-or-nothing mechanism; it **includes a reference of the entire exposed public API**.

Similar to the classic module format, the publicly exported methods hold closures over the internal module details.

### ES Module (ESM)

ESM is **file-based, and module instances are singletons, with everything private by default**.

One notable difference is that ESM files are assumed to be strict-mode, without needing a "use strict" pragma at the top. **There's no way to define an ESM as non-strict mode.**

It uses an ***export* keyword** to expose something on the public API of the module and the ***import* keyword** to include a module instance in your module.

*export* must be **at the top-level scope**; it cannot be inside any other block or function. It can appears before the *function* keyword. The *import* keyword as well.

**The function identifier is function hoisted**, so it's available throughout the whole scope of the module.

A "**default export**" is a shorthand for consumers of the module when they import, giving them **a concise syntax when they only need this single default API member**.

Multiple API member can be listed inside the *import {..}* set, separated with commas. A named import can also be renamed with the *as* keyword.

If you want to mix a defulat import with named import, you can do:
```js
import { default as getName, /*others */} from '/path/to/students.js';
```

It can also have a "namespace import":
```js
import * as Student from '/path/to/student.js';
```

## Implied Scopes

It exists some implied scopes :
 - Parameter scope
 - Function name scope

**Parameter scope** appears when the parameters of a function are considered non-simple. It includes **parameters with default values, rest parameters (using ...), and destructured parameters**.
They creates their **own scope** and the **function's scope is then nested inside this scope**.

It can have weird corner cases if we introduce a function expression into the default parameter. To avoid it, we advice to :
- Never shadow parameters with local variable
- Avoid using a default parameter function that closes over any of the parameters.

For **function named scope**, the name identifier of a function is in its **own implied scope, nested between the outer scope enclosing scope and the main inner function scope**.

## Anonymous vs Named function

For several reasons, it's better to name their function instead of let it anonymous :
- Name inference is incomplete (almost all anonymous functions will have no name at all)
- Lexical names allow self-reference
- Names are useful descriptions (without it's harder to debug, harder to extend and maintain and harder to read).
- Arrow functions have no lexical names
- IIFEs also need names

**"anonymous" showing up in stack trave is not helpfull to debugging.**

**Arrow functions** don't define a *this* identifier keyword at all. If you use a this inside an arrow function, it behaves exactly as any other variable reference, which is that **the scope chain is consulted to find a function scope where it is defined and to use that one**. **It treats *this* like any other lexical variable**.

So, it means in the rare cases you need lexical *this*, use an arrow function.

When defining a standalone IIFE, you can use the *void* operator:
```js
void function yepItsAnIIFE() {
}
```

## Benefits of hoisting

Hoisting has 2 main benefits:
- Executable code first, function declarations last (show its behavior first before implementation)
- Semantic placement of variable declarations

The only time you using *const* it's when you're assigning an already-immutable value and when it's clearly a "constant".
