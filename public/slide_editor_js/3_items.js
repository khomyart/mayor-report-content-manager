/**
 * Fill item panel with items, wich are declared in special object
 * @param {string} itemPanel identifier of panel wich contains items
 * @param {object} objectWithItems JSON object with available items
 */
function fillItemPanelWithItems(itemPanel, objectWithItems) {
    let itemPanelFolder = document.createElement('div');
    let itemPanelElement = document.createElement('div');
    //specific item panel element creation
    let itemPanelWorkSpaceElement = document.createElement('div');
    let itemPanelElementContainer = document.createElement('div');
    
    itemPanelElement.appendChild(document.createElement('img'));

    //adding some things to specific element
    itemPanelWorkSpaceElement.appendChild(document.createElement('div'));
    itemPanelWorkSpaceElement.childNodes[0].appendChild(document.createElement('img'));
    itemPanelWorkSpaceElement.appendChild(document.createElement('div'));

    console.log(itemPanelWorkSpaceElement)
}

/**
 * @param {event} mouseEvent mouse event
 * @param {object} movableItem item wich will be moved with mouse cursor
 * @param {int} itemOffsetX offset wich allows user hold item in place where lmb was pressed on it (x - axes)
 * @param {int} itemOffsetY offset wich allows user hold item in place where lmb was pressed on it (y - axes)
 */
 function moveAt(mouseEvent, movableItem, itemOffsetX, itemOffsetY) {
    movableItem.style.left = mouseEvent.clientX - itemOffsetX + 'px';
    movableItem.style.top = mouseEvent.clientY - itemOffsetY + 'px';
    calculatePositionForItems(movableItem)
}

/**
 * @param {mouse event} event 
 * @param {element} rootItem basis for new item wich will be created after performing a function
 */
function createNewItem(event, rootItem) {
    //creates element and and puts it into elementsOfSchema array
    newElementOfSchema = CONFIG.UI.itemTemplates[rootItem.getAttribute('i-name')].get()
    elementsOfSchema.push(newElementOfSchema)

    //append newly created element to work field
    newElementOfSchema.classList.add('field-item');
    newElementOfSchema.style.width = `${calculateItemParams(newElementOfSchema).width}px`;
    newElementOfSchema.style.height = `${calculateItemParams(newElementOfSchema).height}px`;
    newElementOfSchema.style.borderWidth = `${calculateItemParams(newElementOfSchema).borderWidth}px`;
    newElementOfSchema.style.borderRadius = `${calculateItemParams(newElementOfSchema).borderRadius}px`;
    newElementOfSchema.style.transform = `${calculateItemParams(newElementOfSchema).transform}`
    newElementOfSchema.style.fontSize = `${calculateItemParams(newElementOfSchema).fontSize}px`
    newElementOfSchema.style.padding = `${calculateItemParams(newElementOfSchema).padding}px`
    newElementOfSchema.style.zIndex = getZIndexes().highest + 1;

    workZone.append(newElementOfSchema)

    shiftX = workZone.getBoundingClientRect().left + newElementOfSchema.offsetWidth / 2 - calculateItemParams(newElementOfSchema).anchorShiftX;
    shiftY = workZone.getBoundingClientRect().top + newElementOfSchema.offsetHeight / 2 - calculateItemParams(newElementOfSchema).anchorShiftY;

    //clear item selection
    if (selectedItemForModification) {
        clearItemSelection();
        selectedItemForModification = null;
    }

    newElementOfSchema.ondragstart = () => false;
    newElementOfSchema.childNodes.forEach(element => {
        element.ondragstart = () => false;
        element.onclick = () => false;
    });

    //Variable has been assigned in createNewItem function
    moveAt(event, newElementOfSchema, shiftX, shiftY);
}

/**
 * Method calculates style params for particular item depends on its attributes
 * 
 * @param {object} item - html object which we are working on  
 * @returns {object} - object with item params like: height, width, etc
 */
