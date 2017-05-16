'use strict';

function DateManagement () {

    const _monthNames = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];

    /**
     * Formats the Date "2017-01-31"
     *
     * @param  {Date}
     * @return {string}
     */
    function _hyphenDateFormat (date) {
        date = date || new Date();
        return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('-'); 
    }

    /**
     * Gives the actual date (with timezone) at midnight
     *
     * @param  {string} date
     * @return {Date}
     */
    function _actualDate (date) {
        let split = date.split('-');
        return new Date(split[0], split[1]-1, split[2]);
    }

    return {

        get today () {
            return _hyphenDateFormat(_actualDate(_hyphenDateFormat()));
        },

        prettyDateFormat (date) {
            date = _actualDate(date);
            return _monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        },

        adjacentDate (dateString, direction) {
            let date = _actualDate(dateString),
                adjDate = new Date(date.getTime());

            adjDate = new Date(adjDate.setDate(adjDate.getDate() + direction));
            return _hyphenDateFormat(adjDate);
        },

        randomDate () {
            let start = new Date(1995, 5, 16),
                end   = new Date(),
                date  = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

            return _hyphenDateFormat(date);
        },

        isDateValid (date) {
            date = date || this.today;

            let isTodayGreater = new Date(this.today).getTime() >=  _actualDate(date).getTime(),
                isDateEqual    = new Date(this.today).getTime() === _actualDate(date).getTime();
            
            if (!isTodayGreater) {
                console.log(date + ' is in the future!');
                apodNext.classList.add('hide');
            } else if (isDateEqual) {
                apodNext.classList.add('hide');
            } else {
                apodNext.classList.remove('hide');
            }

            return isTodayGreater;
        },

    }

};
