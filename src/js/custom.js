$(document).ready(function () {
    var clock = $('.my-clock').FlipClock(3600 * 24 * 3, {
        defaultLanguage: 'ar',
        language: 'ar',
        autoStart: true,
        clockFace: 'DailyCounter',
        countdown: true,
        showSeconds: true
    });
});