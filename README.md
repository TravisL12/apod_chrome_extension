## Astronomy Picture of the Day (APOD) Extension by Travis Lawrence!

I really love space and astronomy pictures and for about 10 or 15 years I've had APOD as my home page! But I don't specifically see my homepage that much anymore and I've been missing out on my APOD fix.

So what did I do??? I built an extension to show me an APOD on every new tab I open!

[Get the plug-in for Chrome!](https://chrome.google.com/webstore/detail/apod-by-the-trav/aedpginojmhafbemcoelnppdcmlfjcdj)

[Get the plug-in for Firefox!](https://addons.mozilla.org/en-US/firefox/addon/apod-by-the-trav/)

This extension might seem like a lot of work for such a simple purpose. This is not by accident, I set out to build the best APOD viewing extension that I could think of and if you think there's something that could be added to make this better I can't wait to hear from you!

## APOD By The Trav Features

Your New Tab page will now be the Astronomy Picture of the Day (APOD)! Your top sites are shown in the top left of the page to maintain some usefulness from the default new tab screen.

- Save your favorite APOD's for viewing again with the "Save Favorites" button at the bottom right.
- Click the date in the title bar to display a `date selector`.

##### APOD Options

- Use the options in the Chrome menu bar to set `Today` or a `Random` APOD on new tab.
- High definition photos only. Each APOD has a standard-res and hi-res image, initially the hi-res image is attempted to be shown but if the file size is too large (takes too long to download) it'll default to the standard resolution image. This setting will force high resolution photos only.
- Toggle showing your Top sites, or hide them to focus on the space pics.
- Toggle showing your viewing history bar which is shown at the bottom of the page.
- Enable the ability to see `Todays` APOD a certain number of times before a `random` photo is selected. This allows you to see the most recent APOD a few times and then move onto some new pictures (thanks [Hambly](https://github.com/hambly)!).

##### Navigation shortcuts:

- Random APOD - `r`
- Today's APOD - `t`
- Previous Day APOD - `j`
- Next Day APOD - `k`

##### Tab Shortcuts:

- Toggle Explanation - `e`
- Toggle Favorites - `f`
- Toggle Search - `s`

##### History Navigation (previously viewed APOD's):

- Previous History - `left-arrow`
- Next History - `right-arrow`

## Development

If you want to fork, develop and build this extension locally then follow these steps:

- Fork/Download the repository and using the terminal navigate to the directory.

- Build the dependencies by running `yarn` or `npm install` ([Yarn is recommended](https://yarnpkg.com/en/)).

- For active development you must re-build the extension after changes are made using `yarn build`.

- Add the unpacked extension in Chrome (after running `yarn watch` or `yarn build`). Do this by opening up the Chrome preferences:
  - On the left sidebar click `extensions` (or just navigate directly to `chrome://extensions/`).
  - Make sure `Developer mode` is activated in the top right of the page.
  - Select `Load Unpacked` at the top left of the page, navigate to the `build` folder inside the project directory. Go open a new tab in Chrome and you'll now be running the development version.
- Again, you must re-run `yarn build` after every save of the files for them to show up.

## Reviewer notes

#### Firefox validation warnings

- Firefox has issued a warning for the use of `innerHTML` which is performed one time to avoid more widespread use. This single use
  is done inside a wrapper element and has been reviewed to avoid becoming an injection vector.

#### Dependencies

- [axios](https://github.com/axios/axios) - This is strictly used for ajax calls to the NASA API.

- Additional dependencies are considered well known sources as they all pertain to the use of webpack (i.e. babel, uglifyJS, path, etc.)

#### Service Worker tips

[How I got service workers working](https://dev.to/idoshamun/devtip-two-steps-for-using-workbox-in-a-chrome-extension-1ejb)
