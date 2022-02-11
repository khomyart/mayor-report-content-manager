//srp - slides related panels

const srpConfig = {
    panels: {
        displayType: 'flex',
        slideList: {
            object: document.querySelector('.slides-panel-holder'),
            show: function() {
                this.object.style.display = srpConfig.panels.displayType;
            },
            //modal panels buttons
            buttons: {
                saveSlidesList: document.querySelector('#save_slides_list'),
                addSlide: document.querySelector('#add_slide')
            },
        },
        templatesList: {
            object: document.querySelector('.templates-panel-holder'),
            isShow: function () {
                return true ? window.getComputedStyle(this.object, null).display != 'none' : false;
            },
            show: function() {
                this.object.style.display = srpConfig.panels.displayType;
            },
            hide: function() {
                this.object.style.display = 'none';
            },
            buttons: {
                updateTemplateList: document.querySelector('#update_template_list'),
            },
        },
        imagesList: {
            object: document.querySelector('.images-panel-holder'),
            isShow: function () {
                return true ? window.getComputedStyle(this.object, null).display != 'none' : false;
            },
            show: function() {
                this.object.style.display = srpConfig.panels.displayType;
            },
            hide: function() {
                this.object.style.display = 'none';
            },
            //modal panels buttons
            buttons: {
                addImage: document.querySelector('#add_image')
            },
        },
    },
    buttons: {
        activeButtonClass: 'slides-related-panels-button-activated',
        slidesList: document.querySelector('#slide_list'),
        templatesList: document.querySelector('#templates_list'),
        imagesList: document.querySelector('#images_list')
    },
}

