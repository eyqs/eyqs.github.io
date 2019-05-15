---
layout: post
title: A Review of All UBC's Computer Engineering/Science Courses That Eugene Actually Took
description: A review of all UBC's computer engineering/science courses that Eugene Y. Q. Shen will actually take, and has in fact actually taken before this 2018 April blog post.
---

Engineering undergrads at the University of British Columbia don't get many electives. They only get to choose three of their [complementary studies courses][compstud], one for impact of technology on society and two for humanities and social sciences. Different engineering programs differ on their number of technical electives, from ten in computer engineering to only two in chemical/biological engineering and mechatronics.

As an engineering physics student, I get five technical electives, but I've already used them all up. As I'll never get to actually take any more computer engineering/science courses for the last three years of my degree, now's the time to review all such courses I've actually taken. Also, I finally get to brag about my grades.

<!--more-->

### APSC 160: Introduction to Computation in Engineering Design
#### Hassan Khosravi, 2016W1, 98% (highest in section)

"Analysis and simulation, laboratory data acquisition and processing, measurement interfaces, engineering tools, computer systems organization, programming languages."

APSC 160 is the mandatory programming intro for all first-year engineering students, and by far the most useless course I've ever taken. Analysis and simulation means tracing through five lines of if statements to find the value of a variable at the end. Laboratory data acquisition means plugging sketchy boards made by second-years ten years ago into the lab computers and calling `analogRead()`. The measurement interface is a protractor, and the engineering tool is Microsoft Excel 2003. The hardest concepts were character strings and iterating through arrays.

If you don't have to take the course, don't take it. If you have to take it and you've never coded before, take some time over the summer and learn to code something fun. If you have to take it and you've written any code in any language at any time in your life, then you have a pretty good shot at getting 100%, like Amar Shah did, especially because your worst lab is dropped. The only reason I got 98% was because I handed in the first midterm in exactly 30 minutes, because for some reason I thought that would help me get my TA position in first year, second term. Yes, I'm bragging about it because nothing better has happened in my life since I got this lucrative PeerWise badge.

