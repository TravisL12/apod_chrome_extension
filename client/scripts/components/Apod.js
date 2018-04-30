import reqwest from 'reqwest';
import { $, clearElement } from '../utilities';
import ga from '../utils/ga';
import DateManager from '../DateManagement';
import KnowMoreComponent from './KnowMore';
import { drawer } from '../../index.js';
import NavigationButton from '../NavigationButton';
import History from './History';

// Initialize image & video elements
const apodImage = $('#apod-image');
const apodBgImage = $('#apod-image-vertical-bg');
const apodVideo = $('#apod-video');
const apodVideoIFrame = $('#apod-video iframe');

// Initialize various elements
const apodTitle = $('#apod-title');
const apodDate = $('#apod-date');
const apodKnowMore = $('#know-more-tabs');
const apodLoading = $('#apod-loading');
const apodError = $('#apod-error');
const imgQualityEl = $('#img-quality');

// Initialize button objects
const apodRandom = new NavigationButton('#apod-random', 82, 'random');
const apodCurrent = new NavigationButton('#apod-current', 84, 'current');
const apodPrevious = new NavigationButton('#apod-previous', 74, 'previous');
const apodNext = new NavigationButton('#apod-next', 75, 'next');
const loadHiResEl = $('.nav-buttons #show-hi-res');

class Apod {
    constructor() {
        this.hiResOnly = false;
        this.errorCount = 0;
        this.errorLimit = 3;
        this.imageQuality = 'HD';
        this.delayForHdLoad = 3000;
        this.history = new History();
        this.addToHistory = false;

        document.addEventListener('keyup', e => {
            // keycode left-arrow (37), right (39)
            if (this.addToHistory) {
                if (e.which === 37) {
                    this.addToHistory = false;
                    this.specificDate(this.history.recall(-1));
                } else if (e.which === 39) {
                    this.addToHistory = false;
                    this.specificDate(this.history.recall(1));
                }
            }
        });
    }

    specificDate(date) {
        this.getApod(date);
    }

    random() {
        this.getApod(DateManager.randomDate());
    }

    previous() {
        this.getApod(DateManager.adjacentDate(this.response.date, -1));
    }

    next() {
        this.getApod(DateManager.adjacentDate(this.response.date, 1));
    }

    current() {
        this.getApod();
    }

    addFadedBackground() {
        apodBgImage.style['background-image'] = `url(${this.loadedImage.src})`;
        apodBgImage.classList.remove('hide');
    }

    backgroundSize() {
        const widthGTwindow = this.loadedImage.width > window.innerWidth;
        const heightGTwindow = this.loadedImage.height > window.innerHeight;
        const aspectRatio = this.loadedImage.width / this.loadedImage.height;

        if (widthGTwindow || heightGTwindow) {
            this.addFadedBackground();
            return aspectRatio >= 1.3 ? 'cover' : 'contain';
        }

        if (
            this.loadedImage.width / window.innerWidth > 0.5 ||
            this.loadedImage.height / window.innerHeight > 0.5
        ) {
            this.addFadedBackground();
        }

        return 'auto';
    }

    _setLoadingView() {
        if (this.addToHistory) {
            this.history.add(this.response.date);
        }

        apodImage.style['background-image'] = '';
        apodImage.style['background-size'] = '';
        apodImage.classList.add('hide');

        apodBgImage.style['background-image'] = '';
        apodVideo.classList.add('hide');
        apodVideoIFrame.src = '';

        $('.apod__header .explanation').classList.add('hide');
        loadHiResEl.classList.add('hide');
        apodLoading.classList.remove('hide');
        clearElement(apodKnowMore);

        drawer.closeDrawer();
        drawer.clearKnowMoreTabs();
    }

    isRequestValid() {
        if (this.isRequestInProgress) {
            return false;
        }

        this.isRequestInProgress = true;
        return this.isRequestInProgress;
    }

