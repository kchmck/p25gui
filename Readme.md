# P25rx GUI

## Requirements

This project has been tested with Node 9, Firefox 57, and Chrome 63, but will ideally work
in other modern environments. At a minimum, you'll need

- [**Node**](https://nodejs.org/): installable with `pacman -S nodejs` on Archlinux and
  `apt-get install nodejs` on Ubuntu.
- [**Yarn**](https://yarnpkg.com): a package manager for Node, installable with `pacman -S
  yarn` and [other methods](https://yarnpkg.com/en/docs/install)
- **Make**: installable with `pacman -S make`/`apt-get install make`
- **A web browser**: known to work with Firefox and Chrome

## Building

First, clone the repo:
```
git clone https://github.com/kchmck/p25gui.git && cd p25gui
```

Then, install dependencies:
```
yarn
```

Finally, build the project:
```
make build-web && webpack
```

## Running

First, start the server with
```
node lib/server/index.js
```

Then, navigate your browser to [http://localhost:8026](http://localhost:8026).
