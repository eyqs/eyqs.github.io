---
title: A Collective View of a Collection of Introductory Programming Books
description: A review of introductory programming books Eugene Y. Q. Shen used in 2016 July to introduce programming in himself.
---

This post contains exactly what it says on the tin&mdash;I read many introductory programming books this summer, as promised [in April][April blog post], and I'd like to review some of them. I know you're all itching to read reviews of books you'll never read, but please bear with me as I set some unnecessary context.

Note that I did say, introductory books. If you already know these languages, or really even any language at all, then reading this post will be a complete waste of your time. Otherwise, reading this post will probably still be a waste of your time, but let's not bicker over details.

<!--more-->

I've always been a fan of massive open online courses. Throughout high school, I took dozens of courses on platforms such as [Coursera][] and [edX][]. Of course, with my attitude towards learning, that's "took" in the same sense that I "took" CPSC 490 last term, which is to say, I attended the first month of lectures before mysteriously disappearing as soon as the first assignment came out. It's fun to read the course descriptions and imagine yourself afterwards as the proud scholar with a newfound understanding for the intricacies of Kierkegaard's thought, but not so fun when it comes down to actually doing the work.

There's actually another sense of "took" that I partook in last term, for PHYS 158, in which I never did any assignments, bombed the midterm, and attended a total of five lectures. (I firmly deny the baseless accusation that I have never legitimately taken a course at UBC. For example, I showed up to every PHYS 159 lecture, never mind that it was a one-credit lab.) The first was to see how the lectures were; the second was to realize that they were not; the third was to confirm that they really were not.

