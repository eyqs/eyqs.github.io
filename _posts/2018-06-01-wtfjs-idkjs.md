---
title: Weird Things From JavaScript, Because I Don't Know JavaScript
description: A selection of weird things from JavaScript that Eugene Y. Q. Shen finally understands after reading a book before this 2018 June blog post.
---

I'm currently reading Kyle Simpson's [You Don't Know JS][YDKJS] (YDKJS), often considered the best JavaScript series ever written, and it is the best JavaScript series I've ever read. If you're going to really work with JavaScript, or Node.js, or TypeScript, please just read [this summary][vol1ch3] to see everything you're missing out on.

But although the explanations are extremely comprehensive (yet mysteriously brief), there's no end-of-chapter problems for me to solidify my understanding. If you've read that summary, you'll think that Kyle's favourite word is "perhaps" and his favourite hobby is debunking common misconceptions, demystifying widespread myths, tackling persistent mistruths, and overthrowing conventional wisdom about JavaScript. His eternal enemies are all the commoners who pause at a WTF moment, shrug their shoulders, and say resignedly, "Just JavaScript, eh?"

So what better way to test my newfound knowledge than by addressing all these WTFs?

<!--more-->

The format of this post is slightly awkward, since I can't link to sections within each chapter of YDKJS, but I'll generally address each WTF with a direct quote from YDKJS. The first three words of the quote will be a link to the relevant chapter, so just Ctrl+F in the chapter until you find the context of the quote.

### WTFJS

<iframe width="560" height="315" src="https://www.youtube.com/embed/et8xNAc2ic8" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Brian Leroux's WTFJS was the original "Weird Things From JavaScript" talk, before everybody got tired of the same nits about type coercion over and over again. That's why almost the entire thing is about type coercion or IEEE 754 floating-point numbers, and to avoid needless repetition, I'll address all that here and never again. YDKJS only has two rules about type coercion, and I'll add a third:

1. [If either side][vol4ch4] of the comparison can have `true` or `false` values, don't ever, EVER use `==`.
2. If either side of the comparison can have `[]`, `""`, or `0` values, seriously consider not using `==`.
3. Otherwise, use `==` to allow type coercion, and `===` to forbid it.

Now, on to the play-by-play.

0:00: Introduction.

1:08: [The so-called "falsy"][vol4ch4] values list is: `undefined`, `null`, `false`, `+0`, `-0`, `NaN`, and `""`.

1:50: Rule 1. TODO: why?

2:30: Brian explains the next few WTFs.

3:30: Rule 2. TODO: why?

3:45: [`null` and `undefined`][vol4ch4] can be treated as indistinguishable for comparison purposes, if you use the `==` loose equality operator to allow their mutual implicit coercion.

4:00: [There is a][vol1ch2] `String` (capital S) object wrapper form that pairs with the primitive `string` type. Here, `'I am a string'` is a primitive `string` (after all, `typeof 'asdf' == 'string'`), so it's obviously not an instance of any class.

4:20: [Chapter 4][vol4ch4] and [chapter 3][vol4ch3] of Types & Grammar cover coercion (`String('a')`) and natives (`new String('a')`) respectively. Coercion gives a primitive `string`, and natives give the `String` object wrapper. Brian explains how `==` coerced the object wrapper into its string representation, giving us the result we expect by Rule 3. It's not so weird after all!

5:31: Brian explains this.

5:48: [The following built-in][vol1ch2] types are available: `string`, `number`, `boolean`, `null`, `undefined`, `object`, and `symbol`. So `typeof` anything that's not `string`, `number`, etc. is `object`.

6:07: [Values that are][vol4ch3] `typeof "object"` (such as an array) are additionally tagged with an internal `[[Class]]` property. This property can generally be revealed indirectly by borrowing the default `Object.prototype.toString(..)` method called against the value.

6:40: Brian explains the next few WTFs.

9:00: [If either operand][vol4ch4] to `+` is a `string`, the operation will be string concatenation. But the `-` operator is defined only for numeric subtraction, so `a - 0` forces `a`'s value to be coerced to a `number`.

9:27: [If the first][vol4ch4] character was `'0'`, the guess was that you wanted to interpret the `string` as an octal (base-8) `number`. But as of ES5, `parseInt(..)` no longer guesses octal. But you can still get the same behaviour with `parseInt('0o8')`.

9:49: This was the only WTF that wasn't covered in YDKJS. Going straight to the specifications for [`Number`][number], [`parseFloat`][parseF] and [`parseInt`][parseI], we see that `Number` and `parseFloat` explicitly check for a [`StrDecimalLiteral`][strDecL]---`Infinity`---while `parseInt` does not. This makes sense because IEEE 754 has representations for infinity, but infinity is not an integer.

10:21: [The trailing portion][vol4ch2] of a decimal value after the `.`, if `0`, is optional. And it's kinda pretty!

10:54: [Some developers use][vol4ch4] the double tilde `~~` to truncate the decimal part of a `number`. This short section in WTFJS explains everything about `~~x` and why its behaviour *differs* from `Math.round(x)`, `Math.floor(x)`, and `x | 0`, so you can give that a quick read.

11:13: [Like most modern][vol4ch2] languages, including practically all scripting languages, the implementation of JavaScript's numbers is based on the "IEEE 754" standard. All this behaviour is specified in that standard.

12:18: Brian explains this.

12:50: The actual error is `Uncaught TypeError: Right-hand side of 'instanceof' is not callable`, which makes sense.

13:03: [`NaN` literally stands][vol4ch2] for "not a number", though this label/description is very poor and misleading, as we'll see shortly. It would be much more accurate to think of `NaN` as being "invalid number," "failed number," or even "bad number," than to think of it as "not a number." But `NaN` is a primitive `number`, so again, it's not an instance of any class.

13:20: Brian explains this, but it's worth noting that [the `isNaN(..)` utility][vol4ch2] has a fatal flaw, so read that to find out why.

13:43: It's kinda fun. This is just handy.

14:00: Brian explains this rather well, But remember Rule 2!

14:55: Rule 3 gives us the result we expect.

15:08: [This is a][vol1ch2] long-standing bug in JS, but one that is likely never going to be fixed. This is also the only real WTF in the entire talk.

15:22: Brian explains this rather quickly. `"constructor"` is a string. `"constructor".constructor` is the function that gets called when you run `new String()`. `"constructor".constructor.constructor` is the constructor of that function, which is the function that gets called when you run `new Function()`. And `new Function(..)()` returns a new function and calls it.

16:15: This is just a hack for people who forget to write `foo = new Foo()` instead of `foo = Foo()`. If you use the new ES6 `class` syntax, you'll get an `Uncaught TypeError: Class constructor Foo cannot be invoked without 'new'`, so you'll never forget it.

17:12: Conclusion.

TODO: There will be more as I go through more books in the series!

[number]:  https://tc39.github.io/ecma262/#sec-number-constructor-number-value
[parseF]:  https://tc39.github.io/ecma262/#sec-parsefloat-string
[parseI]:  https://tc39.github.io/ecma262/#sec-parseint-string-radix
[strDecL]: https://tc39.github.io/ecma262/#sec-tonumber-applied-to-the-string-type
[vol1ch2]: https://github.com/getify/You-Dont-Know-JS/blob/master/up%20%26%20going/ch2.md
[vol1ch3]: https://github.com/getify/You-Dont-Know-JS/blob/master/up%20%26%20going/ch3.md
[vol4ch2]: https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch2.md
[vol4ch3]: https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch3.md
[vol4ch4]: https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch4.md
[ydkjs]:   https://github.com/getify/You-Dont-Know-JS/
