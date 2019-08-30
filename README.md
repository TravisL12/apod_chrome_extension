## Astronomy Picture of the Day (APOD) New tab Chrome Extension!

I really love space and astronomy pictures and for about 10 or 15 years I've had APOD as my home page! But I don't specifically see my homepage that much anymore and I've been missing out on my APOD fix.

So what did I do??? I built an extension to show me an APOD on every new tab I open!

[Get the plug-in for Chrome!](https://chrome.google.com/webstore/detail/apod-by-the-trav/aedpginojmhafbemcoelnppdcmlfjcdj)

[Get the plug-in for Firefox!](https://addons.mozilla.org/en-US/firefox/addon/apod-by-the-trav/)

## Description

Your New Tab page will now be the Astronomy Picture of the Day (APOD)! Your top sites are shown in the top left of the page to maintain some usefulness from the default new tab screen.

APOD by The Trav has the following features:

- Use the options in the Chrome menu bar to set "Today" or a "Random" APOD on new tab.
- Save your favorite APOD's for viewing again with the "Save Favorites" button at the bottom right.
- Use the "Learn More" tabs on certain APOD's to learn about the celestial objects shown!

Navigation shortcuts:

- Random APOD - `r`
- Today's APOD - `t`
- Previous Day APOD - `j`
- Next Day APOD - `k`

Tab Shortcuts:

- Toggle Explanation - `e`
- Toggle Favorites - `f`

## Development

If you want to fork, develop and build this extension locally then follow these steps:

- Fork/Download the repository and using the terminal navigate to the directory.

- Build the dependencies by running `yarn` or `npm install` ([Yarn is recommended](https://yarnpkg.com/en/)).

- For active development use `yarn watch` or `npm watch` to rebuild the extension. Each time you make a save the extension will be rebuilt and then reload your web browser and the changes will be reflected.

- Add the unpacked extension in Chrome (after running `yarn watch` or `yarn build`). Do this by opening up Chrome and heading to `chrome://extensions/`. Select `Load Unpacked` at the top left of the page, navigate to the `dist` folder inside the project directory. Go open a new tab in Chrome and you'll now be running the development version.

## Reviewer notes for APOD By The Trav

#### Firefox validation warnings

- Firefox has issued a warning for the use of `innerHTML` which is performed one time to avoid more widespread use. This single use
  is done inside a wrapper element and has been reviewed to avoid becoming an injection vector.

#### Dependencies

- [reqwest](https://github.com/ded/reqwest) - This is strictly used for ajax calls to the NASA API. There are uses of `eval` in this package.

- Additional dependencies are considered well known sources as they all pertain to the use of webpack (i.e. babel, uglifyJS, path, etc.)

#### Service Worker tips

[How I got service workers working](https://dev.to/idoshamun/devtip-two-steps-for-using-workbox-in-a-chrome-extension-1ejb)