function calculateItemParams(item) {
    let widthUnit = workZone.offsetWidth / 100;
    let widthMultiplier = item.getAttribute('widthMultiplier');
    let width = `${(widthUnit * widthMultiplier).toFixed(5)}`;

    let widthInverted = `${((item.offsetWidth / workZone.offsetWidth) * 100).toFixed(5)}`;
    
    let heightUnit = workZone.offsetHeight / 100;
    let heightMultiplier = item.getAttribute('heightMultiplier');
    let height = `${(heightUnit * heightMultiplier).toFixed(5)}`;

    let heightInverted = `${((item.offsetHeight / workZone.offsetHeight) * 100).toFixed(5)}`;

    let borderWidthUnit = workZone.offsetWidth / 100;
    let borderWidthMultiplier = item.getAttribute('borderWidthMultiplier');
    let borderWidth = `${(borderWidthUnit * borderWidthMultiplier).toFixed(4)}`;

    let fontSizeUnit = workZone.offsetWidth / 100;
    let fontSizeMultiplier = item.getAttribute('fontSizeMultiplier');
    let fontSize = `${(fontSizeUnit * fontSizeMultiplier).toFixed(4)}`;

    let paddingUnit = workZone.offsetWidth / 100;
    let paddingMultiplier = item.getAttribute('paddingMultiplier');
    let padding = `${(paddingUnit * paddingMultiplier).toFixed()}`;

    let borderRadiusUnit = workZone.offsetWidth / 100;
    let borderRadiusMultiplier = item.getAttribute('borderRadiusMultiplier');
    let borderRadius = `${(borderRadiusUnit * borderRadiusMultiplier).toFixed()}`;

    let marginBottomUnit = workZone.offsetHeight/100;
    let marginBottomMultiplier = item.getAttribute('marginBottomMultiplier');
    let marginBottom = `${(marginBottomUnit * marginBottomMultiplier).toFixed(4)}`;

    let cX = ((item.offsetLeft / workZone.offsetWidth) * 100).toFixed(4);
    let cY = ((item.offsetTop / workZone.offsetHeight) * 100).toFixed(4);

    const anchorRegexSpaces = /\s+/gi;
    const anchorRegexPersentages = /\%+/gi;

    let cAnchorParam = [null, null],
    transform, anchorShiftX, anchorShiftY;
    if (item.hasAttribute('cAnchor')) {
        cAnchorParam = item.getAttribute('cAnchor').replace(anchorRegexSpaces, '').replace(anchorRegexPersentages, '').split(',');
        transform = `translate(${cAnchorParam[0]}%, ${cAnchorParam[1]}%)`; 
        anchorShiftX = Math.abs(parseInt(item.offsetWidth * (cAnchorParam[0] / 100)));
        anchorShiftY = Math.abs(parseInt(item.offsetHeight * (cAnchorParam[1] / 100)));
    }

    return {
        transform, // full string of transform: translate
        anchorX: cAnchorParam[0], //x part of transform: translate without '%' sign
        anchorY: cAnchorParam[1], //y part of transform: translate without '%' sign
        anchorShiftX, //x shift for object mooving depends on its transform: translate x value
        anchorShiftY, //y shift for object mooving depends on its transform: translate y value
        width,
        height,
        borderWidth,
        borderRadius,
        fontSize,
        padding,
        marginBottom,
        widthInverted, //inverted value, when we have item.offsetWidth and we need to transform it to withMultiplier
        heightInverted,
        cX, cY,
    }
}

/**
 * 
 * @returns object with highest and lowest zIndexes of the .field-items
 */
function getZIndexes() {
    let highestZIndex = 100;
    let lowestZIndex = 100;
    let fieldItems = document.getElementsByClassName('field-item');
    fieldItems = [...fieldItems];
    console.log(fieldItems)
    if (fieldItems.length == 0) {
        console.log('length 0')
        return {
            highest: highestZIndex,
            lowest: lowestZIndex,
        };
    } 

    fieldItems.forEach((item, index) => {
        let currentItemZindex = parseInt(window.getComputedStyle(item, null).zIndex)
        
        if (index == 0) {
            console.log('what the fuck')
            highestZIndex = currentItemZindex;
            lowestZIndex = currentItemZindex;
        } else {
            if (currentItemZindex > highestZIndex) {
                highestZIndex = currentItemZindex;
            }
            if (currentItemZindex < lowestZIndex) {
                lowestZIndex = currentItemZindex;
            }
        }
    });

    return {
        highest: parseInt(highestZIndex),
        lowest: parseInt(lowestZIndex),
    };
}