const slidesConfig = {
    getList: function(isRebuildNeeded = false) {
        console.log('done')
        if (isRebuildNeeded) {
            this.rebuildSlidesList(this.slideList)
            this.select(this.selectedSlideNumber, false);
        }
        return this.slideList;
    },
    slideList: [
    ],
    buttons: {
        removeSlide: document.querySelector('#remove_slide'),
        renameSlide: document.querySelector('#rename_slide'),
        // ...
    },
    slideContainer: document.querySelector('.slides-panel'),
    selectedSlideNumber: 0,
    selectedSlideInnerHtmlInstance: null,
    mainSlide: 0,
    updateSlideContentElementChildsValues(slideContentElement) {
        function recursiveChildrenFontSizing(fontSize, childrenNode) {
            if (childrenNode.length > 0) {
                console.log('iteration')
                console.log(childrenNode)
                childrenNode[0].style.fontSize = `${fontSize}px`;
                recursiveChildrenFontSizing(fontSize, childrenNode[0].children);
            } 

            return
        }

        slideContentElement.childNodes.forEach(childNode => {
            childNode.style.width =`${ this.calculatePreviewItemParam(childNode).width}px`;
            childNode.style.height =`${ this.calculatePreviewItemParam(childNode).height}px`;
            childNode.style.borderRadius =`${ this.calculatePreviewItemParam(childNode).borderRadius}px`;
            childNode.style.borderWidth =`${ this.calculatePreviewItemParam(childNode).borderWidth}px`;
            childNode.style.fontSize = `${ this.calculatePreviewItemParam(childNode).fontSize}px`;
            childNode.style.padding = `${ this.calculatePreviewItemParam(childNode).padding}px`;
        
            childNode.style.top = childNode.getAttribute('cY');
            childNode.style.left = childNode.getAttribute('cX');
        
            if (childNode.childNodes.length > 0) {
                childNode.childNodes.forEach((p)=>{
                    p.style.marginBottom = `${this.calculatePreviewItemParam(p).marginBottom}px`
                })
            }
        }) 
    },
    calculatePreviewItemParam: function (item) {
        let miniatureSlideContentElement = {
            offsetWidth: null,
            offsetHeight: null
        }
        
        if (document.querySelector('.slide-content') != null) {
            miniatureSlideContentElement = {
                offsetWidth: document.querySelector('.slide-content').offsetWidth,
                offsetHeight: document.querySelector('.slide-content').offsetHeight * 0.98,
            }
        } else {
            miniatureSlideContentElement = {
                offsetWidth: document.querySelector('.template-content').offsetWidth,
                offsetHeight: document.querySelector('.template-content').offsetHeight * 0.98,
            }
        }

        

        let widthUnit = miniatureSlideContentElement.offsetWidth / 100;
        let widthMultiplier = item.getAttribute('widthMultiplier');
        let width = `${(widthUnit * widthMultiplier).toFixed(5)}`;
    
        let widthInverted = `${((item.offsetWidth / workZone.offsetWidth) * 100).toFixed(3)}`;
        
        let heightUnit = miniatureSlideContentElement.offsetHeight / 100;
        let heightMultiplier = item.getAttribute('heightMultiplier');
        let height = `${(heightUnit * heightMultiplier).toFixed(5)}`;
    
        let heightInverted = `${((item.offsetHeight / workZone.offsetHeight) * 100).toFixed(3)}`;
    
        let borderWidthUnit = miniatureSlideContentElement.offsetWidth / 100;
        let borderWidthMultiplier = item.getAttribute('borderWidthMultiplier');
        let borderWidth = `${(borderWidthUnit * borderWidthMultiplier).toFixed(5)}`;
    
        let fontSizeUnit = miniatureSlideContentElement.offsetWidth / 100;
        let fontSizeMultiplier = item.getAttribute('fontSizeMultiplier');
        let fontSize = `${(fontSizeUnit * fontSizeMultiplier).toFixed(4)}`;
    
        let paddingUnit = miniatureSlideContentElement.offsetWidth / 100;
        let paddingMultiplier = item.getAttribute('paddingMultiplier');
        let padding = `${(paddingUnit * paddingMultiplier).toFixed(5)}`;
    
        let borderRadiusUnit = miniatureSlideContentElement.offsetWidth / 100;
        let borderRadiusMultiplier = item.getAttribute('borderRadiusMultiplier');
        let borderRadius = `${(borderRadiusUnit * borderRadiusMultiplier).toFixed(5)}`;
    
        let marginBottomUnit = miniatureSlideContentElement.offsetHeight/100;
        let marginBottomMultiplier = item.getAttribute('marginBottomMultiplier');
        let marginBottom = `${(marginBottomUnit * marginBottomMultiplier).toFixed(4)}`;
    
        return {
            width,
            height,
            borderWidth,
            borderRadius,
            fontSize,
            padding,
            marginBottom,
            widthInverted, //inverted value, when we have item.offsetWidth and we need to transform it to withMultiplier
            heightInverted,
        }
    },
    //update selected slide in slide panel
    updateCurrent: function(slideNumber) {
        if (this.slideList.length != 0 && this.slideList[slideNumber].content != workZone.innerHTML) {
            this.slideList[slideNumber].content = workZone.innerHTML;
        }
    },
    /**
     * 
     * @param {string} newSlideName name of the newly created slide
     * @returns true | false. true if creation has been done successfuly, eaither false
     */
    add: function(newSlideName) {
        console.log(newSlideName)
        this.slideList.push(
            {
                name: newSlideName,
                content: '',
            },
        )
        return true
    },
    remove: function(slideNumber) {
        this.slideList.splice(slideNumber, 1);
        return true;
    },
    rename: function(slideName) {
        slidesConfig.slideList[slidesConfig.selectedSlideNumber].name = slideName;
        return true;
    },
    //when we clicks on moveup or movedown slide's buttons, click event fires 2 times,
    //first for button event, second for slide itselft,
    //so, to prevent this, we nned to clear slide click event
    clearSlidesClickEvenets: function() {
        let slideInstances = document.querySelectorAll('.slide');
        slideInstances.forEach(slide => {
            slide.onclick = null;
        })
    },
    moveUp: function() {
        let slideNumber = slidesConfig.selectedSlideNumber;

        if (slideNumber != 0) {
            let currentSlide = slidesConfig.slideList[slideNumber];
            let upperSlide = slidesConfig.slideList[slideNumber-1];

            slidesConfig.slideList[slideNumber - 1] = currentSlide;
            slidesConfig.slideList[slideNumber] = upperSlide;
            
            this.clearSlidesClickEvenets()

            slidesConfig.select(slideNumber - 1, true);
        }
    },
    moveDown: function(){
        let slideNumber = slidesConfig.selectedSlideNumber;

        if (slideNumber != slidesConfig.slideList.length - 1) {
            let currentSlide = slidesConfig.slideList[slideNumber];
            let lowerSlide = slidesConfig.slideList[slideNumber + 1];

            slidesConfig.slideList[slideNumber + 1] = currentSlide;
            slidesConfig.slideList[slideNumber] = lowerSlide;

            this.clearSlidesClickEvenets()

            slidesConfig.select(slideNumber + 1, true);
        }                
    },
    rebuildSlidesList: function(slideList) {
        this.slideContainer.innerHTML = '';

        slideList.forEach((slide, index) => {
            this.slideContainer.innerHTML += 
                this.slideTemplate(this.selectedSlideNumber == index, 
                    this.mainSlide == index, index, slide.name);                    
        });  
        
        if (slideList.length == 0) {
            return null;
        }

        this.selectedSlideInnerHtmlInstance = document.querySelector(`div[slide-number="${this.selectedSlideNumber}"].slide-content`)

        slideList.forEach((slide, index) => {
            let currentSlide = document.querySelector(`div[slide-number="${index}"].slide-content`)
            currentSlide.innerHTML = slide.content.replace(/field-item/gim, '').replace(/selected-item/gim, '')  
        });

        let slideInstances = document.querySelectorAll('.slide');
        slideInstances.forEach(slide => {
            slide.onclick = (event) => {
                if(event.target.getAttribute('slide-number') != this.selectedSlideNumber){
                    this.select(slide.getAttribute('slide-number'), true)
                }
            };
        })

        let slidesContents = document.querySelectorAll(`div[slide-number].slide-content`);
        slidesContents.forEach(currentSlide => {
            this.updateSlideContentElementChildsValues(currentSlide);
        })
        console.log('rebuilded')

        //slide buttons events, place them here!
        //becouse some actions happening through modal window with it's own button
        //confirmation 
        document.querySelector('button[button-action="rename"]').
        addEventListener('click', function(){
            document.querySelector('#edited_slide_name').value = 
            slidesConfig.slideList[slidesConfig.selectedSlideNumber].name;
        })
        document.querySelector('button[button-action="moveUp"]').onclick = 
            () => {this.moveUp();}
        document.querySelector('button[button-action="moveDown"]').onclick = 
            () => {this.moveDown();}
    },
    select: function(slideNumber, isRebuildNeeded) {
        if (this.slideList.length == 0) {
            return null;
        }

        this.selectedSlideNumber = parseInt(slideNumber);
        console.log(this.selectedSlideNumber)
        this.selectedSlideInnerHtmlInstance = document.querySelector(`div[slide-number="${slideNumber}"].slide-content`)
        //rebuilding work zone inner html with all items
        if (workZone.innerHTML != this.slideList[this.selectedSlideNumber].content) {
            workZone.innerHTML = this.slideList[this.selectedSlideNumber].content;
            let fieldItems = document.querySelectorAll('.field-item');
            //do this to field items when they are spawned
            fieldItems.forEach((item)=>{
                addDragAndDropToItem(item);
                item.ondragstart = () => false;

                item.addEventListener('click', (event) => {
                    event.preventDefault();
                })

                item.childNodes.forEach(element => {
                    element.ondragstart = () => false;
                    element.onclick = () => false;
                });
            })
        }
        configureContextPanel('destroy');
        //rebuild slide content window
        if (isRebuildNeeded) {this.rebuildSlidesList(this.slideList);} else {
            this.clearSelection();
            document.querySelector(`div[slide-number="${this.selectedSlideNumber}"].slide`).classList.add('selected-slide')
            this.updateSlideContentElementChildsValues(this.selectedSlideInnerHtmlInstance);
        }
        
        //viewport stuff
        CONFIG.UI.workZoneCurrentScale = 1;
        zoom('in', 0);

        //initial scroll position
        // everythingHolder.scrollTop =
        //     workZoneHolder.offsetHeight / 2 - everythingHolder.offsetHeight / 2;
        // everythingHolder.scrollLeft =
        //     workZoneHolder.offsetWidth / 2 - everythingHolder.offsetWidth / 2;
    },
    clearSelection: function() {
        document.querySelector('.selected-slide').classList.remove('selected-slide')
    },
    slideTemplate: function(isSelected, isMain, slideNumber, slideName) {
        let buttonsTemplate = `
        <div class="slide-control-buttons">
            <button class="slide-control-button" data-bs-toggle="modal" data-bs-target="#removeSlideModal" button-action="remove" slide-number="${slideNumber}">
                ВИ
            </button>
            <button class="slide-control-button" data-bs-toggle="modal" data-bs-target="#renameSlideModal" button-action="rename" slide-number="${slideNumber}">
                П
            </button>
            <button class="slide-control-button" button-action="moveUp" slide-number="${slideNumber}">
                ВВ
            </button>
            <button class="slide-control-button" button-action="moveDown" slide-number="${slideNumber}">
                НН
            </button>
        </div>
        `
        let slideTemplate = `
        <div class="slide ${isSelected ? 'selected-slide' : ''} ${isMain ? 'main-slide': ''}" slide-number="${slideNumber}">
            <div class="slide-content" slide-number="${slideNumber}"></div>
            ${isSelected ? buttonsTemplate : ''}
            <p class="slide-name" slide-number="${slideNumber}">
                ${slideName}
            </p>
        </div>
        `;
        return slideTemplate;
    },
    //send slides to backend
    save() {
        function getUrl (mode) {
            switch (mode) {
                case 'template':
                    return `${CONFIG.serverUrl}/report/template/create`
                case 'presentation':
                    return `${CONFIG.serverUrl}/presentation/slide/create`
            }
        }

        let dataObject = {
            reportId: CONFIG.reportId,
            presentationId: CONFIG.presentationId,
            slides: JSON.stringify(this.slideList)
        }
        
        axios.post(getUrl(CONFIG.mode), dataObject)
        .then((response) => {
            alert('Збережено')
        })
        .catch((errors) => {
            console.log(errors)
            alert('Сталася помилка')
        })
        
        console.log('sent')
    }
}

