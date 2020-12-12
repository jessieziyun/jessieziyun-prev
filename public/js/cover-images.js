$(document).ready(() => {

    // utopia
    $(".utopia").hoverIntent(() => {
        $(".contain.utopia").css("display", "block");
    }, () => {
        $(".contain.utopia").css("display", "none");
    });

    // speech bubbles
    $(".speech-bubbles").hoverIntent(() => {
        $(".contain.speech-bubbles").css("display", "block");
    }, () => {
        $(".contain.speech-bubbles").css("display", "none");
    });

    // mars
    $(".mars").hoverIntent(() => {
        $(".contain.mars").css("display", "block");
    }, () => {
        $(".contain.mars").css("display", "none");
    });

    // advertising bot
    $(".advertising-bot").hoverIntent(() => {
        $(".contain.advertising-bot").css("display", "block");
    }, () => {
        $(".contain.advertising-bot").css("display", "none");
    });

    // sonance
    $(".sonance").hoverIntent(() => {
        $(".contain.sonance").css("display", "block");
    }, () => {
        $(".contain.sonance").css("display", "none");
    });

    // bbc habitat
    $(".bbc-habitat").hoverIntent(() => {
        $(".contain.bbc-habitat").css("display", "block");
    }, () => {
        $(".contain.bbc-habitat").css("display", "none");
    });
});