/**
 * Add drag and dtop to item and also adds some features like context menu by releasing lmb
 * @param {object} item selected item 
 */
function addDragAndDropToItem(item) {
    item.onmousedown = (event) => {
        itemDragActions(item, event)
        removeContextMenu()
        // if(selectedItemForModification) {
        //     selectItem(item)
        // }
    }
    if (item.getAttribute('newly-created') == 'true') {
        itemDragActions(item, event)
    }
}

/**
 * actions wich happens while drag and drop event is going
 * @param {object} item item of actions
 */
function itemDragActions(item, event) {
    item.onmouseup = () => {
        if (event.buttons == 2) {   
            if(item.getAttribute('i-is-selectable') == 'true') {
                showContextMenuOfItem(item, event);
                currentItem = null
            }
        }
        if (event.buttons == 1) {   
            if(item.getAttribute('i-is-selectable') == 'true') {
                clearItemSelection();
                selectItem(item)

                if (contextPanelScrollPosition != null) {
                    contextPanel.scrollTop = contextPanelScrollPosition;
                }
                currentItem = null
            }
        }
    }

    //set this variable to null as default value for every newly created item
    workFieldSelectedAsDropTarget = null;
    workSpaceItemSelectedAsDropTarget = null;
    workSpaceContainerItemSelectedAsMoveTarget = null;
    //getting scroll position, when item has been spawned
    initialScrollPosition = {
        x: everythingHolder.scrollLeft,
        y: everythingHolder.scrollTop
    };
    newScrollPosition = {
        x: null,
        y: null,
    };
    shiftX = event.pageX - item.getBoundingClientRect().left + workZone.getBoundingClientRect().left - calculateItemParams(item).anchorShiftX;
    shiftY = event.pageY - item.getBoundingClientRect().top + workZone.getBoundingClientRect().top - calculateItemParams(item).anchorShiftY;

    // if (!currentItem) {
    //     currentItem = 
    //     document.elementFromPoint(event.clientX, event.clientY).closest('.work-space-container-item');
    // }

    mouseEvent = {
        clientX: null,
        clientY: null
    };
    
    document.body.onmousemove = (event) => {
        if (item.getAttribute('lockType') != 'none') {
            return
        }
        
        if (event.buttons == 1) {
            enableItemPositionCalculationMethod = true;

            if(contextMenu) {
                removeContextMenu()
            }

            newScrollPosition.y = everythingHolder.scrollTop;
            newScrollPosition.x = everythingHolder.scrollLeft;

            if (newScrollPosition.x != initialScrollPosition.x 
                || newScrollPosition.y != initialScrollPosition.y) {
                mouseEvent.clientX = event.clientX + (newScrollPosition.x - initialScrollPosition.x);
                mouseEvent.clientY = event.clientY + (newScrollPosition.y - initialScrollPosition.y);
            } else {
                mouseEvent.clientX = event.clientX;
                mouseEvent.clientY = event.clientY;
            }

            if(currentItem) {
                item = currentItem
                shiftX = event.pageX - item.getBoundingClientRect().left + workZone.getBoundingClientRect().left - calculateItemParams(item).anchorShiftX;
                shiftY = event.pageY - item.getBoundingClientRect().top + workZone.getBoundingClientRect().top - calculateItemParams(item).anchorShiftY;
                item.className = 'field-item' 
                workZone.append(item)
                calculatePositionForItems(item)
                item.style.width = `${CONFIG.UI.defaultWorkZoneItemsOffsets.width * CONFIG.UI.workZoneCurrentScale}px`;
                item.style.height = `${CONFIG.UI.defaultWorkZoneItemsOffsets.height * CONFIG.UI.workZoneCurrentScale}px`;
                item.style.borderRadius = `${CONFIG.UI.defaultWorkZoneItemBorderRadius * CONFIG.UI.workZoneCurrentScale}px`;
                moveAt(event, item, shiftX, shiftY);   
                currentItem = null
            }

            item.onmouseup = null
            // mouseEvent.clientX = x;
            // mouseEvent.clientY = y;
            moveAt(mouseEvent, item, shiftX, shiftY);           
            //To get information about what we have under the item wich moving with cursor, we should do checking when actual item 
            //is invisible, so in this case we will get correct information for workFieldSelectedAsDropTarget variable
            item.style.display = 'none';
            workFieldSelectedAsDropTarget = 
            document.elementFromPoint(event.clientX, event.clientY).closest('#main_field');
           
            item.style.display = 'block';
        }
    }

    document.body.onmouseup = () => {
        itemDropActions(item);
    }
}

