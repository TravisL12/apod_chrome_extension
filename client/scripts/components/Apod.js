import reqwest from 'reqwest';
import { $, clearElement } from '../utilities';
import ga from '../utils/ga';
import DateManager from '../DateManagement';
import KnowMoreComponent from './KnowMore';
import { zeroPad } from '../utilities';
import { drawer, favoritesTab } from '../../index.js';
import NavigationButton from '../NavigationButton';

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

const favoriteButtonShow = $('#add-favorite .favorite');
const favoriteButtonHide = $('#add-favorite .not-favorite');

class Apod {
    constructor() {
        this.hiResOnly = false;
        this.errorCount = 0;
        this.errorLimit = 3;
        this.imageQuality = 'HD';
        this.delayForHdLoad = 3000;
    }

    random() {
        this.getApod(DateManager.randomDate());
    }

    specificDate(date) {
        this.getApod(date);
    }

    previous() {
        this.getApod(DateManager.adjacentDate(this.date, -1));
    }

    next() {
        this.getApod(DateManager.adjacentDate(this.date, 1));
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
                this.title = response.title;
                this.url = response.url;
                this.hdurl = response.hdurl;
                this.date = response.date;
                this.explanation = response.explanation;
                this.errorCount = 0;
                this.checkFavorite();

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

    checkFavorite() {
        const isFavorite = favoritesTab.favoriteDates.indexOf(this.date) > 0;
        favoriteButtonShow.classList.toggle('hide', !isFavorite);
        favoriteButtonHide.classList.toggle('hide', isFavorite);
    }

    highlightResults(result, index) {
        const re = new RegExp('\\b(' + result + ')\\b', 'gi');
        this.explanation = this.explanation.replace(
            re,
            `<span class="keyword keyword-${index}">$1</span>`,
        );
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
                this.highlightResults(results[i].title, i);
                knowMore.createTab(results[i], i);
            }
        }
    }

    preLoadImage(forceHighDef = false) {
        const Img = new Image();

        if (!/(jpg|jpeg|png|gif)$/i.test(this.hdurl)) {
            Img.src = this.url;
            this.imageQuality = 'SD';
        } else {
            Img.src = this.hdurl;
        }

        const timeout = setTimeout(() => {
            if (!Img.complete && !forceHighDef) {
                Img.src = this.url;
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

        this.apodExplanation();
    }

    apodVideo() {
        this.isRequestInProgress = false;
        this.url = this.url.replace(';autoplay=1', '');
        const url = new URL(this.url);
        url.search = 'autopause=1&autoplay=0';
        apodVideoIFrame.src = url.href;
        this.apodExplanation();
    }

    apodExplanation() {
        apodTitle.textContent = this.title;
        apodDate.textContent = DateManager.prettyDateFormat(this.date);
        this.wouldYouLikeToKnowMore(`${this.title} ${this.explanation}`);

        if (!DateManager.isInPast(this.date)) {
            console.log(date + ' is in the future!');
            this.isRequestInProgress = false;
            this.current();
        } else if (DateManager.isToday(this.date)) {
            apodCurrent.el.classList.add('current');
            apodNext.el.classList.add('hide');
        } else {
            apodNext.el.classList.remove('hide');
            apodCurrent.el.classList.remove('current');
        }

        apodLoading.classList.add('hide');
        $('.apod__header .explanation').classList.remove('hide');
    }

    /**
     * Build filename for APOD site: ap170111.html
     *
     * @return {String} "2011-02-15"
     */
    apodSource() {
        const date = this.date.split('-');
        return `ap${date[0].slice(-2)}${zeroPad(date[1])}${zeroPad(date[2])}.html`;
    }
}

export default Apod;