![The "Einstein" badge is awarded for answering at least 20 questions "correctly" in a row on PeerWise. On 2015 September 22, I became the first person in the section to obtain said badge, and I never opened PeerWise after that because it's totally pointless.][peerwise]

### CPSC 320: Intermediate Algorithm Design and Analysis
#### Geoffrey Tien, 2016S2, 95% (highest in section)

"Systematic study of basic concepts and techniques in the design and analysis of algorithms, illustrated from various problem areas. Topics include: models of computation; choice of data structures; graph-theoretic, algebraic, and text processing algorithms."

CPSC 320 is the mandatory intermediate algorithm design and analysis course (yep) for CS students. You'll be writing a lot of pseudocode and proofs, with no actual coding at all. Math students with no programming experience may fare better than CS students who forgot how to do proofs.

Every job I applied to rejected me in the summer of first year, so to cut my losses, I crammed for the CPSC 110 challenge exam and appealed to take CPSC 320 on the basis of my high grades and the fact that there were 30 empty unrestricted seats because this was an extra section with zero demand. It was the last term that the CS department allowed any engineering student to waive any prerequisites, and now the [appeals page][appeals] has become hilariously passive-aggressive towards us.

I got the highest grade in the section mainly because I zoned out in class. Two years ago, Geoff was objectively a bad lecturer. He would speed through statistical derivations and walls of pseudocode that nobody could follow, then stumble over much simpler proofs in the next slide. You'd come out of his lectures knowing less than you did going in. A combination of family issues, little preparation time, CPSC 320 being his second ever UBC course, and the fact that he had to rush to Coquitlam College to teach several other courses probably explains why he was so disorganized. The whole point of this story is that your experience with this course entirely depends not only on who's teaching it, but even their current life circumstances.

My biggest pet peeve was the line of a dozen keeners that would extend 5-minute breaks into 20 minutes because Geoff was too accommodating to tell them to go away. Another issue was the grading scheme, which put 30% on assignments. There were supposed to be four written assignments, but there ended up being only three for some reason, and they were group assignments for some reason, so the class average was like 90% for those. Of course, that led to the exams being ridiculously difficult. Our section average was 70%; the section average in 2016S1 was 76%.

Was it worth it? Not really. I took it to help me find a job, but every job I applied to in co-op rejected me in the fall of second year. All the content came straight from the Kleinberg and Tardos textbook "Algorithm Design", and since lectures had negative utility, the textbook is where I learned everything. If you have to take it, you have to take it; if you don't, just read the textbook, unless your instructor is really great. Though recently, I've heard nothing but praise about Geoff.

### CPEN 221: Principles of Software Construction
#### Sathish Gopalakrishnan, 2016W1, 98% (highest in section)

"Design, implementation, reasoning about software systems: abstraction and specification of software, testing, verification, abstract data types, object-oriented design, type hierarchies, concurrent software design."

CPEN 221 is the mandatory second-year programming course for computer engineering, engineering physics, and (soon) biomedical engineering students, about equivalent to CPSC 210, with dabs of CPSC 110 (recursive data types) and CPSC 213 (concurrency and parallelism).

Whereas APSC 160 was too slow, CPEN 221 was way too fast. The entire course was about principles of software construction (yep) as opposed to programming in Java, so Sathish assumed everyone studied Java over the summer, which exactly zero people did, and leapt straight into inheritance and polymorphism in the first week! Once we finally kinda knew how to use Java, Git, Eclipse, and JUnit, the course suddenly pivoted into concurrency constructs like reader/writer locks and condition variables, so everyone was back to square one. Two weeks later, just as we started to understand what race conditions were, it was time to learn fork-join parallelism and map/filter/reduce. Oh, and a random lecture about networking. And another lecture about grammars, lexers, and parsers. And yep, all those topics were on the final exam.

What the heck?

We had to read 20 pages of notes every single week, and each project took so long that Sathish extended the deadline of the last project until Christmas. 20% of the grade was based on a programming proficiency test that you had to retake until you passed, and people were retaking that into late January. To top it all off, nobody had any idea what the lectures were for, although everyone agreed that Sathish was an awesome character, but this Matei Ripeanu guy kept on randomly interrupting for no reason.

The course is a lot of work, especially if you want to get 98%, but you'll learn so much along the way. The highest base mark is 92%, and anything above that comes from bonuses. So you bet I did all the bonus programming proficiency tests, answered all the bonus exam questions, and spent a week of my life on the bonus project instead of studying for MECH 260, where I got my worst mark ever. I was the only person who had anything sensible for a ridiculous non-polynomial programming test, the only person to correctly answer the bonus question on the final exam, and one of three people to complete and present the bonus project, but I still ended up with the same grade as Amar Shah, who didn't even attempt the bonus project because he's smart, which keeps me salty to this day.

Ultimately, my advice is the same as that which you've heard hundreds of times and never actually followed. Study Java over the summer. Start the projects as soon as they come out. Do the readings as they come out, so you don't have to cram before the exams. And don't even try any of the bonus activities.

### CPEN 331: Operating Systems
#### Alexandra Fedorova, 2017W1, 90%

"Operating systems, their design and their implementation. Process concurrency, synchronization, communication and scheduling. Device drivers, memory management, virtual memory, file systems, networking and security."

CPEN 331 is only mandatory for computer engineering students, but many others take it because we can't take CPSC 313. Unlike advertised, it did *not* cover anything about inter-process communication, scheduling, device drivers, file systems, networking, and security. Instead, it covers concurrency on the level of "use locks" (much more basic than CPEN 221), memory management on the level of "use `malloc` and `free`", and pretty much nobody did the virtual memory assignment.

The material itself is challenging yet fascinating. The [OSTEP textbook][ostep] may be the best textbook I've ever used. The assignments use the excellent [OS/161 instructional operating system][os161] from Harvard. Our prof, Sasha, has fond memories of many sleepless nights hacking away on the [very same assignments][cs161] as an undergrad at Harvard taking CS 161! Unfortunately, UBC is not a world-class educational institution, so our assignments 2 and 3 is their assignment 1, our assignments 4 and 5 is their assignment 2, our assignment 6 (which pretty much nobody did) is their assignment 3, and we wouldn't even have gotten to their assignment 4 with an extra month.

Just as with CPSC 320, the silly grading scheme was a huge factor. 10% was based on "class participation"---we had to write down our name at the end of every class that we "participated" in. People were asking the most ridiculous questions just to get participation marks, so we didn't have time to go through any of the exciting content on scheduling and file systems that Sasha had already prepared for us. Another 20% came from clicker questions, which I always missed because I'm a bad, lazy person who skips classes for no reason. There was an oral final exam worth 20%, but if any TA judged you worthy, you could skip the exam and automatically get 100% for it. My friend had exactly one interaction with some random TA in the entire term, but when he asked, that TA apparently judged him worthy to skip the exam. No wonder pretty much nobody did the last assignment, with so many free marks lying around.

I shouldn't have taken this course---everything is on [the course webpage][cpen331]. But if you have to take it and you want a high mark, focus on the participation marks, the clickers, and the easy assignments (everything except the last one). All the clicker questions are posted before lecture, so you have no excuse to not get 100% on them.

P.S. The official solutions to the last assignment don't even pass the tests, so don't try too hard.

### CPEN 312: Digital Systems and Microcomputers
#### Jesus Calviño-Fraga, 2017W2, 100% (highest in section)

"Data representation in digital computers; boolean algebra; the design and optimization and implementation of combinatorial and sequential circuits; modern digital circuit technologies; memory and programmable logic devices; organization and operation of microcomputers; data/address bus organization; input-output interfacing."

CPEN 312 is a mandatory third-year course for engineering physics and mechatronics students, and a mandatory second-year course for integrated engineering students, about equivalent to CPSC 121 and CPEN 211, but without the grueling weekly 20-hour labs. Nobody else has any reason to take it. The grade distributions are forbiddenly bimodal, with peaks at 45% and 75%, for the same reasons as APSC 160: half the class (especially those not in mechatronics) have absolutely no interest in the course, and there's some convoluted policy where if you fail (<40%) the final or the midterm or the labs, then you fail the course.

The course is split into two sections, the first on sequential circuits and the second on assembly. Both sections are straightforward with enough practice, but the only resources given are Jesus' lecture slides, which are complete but rather compact, so you'll have to find practice problems somewhere else. I spent eight hours straight the night before the midterm watching almost all of [Neso Academy's digital electronics videos][neso] at 3x speed. I highly recommend doing so, but maybe over a week instead, because Neso Academy transformed me from nervous wreck to being so confident that I handed in the midterm in exactly 40 minutes, and subsequently lost 6% due to missing the `'` to turn my `A XOR B` into `A XNOR B`.

For the second section, you can either take careful notes in class, or skip class and read off [Chung-Ping Young's slide deck][mazidi], which covers almost everything you need to know and much more you don't need. Since the final is open-book, you don't have to worry about memorizing anything, but if you aren't prepared, you *will* fail.

### CPEN 432: Real-time System Design
#### Bader Alahmad, 2017W2, 100% (highest in section)

"Multi-tasking; interrupt-driven systems; task scheduling; schedulability analysis; inter-process communication and synchronization; resource management; performance measurement; hardware/software integration; hardware/software tradeoffs; system reliability."

CPEN 432 is a senior elective course and there's nothing else like it. But you have to know what you're getting into. Most of the lecture content is about scheduling theory, verbatim from Buttazzo's "Predictable Scheduling Algorithms and Applications", so skim through chapters 1--4, and if you don't like the material, don't take the course. The final exam and all the written assignments are only about scheduling, and these require about as much rigour as CPSC 320, so brush up on your proofs and be ready to search up what Hoeffding's inequality is.

The projects are nominally about embedded systems, but you'll have to learn everything on your own. They're for groups of four hacking on one Raspberry Pi 2, and the first two are completely unrelated to the lecture material. I would highly recommend obtaining enough Raspberry Pi 2s for everyone, and somehow choosing a good team. I hit the jackpot and ended up mostly freeloading, with two graduating CS students, who were each taking three or four courses, and Amar Shah, who also got 100% and wrote [more stuff about the projects][amar]. It was absolutely unfair for the teams of mechanical engineering students taking seven courses with no OS experience.

Bader was Sathish's PhD student and my TA in CPEN 221, and this was his first time teaching a course. He had a tendency to flood us with bonus marks and easily yield to pressure, extending deadlines for every single assignment and project. The last project was about multiprocessor scheduling and extended to April 21st, but by that time we had so many bonus marks that nobody cared. Otherwise, Bader was a fantastic instructor and incredibly responsive to all my whiny questions on Piazza, and I'm sure he'll set more reasonable workload and deadline expectations next year. Just know that this is a scheduling course, not a embedded systems course.

<hr />

tl;dr: ubcs cpen isnt great

[compstud]: http://www.calendar.ubc.ca/vancouver/index.cfm?tree=12,195,272,30
[peerwise]: {{ "/assets/images/blogs/1804/peerwise.png" | prepend: site.baseurl }}
[appeals]:  https://www.cs.ubc.ca/students/undergrad/courses-deadlines/rules-about-cpsc-appeals-undergraduate-students/
[ostep]:    http://pages.cs.wisc.edu/~remzi/OSTEP/
[os161]:    http://os161.eecs.harvard.edu/
[cs161]:    http://www.eecs.harvard.edu/~cs161/
[cpen331]:  https://sites.google.com/site/cpen331/home/
[neso]:     https://www.youtube.com/playlist?list=PLBlnK6fEyqRjMH3mWf6kwqiTbT798eAOm
[mazidi]:   http://irist.iust.ac.ir/files/ee/pages/az/mazidi.pdf
[amar]:     https://www.reddit.com/r/UBC/comments/82umhv/has_anyone_taken_cpen_432_realtime_system_design/dvd5i25/