(The fourth was to get my midterm back; unfortunately, I was a lecture late and had to meet the prof's surprisingly apathetic gaze in office hours as he personally handed me my unflattering mark. The fifth was to see if the prof would reveal any secret strategies for the final exam; fortunately, he delivered, by proclaiming that 100% of the final mark would be based on the final exam. I passed the course.)

The point is that I don't like lectures very much. For the majority of courses I've taken—PHYS 158, PHYS 170, MATH 152, MATH 217, even MUSC 101—it would be a better use of time to carefully read the textbook and solve practice problems than to attend the lectures. The main exceptions are those without textbooks and those with a flipped classroom model, in which case lectures are actually useful and probably mandatory too. Even the best lecturers can't explain in 90 minutes what a professionally-edited textbook does in 9 pages. You don't have to scramble to keep up with the lecturer's pace and all their tangents and diversions; you don't have to decipher their scribbles or strain to understand their accent above the din of incessant chattering. Here is one of many situations in which university students would do well to learn from their elementary school counterparts; when the lecturer is lecturing, stop talking and listen!

Ultimately, it's all futile. The entire concept of a lecture probably dates from an era before mass publishing, and definitely before e-books became ubiquitous and universally accessible from any location. A lecture is ephemeral, but a book is permanent. Learning from a lecture is like forcing yourself into a one-size-fits-all garment when you could order something tailor-made from China for half the cost.

One day, I realized that those massively open online courses are basically canned lectures with assignments. But I don't like lectures, and I don't like assignments. So why was I still taking courses like "Introduction to Programming with MATLAB" when I could just pick up [MATLAB: A Practical Introduction][] instead?

And that's the story of how I started reading introductory programming books. Let's start reviewing them.

<hr />

#### Racket: [How to Design Programs][], 3/5

*How to Design Programs* is an introduction to the art of designing programs, mainly suitable for complete beginners at programming and non-beginners who don't actually know how to design programs. So it's basically suitable for everyone. It uses [Racket][] and is a good introduction to functional programming as well, but the focus ostensibly remains squarely on the process of designing programs, rather than anything too Racket-specific. However, the process of program design (really, "a couple of functions design") espoused in the book can basically be summarized in two phrases: write test cases, and abstract your functions. Most of the book focuses on writing functions to deal with different forms of input data, like lists, trees, and graphs.

I know, I just spent two paragraphs arguing about how lectures are the bane of all existence and how massively open unlined courses swindled me out of dozens of hours that I could have spent moping around. But *How to Design Programs* reads more like a lecture than a book. It proceeds like a trickle of consciousness, as if your invisible program design teacher friend is guiding you through every laborious step of solving each problem. In fact, I do prefer Gregor Kiczales's *[Systematic Program Design][]*, in which the invisible program design teacher friend is replaced with an concrete program design teacher, namely, Kiczales.

(It says something about the quantity of content in a massively parallel online course that the introductory computer science course at UBC, [CPSC 110][], is split up into three separate courses on edX. Each of these three courses costs $50, which is insanely expensive until you realize that CPSC 110 costs a total of $678.40 for domestic students, in 2016. Either way, if you wanna take a full engineering course load with just edX courses, try taking 21 of them at once.)

Kiczales really emphasized the importance of "following the design recipe" in CPSC 110, and by really emphasized I really mean, really emphasized. Apparently, about 80% of the marks in each question were for following the recipe, and only 20% for actually being a correct answer. Perhaps the most emphasized part of the recipe was the importance of copying function templates from a list of all the allowed template rules. So it surprised me that *How to Design Programs*, on which CPSC 110 is based, has no such devotion to the sanctity of the template. Perhaps this is why I liked Kiczales's lectures more; copying templates means not thinking, copying templates is unconsciousness. There is simply no other way to teach students with no prior programming knowledge how to use worklist accumulators in just three months. On the other hand, there are benefits to relaxing the adherence to template rules, in that readers will actually understand how to write templates without a cheat sheet.

Ultimately, I'd still recommend taking *Systematic Program Design* on edX instead of reading the book, but if you hate lectures even more than me or have a distrust of authority figures telling you exactly what to do, *How to Design Programs* isn't all that bad. And if you'd ever like to learn programming, or learn functional programming, or learn how to design programs, I definitely recommend you consider one of the two.

#### Racket: [The Racket Guide][], 4/5

*The Racket Guide* is an extremely comprehensive introduction to Racket. Perhaps extremely doesn't adequately communicate the extremity of its comprehensiveness; it's 369 pages long and *dense*, yet somehow also highly readable. One of the main drawbacks to relying on massively multiplayer online courses for absorbing programming techniques in a certain language is their non-comprehensiveness. For most languages, there's only one comprehensive source of truth: the documentation itself. But understanding the documentation requires that you understand the language, which is a problem if you're planning to understand the language by understanding the documentation.

Fortunately, for Racket, there's both the guide and a [reference manual][The Racket Reference Manual]. Reading through the guide really prepares you to understand concepts that the reference manual barely explains. Consider Racket's contract system; just try to understand it just by reading the reference manual! Now if you don't succeed after several minutes, try reading the relevant section in the guide instead. (If you do succeed before several minutes, congratulations; you're better at reading documentation than I am. This is not a very impressive achievement.)

I truly believe that every language ought to have a corresponding guide&mdash;an overview and comprehensive high-level explanation of all its most important features without going into unnecessary detail about the signatures of every function. Maybe they do, and they just aren't as visible as Racket's, or I'm too blind to find them. Regardless, Racket does have a guide, and *The Racket Guide* is really the best, and perhaps only real, introduction to Racket.

#### Common Lisp: [Practical Common Lisp][], 5/5

*Practical Common Lisp* is a practical introduction to Common Lisp. While I was reading through all the books in this post, I never really understood what I wanted until I read this. What I was looking for, something that no number of massively destructive online courses could offer, was something active and engaging, the experience of building something real and practical. I only now realize the key distinguishing feature between a bland lecture and an exciting book: lectures are inherently passive modes of communication, while certain books force you to actively engage with them. This also explains my relative approval of flipped-classroom lectures, which are about as active as lectures can get.

*Practical Common Lisp* teaches you everything about Common Lisp from the ground up, or at the very least enough about Common Lisp to create, among others, a spam filter, an MP3 browser, and an HTML generation library. Of its 32 chapters, 12 are purely focused on practical applications of Common Lisp in software engineering. I've never read a book that mixes introductory theory and application so smoothly; some, like *How to Design Programs*, focus solely on the process of design on contrived examples that'll never come up in industry; others, like *The Racket Guide*, focus solely on the bread and butter of the language itself; and the rest focus on building actual applications, which is great, except when their target audience is senior Java gurus with a decade of experience in software development.