const templatesConfig = {
    getList: function(isRebuildNeeded = false) {
        //use this if statemant with rebuild as a callback
        if (isRebuildNeeded) {
            this.rebuildList(this.templateList);
        }
        return this.templateList;
    },
    templateList: [],
    buttons: {
        applyTemplateToSlide: document.querySelector('#apply_template_to_slide'),
        // ...
    },
    templateContainer: document.querySelector('.templates-panel'),
    selectedTemplateNumber: null,

    updateTemplateContentElementChildsValues(templateContentElement) {
        templateContentElement.childNodes.forEach(childNode => {
            childNode.style.width =`${ slidesConfig.calculatePreviewItemParam(childNode).width}px`;
            childNode.style.height =`${ slidesConfig.calculatePreviewItemParam(childNode).height}px`;
            childNode.style.borderRadius =`${ slidesConfig.calculatePreviewItemParam(childNode).borderRadius}px`;
            childNode.style.borderWidth =`${ slidesConfig.calculatePreviewItemParam(childNode).borderWidth}px`;
            childNode.style.fontSize = `${ slidesConfig.calculatePreviewItemParam(childNode).fontSize}px`;
            childNode.style.padding = `${ slidesConfig.calculatePreviewItemParam(childNode).padding}px`;
        
            childNode.style.top = childNode.getAttribute('cY');
            childNode.style.left = childNode.getAttribute('cX');
        
            if (childNode.childNodes.length > 0) {
                childNode.childNodes.forEach((p)=>{
                    p.style.marginBottom = `${slidesConfig.calculatePreviewItemParam(p).marginBottom}px`
                })
            }

            childNode.ondragstart = () => false;
            childNode.childNodes.forEach(element => {
                element.ondragstart = () => false;
                element.onclick = () => false;
            });
        }) 
    },
    rebuildList: function(templateList) {
        this.templateContainer.innerHTML = '';

        templateList.forEach((template, index) => {
            this.templateContainer.innerHTML += 
                this.templateBlueprint(index, template.name);                    
        });     

        templateList.forEach((template, index) => {
            let currentTemplate = document.querySelector(`div[template-number="${index}"].template-content`)
            currentTemplate.innerHTML = template.content.replace(/field-item/gim, '').replace(/selected-item/gim, '')  
        });

        let templateInstances = document.querySelectorAll('.template');
        templateInstances.forEach(template => {
            template.onclick = () => {
                this.select(template.getAttribute('template-number'))
            };
        })

        let templatesContents = document.querySelectorAll(`div[template-number].template-content`);
        templatesContents.forEach(templateContent => {
            this.updateTemplateContentElementChildsValues(templateContent);
        })
        console.log('rebuilded')
    },
    select: function(templateNumber) {  
        //text area template generates according to presence of slides inside 
        //slideList, if there is no slides, template will generate text which 
        //offer user to create new slide with this template
        function textAreaTemplate(name, selectedSlideName) {
            if (selectedSlideName == null) {
                return `
                    <strong>Буде створено новий слайд на основі вибраного шаблону!</strong>
                    <br>
                    Ви точно бажаєте застосувати шаблон "${name}"?
                `
            } else {
                return `
                    <strong>Вміст слайду буде замінено вмістом шаблону!</strong>
                    <br>
                    Ви точно бажаєте застосувати шаблон "${name}" 
                    до слайду "${selectedSlideName}"? 
                `
            }
        }

        this.selectedTemplateNumber = templateNumber;
        
        let modal = new bootstrap.Modal(document.getElementById('applySlideTemplateModal')),
        modalTextArea = document.querySelector('#apply_slide_template_text_area');
        modal.show();

        modalTextArea.innerHTML = textAreaTemplate(
            this.templateList[templateNumber].name,
            slidesConfig.slideList != 0 ? slidesConfig.slideList[slidesConfig.selectedSlideNumber].name : null);
    },
    templateBlueprint: function(templateNumber, templateName) {
        let templateBlueprint = `
        <div class="template" template-number="${templateNumber}">
            <div class="template-content" template-number="${templateNumber}"></div>
            <p class="template-name" template-number="${templateNumber}">
                ${templateName}
            </p>
        </div>
        `;
        return templateBlueprint;
    },
}

