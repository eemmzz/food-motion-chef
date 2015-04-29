window.onload = function() {
    var navBar = document.querySelector('#side-bar');
    var pageWrapper =  document.querySelector('.page-wrapper');
    var pages = document.querySelectorAll('.page');

    var currentPageIndex = 0;
    var previousPageIndex;

    var debounceUpDownTime = 700;
    var debounceLeftRightTime = 300;

    var acceptUpDownGesture = true;
    var acceptLeftRightGesture = true;

    Leap.loop({
        hand: function (hand) {
            var handMesh = hand.data('riggedHand.mesh');

            var screenPosition = handMesh.screenPosition(
                hand.palmPosition,
                riggedHandPlugin.camera
            );
        }
    },
    function(frame) {
        if (frame.gestures.length > 0) {
            for (var index = 0; index < frame.gestures.length; index++) {
                var gesture = frame.gestures[index];

                switch (gesture.type) {
                    case "swipe":
                        // Horizontal or Vertical?
                        var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
                        var swipeDirection = "";

                        if (isHorizontal) {
                            if (!acceptLeftRightGesture) {
                                break;
                            }

                            // Debounce me bby
                            acceptLeftRightGesture = false;
                            setTimeout(function() {
                                acceptLeftRightGesture = true;
                            },
                            debounceLeftRightTime);

                            // Direction
                            if(gesture.direction[0] > 0){
                                swipeDirection = "right";
                            } else {
                                swipeDirection = "left";
                            }
                            scrollPage(swipeDirection, gesture.speed);
                        } else {
                            if (!acceptUpDownGesture) {
                                break;
                            }

                            // Debounce me bby
                            acceptUpDownGesture = false;
                            setTimeout(function() {
                                acceptUpDownGesture = true;
                            },
                            debounceUpDownTime);

                            // Direction
                            if (gesture.direction[1] > 0) {
                                swipeDirection = "up";
                            } else {
                                swipeDirection = "down";
                            }   
                            changePage(swipeDirection);
                        }
                        break;
                }
            }
        }
    })
    .use('riggedHand')
    .use('handEntry');

    riggedHandPlugin = Leap.loopController.plugins.riggedHand;

    function scrollPage(direction, speed) {
        var currentPage = pages[currentPageIndex];
        var maximum = currentPage.querySelector('img').clientWidth;
        if (direction === "left") {
            var scrollTo = pageWrapper.scrollLeft + currentPage.clientWidth;
            if (scrollTo < maximum) {
                $(pageWrapper).stop().animate({scrollLeft: scrollTo + 'px'}, 500, 'easeInOutQuart');
            }
        } else {
            var scrollTo = pageWrapper.scrollLeft - currentPage.clientWidth;
            if (scrollTo < 0) {
                scrollTo = 0;
            }
            $(pageWrapper).stop().animate({scrollLeft: scrollTo + 'px'}, 500, 'easeInOutQuart');
        }
    }

    function changePage(direction) {
        if (direction === "up") {
            // Go to the next page if available
            if (pages && pages[currentPageIndex + 1] !== undefined) {
                // Store index for page
                previousPageIndex = currentPageIndex;
                currentPageIndex = currentPageIndex + 1;
            }
        } else {
            // Go to the previous page if available
            if (pages && pages[currentPageIndex - 1] !== undefined) {
                // Store index for page
                previousPageIndex = currentPageIndex;
                currentPageIndex = currentPageIndex - 1;
            }
        }

        // Get pages
        var previousPage = pages[previousPageIndex];
        var currentPage = pages[currentPageIndex];

        // Hide previous page
        if (previousPage !== undefined && previousPage.classList.contains('active')) {
            previousPage.classList.remove('active');
        }

        // Show current page
        if (!currentPage.classList.contains('active')) {
            currentPage.classList.add('active');
        }

        // Update nav bar
        navBar.className = 'nav-' + currentPageIndex;

        // Back to 0
        pageWrapper.scrollLeft = 0;
    }
}