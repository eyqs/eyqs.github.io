---
layout: post
title: Weird Things From JavaScript, Because I Don't Know JavaScript
description: A selection of weird things from JavaScript that Eugene Y. Q. Shen finally understands after reading a book before this 2018 June blog post.
---

I'm currently reading Kyle Simpson's [You Don't Know JS][YDKJS] (YDKJS), the [eighth-most starred project on GitHub][stars], often considered the best JavaScript series ever written, and it is the best JavaScript series I've ever read. If you're going to really work with JavaScript, or Node.js, or TypeScript, please just read [this summary][vol1ch3] to see everything you're missing out on.

But although the explanations are extremely comprehensive (yet mysteriously brief), there's no end-of-chapter problems for me to solidify my understanding. If you've read that summary, you'll think that Kyle's favourite word is "perhaps" and his favourite hobby is debunking common misconceptions, demystifying widespread myths, tackling persistent mistruths, and overthrowing conventional wisdom about JavaScript. His eternal enemies are all the commoners who pause at a WTF moment, shrug their shoulders, and say resignedly, "Just JavaScript, eh?"

So what better way to test my newfound knowledge than by addressing all these WTFs?

<!--more-->

The format of this post is slightly awkward, since I can't link to sections within each chapter of YDKJS, but I'll generally address each WTF with a direct quote from YDKJS. The first three words of the quote will be a link to the relevant chapter, so just Ctrl+F in the chapter until you find the context of the quote.

### WTFJS

<iframe width="560" height="315" src="https://www.youtube.com/embed/et8xNAc2ic8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Brian Leroux's WTFJS was the original "Weird Things From JavaScript" talk, before everybody got tired of the same nits about type coercion and IEEE 754 floating-point numbers over and over again. YDKJS only has two rules about type coercion, and I'll add a third:

1. [If either side][vol4ch4] of the comparison can have `true` or `false` values, don't ever, EVER use `==`.
2. If either side of the comparison can have `[]`, `""`, or `0` values, seriously consider not using `==`.
3. Otherwise, use `==` to allow type coercion, and `===` to forbid it.

Now, on to the play-by-play.

0:00: Introduction.

1:08: [The so-called "falsy"][vol4ch4] values list is: `undefined`, `null`, `false`, `+0`, `-0`, `NaN`, and `""`.

1:50: Rule 1. `null != false` makes sense, but the others are two of the seven items on the ["bad list"][vol4ch4]. Don't do this!

2:30: Brian explains the next few WTFs.

3:30: Rule 2. `0 == "0"` actually kinda makes sense, but `0 == ""` definitely doesn't.

3:45: [`null` and `undefined`][vol4ch4] can be treated as indistinguishable for comparison purposes, if you use the `==` loose equality operator to allow their mutual implicit coercion.

4:00: [There is a][vol1ch2] `String` (capital S) object wrapper form that pairs with the primitive `string` type. Here, `'I am a string'` is a primitive `string` (after all, `typeof 'asdf' == 'string'`), so it's obviously not an instance of any object.

4:20: [Chapter 4][vol4ch4] and [chapter 3][vol4ch3] of Types & Grammar cover coercion (`String('a')`) and natives (`new String('a')`) respectively. Coercion gives a primitive `string`, and natives give the `String` object wrapper. Brian explains how `==` coerced the object wrapper into its string representation, giving us the result we expect by Rule 3. It's not so weird after all!

5:31: Brian explains this.

5:48: [The `typeof` operator][vol4ch1] inspects the type of the given value, and always returns one of seven string values. So `typeof` anything that's not a `string`, `number`, `boolean`, `undefined`, `function`, or `symbol` is `object`.

6:07: [Values that are][vol4ch3] `typeof "object"` (such as an array) are additionally tagged with an internal `[[Class]]` property. This property can generally be revealed indirectly by borrowing the default `Object.prototype.toString(..)` method called against the value.

6:40: Brian explains the next few WTFs.

9:00: [If either operand][vol4ch4] to `+` is a `string`, the operation will be string concatenation. But [the `-` operator][vol4ch4] is defined only for numeric subtraction, so `a - 0` forces `a`'s value to be coerced to a `number`.

9:27: [If the first][vol4ch4] character was `'0'`, the guess was that you wanted to interpret the `string` as an octal (base-8) `number`. But as of ES5, `parseInt(..)` no longer guesses octal, and you'd have to do `parseInt('0o8')` instead.

9:49: This was the only WTF in this talk that wasn't covered in YDKJS. Going straight to the specifications for [`Number`][number], [`parseFloat`][parseF] and [`parseInt`][parseI], we see that `Number` and `parseFloat` explicitly check for a [`StrDecimalLiteral`][strDecL]---`Infinity`---while `parseInt` does not. This makes sense because IEEE 754 has representations for infinity, but infinity is not an integer.

10:21: [The trailing portion][vol4ch2] of a decimal value after the `.`, if `0`, is optional. And it's kinda pretty!

10:54: [Some developers use][vol4ch4] the double tilde `~~` to truncate the decimal part of a `number`. This short section in YDKJS explains everything about `~~x` and why its behaviour *differs* from `Math.round(x)`, `Math.floor(x)`, and `x | 0`, so you can give that a quick read.

11:13: [Like most modern][vol4ch2] languages, including practically all scripting languages, the implementation of JavaScript's numbers is based on the "IEEE 754" standard. All this behaviour is specified in that standard.

12:18: Brian explains this.

12:50: The actual error is `Uncaught TypeError: Right-hand side of 'instanceof' is not callable`, which makes sense.

13:03: [`NaN` literally stands][vol4ch2] for "not a `number`", though this label/description is very poor and misleading, as we'll see shortly. It would be much more accurate to think of `NaN` as being "invalid number," "failed number," or even "bad number," than to think of it as "not a number." But `NaN` is a primitive `number`, so again, it's not an instance of any object.

13:20: Brian explains this, but it's worth noting that [the `isNaN(..)` utility][vol4ch2] has a fatal flaw, so read that to find out why.

13:43: It's kinda fun. This is just handy.

14:00: Brian explains this rather well, But remember Rule 2!

14:55: Rule 3 gives us the result we expect.

15:08: [This is a][vol1ch2] long-standing bug in JS, but one that is likely never going to be fixed. This is also the only real WTF in the entire talk.

15:22: Brian explains this rather quickly. `"constructor"` is a string. `"constructor".constructor` is the function that gets called when you run `new String()`. `"constructor".constructor.constructor` is the constructor of that function, which is the function that gets called when you run `new Function()`. And `new Function(..)()` returns a new function and calls it.

16:15: This is just a hack for people who forget to write `foo = new Foo()` instead of `foo = Foo()`. If you use the new ES6 `class` syntax, you'll get an `Uncaught TypeError: Class constructor Foo cannot be invoked without 'new'`, so you'll never forget it.

17:12: Conclusion.

### Javascript sucks and it doesn't matter

<iframe width="560" height="315" src="https://www.youtube.com/embed/PV_cFx29Xz0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Rob Ashton gave this talk a month before Brian Leroux, which is primarily about "it doesn't matter" rather than "JavaScript sucks". But the first few minutes does have a few WTFs, and it's the third most-viewed WTFJS video on YouTube, so it's worth a look.

0:00: Introduction.

1:38: [What do we][vol4ch4] know about the `!` unary operator? It explicitly coerces to a `boolean` using the `ToBoolean` rules (and it also flips the parity). So before `[0] == ![0]` is even processed, it's actually already translated to `[0] == false` [...] the right-hand side `[0]` will go through a `ToPrimitive` coercion [...] which then is `ToNumber` coerced to `0` for the right-hand side value, which is falsy.

2:14: This WTF wasn't covered in YDKJS, so we jump to the specs for [Array.prototype.toString()][arrToS], which calls [Array.prototype.join()][arrJoin], which in step 7c says: "If element is `undefined` or `null`, let *next* be the empty String; otherwise, let *next* be ? ToString(*element*)." `[].toString()` comes from step 5 and 8: "Let *R* be the empty String. Return *R*." That makes sense, but the special check for `undefined` or `null`... WTF?!

2:54: Brian Leroux explains this at 12:19 of his talk.

3:16: [WTF, JSFuck!?][jsfuck]

3:40: [Scopes.][vol2] [This.][vol3] [Classes.][vol6ch3] [Sugar.][sugar] [Tools.][tools] As Rob elaborates in the rest of his talk, JavaScript had them all, even back in 2012!

### WAT

<iframe width="560" height="315" src="https://www.youtube.com/embed/BrB0oaSz8Nk" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Gary Bernhardt gave this talk ten months before the previous, so maybe this is really the original WTFJS talk, before all the obscenity crept in.

0:00: Ruby.

1:21: [If either operand][vol4ch4] to `+` is a `string` (or becomes one with the above steps!), the operation will be `string` concatenation.

1:51: [Another commonly cited][vol4ch5] JS gotcha is this exact example.

2:26: [`{}` is interpreted][vol4ch5] as a standalone `{}` empty block (which does nothing). Finally, `+ {}` is an expression that *explicitly coerces* (see Chapter 4) the `{}` to a `number`, which is `NaN`.

3:03: "This is actually the only line in this entire presentation that's reasonable."

3:33: [The `-` operator][vol4ch4] is defined only for numeric subtraction, so `a - 0` forces `a`'s value to be coerced to a `number`, which is `NaN`.

3:54: Conclusion.

### wtfjs.com

Because this post is apparently in reverse chronological order now, turns out that the original original WTFJS was Brian Leroux's [wtfjs.com][wtfjs]. In fact, we've seen most of the WTFs already in the three videos above, respectively titled "Brian", "Rob", and "Gary":

- [almost but not quite](https://wtfjs.com/wtfs/2010-02-12-almost-but-not-quite): Brian, 6:40.
- [foonanny](https://wtfjs.com/wtfs/2010-02-12-foonanny): Brian, 5:31.
- [min number treachery](https://wtfjs.com/wtfs/2010-02-12-min-number-treachery), Brian, 12:07.
- [maths fun](https://wtfjs.com/wtfs/2010-02-12-maths-fun): Brian, 13:03, 11:14, 7:06.
- [not a number is a number](https://wtfjs.com/wtfs/2010-02-12-not-a-number-is-a-number): Duplicate of [maths fun](https://wtfjs.com/wtfs/2010-02-12-maths-fun).
- [not a number is not not a number](https://wtfjs.com/wtfs/2010-02-12-not-a-number-is-not-a-not-a-number): [`NaN` isn't equal][vol4ch2] to itself. `NaN` is the *only* value in the whole language where that's true.
- [null is not an object](https://wtfjs.com/wtfs/2010-02-12-null-is-not-an-object): Brian, 15:08.
- [parseint treachery](https://wtfjs.com/wtfs/2010-02-12-parseint-treachery): Brian, 9:27.
- [null is not falsy](https://wtfjs.com/wtfs/2010-02-13-null-is-not-falsy): Brian, 1:50.
- [string is not string](https://wtfjs.com/wtfs/2010-02-13-string-is-not-string): Brian, 4:00.
- [careful](https://wtfjs.com/wtfs/2010-02-15-careful): Rob, 1:38.
- [hoisting](https://wtfjs.com/wtfs/2010-02-15-hoisting): [Only the declarations][vol2ch4] themselves are hoisted, while any assignments or other executable logic are left *in place*. If hoisting were to re-arrange the executable logic of our code, that could wreak havoc.
- [scope fun](https://wtfjs.com/wtfs/2010-02-15-scope-fun): [The top-end of][vol3ch5] every normal `[[Prototype]]` chain is the built-in `Object.prototype`. So `window.foo === 10` in the browser or `global.foo === 10` in Node, then `console.log(foo)` is `console.log(window.foo)` or `console.log(global.foo)`.
- [thc timetravel](https://wtfjs.com/wtfs/2010-02-15-thc-timetravel): [According to the][vol4ch2] specification, if an operation like addition results in a value that's too big to represent, the IEEE 754 "round-to-nearest" mode specifies what the result should be.
- [true has a value](https://wtfjs.com/wtfs/2010-02-15-true-has-a-value): Brian, 2:40.
- [undefined is mutable](https://wtfjs.com/wtfs/2010-02-15-undefined-is-mutable): [In non-`strict` mode][vol4ch2], it's actually possible (though incredibly ill-advised!) to assign a value to the globally provided `undefined` identifier:
- [automagic semicolons](https://wtfjs.com/wtfs/2010-02-16-automagic-semicolons): [The `return` statement][vol4ch5] doesn't carry across the newline, as automatic semicolon insertion assumes the `;` terminating the `return` statement.
- [concat coerce](https://wtfjs.com/wtfs/2010-02-19-concat-coerce): Brian, 9:00.
- [boolean paradox](https://wtfjs.com/wtfs/2010-02-23-boolean-paradox): Brian, 2:52.
- [coerced](https://wtfjs.com/wtfs/2010-02-23-coerced): Duplicate of [parseint treachery](https://wtfjs.com/wtfs/2010-02-12-parseint-treachery).
- [makes perfect sense](https://wtfjs.com/wtfs/2010-02-23-makes-perfect-sense): Brian, 8:29.
- [messing with number prototype](https://wtfjs.com/wtfs/2010-02-24-messing-with-number-prototype): Brian, 7:46.
- [implicit tostring fun](https://wtfjs.com/wtfs/2010-02-26-implicit-tostring-fun): Brian, 4:20.
- [call in ur call](https://wtfjs.com/wtfs/2010-04-12-call-in-ur-call): `let f = function (a) {return a}`. Then this is equivalent to `Function.prototype.call.apply(f, [1,2])`, which is `f.call(1, 2)`, which is `f(2)`, which is `2`.
- [isNaN](https://wtfjs.com/wtfs/2010-04-31-isNaN): `null !== NaN` makes sense. Brian, 13:20.
- [instances and default values](https://wtfjs.com/wtfs/2010-06-02-instances-and-default-values): [It's a very][vol4ch4] little known fact that **`==` and `===` behave identically** in the case where two `object`s are being compared! Two such values are only *equal* if they are both references to *the exact same value*.
- [function in ur string](https://wtfjs.com/wtfs/2010-06-09-function-in-ur-string): Brian, 15:22.
- [typeof number is not number](https://wtfjs.com/wtfs/2010-07-15-typeof-number-is-not-number): Duplicate of [messing with number prototype](https://wtfjs.com/wtfs/2010-02-24-messing-with-number-prototype).
- [magic increasing number](https://wtfjs.com/wtfs/2010-07-22-magic-increasing-number): Brian, 6:40.
- [im not a number really](https://wtfjs.com/wtfs/2010-07-23-im-not-a-number-really): Duplicate of [maths fun](https://wtfjs.com/wtfs/2010-02-12-maths-fun).
- [false advertising](https://wtfjs.com/wtfs/2010-11-10-false-advertising): [Unless the function][vol3ch2] returns its own alternate **object**, the `new`-invoked function call will automatically return the newly constructed object.
- [i am myself but also not myself](https://wtfjs.com/wtfs/2010-11-15-i-am-myself-but-also-not-myself): Duplicate of [careful](https://wtfjs.com/wtfs/2010-02-15-careful).
- [all your commas are belong to Array](https://wtfjs.com/wtfs/2011-02-11-all-your-commas-are-belong-to-Array): Rob, 2:14.
- [parseInt is not eval](https://wtfjs.com/wtfs/2011-05-12-parseInt-is-not-eval): [Parsing a numeric][vol4ch4] value out of a string is *tolerant* of non-numeric characters -- it just stops parsing left-to-right when encountered.
- [parseint magic](https://wtfjs.com/wtfs/2011-06-23-parseint-magic): Duplicate of [infinity madness](https://wtfjs.com/wtfs/2012-10-10-infinity-madness).
- [min less max](https://wtfjs.com/wtfs/2011-06-27-min-less-max): Brian, 12:07.
- [iteration demoralization](https://wtfjs.com/wtfs/2011-07-26-iteration-demoralization): [The `in` operator][vol3ch3] has the appearance that it will check for the existence of a value inside a container, but it actually checks for the existence of a property name.
- [changing variables changes arguments](https://wtfjs.com/wtfs/2012-04-18-changing-variables-changes-arguments): [If you pass][vol4ch5] an argument, the `arguments` slot and the named parameter are linked to always have the same value. [...] It's almost certainly a bad idea to ever rely on any such linkage.
- [Numbers and dots](https://wtfjs.com/wtfs/2012-05-07-Numbers-and-dots): Brian, 10:21.
- [infinity madness](https://wtfjs.com/wtfs/2012-10-10-infinity-madness): Read the [Parsing Non-Strings][vol4ch4] section for an explanation.
- [undefined props on numbers](https://wtfjs.com/wtfs/2012-12-28-undefined-props-on-numbers): [Primitive values don't][vol4ch3] have properties or methods, so to access `.width` or `.height` you need an object wrapper around the value.
- [unicode vars](https://wtfjs.com/wtfs/2013-02-13-unicode-vars): [Prior to ES6][vol6ch2], JavaScript strings could specify Unicode characters using Unicode escaping. [...] As of ES6, we now have a new form for Unicode escaping (in strings and regular expressions), called Unicode *code point escaping*.
- [why am i a number](https://wtfjs.com/wtfs/2013-02-21-why-am-i-a-number): [The unary `+`][vol4ch4] explicitly coerces its operand to a `number` value.
- [parseint radix](https://wtfjs.com/wtfs/2013-02-22-parseint-radix): Duplicate of [infinity madness](https://wtfjs.com/wtfs/2012-10-10-infinity-madness).
- [null, undefined and test](https://wtfjs.com/wtfs/2013-02-28-null,-undefined-and-test): [`RegExp.prototype.test()` applies `ToString()`][regexT].
- [false isn't false](https://wtfjs.com/wtfs/2013-03-06-false-isnt-false): Explained in the link.
- [true story bro](https://wtfjs.com/wtfs/2013-04-18-true-story-bro): Duplicate of [false isn't false](https://wtfjs.com/wtfs/2013-03-06-false-isnt-false).
- [isfinite null is true](https://wtfjs.com/wtfs/2013-04-28-isfinite-null-is-true): [`isFinite()` applies `ToNumber()`][isFNum], but [`Number.isFinite()` fixes this WTF][numIsF].
- [negative indexes](https://wtfjs.com/wtfs/2013-06-20-negative-indexes): `indexOf()` returning `-1` is unfortunate, but Perl, Python, Ruby, etc. all support negative array indices.
- [array constructor](https://wtfjs.com/wtfs/2013-07-04-array-constructor): [The `a.map(..)` call][vol4ch3] fails because the slots don't actually exist, so `map(..)` has nothing to iterate over.
- [array ruse](https://wtfjs.com/wtfs/2013-07-18-array-ruse): [Trailing commas in][vol4ch3] lists (array values, property lists, etc.) are allowed (and thus dropped and ignored).
- [Math.max() behaviour](https://wtfjs.com/wtfs/2013-08-07-Math.max()-behaviour): [`Math.max()` applies `ToNumber()`][mathMax] on each of its arguments, and returns `NaN` if any value is `NaN`.
- [Array Constructor2 is Very Undefined](https://wtfjs.com/wtfs/2013-09-30-Array-Constructor2-is-Very-Undefined): Duplicate of [array constructor](https://wtfjs.com/wtfs/2013-07-04-array-constructor).
- [multiplying arrays and objects](https://wtfjs.com/wtfs/2014-01-11-multiplying-arrays-and-objects): [While far less][vol4ch4] common, `a * 1` or `a / 1` would force `a`'s value to be coerced to a `number`, which is `NaN` for `{}` and `[4, 4]`.
- [regular expression and slash](https://wtfjs.com/wtfs/2014-01-29-regular-expression-and-slash): This is standard regex behaviour.
- [Date.Date vs Year](https://wtfjs.com/wtfs/2014-02-04-Date.Date-vs-Year): [Months are identified][dateM] by an integer in the range 0 to 11, inclusive. But [a date number][dateD] is identified by an integer in the range 1 through 31, inclusive. WTF?!
- [wtf_document.all](https://wtfjs.com/wtfs/2014-02-22-wtf_document.all): [A "falsy object"][vol4ch4] is a value that looks and acts like a normal object (properties, etc.), but when you coerce it to a `boolean`, it coerces to a `false` value. [...] The most well-known case is `document.all`.
- [array indexof](https://wtfjs.com/wtfs/2014-02-25-array-indexof): Same idea as [array constructor](https://wtfjs.com/wtfs/2013-07-04-array-constructor).
- [String Integers Comparison](https://wtfjs.com/wtfs/2014-03-13-String-Integers-Comparison): [If both values][vol4ch4] are `string`s for the `<` comparison, simple lexicographic (natural alphabetic) comparison on the characters is performed.
- [regex test true false](https://wtfjs.com/wtfs/2014-03-13-regex-test-true-false): This is standard regex behaviour when you set the global flag `'g'`.
- [this length](https://wtfjs.com/wtfs/2014-05-05-this-length): `this` is the global `window` or `global` object, so `this.length === 0`.
- [true equals false](https://wtfjs.com/wtfs/2014-10-07-true-equals-false): Duplicate of [false isn't false](https://wtfjs.com/wtfs/2013-03-06-false-isnt-false).
- [object as object key](https://wtfjs.com/wtfs/2014-11-22-object-as-object-key): [Accessing a property][props] calls [`ToPropertyKey()`, which calls][propKey] `ToPrimitive()`, resulting in `[object Object]` for all empty objects.
- [Boolean constructor](https://wtfjs.com/wtfs/2015-02-02-Boolean-constructor): Objects are never falsy, except maybe [document.all](https://wtfjs.com/wtfs/2014-02-22-wtf_document.all).
- [good old octal decimal wtf](https://wtfjs.com/wtfs/2015-02-05-good-old-octal-decimal-wtf): Duplicate of [parseint treachery](https://wtfjs.com/wtfs/2010-02-12-parseint-treachery), plus a WTF for the silent fail.
- [adding arrays](https://wtfjs.com/wtfs/2015-03-23-adding-arrays): Gary, 1:21.
- [array sort](https://wtfjs.com/wtfs/2015-04-08-array-sort): [`Array.prototype.sort()`applies `toString()`][arrSort] on each element.
- [moving numbers](https://wtfjs.com/wtfs/2015-04-16-moving-numbers): [Let *shiftCount* be][leftS] the result of masking out all but the least significant 5 bits of `rnum`. For `rnum === 32`, we get `shiftCount === 0`.
- [screwy negative array index](https://wtfjs.com/wtfs/2015-04-23-screwy-negative-array-index): Duplicate of [negative indexes](https://wtfjs.com/wtfs/2013-06-20-negative-indexes).
- [Object And Array Prototype Length](https://wtfjs.com/wtfs/2016-03-10-Object-And-Array-Prototype-Length): This doesn't actually create a real array.

### What the... JavaScript?

It's 4:30 am, so let's hastily conclude with [a link to a popular wtfjs repo](https://github.com/denysdovhan/wtfjs), and the most popular WTFJS video on YouTube, by Kyle Simpson himself:

<iframe width="560" height="315" src="https://www.youtube.com/embed/2pL28CcEijU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

[stars]:   https://github.com/search?q=stars%3A%3E80000
[number]:  https://tc39.github.io/ecma262/#sec-number-constructor-number-value
[parseF]:  https://tc39.github.io/ecma262/#sec-parsefloat-string
[parseI]:  https://tc39.github.io/ecma262/#sec-parseint-string-radix
[strDecL]: https://tc39.github.io/ecma262/#sec-tonumber-applied-to-the-string-type
[regexT]:  https://www.ecma-international.org/ecma-262/#sec-regexp.prototype.test
[numIsF]:  https://www.ecma-international.org/ecma-262/#sec-number.isfinite
[isFNum]:  https://www.ecma-international.org/ecma-262/#sec-isfinite-number
[arrToS]:  https://www.ecma-international.org/ecma-262/#sec-array.prototype.tostring
[arrJoin]: https://www.ecma-international.org/ecma-262/#sec-array.prototype.join
[mathMax]: https://www.ecma-international.org/ecma-262/#sec-math.max
[dateM]:   https://www.ecma-international.org/ecma-262/#sec-month-number
[dateD]:   https://www.ecma-international.org/ecma-262/#sec-date-number
[props]:   https://www.ecma-international.org/ecma-262/#sec-property-accessors-runtime-semantics-evaluation
[propKey]: https://www.ecma-international.org/ecma-262/#sec-topropertykey
[arrSort]: https://www.ecma-international.org/ecma-262/#sec-array.prototype.sort
[leftS]:   https://www.ecma-international.org/ecma-262/#sec-left-shift-operator
[hasInst]: https://www.ecma-international.org/ecma-262/#sec-ordinaryhasinstance
[ydkjs]:   https://github.com/getify/You-Dont-Know-JS/
[vol1ch2]: https://github.com/getify/You-Dont-Know-JS/blob/master/up%20%26%20going/ch2.md
[vol1ch3]: https://github.com/getify/You-Dont-Know-JS/blob/master/up%20%26%20going/ch3.md
[vol2]:    https://github.com/getify/You-Dont-Know-JS/tree/master/scope%20%26%20closures
[vol2ch4]: https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch4.md
[vol3]:    https://github.com/getify/You-Dont-Know-JS/tree/master/this%20%26%20object%20prototypes
[vol3ch2]: https://github.com/getify/You-Dont-Know-JS/tree/master/this%20%26%20object%20prototypes/ch2.md
[vol3ch3]: https://github.com/getify/You-Dont-Know-JS/tree/master/this%20%26%20object%20prototypes/ch3.md
[vol3ch5]: https://github.com/getify/You-Dont-Know-JS/blob/master/this%20%26%20object%20prototypes/ch5.md
[vol4ch1]: https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch1.md
[vol4ch2]: https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch2.md
[vol4ch3]: https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch3.md
[vol4ch4]: https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch4.md
[vol4ch5]: https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch5.md
[vol4chA]: https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/apA.md
[vol6ch2]: https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20%26%20beyond/ch2.md
[vol6ch3]: https://github.com/getify/You-Dont-Know-JS/blob/master/es6%20%26%20beyond/ch3.md
[jsfuck]:  https://github.com/aemkei/jsfuck
[sugar]:   https://github.com/getify/You-Dont-Know-JS/search?q=sugar&unscoped_q=sugar
[tools]:   https://github.com/sorrycc/awesome-javascript
[wtfjs]:   https://wtfjs.com/
