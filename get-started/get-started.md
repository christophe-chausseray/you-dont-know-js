# You don’t know Js : Get Started

## Introduction

3 mains pillars :
- **Scope/closures**
- **Prototypes/objects**
- **Types/Coercion**

## Summary

- [JS naming and standard](#js-naming-and-standard)
- [JS Paradigm, compatibility and compilation](#js-paradigm-compatibility-and-compilation)
- [Values](#values)
- [Variables](#variables)
- [Functions](#functions)
- [Comparisons](#comparisons)
- [Class and Module](#class-and-module)
- [Iteration](#iteration)
- [Closure](#closure)
- [Prototypes](#prototypes)
- [Values vs References](#values-vs-references)
- [Function Forms](#function-forms)
- [Coercive conditional comparison](#coercive-conditional-comparison)

## JS naming and standard

The Javascript/Js that **runs in your browser or in Node.js**, is an implementation of the **ES2019 standard**.
The name of the language is specified by **TC39** and formalized by the **ECMAScript**.
Whether you call it Javascript, JS, ECMAScript, or ES2019, it’s **most definitely not a variant of the Java language**.


TC39 vote on any agreed changes, which they then submit to ECMA, the standard organization.
**JS’s syntax and behavior are defined in the ES specification**.
All TC39 proposals progress **through a five-stage process** from Stage 0 through Stage 4.
**There’s just one JS, the official standard as maintained by TC39 and ECMA**.
The JS specification includes one appendix “Additional ECMAScript Features for Web Browsers” to detail out any known mismatches between the official JS specification and the reality of JS on the web.
**Exceptions are only allowed for web JS**

Don’t trust what behavior you see in a developer console as representing exact to-the-letter JS semantics; for that, read the specification. **Think of the console as a “JS-friendly” environment**.

## JS Paradigm, compatibility and compilation

JavaScript is most definitely a **multi-paradigm language. You can write procedural, class-oriented, or FP-style code.**

Javascript is preservation of **backward compatibility**. It means JS developers can write code with confidence that their code won’t stop working unpredictably because a browser update is released.

**Javascript is not forward compatible**. It means adding new features of the language in a program would break it if the program is running in an older JS engine
For new and incompatible syntax, **the solution is transpiling**. It means using a tool to convert the source code of a program from one to another (ex: Babel).
It’s strongly recommended that developers use the latest version of JS so that their code is clean and communicates its ideas most effectively.
If it’s a missing API method, the common solution is to provide a definition for that missing API method that stands in and acts as if the older environment had already had it natively defined. **It’s called a polyfill**.
Don’t use polyfills in your code, usually the transpiler detects the polyfills you need in your code and provides them.

**JS source code is parsed before it is executed-statically determined errors in code, such as a duplicate parameter name.**

JS is a **parsed language.**

The parsed JS is converted to an optimized (binary) form before to be executed but the engine does not switch back into line-by-line execution mode after the parsing (for efficiency purpose).

JS engines can employ multiple passes of JIT (Just-In-Time) processing/optimization on the generated code (post pasing).

In the spirit, not in practice, JS is **a compiled language**.

WASM is a representation format more akin to Assembly that can be processed by a JS engine by skipping the parsing/compilation that the JS engine normally does.

**In JS, each standalone file is its own separate program.** It means if one file may fail during parse/compile or execution that does not necessarily prevent the next file to be processed.

The only way multiple standalone .js files act as a single program is by **sharing their state via the “global scope”.** They mix together in this global scope namespace, so at runtime they act as a whole.

Since ES6, JS has also supported a module format. **Modules are also file-based.** Importing a module into another allows runtime interoperation between them.

**Think of each file as its own (mini) program, which may then cooperate with other (mini) programs to perform the functions of your overall application.**

## Values

**Values are data.** They’re how the program maintains state. Values come in two forms in JS : **primitive and object.**

Primitive values are :
- **String (back quote permits interpolation)**
- **Boolean**
- **Number**
- **Null**
- **Undefined (safest and best to use only undefined as the single empty value)**
- **Symbol**

Other values as **Objects, Arrays and Functions are object values**.

Arrays are a **special type of object that’s composed of an ordered and numerically indexed list** of data.
JS arrays can hold any value type either primitive or object (including other arrays). Even functions are values that can be held in arrays of objects.

**Functions are also a special kind of object.**

Objects are more general: **an unordered, keyed collection of any various values.**

**/!\ typeof null unfortunately returns “object” instead of the expected “null”. Typeof returns also the specific “function” for functions**, but not the expected “array” for arrays.

**Converting form one value type to another**, it’s what it’s called **“coercion”**.

## Variables

Variables have to be declared (created) to be used :
- *var* keyword declares **a variable to be used in that part of the program**, and optionally allows initial value assignment, **“function scoping”**.
- *let* keyword allows a **more limited access to the variable than *var*.** This is called **“block scoping”** as opposed to regular or function scoping. It’s very useful for limiting how widespread variable declarations help prevent accidental overlap of their names.
- *const* keyword allows **a given value at the moment it’s declared, and which it cannot be re-assigned** with a different value later. The best semantic use of a *const* is when you have a simple primitive value that you want to give a useful name.

Function identifiers are outer scope and parameters are only accessible in that function’s scope (var-declared).
The *err* exists only inside a catch clause when it’s declared with let.

## Functions

A function in JS is **a collection of statements that can be invoked one or more times, may be provided some inputs, and may give back one or more outputs** (a procedure).
Two forms of functions : **declaration function (function awesome {}) and expression function (awesome = function() {}).**

In the declaration function, **the association between the identifier and the function value happens during the compile phase of the code**, before the code is executed.

In the expression function, **the identifier and the function value are only associated at runtime.**

In a function, **you can only return a single value.** If you have more values to return, you can wrap them up into a single object/array.

**Functions can be assigned as properties on objects.** Each function can be called by accessing the property to retrieve the function reference value.

## Comparisons

The === operator is designed to lie in two cases of special values : **NaN and -0**.
For the NaN, it says that an occurrence of **NaN is not equal to another NaN.**
For the -0, it says that **it’s equal to the regular 0 value.**

Instead, use the :
- Number.isNaN()
- Object.is()

**JS does not define === as structural equality for object values. Instead, === uses identity equality for object values.**

All object values are held by reference, are assigned and passed by reference-copy, and are **compared by reference (identity) equality**.

JS **doesn’t provide structural equality comparison** because it’s almost intractable to handle all the corner cases!

**Coercion means a value of one type being converted to its respective representation in another type.**

The == operator is described as **“coercive equality”**. It allows **coercion (type conversion) before the comparison.**

The <, >, <=,  >= operators they will allow coercion first if the types differ.

There’s no way to get these relational operators to avoid coercion, other than to just **never use mismatched types in the comparisons.**

## Class and Module

A class in a program is a definition of **a “type” of custom data structure that includes both data and behaviors** that operate on that data. To get a concrete value that you can use in the program, **a class must be instantiated** (with the *new* keyword).

**Behavior (methods) can only be called on instances.**

Class can use the *extends* keyword to **extend from a general definition to include additional behavior.** The *super(..)* call in the constructor **delegates to the parent constructor for its initialization work.**

Both the inherited and overridden methods **can have the same name and co-exist** thanks to the **polymorphism**.

The **module pattern** has essentially the same goal as the class pattern, which is to **group data and behavior together into logical units**. Also like classes, modules can “include” or “access” the data and behaviors of other modules.

A **module factory** (classic module) is a function which produces, when calling it, an “instance” of the module with one or more functions exposed that can operate on the module instance’s internal data.

The main difference between the class and the module factory function is **you explicitly create and return an object with any publicly exposed methods, and any data or other unreferenced methods remain private** inside the factory function.

Different form of modules in JS programs :
- AMD (Asynchronous Module Definition)
- UMD (Universal Module Definition)
- CommonJS (classic Node.js-style modules)

**ES6 introduced to the JS language the ES6 modules (ESM).**

It has some differences with classic modules :
- **No wrapping function to define a module.** The wrapping context is a file.
- You use **the *export* keyword to add a variable or method to its public API definition.**
- You don’t “instantiate” an ES module, you **just import it to use its single instance.** They are **“singletons”**. If your module needs to support **multiple instantiations, you have to provide a classic module-style factory function on your ESM definition**.

## Iteration

The idea is that it’s more common and helpful to iterate the data source -to **progressively handle the collection of the data by progressing the first part, then the next, and so on**, rather than handling the entire set all at once.

The iterator pattern defines a data structure called **“iterator”** that has a reference to an underlying data source (ex: the query result) which exposes a method like next(). next() returns the next piece of data called an **iterator result**.

The iterator result is an object which has value and done properties. Done is a boolean that is false until the iteration over the underlying data source is complete.

ES6 included several mechanisms for standardized the consumption of these iterators :
- **for..of loop**
- **… operator**

The … operator has 2 symmetrical forms : **spread and rest (or gather). The spread form is an iterator-consumer.**

It has 2 possibilities to spread an operator: **an array or an argument list for a function call.**

**A single iterable could be consumed more than once;** each time a new iterator instance would be created and used.

**ES6 defined the basic data structure/collection types in JS as iterables.** This includes **strings, arrays, maps, sets**, and others.

An entry is a tuple including both a key and a value. You can make an entries iterator with the *entries()* method.

**[btn, btnName] => array destructuring**

**All built-in iterables in JS have 3 iterator forms :**
- **keys() (keys-only)**
- **values() (values-only)**
- **entries() (entries)**

When creating an iterator instance from an existing iterator, the iterator itself is returned.

## Closure

**Closure is when a function remembers and continues to access variables from outside its scope, even when the function is executed in a different scope.**

Objects don’t get closures, functions do. You must execute a function in a different scope than where that function was originally defined.

**As the inner function instance is still alive, the closure is still preserving the variables.** The closure can make updates to these variables over time. These **updates are preserved** each time the inner function instance is called.

**Closure is most common when working with asynchronous code, such as with callbacks.**

It’s not necessary that the outer scope be a function, it could be one variable in an outer scope accessed from an inner function.

Scope is the set of rules that **controls how references to variables are resolved.**

The *this* keyword is an **execution context**.

**Scope is static** and contains a fixed set of variables available at the moment and location you define a function, ***this* (function’s execution context) is dynamic**. It depends on how it is called.

The execution context is **a tangible object whose properties are made available to a function while it executes**.

You can invoke a function with the *call(..)* method

The benefit of this-aware functions and their dynamic context is the ability to more flexibility re-use a single function with data from different objects.

**The scope unit boundaries, and how variables are organized in them, is determined at the time the program is parsed (compiled).**

## Prototypes

A prototype is **a characteristic of an object**, and specifically resolution of a property access. It’s a **linkage between 2 objects**; the linkage is hidden behind the scenes, though there are ways to expose and observe it. The **prototype linkage occurs when an object is created; it’s linked to another object that already exists.**

A series of objects linked together via prototypes is called the **“prototype chain”**.

**Delegation of property/method access** allows **two or more objects to cooperate** with each other to perform a task.

For instance, the default prototype *Object.prototype* object has common built-in methods on it like *toString()* and *valueOf()*. So, **it means when you create a new object it has those 2 methods accessed by delegation.**

To **create an object prototype linkage from another already created** you can use the *Object.create(...)* method.

**Delegation through the prototype chain only applies for accesses to lookup the value in a property.** If you assign to a property of an object, that will apply directly to the object regardless of where that object is prototype linked to. It’s “shadowing” the property of the parent.

***Object.create(null)* creates an object that is not a prototype linked anywhere**, so it’s purely just a standalone object.

One of the main reasons this supports dynamic context based on how the function is called is so that method calls **on objects which delegate through the prototype chain still maintain the expected *this**.

JS’s *this* **being dynamic is a critical component of allowing prototype delegation**, and indeed class, to work as expected.

**Delegation can be more powerful than class inheritance** for organizing behavior and data in our programs.

The **“prototypal class”** pattern is strongly discouraged, in favor of using ES6’s class mechanism. Under the covers, the same prototype linkage is wired up, but this class syntax fit the class-oriented design pattern much more cleanly than “prototype classes”.

## Values vs References

The **type of value in JS will determine how you assign/pass a value**, if it’s as the value itself or as a reference :
- **Primitive values are assigned/passed as value copies** (each variable holds its own copy of the value)
- **Object values (arrays, objects, functions) are treated as reference.** It means 2 or more variables are pointing at the same value (each variable holds a copy of the reference to the single shared object). **If you update one it updates both.**

**Primitives are held by value, objects are held by reference.**

## Function Forms

**Anonymous function expression** = it has no name identifier between the function keyword and the *(...)* parameter list.

JS performs a **“name inference”** on an anonymous function to define the name of the function with the name of the variable assigned to this one.

The *name* property of a function will reveal either its directly given name (in the case of a declaration) or its inferred name in the case of an anonymous function expression.

However, if you **pass a function expression as an argument to a function call no name inference occurs.** Because an anonymous function doesn’t have an identifier to use to refer to itself from inside itself.

For a **named function expression, the identifier is directly associated** with the function expression **at compile time**, the association with the variable still doesn’t happen until runtime.

More in favor of a name function expression as a function has a purpose and this purpose needs to be described by a name.

**Arrow function expressions are syntactically anonymous.**

Arrow function form has a specific purpose (handling the *this* keyword lexically), but that doesn’t mean we should use it for every function we write.

Function can also be specified in class definitions and object literal definitions.

## Coercive conditional comparison

**Conditional expressions needing to perform coercion-oriented comparisons to make their decisions.**

It’s important to see that **before the comparison, a coercion occurs, from wherever type x currently is, to boolean**.
