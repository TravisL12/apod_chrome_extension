'use strict';

const DateManagement = () => {

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
    function _hyphenDateFormat (date = new Date()) {
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

    function _getToday () {
        return _hyphenDateFormat(_actualDate(_hyphenDateFormat()));
    }

    return {

        get today () {
            return _getToday();
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

        checkDateEqual (date) {
            return new Date(_getToday()).getTime() === _actualDate(date).getTime();
        },

        checkTodayGreater (date) {
            return _actualDate(_getToday()).getTime() >=  _actualDate(date).getTime();
        },

        isDateValid (date = _getToday()) {
            return this.checkTodayGreater(date);
        },

    }

};