/**
 * Decides how item should behave when mouse moving is done and lmb has been released
 * @param {*} item 
 */
function itemDropActions(item) {
    item.setAttribute('newly-created', false)
    item.style.transition = `all ease-in-out 0s`;
    item.setAttribute('i-is-selectable', 'true');

    if (workZone.getBoundingClientRect().left > item.getBoundingClientRect().right
    || workZone.getBoundingClientRect().right < item.getBoundingClientRect().left 
    || workZone.getBoundingClientRect().top > item.getBoundingClientRect().bottom
    || workZone.getBoundingClientRect().bottom < item.getBoundingClientRect().top) {
        enableItemPositionCalculationMethod = false;
        if (selectedItemForModification) {
            clearItemSelection();
        }
        item.remove();

        console.log('item should be deleted')
    } 

    if (enableItemPositionCalculationMethod == true) {
        calculatePositionForItems(item)
    }

    if(selectedItemForModification) {
        clearItemSelection();
        selectItem(item);
    }
    
    enableItemPositionCalculationMethod = false;
    document.body.onmousemove = null;
    document.body.onmouseup = null;
}

/**
 * 
 * @param {object} item item which has been clicked
 */
function selectItem(item) {
    document.querySelectorAll('.selected-item').forEach(item => {
        item.classList.remove('selected-item')
    })

    console.log('open side panel')
    selectedItemForModification = item;
    selectedItemForModification.classList.add('selected-item');
    configureContextPanel('create');
}

function clearItemSelection() {
    console.log('close side panel')
    item = selectedItemForModification;
    configureContextPanel('destroy');

    if (item!=null && item.classList.contains('selected-item')) {
        item.classList.remove('selected-item');
    }

    selectedItemForModification = null;
}

/**
 * Showing context menu with content wich is releted to selected item 
 * @param {selected item} item 
 */
function showContextMenuOfItem(item, event) {
    removeContextMenu()
    contextMenu = document.createElement('div')
    contextMenu.className = 'context-menu'
    document.body.append(contextMenu)
    contextMenuContent = [
        {
            name: () => {
                return item.getAttribute('lockType') == 'none' ? 'Блокувати переміщення' : 'Розблокувати переміщення'
            },
            method: () => {
                switch (item.getAttribute('lockType')) {
                    case 'none':
                        item.setAttribute('lockType', 'movement')
                    break;
                    case 'movement':
                        item.setAttribute('lockType', 'none')
                    break;
                }
                removeContextMenu()
            },
            //TODO: create extendable stuff
            extendable: {}
        },
        {
            name: () => `hr`
        },
        {
            name: () => `Видалити`,
            method: () => {
                item.remove();
                removeContextMenu();
                if (selectedItemForModification != null) {
                    clearItemSelection();
                }
            },
        },
    ]

    contextMenuContent.forEach((element, index) => {
        if(element.name() == 'hr') {
            contextMenu.innerHTML = contextMenu.innerHTML +
            `
                <div class="context-menu-separator"></div>
            `
        } else {
            contextMenu.innerHTML = contextMenu.innerHTML +
            `
                <div class="context-menu-item" onclick="contextMenuContent[${index}].method()">
                    ${element.name()}
                <div>
            `
        }
    })

    contextMenu.style.transition = `all ease-in-out ${CONFIG.logic.contextMenuOpeningSpeed}s`
    contextMenu.style.top = `${event.clientY + 2}px`
    contextMenu.style.left = `${event.clientX + 2}px`
    contextMenu.style.zIndex = 2000;
    setTimeout(()=>{
        contextMenu.style.opacity = 1
    },10)
}

function removeContextMenu() {
    contextMenu = document.querySelector('.context-menu')
    if (contextMenu) {
        contextMenu.remove()
        console.log('context menu has been deleted')
    }
    contextMenuContent = null;
}