    getApod(date = DateManager.today) {
        if (!this.isRequestValid()) {
            console.log('Request in Progress!');
            return;
        }

        if (!DateManager.isDateValid(date)) {
            this.isRequestInProgress = false;
            return;
        }

        this._setLoadingView();
        this.addToHistory = true; // this starts history

        reqwest({
            method: 'GET',
            url: 'https://api.nasa.gov/planetary/apod',
            data: {
                api_key: 'hPgI2kGa1jCxvfXjv6hq6hsYBQawAqvjMaZNs447',
                date: date,
            },
        }).then(
            response => {
                ga({ category: 'APOD', action: 'viewed', label: response.date });
                this.response = response;
                this.errorCount = 0;
                this.populateTabs();

                const isMediaImage = response.media_type === 'image';
                apodImage.classList.toggle('hide', !isMediaImage);
                apodVideo.classList.toggle('hide', isMediaImage);

                if (isMediaImage) {
                    this.preLoadImage(this.hiResOnly);
                } else if (response.media_type === 'video') {
                    this.apodVideo();
                } else {
                    this.random();
                }
            },
            error => {
                this.errorCount++;
                console.log(`Error: APOD API response (${this.errorCount})`);
                this.isRequestInProgress = false;
                if (this.errorCount < this.errorLimit) {
                    this.random();
                } else {
                    apodError.textContent = 'NASA APOD Error: Please reload or try Again Later';
                }
            },
        );
    }

    populateTabs() {
        drawer.tabs[0].urls = {
            hdurl: this.response.hdurl,
            url: this.response.url
        };
        drawer.tabs[0].explanation = this.response.explanation;
        drawer.tabs[0].date = this.response.date;

        drawer.tabs[1].date = this.response.date;
        drawer.tabs[1].title = this.response.title;
        drawer.tabs[1].url = this.response.url;
        drawer.tabs[1].specificDate = this.specificDate.bind(this);
        drawer.tabs[1].checkFavorite();
    }

    wouldYouLikeToKnowMore(text) {
        const knowMore = new KnowMoreComponent(text);
        const results = knowMore.results;

        if (results.length) {
            // Don't draw duplicate tabs beyond the default tabs (i.e. Explanation and Favorite tabs)
            if (drawer.tabs.length > 2) {
                return;
            }
            for (let i in results) {
                drawer.tabs[0].highlightKeywords(results[i].title, i);
                knowMore.createTab(results[i], i);
            }
        }
    }

    preLoadImage(forceHighDef = false) {
        const Img = new Image();

        if (!/(jpg|jpeg|png|gif)$/i.test(this.response.hdurl)) {
            Img.src = this.response.url;
            this.imageQuality = 'SD';
        } else {
            Img.src = this.response.hdurl;
        }

        const timeout = setTimeout(() => {
            if (!Img.complete && !forceHighDef) {
                Img.src = this.response.url;
                this.imageQuality = 'SD';
            }
        }, this.delayForHdLoad);

        Img.onload = () => {
            clearTimeout(timeout);
            this.loadedImage = Img;
            this.apodImage();
        };

        Img.onerror = () => {
            clearTimeout(timeout);
            console.log('Error: image load');
            this.isRequestInProgress = false;
            this.random();
        };
    }

    apodImage() {
        this.isRequestInProgress = false;
        apodImage.classList = 'apod__image';
        imgQualityEl.classList.remove('spin-loader');

        apodImage.style['background-image'] = `url(${this.loadedImage.src})`;
        apodImage.classList.add(`bg-${this.backgroundSize()}`);

        imgQualityEl.textContent = this.imageQuality;

        if (this.imageQuality !== 'HD') {
            const forceLoadHighDefImg = e => {
                loadHiResEl.classList.add('hide');
                loadHiResEl.removeEventListener('click', forceLoadHighDefImg);
                imgQualityEl.textContent = '';
                imgQualityEl.classList.add('spin-loader');
                this.preLoadImage(true);
            };
            loadHiResEl.classList.remove('hide');
            loadHiResEl.addEventListener('click', forceLoadHighDefImg);
        }

        this.constructApod();
    }

    apodVideo() {
        this.isRequestInProgress = false;
        this.response.url = this.response.url.replace(';autoplay=1', '');
        const url = new URL(this.response.url);
        url.search = 'autopause=1&autoplay=0';
        apodVideoIFrame.src = url.href;
        this.constructApod();
    }

    constructApod() {
        apodTitle.textContent = this.response.title;
        apodDate.textContent = DateManager.prettyDateFormat(this.response.date);
        this.wouldYouLikeToKnowMore(`${this.response.title} ${this.response.explanation}`);

        if (!DateManager.isInPast(this.response.date)) {
            console.log(date + ' is in the future!');
            this.isRequestInProgress = false;
            this.current();
        } else if (DateManager.isToday(this.response.date)) {
            apodCurrent.el.classList.add('current');
            apodNext.el.classList.add('hide');
        } else {
            apodNext.el.classList.remove('hide');
            apodCurrent.el.classList.remove('current');
        }

        apodLoading.classList.add('hide');
        $('.apod__header .explanation').classList.remove('hide');
    }
}

export default Apod;
