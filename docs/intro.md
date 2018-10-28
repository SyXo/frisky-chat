# i used react hooks to make a social furry porn website

## introduction

so, basically, dan is trying to make stateless functional components (sfcs) cool again, which is admirable and i fully support it

which is what inspired me to finally develop the frontend for a social porn website i'm making called frisky.chat

be warned, it's a site for porn, so. ¯\_(ツ)\_/¯

and please, save your puritanical views for some place else. however, if you're sex-positive, feel free to read on and hopefully gain some knowledge from my experience!

## features

## patterns

so, in order to build an application entirely on react hooks, i first needed to develop some patterns

this is the part i was most looking forward to :3

so, a few patterns necessary to make a frontend web app that are pertinent to states and effects are:

- routing
- fetching data
- event listeners

### routing

### fetching data

### event listeners

## key takeaways

because states and effects are defined in the context of what is essentially the render function

event handlers defined in useEffect will not get states that are

states are only updated upon the next render, so forget about using them as a replacement for variables. remember: their purpose is only to trigger a re-render of that component, as necessary

## technical considerations

i work mostly in typescript these days, but typings aren't yet available for react 16.7-alpha, so i had this code at the top of every file containing a stateful react component:

```ts
import * as React from 'react'
// @ts-ignore
const { useState, useEffect } = React
```

sure, i could have written a typing that extends this, but i didn't see the point of doing that considering someone will likely do that and i can just remove that ts-ignore, heh

i used cypress for integration tests

in order to get cypress to work with webpack, i actually had to roll my own node.js livereload client. i kid you not. their webpack preprocessor plugin only works on cypress specs. and if you use webpack dev server or traditional livereload, you lose your server context. not so bad if you already have a server, but if you're mocking routes with cypress fixtures, you're gonna want livereload to trigger an actual cypress refresh. the code is in the repo, under cypress/plugins, but i don't consider it robust enough to solve this problem, other than as a stopgap solution till webpack plugins or cypress can support this particular situation ootb.

## repo

the code is on github:

don't worry, there's no porn -in- the repo, but it does have some images for testing made by some furry artists that are kinda cool