const imagesConfig = {
    //use this if statemant with rebuild as a callback
    getList: function(isRebuildNeeded = false) {
        if (isRebuildNeeded) {
            this.rebuildList(this.imageList);
        }
        return this.imageList;
    },
    imageList: [
    ],
    //buttons of image list itself
    buttons: {
        remove: document.querySelector('#remove_image'),
        rename: document.querySelector('#rename_image'),
        // ...
    },
    imageContainer: document.querySelector('.images-panel'),
    selectedImageIndex: null,

    rebuildList: function(imageList) {
        this.imageContainer.innerHTML = '';
        
        if (imageList.length == 0) {
            return null;
        }

        imageList.forEach((image, index) => {
            this.imageContainer.innerHTML += 
                this.imageTemplate(index, image.name, image.src);                    
        });     

        document.querySelectorAll('.image-control-button').forEach(button => {
            button.onclick = () => {
                let buttonType = button.getAttribute('button-action');
                this.selectedImageIndex = button.getAttribute('image-list-index');
                let deleteImageNameSpan = document.querySelector('#delete_image_name');
                let renameImageNameInput = document.querySelector('#edited_image_name');
                let modal;

                switch (buttonType) {
                    case 'remove':
                        modal = new bootstrap.Modal(document.getElementById('removeImageModal'))
                        deleteImageNameSpan.innerHTML = this.imageList[this.selectedImageIndex].name;
                        modal.show()
                        break;
                    case 'rename':
                        modal = new bootstrap.Modal(document.getElementById('renameImageModal'))
                        renameImageNameInput.value = this.imageList[this.selectedImageIndex].name;
                        modal.show()
                        break;
                }
            }
        })

        console.log('image list rebuilded')
    },
    add: function() {  
        let imageNameInput = document.querySelector('#image_name');
        let imageFileInput = document.querySelector('#image_file');
        let isSuccess = true;
        
        if (isSuccess) {    
            function getUrl (mode) {
                switch (mode) {
                    case 'template':
                        return `${CONFIG.serverUrl}/report/${CONFIG.reportId}/image/create`
                    case 'presentation':
                        return `${CONFIG.serverUrl}/presentation/${CONFIG.presentationId}/image/create`
                }
            }

            let options = {
                headers: {'Content-Type': 'multipart/form-data'}
            }

            let formData = new FormData();
            formData.append('name', imageNameInput.value),
            formData.append('image', imageFileInput.length == 0 ? null : imageFileInput.files[0])

            axios.post(getUrl(CONFIG.mode), formData, options)
            .then((response) => {
                this.imageList = response.data;
                this.getList(true);
            })
            .catch((errors) => {
                console.log(errors)
                alert('Сталася помилка')
            })

            return true;
        } else {
            return false;
        }
    },
    remove: function() {
        let isSuccess = true;
        let imageId = this.imageList[this.selectedImageIndex].id;
        let imagePath = this.imageList[this.selectedImageIndex].src;
        // let imageElement = document.querySelectorAll(`img.field-item[src="${this.imageList[this.selectedImageIndex].src}"]`)
                
        if (isSuccess) {
            function getUrl (mode) {
                switch (mode) {
                    case 'template':
                        return `${CONFIG.serverUrl}/report/${CONFIG.reportId}/image/${imageId}/delete`
                    case 'presentation':
                        return `${CONFIG.serverUrl}/presentation/${CONFIG.presentationId}/image/${imageId}/delete`
                }
            }

            axios.post(getUrl(CONFIG.mode))
            .then((response) => {
                this.imageList = response.data;
                this.getList(true);
                               
                if (selectedItemForModification != null) {
                    clearItemSelection();
                }

                slidesConfig.slideList.forEach((slide, index) => {
                    slidesConfig.slideList[index].content = slide.content.replaceAll(imagePath, CONFIG.UI.itemTemplates.imageSrcTemplate);
                });
                
                slidesConfig.select(slidesConfig.selectedSlideNumber, true);
                slidesConfig.save();
            })
            .catch((errors) => {
                console.log(errors)
                alert('Сталася помилка')
            })

            return true;
        } else {
            return false;
        }
    },
    rename: function() {
        let isSuccess = true;
        let imageId = this.imageList[this.selectedImageIndex].id;
        let renameImageNameInput = document.querySelector('#edited_image_name');
        
        let newImageName = renameImageNameInput.value;

        if (isSuccess) {
            function getUrl(mode) {
                switch (mode) {
                    case 'template':
                        return `${CONFIG.serverUrl}/report/${CONFIG.reportId}/image/${imageId}/rename`
                    case 'presentation':
                        return `${CONFIG.serverUrl}/presentation/${CONFIG.presentationId}/image/${imageId}/rename`
                }
            }

            axios.post(getUrl(CONFIG.mode), 
            {name: newImageName})
            .then((response) => {
                this.imageList = response.data;
                this.getList(true);

                if (selectedItemForModification != null) {
                    this.rebuildInputImageList();
                }
            })
            .catch((errors) => {
                console.log(errors)
                alert('Сталася помилка')
            })

            return true;
        } else {
            return false;
        }
    },
    rebuildInputImageList: function() {
        function optionTemplate (name, value, isSelected, isDisabled = false) {
            console.log(isSelected)
            let optionTemplate = `
                <option ${isDisabled ? 'disabled ' : ''} ${isSelected ? 'selected ' : ''} value="${value}">${name}</option>
            `
            return optionTemplate;
        }

        let itemImageSrc = selectedItemForModification.src;
        let imageSelectInput = document.querySelector('#panel_image_name_select');
        
        imageSelectInput.innerHTML = '';
        /* fill select input with values */
        imageSelectInput.innerHTML = 
        optionTemplate('Оберіть зображення', CONFIG.UI.itemTemplates.imageSrcTemplate, CONFIG.UI.itemTemplates.imageSrcTemplate == itemImageSrc, true);

        this.getList().forEach((imageItem) => {
            imageSelectInput.innerHTML += 
            optionTemplate(imageItem.name, imageItem.src, itemImageSrc.match(imageItem.src) != null)
        })   
    },
    imageTemplate: function(imageListIndex, imageName, imageSrc) {
        let imageTemplate = `
        <div class="image" image-list-index="${imageListIndex}">
            <div class="image-content" image-list-index="${imageListIndex}">
                <img style="width: 100%; height: 100%;" src="${imageSrc}">
            </div>

            <div class="slide-control-buttons">
                <button class="image-control-button" button-action="remove" image-list-index="${imageListIndex}">
                    ВИ
                </button>
                <button class="image-control-button" button-action="rename" image-list-index="${imageListIndex}">
                    П
                </button>
            </div>
        
            <p class="image-name" image-list-index="${imageListIndex}">
                ${imageName}
            </p>
        </div>
        `;
        return imageTemplate;
    },
}

