let contextPanelScrollPosition = null;

/**
 * Converts rgb string like "rgb(69, 69, 69, 0.69)" to hex value: "#69696969"
 * 
 * @param {string} rgb 
 * @returns hex string
 */
function rgbToHex(rgb) {
    //hex with alpha chanel
    let hexA = '#';
    //hex without alpha chanel
    let hex = '#';
    let a16 = '';
    let match = rgb.matchAll(/[0-9.]+/gi);
    match = Array.from(match, x => x[0]);

    for (let i = 0; i < 3; i++) {
        let parsedValue = parseInt(match[i]).toString(16);
        hex += parsedValue.length < 2 ? `0${parsedValue}` : parsedValue;
        hexA = hex
    }

    if (match.length == 4) {
        hexA += parseInt(((255 * parseFloat(match[3]))).toFixed()).toString(16);
        a16 = parseInt(((255 * parseFloat(match[3]))).toFixed()).toString(16);
    } else {
        hexA += 'ff';
        a16 = 'ff';
    }

    return {
        hexA,
        hex,
        r: match[0],
        g: match[1],
        b: match[2],
        a: match[3] ? match[3] : '1',
        a16
    };
}

/**
 * init all fields of context panel depends on item's attributes
 * 
 * @param {string} mode 'create' or 'destroy' fields of context panel  
 * !! selectedItemForModification !! - item, for which context panel will be tweaked
 */
