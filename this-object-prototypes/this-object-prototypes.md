# You don't know JS : this and object prototypes

## Summary

- [this](#this)
- [The 4 rules to determine the call-site](#the-4-rules-to-determine-the-call-site)
    - [Default binding](#default-binding)
    - [Implicit binding](#implicit-binding)
    - [Explicit Binding](#explicit-binding)
    - [new Binding](#new-binding)
    - [Order when call-site has multiple eligible rules](#order-when-call-site-has-multiple-eligible-rules)
    - [Binding exceptions](#binding-exceptions)
- [Objects](#objects)
    - [Type](#type)
    - [Built-in objects](#built-in-objects)
    - [Arrays](#arrays)
    - [Duplicated objects](#duplicated-objects)
    - [Property Descriptors](#property-descriptors)
- [Mixing up "Class" Objects](#mixing-up-"class"-objects)
- [Prototypes](#prototypes)
- [Behavior delegation](#behavior-delegation)
- [ES6 class](#es6-class)

## this

It allows the functions to be reused against multiple **context** objects, rather than needing a separate version of the function for each object.

It's a more elegant way of implicitly  passing an object reference, **leading to cleaner API design and easier reuse** (than passing an explicit context).

The *this* **doesn't refer to the function itself**. If you need to refer to the function itself you need to call the "named function".

It also **doesn't refer to a function.s lexical scope**. There is no bridge between lexical scope and *this*.

The *this* binding has nothing to do with where a function is declared, but has instead **everything to do with the manner in which the function is called** (when the function is invoked). Its reference is determined entirely by the call-site.

Finding the call-site is generally "go locate where a function is called from".

## The 4 rules to determine the call-site

To understand how the call-stie determines where *this* will point during the execution of a function, you must inspect the call-site and determine which of four rules applies.

### Default binding

It applies for standalone function invocation. In this case, the default binding for *this* applies to the function call, ans so points *this* at the global object.

If it's **strict mode the global object is not eligible for the default binding**.

### Implicit binding

When there is a context object for a function reference, the *implicit binding* rule says that it's that object that should be used for the function call's this binding.

One of the most common frustrations that *this* binding creates is when an implicitly bound **function loses that binding, which usually means it falls back to the default binding** of either the global object or *undefined*, depending on the strict mode.

Parameter passing is just an implicit assignment, and since we're passing a function, it's an **implicit reference assignment**.

Another way that *this* can surprise us is when function we've passed our callback to intentionally changes the *this* for the call.

### Explicit Binding

When we want to force a function call to use a particular object for the *this* binding, without putting a property function reference.

We can do that with **methods *call(..)* and *apply(..)* on the function**. As you are **explicitly saying what you want the *this* to be in first argument of the methods**, we call it explicit binding.

If you pass a primitive value, **the primitive value is wrapped in its object form respectively**. It's called "boxing".

This binding is both **explicit and strong**, we call it **hard binding**. It creates a pass-through of any arguments passed and any return values received.

ES5, provided a built-in utility for hard binding **Function.prototype.bind**. It returns a **new function that is hardcoded to call the original function with the *this* context set as you specified**.

New built-in functions in JS have an optional parameter, called "context", as workaround to not having to use *bind(..)*.

### new Binding

 In JS, there is **no connection to class-oriented functionnality implied by *new* usage**.

 **Constructors are just functions that happen to be called with the *new* operator in front of them**. They are not attached to classes, nor are they instantiating a class. They're just regular function.

 A **constructor call** is when a function is called with the new in front of it.

 Few things are done automitically when we do it :
 - A brand new object is created
 - The newly constructed object is [[Prototype]]-linked.
 - The newly constructed object is set as the *this* binding for that function call.
 - Unless the function returns its own alternate object, the *new* invoked function call will automatically return the newly contructed object.

 ### Order when call-site has multiple eligible rules

 There is the priority rule from the lowest to the highest :
 - default binding
 - explicit binding
 - implicit binding / hard binding
 - new binding

So for determining the *this* you will process with those following steps :
- Is the functioncalled with *new binding* ? If so, *this* is the newly constructed object.
- Is the function called with call or apply (*explicit binding*), even hidden inside a *hard binding*? If so, *this* is the explicitly specified object.
- Is the function called with a context (*implicit binding*), known as an owning or containing ? If so, *this* is that context object.
- Otherwise, default the *this* (*default binding*). If in strict mode, pick *undefined*, otherwise pick the *global object*.

### Binding exceptions

If you pass *null* or *undefined* as a *this* binding parameter to *call*, *apply* or *bind*, those values are ignored and instead the *default binding* applies.

It can be confusing and it might inadvertently reference (or worse mutate) the global object.

A safer practice is pass a specifically set up object for *this*, an empty object (DMZ). Like that, the *this will be restricted to the empty object.

The easiest way to set up a DMZ, it's with **Object.create(null)**. It's similar to *{}*, but without the delegation to Object.prototype, so it's "more empty".

Another exception, it's to create an **"indirect reference"** to function. When this function reference is invoked, the *default binding* rule also apply.

Hard binding **avoid a function call falling back to the *default binding*** rule inadvertently but it also reduces the flexibility of a function. It **prevents manual this override with either *implicit binding* or even another *explicit binding***.

**Arrow functions**, instead of using the 4 standard rules, **adopt the *this* binding from the enclosing (function or global) scope (lexical scope)**. The lexical binding of an arrow-function cannot be overridden (even with new). The most common use case, it's to use it in the callbacks (as event handlers or timers).

If you find yourself writing most of the time *self = this* or arrow functions peraps you should either :
- Use only lexical scope
- Embrace this-style mechanism completely, including using *bind(..)* where necessary and try to avoir *self = this* and arrow functions.

**A program can effectively use both style of code (lexical and *this*)** but insde of the same function, and indeed for the same sorts of lookup, **mixing the 2 mechanisms is usually asking for harder to-maintain code**.

## Objects

Objects come in 2 forms the **declarative (literal) form** and the **constructed form**.

The only difference is that **you can add one or more key/value pairs to the literal declaration**, whereas with **constructed-form objects, you must add the property only one by one**.

### Type

It has six primary types:
- string
- number
- boolean
- null
- undefined
- object

Simple primitives (string, number, boolean, null and undefined) **are not themselves objects**.

It has few special object subtypes, which we can refer as **complex primitives**.

**Function is a subtype of object ("callable object")**. They are basically just normal objects (with callable behavior), aka "first class".

**Arrays are also a form of objects, with extra behavior**. It's content organisation is slightly **more structured**.

### Built-in objects

There are several others subtypes, named built-in objects:
- String
- Number
- Boolean
- Object
- Function
- Array
- Date
- RegExp
- Error

There are actually just **built-in functions that can be used as a constructor** (with the *new* operator).

The language **automatically coerces** a string primitive **to a String object** when necessary.

*null* and *undefined* have no object wrapper only their primitive values. By contrast, Date values can only be created with the constructed object form.

**Objets, Arrays, Functions and RegExp are all objects** regardless of whether the litteral or constructed form is used.

Error objects are created automatically when errors are throwns. But they can also be created with the constructed form *new Error(..)*.

**Properties are the contents of an object stored at specifically named location**. If you use any other values than string as properties, it will converted in string primitives.

ES6 adds **computed properties**, where you can specify an expression, surrounded by *[]* pair, in the key-name position of an object literal declaration.

### Arrays

Arrays assume numeric indexing, which means that values are stored in positive integer locations, usually called **indices**.

Arrays are objects so even though each index is a positive integer, you can also add properties onto the array.

**Use objects to store key/value pairs, and arrays to store values at numeric indices**.

### Duplicated objects

In ES6, you can do a shallow copy with **Object.assign(..)**. It takes a target object as it's first parameter, and one or more source object as its subsequent parameters. **It's copying all the source properties to the target and return it.**

### Property Descriptors

All properties are described in terms of property derciptors **Object.getOwnPropertyDescriptor(myObject, stringProperty)**.

It includes 3 characteristics: **writable, enumerable and configurable**. When we create a normal propery, we can use *Object.defineProperty(..)* to add a new property, or modifying an existing one with the desired characteristics.

**The ability to change the value of a property is controlled by writable**.

As long as a property is configurable, we can change its descriptor definition, using *defineProperty(..)*. It also prevents the ability to use the delete operator to remove the existing property.

Enumerable characteristic will control if a property will show up in certain object-property enumerations, such as the for..in loop.

If you want **to make an object immutable**, you can use **Object.freeze(..)** to forbidden to add any more properties, to reconfigure or delete an existing property and also modify their values.

**[[Get]] built in operator for an object inspects the object for a property of the requested name and if it finds it, it will return the value accordingly**. If no value comes up it will return *undefined*.

**[[Put]] built in operator is invoked to set or create the property on an object**. How it works will depend if the property already exist on the object :
- Is the property has an accessor descriptor? If so, call the setter if any.
- Is the property a data descriptor with writable of false? If so, silently fail in non-strict mode or throw TypeError in strict mode.
- Otherwise, set the value of the existing property as normal.

**Those operators can overriden with getter and setter on the object**.

We can also ask an object if it has a certain property without asking to get the value, **myObject.hasOwnProperty(..)**.

We can tests if the property is enmerable with **myObject.propertyIsEnumerable(..)**.

We can iterate on arrays with *forEach(..)*, *every(..)* and *some(..)*, *every(..)* keeps going until the end or the callback returns a false (or "falsy"). *some(..)* keeps going until the end or the callback returns a true (or "truly") value.

Custom iterators combined with ES6's ***for..of* loop are a powerful new synthetic tool for manipulating use-defined objects**.

## Mixing up "Class" Objects

Class/inheritance describes a certain form of code organisation and architecture.

OO or class-oriented programming stresses that data intrinsically has associated behavior that operate on it, so proper design is to package up (aka encapsulate) the data and the behavior together.

And from thus classes emerge inheritance and instantiation. **Class inerhitance implies copies**.

Another key concept with classes is polymorphism, which describes the idea that a general behavior from a parent class can be overridden in a child class to be more specifics.

But **Javascript actually doesn't have classes**. It tries to satisfy the extremely pervasive desire to design with classes by providing seemingly class-like syntax.

Javascript object mechanism does not automatically perform copy behavior when you inherit or instantiate. **There is no classes to instantiate, only objects**. And **objects don't get copied to other objects, they get linked together**.

Many libraries/framework use a utility to manually copy behavior from one parent object to a child object, called **extend(..)**. Technically functions are not actually duplicated, but rather **references to the functions are copied**.

Because of JS peculiarities, **explicit pseudopolymorphism (because of shadowing) create brittle manual/explicit linkage in every single function where you need such a pseudopolymorphic reference**. This can significantly increase the maintenance coast.

## Prototypes

Objects in Javascript have an **internal property**, denoted in the specification as **[[Prototype]], which is simply a reference to another object**. Almost all objects are given a non-null value for this property, at the time of their creation.

The default **[[Get]] operation proceeds to follow the [[Prototype]] link of the object if it cannot find the requested property on the object directly**. The process continues until either a matching property name is found or the [[Prototype]] chain ends. If no matching property is ever found, the return result from the [[Get]] operation is *undefined*.

Same for the *for..in* loop, any property that can be reached via its chain will be enumerate. The [[Prototype]] chain is consulted, **one link at a time**.

**The top end of every normal [[Prototype]] chain is the built-in Object.prototype**.

If the object has already a normal data accessor property directly present on it, the assignlent is as simple as changing the value of the existing property.

If the property is not already present directly on the object, the [[Prototype]] chain is traversed. If the property is not found anywhere ins the chain, the property is added directly to the object with the specified value, as expected.

However, if the property is already present somewhere higher in the chain nuanced behavior can occur :
- if a normal data accessor property is found anywhere higher on the [[Prototype]] chain, and it's not marked as read-only (writable:false), then a new property with the same name is added directly on the object, resulting in a **shadowing property**.
- if a property is found higher on the [[Prototype]] chain, but it's marked as read-only (writable:true), then both the setting of the existing property as well as the creation of the shadowed property are disallowed. If the code is running in strict mode, an error will be thrown.
- If a property is found higher on the [[Prototype]] chain, and it's a setter, then the setter will always be called. No property with the fame name will be added on the object, nor setter will be redefined.

If you want to shadow in case 2 and 3, you must use Object.defineProperty(..).

**Shadowing methods leads to ugly explicit pseudopolymorphism if you need to delegate between them**. So you should try to avoid it if possible.

Javascript is the only language with the right to use the label "object-oriented". The object defines its own behavior directly. There's just the object.

*new* keyword end up with a new object internally [[Prototype]]-linked to the based object.prototype. So we basically 2 objects linked to each other.

JS creates a link between 2 objects, where one object can essentially **delegate property/function access to another object**.

object.constructor is extremely unreliable, and it's unsafe reference to rely upon in your code.

The call to **Object.create(..) creates a "new" object out of thin air, and links that new object's internal [[Prototype]] to the object you specify**.

With ES6, we can modify the linkage of an existing object with *Object.setPrototypeOf(..)*.

To do introspection, we can do *Foo.prototype.isPrototypeOf(a);*

You can also directly retrieve the [[Prototype]] of an object with *Object.getPrototypeOf(a);*.

Object.create(null) creates an object that has an empty [[Prototype]] linkage, and thus the object can't delegate anywhere.

## Behavior delegation

We need to try to change our thinking from the class/inheritance design pattern to the behavior delegation pattern.

**Rather than compose 2 object together, via class copies, we can keep them in their separate objects and allow one object to delegate to another object when needed**.

It's the **OOLO pattern (object linked to other objects)**.

We **avoid if at all possible naming things the same at different levels of the [[Prototype]] chain**.

More use of **descriptive method names**, specific to the type of behavior each object is doing.

**Behavior delegation** means to **let some object provide a delegation for property or method references** if they are not found on the object.

Rather than organizing objects in your mind vertically, with parent flowing down to children, **think object side by side, with any direction of delegation links between the objects as necessary**.

You **cannot create a cycle where 2 or more objects** are mutually delegated to each other. You will get an error.

OOLO design is **way more easier** to desing architecture in JS than OO.

Construction and initialisation of objects can be done at 2 different times.

There is **no need of composition** in the delegation pattern as the 2 object have the abilities to cooperate.

In ES6, we can use **concise method declarations in any literal objects**. And you can delegate to another object with Object.setPrototypeOf(...) :
```js
// Now link AuthController to delegate to LoginController
Object.setPrototypeOf(AuthController, LoginController);
```

Just be aware with concise method that you can suffer of lack of self-reference. So in this case, make sure you do a manual named function expression declaration.

## ES6 class

They are **optional design pattern for code** and they are quite often **awkward to implement** in a [[Prototype]] language like Javascript.

Because in a [[Prototype]] language the **action is not a copy** but rather **the opposite a delegation link**.

Even if it has improved the way to write OO design pattern in JS, it's just syntactic sugar on top of existing [[Prototype]] delegation mechanism.

It just make it harder to understand the difference between traditional classes and delegated objects.

You completely loss the fact that an object is a concrete thing, which you can directly interact.

It feels like very **unnatural fit on top of the elegant simplicity** of the [[Prototype]] mechanism.
