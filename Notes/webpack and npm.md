
These are some things that came up when I moved to the Mac Studio

When I install packages with npm now I seem to have to include (at least sometimes) `--legacy-peer-deps`

For example

``` shell
npm install mini-css-extract-plugin --legacy-peer-deps
```
This corrects `ERESOLVE could not resolve` and is suggested by the error message itself

It's explained [here](https://stackoverflow.com/questions/66239691/what-does-npm-install-legacy-peer-deps-do-exactly-when-is-it-recommended-wh)


When webpack (via npm or however) I need to first execute this:

```shell
export NODE_OPTIONS=--openssl-legacy-provider
```

I added it to my scripts in package.json so I don't actually need to type it every time now.

I was getting the error something like: `error:0308010C:digital envelope routines::unsupported`

See discussion [here](https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported/72683479#72683479)