function configureContextPanel(mode) {   
    let availableFields = {
        position: {
            init: function() {
                let minValue = 0;
                let maxValue = 100;
                let fieldHolder = document.querySelector('div[ci-name="position"]')
                fieldHolder.style.display = 'flex';

                /* context panel POSITION */
                let x = document.querySelector('#panel_position_x');
                let y = document.querySelector('#panel_position_y');

                if (selectedItemForModification.style.left.match(/px/) != null &&
                    selectedItemForModification.style.top.match(/px/) != null) {
                    x.value = (selectedItemForModification.offsetLeft / workZone.offsetWidth * 100).toFixed(4);
                    y.value = (selectedItemForModification.offsetTop / workZone.offsetHeight * 100).toFixed(4);
                } else {
                    x.value = selectedItemForModification.style.left.replace(/%/gi,'');
                    y.value = selectedItemForModification.style.top.replace(/%/gi,'');
                }

                x.oninput = function(event) {
                    if (event.target.value > maxValue) {
                        event.target.value = maxValue;
                    }

                    if (event.target.value < minValue) {
                        event.target.value = minValue;
                    }

                    selectedItemForModification.style.left = `${event.target.value}%`;
                    calculatePositionForItems(selectedItemForModification, true)
                }
                y.oninput = function(event) {
                    if (event.target.value > maxValue) {
                        event.target.value = maxValue;
                    }

                    if (event.target.value < minValue) {
                        event.target.value = minValue;
                    }
                    selectedItemForModification.style.top = `${event.target.value}%`;
                    calculatePositionForItems(selectedItemForModification, true)
                }
            },
        },

        zIndex: {
            init: function() {
                let fieldHolder = document.querySelector('div[ci-name="zIndex"]')
                fieldHolder.style.display = 'flex';
                
                let riseZIndexButton = document.querySelector('#zIndex_rise');
                let riseZIndexToEndButton = document.querySelector('#zIndex_rise_to_end');
                let downZIndexButton = document.querySelector('#zIndex_down');
                let downZIndexToEndButton = document.querySelector('#zIndex_down_to_end');

                riseZIndexButton.onclick = function () {
                    selectedItemForModification.style.zIndex = 
                        parseInt(window.getComputedStyle(selectedItemForModification, null).zIndex) + 1;
                    console.log(window.getComputedStyle(selectedItemForModification, null).zIndex)
                }
                riseZIndexToEndButton.onclick = function () {
                    selectedItemForModification.style.zIndex =
                        getZIndexes().highest + 1;
                    console.log(getZIndexes().highest)
                }
                downZIndexButton.onclick = function () {
                    selectedItemForModification.style.zIndex = 
                        parseInt(window.getComputedStyle(selectedItemForModification, null).zIndex) - 1;
                }
                downZIndexToEndButton.onclick = function () {
                    selectedItemForModification.style.zIndex =
                        getZIndexes().lowest - 1;
                }
            },
        },

        anchor: {
            init: function() {
                function assignActivatedAnchorButtonClass(buttons) {
                    buttons.forEach(button => {
                        if (button.getAttribute('ca-value') == selectedItemForModification.getAttribute('cAnchor')) {
                            button.classList.add('anchor-button-activated');
                        } else {
                            button.classList.remove('anchor-button-activated');
                        }
                    });
                }

                let fieldHolder = document.querySelector('div[ci-name="anchor"]')
                fieldHolder.style.display = 'flex';
                let anchorButtons = document.querySelectorAll('.anchor-button')

                assignActivatedAnchorButtonClass(anchorButtons);

                anchorButtons.forEach((button)=>{
                    button.onclick =  function(event) {
                        selectedItemForModification.style.left = selectedItemForModification.offsetLeft - calculateItemParams(selectedItemForModification).anchorShiftX + 'px';
                        selectedItemForModification.style.top = selectedItemForModification.offsetTop - calculateItemParams(selectedItemForModification).anchorShiftY  + 'px';

                        let anchorValue = button.getAttribute('ca-value');
                        selectedItemForModification.setAttribute('cAnchor', anchorValue)

                        selectedItemForModification.style.transform = `${calculateItemParams(selectedItemForModification).transform}`;
                        selectedItemForModification.style.left = selectedItemForModification.offsetLeft + calculateItemParams(selectedItemForModification).anchorShiftX + 'px';
                        selectedItemForModification.style.top = selectedItemForModification.offsetTop + calculateItemParams(selectedItemForModification).anchorShiftY + 'px';
                    
                        // calculatePositionForItems(selectedItemForModification)
                        assignActivatedAnchorButtonClass(anchorButtons);
                        selectItem(selectedItemForModification);
                    }
                })
            },
        },

        width: {
            init: function() {
                let fieldHolder = document.querySelector('div[ci-name="width"]')
                fieldHolder.style.display = 'flex';

                let widthRange = document.querySelector('#panel_width_range');
                let widthInput = document.querySelector('#panel_width_input');
                let widthCheckbox = document.querySelector('#panel_width_checkbox');

                if (selectedItemForModification.style.width == 'auto') {
                    widthCheckbox.checked = true;
                    widthRange.disabled = true;
                    widthInput.disabled = true;
                    widthRange.value = 50;
                    widthInput.value = 'AUTO';
                } else {
                    widthRange.disabled = false;
                    widthInput.disabled = false;
                    widthCheckbox.checked = false;
                    widthRange.value = selectedItemForModification.getAttribute('widthMultiplier');
                    widthInput.value = selectedItemForModification.getAttribute('widthMultiplier');
                }

                widthRange.oninput = function(event) {
                    if (selectedItemForModification.style.width != 'auto') {
                        widthInput.value = event.target.value;
                        selectedItemForModification.setAttribute('widthMultiplier', event.target.value);
                        selectedItemForModification.style.width = `${calculateItemParams(selectedItemForModification).width}px`;
                    }
                }
                widthInput.oninput = function(event) {
                    if (selectedItemForModification.style.width != 'auto') {
                        widthRange.value = event.target.value;
                        selectedItemForModification.setAttribute('widthMultiplier', event.target.value);
                        selectedItemForModification.style.width = `${calculateItemParams(selectedItemForModification).width}px`;
                    }
                }    
                widthCheckbox.oninput = function(event) {
                    if (event.target.checked) {
                        widthRange.disabled = true;
                        widthInput.disabled = true;
                        selectedItemForModification.setAttribute('widthMultiplier', 'auto');
                        selectedItemForModification.style.width = `auto`;
                        widthInput.value = 'AUTO';
                        widthRange.value = 50;
                    } else if (!event.target.checked) {
                        widthRange.disabled = false;
                        widthInput.disabled = false;
                        console.log(calculateItemParams(selectedItemForModification).widthInverted)
                        selectedItemForModification.setAttribute('widthMultiplier', calculateItemParams(selectedItemForModification).widthInverted);
                        widthRange.value = selectedItemForModification.getAttribute('widthMultiplier');
                        widthInput.value = selectedItemForModification.getAttribute('widthMultiplier');

                        selectedItemForModification.style.width = `${calculateItemParams(selectedItemForModification).width}px`;
                    }
                }           
            },
        },

        height: {
            init: function () {
                let fieldHolder = document.querySelector('div[ci-name="height"]')
                fieldHolder.style.display = 'flex';

                /* context panel HEIGHT */
                let heightRange = document.querySelector('#panel_height_range');
                let heightInput = document.querySelector('#panel_height_input');
                let heightCheckbox = document.querySelector('#panel_height_checkbox');

                if (selectedItemForModification.style.height == 'auto') {
                    heightCheckbox.checked = true;
                    heightRange.disabled = true;
                    heightInput.disabled = true;
                    heightRange.value = 50;
                    heightInput.value = 'AUTO';
                } else {
                    heightRange.disabled = false;
                    heightInput.disabled = false;
                    heightCheckbox.checked = false;
                    heightRange.value = selectedItemForModification.getAttribute('heightMultiplier');
                    heightInput.value = selectedItemForModification.getAttribute('heightMultiplier');
                }

                heightRange.oninput = function(event) {
                    if (selectedItemForModification.style.height != 'auto') {
                        heightInput.value = event.target.value;
                        selectedItemForModification.setAttribute('heightMultiplier', event.target.value);
                        selectedItemForModification.style.height = `${calculateItemParams(selectedItemForModification).height}px`;
                    }
                }
                heightInput.oninput = function(event) {
                    if (selectedItemForModification.style.height != 'auto') {
                        heightRange.value = event.target.value;
                        selectedItemForModification.setAttribute('heightMultiplier', event.target.value);
                        selectedItemForModification.style.height = `${calculateItemParams(selectedItemForModification).height}px`;
                    }
                }
                heightCheckbox.oninput = function(event) {
                    if (event.target.checked) {
                        heightRange.disabled = true;
                        heightInput.disabled = true;
                        selectedItemForModification.setAttribute('heightMultiplier', 'auto');
                        selectedItemForModification.style.height = `auto`;
                        heightRange.value = 50;
                        heightInput.value = 'AUTO';
                    } else if (!event.target.checked) {
                        heightRange.disabled = false;
                        heightInput.disabled = false;
                        console.log(calculateItemParams(selectedItemForModification).heightInverted)
                        selectedItemForModification.setAttribute('heightMultiplier', calculateItemParams(selectedItemForModification).heightInverted);
                        heightRange.value = selectedItemForModification.getAttribute('heightMultiplier');
                        heightInput.value = selectedItemForModification.getAttribute('heightMultiplier');

                        selectedItemForModification.style.height = `${calculateItemParams(selectedItemForModification).height}px`;
                    }
                } 
            }
        },
        image: {
            init: function () {
                function optionTemplate (name, value, isSelected, isDisabled = false) {
                    console.log(isSelected)
                    let optionTemplate = `
                        <option ${isDisabled ? 'disabled ' : ''} ${isSelected ? 'selected ' : ''} value="${value}">${name}</option>
                    `
                    return optionTemplate;
                }

                let fieldHolder = document.querySelector('div[ci-name="image"]');
                let itemImageSrc = selectedItemForModification.src;
                let imageSelectInput = document.querySelector('#panel_image_name_select');
                fieldHolder.style.display = 'flex';

                /* fill select input with values */
                imageSelectInput.innerHTML = 
                    optionTemplate('Оберіть зображення', CONFIG.UI.itemTemplates.imageSrcTemplate, CONFIG.UI.itemTemplates.imageSrcTemplate == itemImageSrc, true);

                imagesConfig.getList().forEach(imageItem => {
                    imageSelectInput.innerHTML += 
                    optionTemplate(imageItem.name, imageItem.src, imageItem.src == itemImageSrc)
                })               

                imageSelectInput.oninput = () => {
                    selectedItemForModification.src = imageSelectInput.value;
                }

                console.log(fieldHolder)
            }
        },
        href: {
            init: function () {
                let fieldHolder = document.querySelector('div[ci-name="href"]');
                let itemHref = selectedItemForModification.href;
                let hrefInput = document.querySelector('#panel_href_input');
                let hrefButton = document.querySelector('#panel_href_button');

                fieldHolder.style.display = 'flex';
                hrefInput.value = itemHref;

                hrefInput.oninput = function(event) {
                    selectedItemForModification.href = `${event.target.value}`;
                }

                hrefButton.onclick = function() {
                    window.open(selectedItemForModification.href, '_blank').focus();
                }
            }
        },

        opacity: {
            init: function () {
                let minValue = 3;
                let maxValue = 100;

                let fieldHolder = document.querySelector('div[ci-name="opacity"]')
                let itemOpacity = window.getComputedStyle(selectedItemForModification, null).opacity * 100;           
                let opacityRange = document.querySelector('#panel_opacity_range');
                let opacityInput = document.querySelector('#panel_opacity_input');

                fieldHolder.style.display = 'flex';
                opacityRange.value = itemOpacity;
                opacityInput.value = itemOpacity;

                opacityRange.oninput = function(event) {
                    opacityInput.value = event.target.value;
                    selectedItemForModification.style.opacity = `${event.target.value / 100}`;
                }
                opacityInput.oninput = function(event) {
                    if (event.target.value > maxValue) {
                        opacityInput.value = maxValue;
                    }

                    if (event.target.value < minValue) {
                        opacityInput.value = minValue;
                    }

                    opacityRange.value = event.target.value;
                    selectedItemForModification.style.opacity = `${event.target.value / 100}`;
                }
            }
        },

        padding: {
            init: function() {
                let fieldHolder = document.querySelector('div[ci-name="padding"]')
                fieldHolder.style.display = 'flex';

                let paddingRange = document.querySelector('#panel_padding_range');
                let paddingInput = document.querySelector('#panel_padding_input');
                paddingRange.value = selectedItemForModification.getAttribute('paddingMultiplier');
                paddingInput.value = selectedItemForModification.getAttribute('paddingMultiplier');

                paddingRange.oninput = function(event) {
                    paddingInput.value = event.target.value;
                    selectedItemForModification.setAttribute('paddingMultiplier', event.target.value);
                    selectedItemForModification.style.padding = `${calculateItemParams(selectedItemForModification).padding}px`;
                }
                paddingInput.oninput = function(event) {
                    paddingRange.value = event.target.value;
                    selectedItemForModification.setAttribute('paddingMultiplier', event.target.value);
                    selectedItemForModification.style.padding = `${calculateItemParams(selectedItemForModification).padding}px`;
                }             
            },
        },

        marginBottom: {
            init: function() {
                let fieldHolder = document.querySelector('div[ci-name="marginBottom"]')
                fieldHolder.style.display = 'flex';

                let marginBottomRange = document.querySelector('#panel_margin_bottom_range');
                let marginBottomInput = document.querySelector('#panel_margin_bottom_input');
                marginBottomRange.value = selectedItemForModification.getAttribute('marginBottomMultiplier');
                marginBottomInput.value = selectedItemForModification.getAttribute('marginBottomMultiplier');

                marginBottomRange.oninput = function(event) {
                    marginBottomInput.value = event.target.value;
                    selectedItemForModification.setAttribute('marginBottomMultiplier', event.target.value);
                    let marginBottomValue = `${calculateItemParams(selectedItemForModification).marginBottom}px`;

                    selectedItemForModification.childNodes.forEach((childNode)=>{
                        childNode.setAttribute('marginBottomMultiplier', event.target.value)
                        childNode.style.marginBottom = marginBottomValue;
                        console.log(marginBottomValue)
                    })
                }
                marginBottomInput.oninput = function(event) {
                    marginBottomRange.value = event.target.value;
                    selectedItemForModification.setAttribute('marginBottomMultiplier', event.target.value);
                    let marginBottomValue = `${calculateItemParams(selectedItemForModification).marginBottom}px`;

                    console.log(selectedItemForModification.childNodes.length)

                    selectedItemForModification.childNodes.forEach((childNode)=>{
                        childNode.setAttribute('marginBottomMultiplier', event.target.value)
                        childNode.style.marginBottom = marginBottomValue;
                        console.log(marginBottomValue)
                    })
                }               
            },
        },

        fontSize: {
            init: function() {
                let fieldHolder = document.querySelector('div[ci-name="fontSize"]')
                fieldHolder.style.display = 'flex';

                let fontSizeRange = document.querySelector('#panel_font_size_range');
                let fontSizeInput = document.querySelector('#panel_font_size_input');
                fontSizeRange.value = selectedItemForModification.getAttribute('fontSizeMultiplier');
                fontSizeInput.value = selectedItemForModification.getAttribute('fontSizeMultiplier');

                fontSizeRange.oninput = function(event) {
                    fontSizeInput.value = event.target.value;
                    selectedItemForModification.setAttribute('fontSizeMultiplier', event.target.value);
                    selectedItemForModification.style.fontSize = `${calculateItemParams(selectedItemForModification).fontSize}px`;
                }
                fontSizeInput.oninput = function(event) {
                    fontSizeRange.value = event.target.value;
                    selectedItemForModification.setAttribute('fontSizeMultiplier', event.target.value);
                    selectedItemForModification.style.fontSize = `${calculateItemParams(selectedItemForModification).fontSize}px`;
                }                
            },
        },

        textEditor: {
            init: function () {
                let fieldHolder = document.querySelector('div[ci-name="textEditor"]'),
                    marginBottomInput = document.querySelector('#panel_margin_bottom_input');

                fieldHolder.style.display = 'block';
                editor.setData( selectedItemForModification.innerHTML );

                if (textEditorOnChangeMethodIsCreated == false) {
                    editor.model.document.on( 'change:data', () => {
                        textEditorOnChangeMethodIsCreated = true
                        selectedItemForModification.innerHTML = editor.getData();

                        selectedItemForModification.childNodes.forEach((childNode)=>{
                            childNode.setAttribute('marginBottomMultiplier', marginBottomInput.value);
                        })

                        selectedItemForModification.childNodes.forEach((childNode, index)=>{
                            let marginBottomValue = `${calculateItemParams(selectedItemForModification).marginBottom}px`
                            childNode.style.marginBottom = marginBottomValue;
                            console.log('child_node: ' + (index + 1))
                            console.log('margin-calculated')
                        })      
                    });
                } 
            }
        },

        backgroundColor: {
            init: function () { 
                function getOpacity(opacityFromInput) {
                    let opacity = `${parseInt((255 / 100 * opacityFromInput).toFixed()).toString(16)}`;
                    opacity = opacity.length < 2 ? '0' + opacity : opacity; 
                    return opacity;
                }

                let minValue = 0;
                let maxValue = 100;

                // selectedItemForModification.style.backgroundImage = 'linear-gradient(90deg, red 50%, yellow 80%)'

                let fieldHolder = document.querySelector('div[ci-name="backgroundColor"]')
                fieldHolder.style.display = 'flex';
                backgroundColor = rgbToHex(window.getComputedStyle(selectedItemForModification, null).backgroundColor);     

                let backgroundColorInput = document.querySelector('#panel_background_color_input');
                let backgroundColorOpacityRange = document.querySelector('#panel_background_color_opacity_range');
                let backgroundColorOpacityInput = document.querySelector('#panel_background_color_opacity_input');
                
                backgroundColorInput.value = backgroundColor.hex;
                backgroundColorOpacityRange.value = parseInt(parseFloat(backgroundColor.a) * 100);
                backgroundColorOpacityInput.value = parseInt(parseFloat(backgroundColor.a) * 100);

                backgroundColorInput.oninput = function(event) {
                    selectedItemForModification.style.backgroundColor = `
                        ${event.target.value}${getOpacity(backgroundColorOpacityRange.value)}
                    `;
                }
                backgroundColorOpacityRange.oninput = function(event) {
                    backgroundColorOpacityInput.value = event.target.value;
                    selectedItemForModification.style.backgroundColor = `
                        ${backgroundColorInput.value}${getOpacity(event.target.value)}
                    `;
                }
                backgroundColorOpacityInput.oninput = function(event) {
                    if (event.target.value > maxValue) {
                        backgroundColorOpacityInput.value = maxValue;
                    }

                    if (event.target.value < minValue) {
                        backgroundColorOpacityInput.value = minValue;
                    }

                    backgroundColorOpacityRange.value = event.target.value;
                    selectedItemForModification.style.backgroundColor = `
                        ${backgroundColorInput.value}${getOpacity(event.target.value)}
                    `;
                }
            }
        },

        backgroundLinearGradient: {
            init: function () { 
                function getCompiledLinearGradientString (deg, cF, oF, vF, cT, oT, vT) {
                    return `linear-gradient(${deg}deg, ${cF}${oF} ${vF}%, ${cT}${oT} ${vT}%)`
                }
                function getOpacity(opacityFromInput) {
                    let opacity = `${parseInt((255 / 100 * opacityFromInput).toFixed()).toString(16)}`;
                    opacity = opacity.length < 2 ? '0' + opacity : opacity; 
                    return opacity;
                }
                //gradient 'to' value (percentages of linear-gradient function)
                function getToValue(toValue) {
                    return `${maxValue + minValue - toValue}`;
                }
                function decomposeBackgroundImageParam(backgroundImage) {
                    let match;
                    let persentagesValue = {
                        from: '',
                        to: ''
                    }
                    let rgba = {
                        from: '',
                        to: '',
                    }
                    let deg = ''

                    match = backgroundImage.matchAll(/[0-9.]+%/gi);
                    match = Array.from(match, x => x[0]);
                    persentagesValue.from = match[0].slice(0,-1);
                    persentagesValue.to = match[1].slice(0,-1);

                    match = backgroundImage.matchAll(/rgb[a]*\([0-9,.\s]+\)/gi);
                    match = Array.from(match, x => x[0]);
                    rgba.from = match[0];
                    rgba.to = match[1];

                    match = backgroundImage.matchAll(/[0-9.]+deg/gi);
                    match = Array.from(match, x => x[0]);
                    deg = match[0].slice(0,-3);

                    return {
                        persentagesValue,
                        rgba,
                        deg
                    }
                }

                let minValue = 0;
                let maxValue = 100;   

                let backgroundImage = window.getComputedStyle(selectedItemForModification, null).backgroundImage
                let fieldHolder = document.querySelector('div[ci-name="backgroundLinearGradient"]')
                fieldHolder.style.display = 'flex';

                //color from, opacity from, value from, etc...
                let cF = document.querySelector('#panel_background_linear_gradient_from_input');
                let oF = document.querySelector('#panel_background_linear_gradient_from_opacity_range');
                let vF = document.querySelector('#panel_background_linear_gradient_from_value_range');
                
                //color to, opacity to, value to, etc...
                let cT = document.querySelector('#panel_background_linear_gradient_to_input');
                let oT = document.querySelector('#panel_background_linear_gradient_to_opacity_range');
                let vT = document.querySelector('#panel_background_linear_gradient_to_value_range');
                
                let degRange = document.querySelector('#panel_background_linear_gradient_deg_range');
                let degInput = document.querySelector('#panel_background_linear_gradient_deg_input');

                if (backgroundImage == 'none') {
                    selectedItemForModification.style.backgroundImage = 'linear-gradient(90deg, #FFFFFF00 10%, #FFFFFF00 90%)'
                }
                let decomposedBI = decomposeBackgroundImageParam(window.getComputedStyle(selectedItemForModification, null).backgroundImage);             

                cF.value = rgbToHex(decomposedBI.rgba.from).hex
                cT.value = rgbToHex(decomposedBI.rgba.to).hex
                oF.value = rgbToHex(decomposedBI.rgba.from).a*100
                oT.value = rgbToHex(decomposedBI.rgba.to).a*100
                vF.value = decomposedBI.persentagesValue.from
                vT.value = minValue + maxValue - decomposedBI.persentagesValue.to
                degRange.value = decomposedBI.deg;
                degInput.value = decomposedBI.deg;
                
                cF.oninput = function(event) {
                    selectedItemForModification.style.backgroundImage = getCompiledLinearGradientString (degRange.value, cF.value, getOpacity(oF.value), vF.value, cT.value, getOpacity(oT.value), getToValue(vT.value))
                }
                oF.oninput = function(event) {
                    selectedItemForModification.style.backgroundImage = getCompiledLinearGradientString (degRange.value, cF.value, getOpacity(oF.value), vF.value, cT.value, getOpacity(oT.value), getToValue(vT.value))
                }
                vF.oninput = function(event) {
                    selectedItemForModification.style.backgroundImage = getCompiledLinearGradientString (degRange.value, cF.value, getOpacity(oF.value), vF.value, cT.value, getOpacity(oT.value), getToValue(vT.value))
                }

                cT.oninput = function(event) {
                    selectedItemForModification.style.backgroundImage = getCompiledLinearGradientString (degRange.value, cF.value, getOpacity(oF.value), vF.value, cT.value, getOpacity(oT.value), getToValue(vT.value))
                }
                oT.oninput = function(event) {
                    selectedItemForModification.style.backgroundImage = getCompiledLinearGradientString (degRange.value, cF.value, getOpacity(oF.value), vF.value, cT.value, getOpacity(oT.value), getToValue(vT.value))
                }
                vT.oninput = function(event) {
                    selectedItemForModification.style.backgroundImage = getCompiledLinearGradientString (degRange.value, cF.value, getOpacity(oF.value), vF.value, cT.value, getOpacity(oT.value), getToValue(vT.value))
                }

                degRange.oninput = function(event) {
                    degInput.value = event.target.value;
                    selectedItemForModification.style.backgroundImage = getCompiledLinearGradientString (degRange.value, cF.value, getOpacity(oF.value), vF.value, cT.value, getOpacity(oT.value), getToValue(vT.value))
                }
                degInput.oninput = function(event) {
                    degRange.value = event.target.value;
                    selectedItemForModification.style.backgroundImage = getCompiledLinearGradientString (degRange.value, cF.value, getOpacity(oF.value), vF.value, cT.value, getOpacity(oT.value), getToValue(vT.value))
                }
            }
        },


        borderColor: {
            init: function () { 
                function getOpacity(opacityFromInput) {
                    let opacity = `${parseInt((255 / 100 * opacityFromInput).toFixed()).toString(16)}`;
                    opacity = opacity.length < 2 ? '0' + opacity : opacity; 
                    return opacity;
                }

                let minValue = 0;
                let maxValue = 100;

                let fieldHolder = document.querySelector('div[ci-name="borderColor"]')
                fieldHolder.style.display = 'flex';
                borderColor = rgbToHex(window.getComputedStyle(selectedItemForModification, null).borderColor);     

                let borderColorInput = document.querySelector('#panel_border_color_input');
                let borderColorOpacityRange = document.querySelector('#panel_border_color_opacity_range');
                let borderColorOpacityInput = document.querySelector('#panel_border_color_opacity_input');
                
                borderColorInput.value = borderColor.hex;
                borderColorOpacityRange.value = parseInt(parseFloat(borderColor.a) * 100);
                borderColorOpacityInput.value = parseInt(parseFloat(borderColor.a) * 100);

                borderColorInput.oninput = function(event) {
                    selectedItemForModification.style.borderColor = `
                        ${event.target.value}${getOpacity(borderColorOpacityRange.value)}
                    `;
                }
                borderColorOpacityRange.oninput = function(event) {
                    borderColorOpacityInput.value = event.target.value;
                    selectedItemForModification.style.borderColor = `
                        ${borderColorInput.value}${getOpacity(event.target.value)}
                    `;
                }
                borderColorOpacityInput.oninput = function(event) {
                    if (event.target.value > maxValue) {
                        borderColorOpacityInput.value = maxValue;
                    }

                    if (event.target.value < minValue) {
                        borderColorOpacityInput.value = minValue;
                    }

                    borderColorOpacityRange.value = event.target.value;
                    selectedItemForModification.style.borderColor = `
                        ${borderColorInput.value}${getOpacity(event.target.value)}
                    `;
                }
            }
        },

        borderWidth: {
            init: function() {
                let fieldHolder = document.querySelector('div[ci-name="borderWidth"]')
                fieldHolder.style.display = 'flex';

                /* context panel BORDER WIDTH */
                let borderWidthRange = document.querySelector('#panel_border_width_range');
                let borderWidthInput = document.querySelector('#panel_border_width_input');
                borderWidthRange.value = selectedItemForModification.getAttribute('borderWidthMultiplier');
                borderWidthInput.value = selectedItemForModification.getAttribute('borderWidthMultiplier');

                borderWidthRange.oninput = function(event) {
                    borderWidthInput.value = event.target.value;
                    selectedItemForModification.setAttribute('borderWidthMultiplier', event.target.value);
                    selectedItemForModification.style.borderWidth = `${calculateItemParams(selectedItemForModification).borderWidth}px`;
                }
                borderWidthInput.oninput = function(event) {
                    borderWidthRange.value = event.target.value;
                    selectedItemForModification.setAttribute('borderWidthMultiplier', event.target.value);
                    selectedItemForModification.style.borderWidth = `${calculateItemParams(selectedItemForModification).borderWidth}px`;
                }               
            },
        },

        borderRadius: {
            init: function() {
                let fieldHolder = document.querySelector('div[ci-name="borderRadius"]')
                fieldHolder.style.display = 'flex';

                /* context panel BORDER RADIUS */
                let borderRadiusRange = document.querySelector('#panel_border_radius_range');
                let borderRadiusInput = document.querySelector('#panel_border_radius_input');
                borderRadiusRange.value = selectedItemForModification.getAttribute('borderRadiusMultiplier');
                borderRadiusInput.value = selectedItemForModification.getAttribute('borderRadiusMultiplier');

                borderRadiusRange.oninput = function(event) {
                    borderRadiusInput.value = event.target.value;
                    selectedItemForModification.setAttribute('borderRadiusMultiplier', event.target.value);
                    selectedItemForModification.style.borderRadius = `${calculateItemParams(selectedItemForModification).borderRadius}px`;
                }
                borderRadiusInput.oninput = function(event) {
                    borderRadiusRange.value = event.target.value;
                    selectedItemForModification.setAttribute('borderRadiusMultiplier', event.target.value);
                    selectedItemForModification.style.borderRadius = `${calculateItemParams(selectedItemForModification).borderRadius}px`;
                }                
            },
        },
    }

    
    switch (mode) {
        case 'create':
            let availableFieldsOfParticularItem = CONFIG.UI.itemTemplates[selectedItemForModification.getAttribute('i-name')].contextPanelParams
            document.querySelectorAll('[ci-name]').forEach((item)=>{
                item.style.display = 'none';
            })
            contextPanel.style.display = 'flex';

            availableFieldsOfParticularItem.forEach(field => {
                availableFields[field].init();
            });

            contextPanel.scrollTop = contextPanelScrollPosition;
            break;

        case 'destroy':
            contextPanelScrollPosition = contextPanel.scrollTop;

            document.querySelectorAll('[ci-name]').forEach((item)=>{
                item.style.display = 'none';
            })
    
            selectedItemForModification = null;
            contextPanel.style.display = 'none'
            break;
    }
}