/* MENU PANEL BUTTONS */
// srpConfig.buttons.slidesList.onclick = () => {
//     if (srpConfig.panels.slideList.isShow()) {
//         srpConfig.buttons.slidesList.classList.remove(srpConfig.buttons.activeButtonClass)
//         srpConfig.panels.slideList.hide();
//     } else {
//         srpConfig.panels.slideList.show();
//         srpConfig.buttons.slidesList.classList.add(srpConfig.buttons.activeButtonClass)
//         slidesConfig.select(slidesConfig.selectedSlideNumber, true);
//     } 
// }

srpConfig.buttons.templatesList.onclick = () => {
    if (srpConfig.panels.templatesList.isShow()) {
        srpConfig.panels.templatesList.hide();
        srpConfig.buttons.templatesList.classList.remove(srpConfig.buttons.activeButtonClass)
    } else {
        srpConfig.panels.templatesList.show();
        srpConfig.buttons.templatesList.classList.add(srpConfig.buttons.activeButtonClass)
        templatesConfig.rebuildList(templatesConfig.getList(true));
    } 
}

srpConfig.buttons.imagesList.onclick = () => {
    if (srpConfig.panels.imagesList.isShow()) {
        srpConfig.panels.imagesList.hide();
        srpConfig.buttons.imagesList.classList.remove(srpConfig.buttons.activeButtonClass)
    } else {
        srpConfig.panels.imagesList.show();
        srpConfig.buttons.imagesList.classList.add(srpConfig.buttons.activeButtonClass)
        imagesConfig.getList(true);
    } 
}

