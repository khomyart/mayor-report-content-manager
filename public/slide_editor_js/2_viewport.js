/**
 * Method do zoom in and zoom out of viewport and all included items. Contains rules for it
 * 
 * @param {string} direction in or out
 * @param {int} step how much viewport will zoomin or zoomout per one iteration (mmultiplier)
 */
function zoom(direction, step) {
    if (CONFIG.UI.workZoneCurrentScale < CONFIG.UI.workZoneMinScale && direction == 'in' ||
        CONFIG.UI.workZoneCurrentScale > CONFIG.UI.workZoneMaxScale && direction == 'out' ||
        CONFIG.UI.workZoneCurrentScale > CONFIG.UI.workZoneMinScale && CONFIG.UI.workZoneCurrentScale < CONFIG.UI.workZoneMaxScale) {

        if (direction == 'in') {
            CONFIG.UI.workZoneCurrentScale += step;
        } else if (direction == 'out') {
            CONFIG.UI.workZoneCurrentScale -= step;
        }
    
        if (amountOfItemsInWorkZone != document.querySelectorAll('.field-item').length) {
            amountOfItemsInWorkZone = document.querySelectorAll('.field-item').length
            calculatePositionForItems('.field-item')
        }
       
        scrollPosition.top = everythingHolder.scrollTop / workZoneHolder.offsetHeight * 100;
        scrollPosition.left = everythingHolder.scrollLeft / workZoneHolder.offsetWidth * 100;
    
        previousWorkZoneHolderOffset = {
            width: workZoneHolder.offsetWidth,
            height: workZoneHolder.offsetHeight,
        };
    
        workZone.style.width = `${CONFIG.UI.defaultWorkZoneOffsets.width * CONFIG.UI.workZoneCurrentScale}px`;
        workZone.style.height = `${CONFIG.UI.defaultWorkZoneOffsets.height * CONFIG.UI.workZoneCurrentScale}px`; 
        workZoneHolder.style.width = `${workZone.offsetWidth + everythingHolder.offsetWidth * 1.5}px`;
        workZoneHolder.style.height = `${workZone.offsetHeight + everythingHolder.offsetHeight * 1.5}px`;
    
        document.querySelectorAll('.field-item').forEach(e => {
            e.style.width != 'auto' ? 
                e.style.width =`${calculateItemParams(e).width}px`: e.style.width = 'auto';
            e.style.height != 'auto' ? 
                e.style.height =`${calculateItemParams(e).height}px`: e.style.height = 'auto';

            e.style.borderRadius =`${calculateItemParams(e).borderRadius}px`;
            e.style.borderWidth =`${calculateItemParams(e).borderWidth}px`;
            e.style.fontSize = `${calculateItemParams(e).fontSize}px`;
            e.style.padding = `${calculateItemParams(e).padding}px`;

            if (e.childNodes.length > 0) {
                e.childNodes.forEach((childNode)=>{
                    childNode.style.marginBottom = `${calculateItemParams(childNode).marginBottom}px`
                })
            }
        })

        // // can be proper but a bit strange variant, here we have zoom in and zoom out variants
        // everythingHolder.scrollTop = workZoneHolder.offsetHeight / 100 * scrollPosition.top ;
        // everythingHolder.scrollLeft = workZoneHolder.offsetWidth / 100 * scrollPosition.left;
        //????
        everythingHolder.scrollLeft += (workZoneHolder.offsetWidth  - previousWorkZoneHolderOffset.width) /2 
        everythingHolder.scrollTop += (workZoneHolder.offsetHeight - previousWorkZoneHolderOffset.height) /2 
        // everythingHolder.scrollTop += 2 * CONFIG.UI.workZoneCurrentScale;
        // everythingHolder.scrollLeft = workZoneHolder.offsetWidth * scrollPosition.left
        // everythingHolder.scrollTop = 
    }
}

/**
 * calculate position of item in persentages (%) depends on viewport length
 * 
 * @param {string} selector pointer on items type (class)
 */
function calculatePositionForItems (selector) {
        if (typeof selector == 'string') {
            let allItems = document.querySelectorAll(selector);
            allItems.forEach(e => {
                //if item has top and left values in % we dont need to recalculate it's position,
                //if it doesn't, we should recalculate it's position depends on it's offsetTop, offsetLeft values
                if (e.style.left.match(/px/) != null &&
                    e.style.top.match(/px/) != null) {

                    e.style.top = `${e.offsetTop / workZone.offsetHeight * 100}%`
                    e.style.left = `${e.offsetLeft / workZone.offsetWidth * 100}%`
                    e.setAttribute('cY', selector.style.top)
                    e.setAttribute('cX', selector.style.left)
                } else {
                    e.setAttribute('cY', e.style.top)
                    e.setAttribute('cX', e.style.left)
                }
                
            })
        } else if (typeof selector == 'object') {
            if (selector.style.left.match(/px/) != null &&
                selector.style.top.match(/px/) != null) {

                selector.style.top = `${(selector.offsetTop / workZone.offsetHeight * 100).toFixed(4)}%`
                selector.style.left = `${(selector.offsetLeft / workZone.offsetWidth * 100).toFixed(4)}%`
                selector.setAttribute('cY', selector.style.top)
                selector.setAttribute('cX', selector.style.left)
            } else {
                selector.setAttribute('cY', selector.style.top)
                selector.setAttribute('cX', selector.style.left)
            }
            
        }
}