A note of caution: I've only read through half the book so far, so I'm not totally justified in my 5-star review. (Even if I had read through the entire book, I doubt I'd be justified anyway. All of my justifications are rather pathetic.) Nevertheless, from what I have read, I can confidently recommend *Practical Common Lisp* to anyone interested in any Lisp.

#### MIT/GNU Scheme: [MIT/GNU Scheme User's Manual][], 1/5

The homepage of [MIT/GNU Scheme][] (henceforth just Scheme, as I haven't tried any others) has links to both a user's manual and a reference manual. You'd think that the user's manual would be comparable to Racket's guide, but you'd be woefully mistaken. You'd think that the user's manual would be an actual user's manual, wouldn't you? But you'd be, uh, correct, yes, it's basically a user's manual, like one you'd find with your new chainsaw or vacuum cleaner or IKEA&reg; furniture, as opposed to one for your car or calculator or programming language.

The user's manual teaches you nothing about the language proper, but does get you up and running with detailed instructions for installation, compilation, and best of all, debugging. To this day I still don't understand how gdb works (don't worry, I'll rectify this tomorrow), and the only debuggers I can use are in IDEs or Edwin, the official Scheme text editor. Read the *MIT/GNU Scheme User's Manual* if you have problem setting up Scheme and look elsewhere for an actual introductory programming book.

#### Scheme: [The Little Schemer][], 2/5

Coauthored by a coauthor of *How to Design Programs*, *The Little Schemer* is an extremely terse introduction to Scheme. It follows the Socratic method of questions and answers, which is a rather unique flavour that I found not to my taste. Perhaps the best illustration is by illustration. The entire book is in the same format as this excerpt from page 90:

    (eqlist? l1 l2)                                 #f
    where l1 is (strawberry ice cream)
      and l2 is (strawberry cream ice)

    (eqlist? l1 l2)                                 #f
    where l1 is (banana ((split)))
      and l2 is ((banana) (split))

    (eqlist? l1 l2)                                 #f, but almost #t.
    where l1 is (beef ((sausage)) (and (soda)))
      and l2 is (beef ((salami)) (and (soda)))

    (eqlist? l1 l2)                                 #t. That's better.
    where l1 is (beef ((sausage)) (and (soda)))
      and l2 is (beef ((sausage)) (and (soda)))

    What is eqlist?                                 It is a function that determines if two lists are equal.

If you might like this style, great! *The Little Schemer* might be the book for you. If you might not, well, you never know for certain unless you try. Personally, I found the repetitiveness just unbearable, and the whole dialogue felt more like a teacher asking me a question, waiting for my response, and then answering the question themselves with a disapproving tut-tut. The contrast between the needless repetition highlighted in that excerpt and the fast paced density of argument in later chapters is quite jarring, and the "playful" banter and examples with food quickly lose their cuteness.

On the other hand, I can see how the book might appeal to many, especially if your goal isn't to learn Scheme, but to learn to think recursively. It doesn't rely on any specific dialect of Scheme, and you could easily replace it in your head with any Lisp. Had I not read *How to Design Programs*, I can imagine that *The Little Schemer* would be an even better introduction to accumulators, as well as many additional constructs like continuations and the Y combinator. It often references a set of Ten Commandments vaguely similar to the template rules of *How to Design Programs*, but with much less focus on data definitions and more focus on recursion, plain and simple. My favourite quality of *The Little Schemer* is the ability to follow along (until the last few chapters, of course) with only a pen and paper, unlike most other programming books. It's these qualities that lead me to recommend it despite my own dissatisfaction. Just try reading *The Little Schemer* and see if you like it.

#### Scheme: [R5RS][], 3/5

The *Revised Revised Revised Revised Revised Report on the Algorithmic Language Scheme*, or R5RS for short, is the definition of Scheme. Unlike many programming languages' standards, especially those standardized by people who worry too much about legal issues, such as C++ (1500+ pages) or JavaScript (500+ pages), R5RS is but 50 pages long and highly readable. It serves as a suitable introduction to actually programming in a Scheme, with an abundance of examples and the benefit of being the definitive definition documentation all in one.

Although R5RS is probably one of the most readable language specifications out there (Python is another that comes to mind), it suffers from perhaps the opposite troubles as *The Little Schemer* does. While *The Little Schemer* lacks any detailed discussion over proper syntax and semantics, R5RS explicitly specifies every single rule, as a language specification should. While *The Little Schemer* throws you off the deep end from the very beginning, without ever worrying about evaluation rules and other such little details, R5RS takes until Chapter 4 (out of only 7!) before introducing expressions. Granted, the last two chapters take up more than half the document, but the point is that *The Little Schemer* and R5RS cannot be any more different. So the same recommendation applies; although I found R5RS much more useful, try reading both and you're bound to be satisfied with at least one. At the very least, you'll never know that you won't be satisfied until you've tried!

#### Scheme: [Structure and Interpretation of Computer Programs][], 5/5

*Structure and Interpretation of Computer Programs* is one of those rare textbooks considered influential enough to have [its own Wikipedia page][SICP Wikipedia]. I haven't read it, but I heard people say it's amazing and only losers think it's not amazing, so I'll give it a 5/5 for fun. This post is getting too long, and there's nothing I can add to the erudite reviews on Amazon or Goodreads anyway, so there you have it, the conclusion of this post. So what did I learn from all of this? Firstly, I learned that self-published books, especially self-published open-source introductory programming books written by software developers, are usually not very good, which is why this post ended up all Lisp instead of JavaScript or Ruby or whatever. Finally, I learned that reading books takes a lot of time and effort, which I apparently don't even have in summer. Expected more? Sorry&hellip;

[April blog post]:                                   ../1604-hard-ware/
                                                       "My blog post for 2016 April."
[Coursera]:                                          https://www.coursera.org/
                                                       "Coursera, a massively open online course provider."
[edX]:                                               https://www.edx.org/
                                                       "edX, another massively open online course provider."
[MATLAB: A Practical Introduction]:                  https://books.google.com/books?id=52v7jEa3aqIC
                                                       "An introductory book for MATLAB."
[How to Design Programs]:                            http://www.ccs.neu.edu/home/matthias/HtDP2e/
                                                       "An introductory book for designing programs."
[Racket]:                                            https://racket-lang.org/
                                                       "A programmable programming language."
[Systematic Program Design]:                         https://www.edx.org/xseries/how-code-systematic-program-design/
                                                       "An introductory online course for designing programs."
[CPSC 110]:                                          https://sites.google.com/site/ubccpsc110/
                                                       "An introductory UBC course for designing programs."
[The Racket Guide]:                                  https://docs.racket-lang.org/guide/
                                                       "An introductory overview of Racket."
[The Racket Reference Manual]:                       https://docs.racket-lang.org/reference/index.html
                                                       "The official documentation for Racket."
[Practical Common Lisp]:                             http://www.gigamonkeys.com/book/index.html
                                                       "An introductory book for Common Lisp."
[MIT/GNU Scheme User's Manual]:                      https://www.gnu.org/software/mit-scheme/documentation/mit-scheme-user/index.html
                                                       "The official user's manual for MIT/GNU Scheme."
[MIT/GNU Scheme]:                                    https://www.gnu.org/software/mit-scheme/
                                                       "The official website for MIT/GNU Scheme."
[The Little Schemer]:                                https://books.google.com/books?id=xyO-KLexVnMC
                                                       "An introductory book for understanding recursion."
[R5RS]:                                              http://www.schemers.org/Documents/Standards/R5RS/
                                                       "The official standard for Scheme."
[Structure and Interpretation of Computer Programs]: https://mitpress.mit.edu/sicp/
                                                       "An introductory book for learning programming."
[SICP Wikipedia]:                                    https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Computer_Programs
                                                       "The Wikipedia page for Structure and Interpretation of Computer Programs."