/* SLIDE PANEL BUTTONS */
srpConfig.panels.slideList.buttons.addSlide.onclick = () => {
    var modalElement = document.getElementById('createSlideModal')
    var modal = bootstrap.Modal.getInstance(modalElement) // Returns a Bootstrap modal instance
    let newSlideName = document.querySelector('#new_slide_name').value;
    
    if (newSlideName == '') {
        newSlideName = 'Новий слайд';
    }

    if (slidesConfig.add(newSlideName)) {
        modal.hide()
        slidesConfig.select(slidesConfig.slideList.length - 1, true);
        slidesConfig.selectedSlideInnerHtmlInstance.
            scrollIntoView({block: "center", behavior: "smooth"});
    }
    
}
srpConfig.panels.slideList.buttons.saveSlidesList.onclick = () => {
    slidesConfig.save();
}

srpConfig.panels.templatesList.buttons.updateTemplateList.onclick = () => {
    axios.get(`${CONFIG.serverUrl}/report/${CONFIG.reportId}/templates/get`)
    .then((response) => {
        templatesConfig.templateList = response.data;
        templatesConfig.getList(true);
    })
    .catch((errors) => {
        console.log(errors)
        alert('Сталася помилка')
    })
}
/* SLIDE BUTTONS */
slidesConfig.buttons.removeSlide.onclick = () => {
    var modalElement = document.getElementById('removeSlideModal')
    var modal = bootstrap.Modal.getInstance(modalElement) // Returns a Bootstrap modal instance

    if (slidesConfig.remove(slidesConfig.selectedSlideNumber)) {
        modal.hide()
        slidesConfig.selectedSlideNumber == 0 ? slidesConfig.selectedSlideNumber = 0 : slidesConfig.selectedSlideNumber -= 1;
        console.log(slidesConfig.selectedSlideNumber)
        console.log(slidesConfig.slideList)

        if (slidesConfig.slideList.length != 0) {
            slidesConfig.select(slidesConfig.selectedSlideNumber, true);
        } else {
            slidesConfig.rebuildSlidesList(slidesConfig.slideList);
            workZone.innerHTML = '';
        }
        
    }
}
slidesConfig.buttons.renameSlide.onclick = () => {
    var modalElement = document.getElementById('renameSlideModal')
    var modal = bootstrap.Modal.getInstance(modalElement) // Returns a Bootstrap modal instance
    let editedSlideNameInput = document.querySelector('#edited_slide_name').value;
    console.log(modal)

    if (slidesConfig.rename(editedSlideNameInput)) {
        modal.hide()
        slidesConfig.rebuildSlidesList(slidesConfig.slideList);
    }
}

/* TEMPLATE BUTTONS */
templatesConfig.buttons.applyTemplateToSlide.onclick = () => {
    var modalElement = document.getElementById('applySlideTemplateModal')
    var modal = bootstrap.Modal.getInstance(modalElement) // Returns a Bootstrap modal instance
    modal.hide();

    if (slidesConfig.slideList.length == 0) {
        slidesConfig.add(CONFIG.presentationName);
        slidesConfig.getList(true);
        slidesConfig.selectedSlideNumber = 0;
    }

    //rebuilding work zone inner html with all items
    if (workZone.innerHTML != templatesConfig.templateList[templatesConfig.selectedTemplateNumber].content) {
        workZone.innerHTML = templatesConfig.templateList[templatesConfig.selectedTemplateNumber].content;
        slidesConfig.slideList[slidesConfig.selectedSlideNumber].content =
            templatesConfig.templateList[templatesConfig.selectedTemplateNumber].content;

        let fieldItems = document.querySelectorAll('.field-item');
        fieldItems.forEach((item)=>{
            addDragAndDropToItem(item);
            item.ondragstart = () => false;
            item.childNodes.forEach(element => {
                element.ondragstart = () => false;
                element.onclick = () => false;
            });
        })
    }

    configureContextPanel('destroy');
    // //viewport stuff
    CONFIG.UI.workZoneCurrentScale = 1;
    zoom('in', 0);
    // //initial scroll position
    everythingHolder.scrollTop =
        workZoneHolder.offsetHeight / 2 - everythingHolder.offsetHeight / 2;
    everythingHolder.scrollLeft =
        workZoneHolder.offsetWidth / 2 - everythingHolder.offsetWidth / 2;
}

/* IMAGE BUTTONS */
srpConfig.panels.imagesList.buttons.addImage.onclick = function() {
    var modalElement = document.getElementById('createImageModal')
    var modal = bootstrap.Modal.getInstance(modalElement) // Returns a Bootstrap modal instance

    if (imagesConfig.add()) {
        modal.hide()
        imagesConfig.getList(true);
    }
}

imagesConfig.buttons.remove.onclick = () => {
    var modalElement = document.getElementById('removeImageModal')
    var modal = bootstrap.Modal.getInstance(modalElement) // Returns a Bootstrap modal instance

    if (imagesConfig.remove()) {
        modal.hide();
        imagesConfig.getList(true);
    }
}

imagesConfig.buttons.rename.onclick = () => {
    var modalElement = document.getElementById('renameImageModal')
    var modal = bootstrap.Modal.getInstance(modalElement) // Returns a Bootstrap modal instance

    if (imagesConfig.rename()) {
        modal.hide();
        imagesConfig.getList(true);
    }
}
