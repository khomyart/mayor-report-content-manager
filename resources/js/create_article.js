import axios from "axios";

function datasetHTMLTemplate(currentChartDataset) {
    return `
    <div class="row mb-3 d-flex align-items-end dataset" id="dataset_${currentChartDataset}">
        <div class="col-4">
            <label for="label_${currentChartDataset}" class="form-label">Назва поля</label>
            <input type="text" class="form-control dataset_element dataset_label" id="label_${currentChartDataset}">
        </div>
        <div class="col-5">
            <label for="value_${currentChartDataset}" class="form-label">Значення</label>
            <input type="text" class="form-control dataset_element dataset_value" id="value_${currentChartDataset}">
        </div>
        <div class="col-3">
            <button class="btn btn-primary col-12" onclick="document.querySelector('#dataset_${currentChartDataset}').remove()">
                Видалити
            </button>
        </div>
    </div>
    `
}

let datasetContainer = document.querySelector('#datasets_container')
let currentChartDataset = 0;

document.querySelector('#add_dataset_button').onclick = () => {
    datasetContainer.innerHTML += datasetHTMLTemplate(currentChartDataset);
    currentChartDataset += 1;
}

/* ************************************************************************ */
let chartFieldsIDs = [
    'chart_title',
    'chart_legend',
    'chart_type',
    'chart_axis_x',
    'chart_axis_y',
    'chart_sufix',
    'chart_verbal_rounding',
    'chart_verbal_rounding_when_hovered',
];

let rules = {
    'requeried': (string) => {
        return string.length > 0 ? true : false
    },
    'numbers': (string) => {
        let re = /^[0-9]+$/gmi;
        return string.match(re) != null ? true : false;
    },
    'letters': (string) => {
        let re = /^[a-zA-Zа-яА-ЯґҐїЇіІ\s`"’'.]+$/gmi;
        return string.match(re) != null ? true : false;
    },
    'datasets': () => {
        let amountOfDatasets = document.querySelectorAll('.dataset');
        return amountOfDatasets.length > 0 ? true : false;
    }
}

let elementsForValidation = [
    {
        selector: '#chart_title', 
        rules: ['requeried'], 
        errorMessage: 'Поле "Назва графіка" повинно бути заповнене'
    },
    {
        selector: '#chart_legend', 
        rules: ['requeried'], 
        errorMessage: 'Поле "Додаткова назва графіка" повинне бути заповнене'
    },
    {
        selector: '#chart_type', 
        rules: ['requeried'], 
        errorMessage: 'Необхідно обрати тип графіку'
    },
    // {
    //     selector: '#chart_axis_x', 
    //     rules: ['requeried', 'letters'], 
    //     errorMessage: 'Поле "Назва осі Х" повинно бути заповнене та не може містити цифри'
    // },
    // {
    //     selector: '#chart_axis_y', 
    //     rules: ['requeried', 'letters'], 
    //     errorMessage: 'Поле "Назва осі Y" повинно бути заповнене та не може містити цифри'
    // },
    // {
    //     selector: '#chart_sufix', 
    //     rules: ['requeried', 'letters'], 
    //     errorMessage: 'Поле "Суфікс показників" повинно заповнене та містити лише літери'
    // },
    {
        selector: '.dataset_label', 
        rules: ['requeried'], 
        errorMessage: 'Назва набору даних повнинна бути заповнена'
    },
    {
        selector: '.dataset_value', 
        rules: ['requeried', 'numbers'], 
        errorMessage: 'Значення набору даних повинне бути заповнене та містити лише цифри'
    },
    {
        selector: '#add_dataset_button', 
        rules: ['datasets'], 
        errorMessage: 'Додайте хоча б один набір данних!'
    },
]

let chartHTMLTemplate = `
<div class="col-12 col-lg-10 col-xxl-6 mb-3"> <canvas class="chart"></canvas> </div>
<hr class="mb-3"/>
`
let chartContainerSelector = '.charts-container'
let chartSelector = '.chart'
let charts = [];
let articleChartsInstances = [];

/**
 * Cuts incoming string into pieces with length wich are close to "symbolsPerLine" number and places them into array 
 * 
 * @param {number} symbolsPerLine 
 * @param {string} string 
 * @returns 
 */
 function stringCut(symbolsPerLine, string) {
    function findClosestSpaceToSymbolsPerLineNumberInString(lengthPerLine, string) {
        let spaceIndexes = [];
        let closestSpaces = [];
        let previousDifference;
        let currentClosestSpaceIndex;
    
        for (let i = 0; i < string.length; i++) {
            if (string[i] === ' ') {
                spaceIndexes.push(i);
            }
        }
    
        for (let i = 1; spaceIndexes[spaceIndexes.length-1] > lengthPerLine; i++) {
            lengthPerLine = lengthPerLine * i;
            spaceIndexes.forEach((spaceIndex, index)=>{
                if (index == 0) { previousDifference = Math.abs(lengthPerLine - spaceIndex) }
                else if (previousDifference > Math.abs(lengthPerLine - spaceIndex)) { 
                    currentClosestSpaceIndex = spaceIndex;
                    previousDifference = Math.abs(lengthPerLine - spaceIndex);
                    closestSpaces[i-1] = spaceIndex;
                }
            })
        }
        //deletes last space
        closestSpaces.pop();
    
        return closestSpaces;
    }
    
    function devideStringBySpaceIndexes(closestSpaceIndexes, string) {
        let devidedString = [];
        let tempString;
        closestSpaceIndexes.unshift(0)
        closestSpaceIndexes.push(string.length)
    
        for (let i = 0; i < closestSpaceIndexes.length - 1; i++) {
            tempString = '';
    
            for (let j = i == 0 ? closestSpaceIndexes[i] : closestSpaceIndexes[i] + 1; j < closestSpaceIndexes[i+1]; j++) {
                tempString += string[j]
            }
    
            devidedString[i] = tempString
        }
    
        return devidedString;
    }

    if (string.length < symbolsPerLine * 1.5) 
    {
        return string
    } else {
        return devideStringBySpaceIndexes(findClosestSpaceToSymbolsPerLineNumberInString(symbolsPerLine, string), string)
    }
}

/**
 * 
 * @param {string} chartHTMLTemplate template for chart's canvas, actually chart holder template
 * @param {string} chartSelector chart's canvas selector
 * @param {string} chartContainerSelector place, where templates located
 * @param {array} chartsArray array with charts params like title, legend, values, etc
 * @returns 
 */
function buildCharts(chartHTMLTemplate, chartSelector, chartContainerSelector, chartsArray) {
    let chartContainer = document.querySelector(chartContainerSelector)

    chartContainer.innerHTML = ''
    charts.forEach(chart => {
        chartContainer.innerHTML += chartHTMLTemplate;
    })
    /* ITEMS FOR CHART DISPLAYING */
    const
        ChartPrototype = function() {
            this.type = '';
            this.data = {
                labels: [],
                datasets: [{
                    label: '',
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                }]
            };
        }

    function optimizeCanvasSize(canvas, chartData) {
        let chartsDefaultHeight = {
            more0less300: 120,
            more300less370: 93,
            more370less450: 80,
            more450less580: 65,
            more580less768: 65,
            more768less1365: 55,
            more1365: 55,
        }

        function optimizeCanvasHeight(chartHeight, multiplier) {
            if (chartData.type === 'pie' ||
                chartData.type === 'doughnut') {
                canvas.width = '100';
                canvas.height = (chartHeight + chartData.dataset.length * multiplier).toString();
            } else {
                //if chart has additional strings to their title, height of canvas will be increased
                if (typeof chartData.title === 'object') {
                    canvas.height = (chartHeight + chartData.title.length * multiplier).toString();
                    canvas.width = '80';
                } else {
                    canvas.height = chartHeight.toString();
                    canvas.width = '80';
                }
            }
        }

        if (window.innerWidth > 0 && window.innerWidth <= 300) {
            optimizeCanvasHeight(chartsDefaultHeight.more0less300, 4);
        }
        if (window.innerWidth > 300 && window.innerWidth <= 370) {
            optimizeCanvasHeight(chartsDefaultHeight.more300less370, 4);
        }
        if (window.innerWidth > 370 && window.innerWidth <= 450) {
            optimizeCanvasHeight(chartsDefaultHeight.more370less450, 4);
        }
        if (window.innerWidth > 450 && window.innerWidth <= 580) {
            optimizeCanvasHeight(chartsDefaultHeight.more450less580, 3);
        }
        if (window.innerWidth > 580 && window.innerWidth <= 768) {
            optimizeCanvasHeight(chartsDefaultHeight.more580less768, 3);
        }
        if (window.innerWidth > 768 && window.innerWidth <= 1365) {
            optimizeCanvasHeight(chartsDefaultHeight.more768less1365, 3);
        }
        if (window.innerWidth > 1365) {
            optimizeCanvasHeight(chartsDefaultHeight.more1365, 3);
        }
    }

    function getRandomColor() {
        let r = Math.floor(Math.random() * (256));
        let g = Math.floor(Math.random() * (256));
        let b = Math.floor(Math.random() * (256));
        return {
            r: r,
            g: g,
            b: b,
        }
    }

    function proceedAdditionalOptionsToChart(chartInstance, chartData) {
        let
            type = chartInstance.type,
            legend = chartData.legend,
            name = chartData.title,
            axisNames = chartData.axis,
            dataLabelSuffix = chartData.suffix,
            arrayWithData = chartInstance.data.datasets[0].data.map(element => parseInt(element)),
            showVerbalRounding = chartData.isVerbalRoundingEnabled === 'true',
            showVerbalRoundingForHoveredLabels = chartData.isVerbalRoundingEnabledForHoveredLabels === 'true',
            barsBackgroundsColors = [];
        chartInstance.data.datasets[0].barPercentage = 0.7;
        chartInstance.type = type;
        chartInstance.data.datasets[0].label = legend;
        chartInstance.options = {
            //here chart's title can be enabled
            title: {
                display: true,
                text: name,
                fontSize: 16,
                fontColor: 'black',
                fontFamily: '\'Open Sans\', sans-serif',
                padding: (chartInstance.type === 'pie' || chartInstance.type === 'doughnut') ? 0 : 20,
            },
            tooltips: {
                titleFontSize: 14,
                bodyFontSize: 12,
                footerFontSize: 12,
                callbacks: {
                    label: function(tooltipItem, data) {
                        let
                            currentItemIndex = tooltipItem.index,
                            currentItemData = data.datasets[0].data[currentItemIndex],
                            label = `${data.labels[currentItemIndex]}: `;
                        if (showVerbalRoundingForHoveredLabels == 'true') {
                            if (currentItemData >= 1000 && currentItemData < 1000000) {
                                return `${label}${(currentItemData/1000).toFixed(1)} тис.${dataLabelSuffix}`;
                            } else if (currentItemData >= 1000000 && currentItemData < 1000000000) {
                                return `${label}${(currentItemData/1000000).toFixed(1)} млн.${dataLabelSuffix}`;
                            } else if (currentItemData >= 1000000000 && currentItemData < 1000000000000) {
                                return `${label}${(currentItemData/1000000000).toFixed(1)} млрд.${dataLabelSuffix}`;
                            } else {
                                return `${label}${currentItemData}${dataLabelSuffix}`;
                            }
                        } else {
                            return `${label}${currentItemData}${dataLabelSuffix}`;
                        }
                    }
                }
            },
            legend: {
                display: (chartInstance.type === 'pie' || chartInstance.type === 'doughnut' || legend !== ''),
                labels: {
                    display: true,
                    fontFamily: '\'Open Sans\', sans-serif',
                    fontColor: 'black',
                    fontSize: 14,
                }
            },
            plugins: {
                datalabels: {
                    display: !(chartInstance.type === 'pie' || chartInstance.type === 'doughnut'),
                    anchor: (chartInstance.type === 'pie' || chartInstance.type === 'doughnut') ? 'center' : 'end',
                    align: (chartInstance.type === 'pie' || chartInstance.type === 'doughnut') ? 'end' :
                            chartInstance.type === 'horizontalBar' ? 'end' : 'top',
                    formatter: function(value, context) {
                        if (showVerbalRounding) {
                            if (value >= 1000 && value < 1000000) {
                                return `${(value/1000).toFixed(1)} тис.${dataLabelSuffix}`;
                            } else if (value >= 1000000 && value < 1000000000) {
                                return `${(value/1000000).toFixed(1)} млн.${dataLabelSuffix}`;
                            } else if (value >= 1000000000 && value < 1000000000000) {
                                return `${(value/1000000000).toFixed(1)} млрд.${dataLabelSuffix}`;
                            } else {
                                return `${value}${dataLabelSuffix}`;
                            }
                        } else {
                            return `${value}${dataLabelSuffix}`;
                        }
                    },
                    font: {
                        family: '\'Open Sans\', sans-serif',
                        size: 14,
                    },
                    color: 'black',
                }
            }
        }
        if (chartInstance.type === 'line') {
            chartInstance.data.datasets[0].fill = false;
            /*
            fill chart elements with color according to amount of incoming data
                */
            for (let i = 0; i < arrayWithData.length; i++) {
                chartInstance.data.datasets[0].pointBorderColor.push('rgba(0, 0, 0, 1)');
                chartInstance.data.datasets[0].pointBackgroundColor.push('rgba(255, 99, 132, 1)');
                chartInstance.data.datasets[0].borderColor.push('rgba(255, 99, 132, 1)');
            }
            chartInstance.data.datasets[0].pointBorderWidth = 2;
        }
        if (chartInstance.type === 'bar' ||
            chartInstance.type === 'horizontalBar') {
            for (let i = 0; i < arrayWithData.length; i++) {
                chartInstance.data.datasets[0].backgroundColor.push('rgba(255, 0, 0, 1)');
            }
            chartInstance.data.datasets[0].borderWidth = 0;
        }
        if (chartInstance.type === 'doughnut' ||
            chartInstance.type === 'pie') {
            chartInstance.options.legend.position = window.innerWidth < 768 ? 'top' : 'top'
            for (let i = 0; i < arrayWithData.length; i++) {
                let randomColor = getRandomColor();
                chartInstance.data.datasets[0].backgroundColor.push(`rgba(${randomColor.r},${randomColor.g},${randomColor.b}, 0.4)`);
                chartInstance.data.datasets[0].borderColor.push(`rgba(${randomColor.r},${randomColor.g},${randomColor.b}, 0.8)`);
            }
            chartInstance.data.datasets[0].borderWidth = 1;
        }
        if (chartInstance.type === 'bar' ||
            chartInstance.type === 'horizontalBar' ||
            chartInstance.type === 'line') {
            chartInstance.options.scales = {
                xAxes: [{
                    scaleLabel : {
                        labelString: axisNames.x,
                        display: axisNames.x !== '',
                        fontFamily: '\'Open Sans\', sans-serif',
                        fontSize: 14,
                        fontColor: 'black',
                        padding: 0,
                    },
                    offset: chartInstance.type !== 'horizontalBar',
                    ticks: {
                        callback: function(value, index, values) {
                            if (showVerbalRounding) {
                                if (value >= 1000 && value < 1000000) {
                                    return `${(value/1000).toFixed(1)} тис.${dataLabelSuffix}`;
                                } else if (value >= 1000000 && value < 1000000000) {
                                    return `${(value/1000000).toFixed(1)} млн.${dataLabelSuffix}`;
                                } else if (value >= 1000000000 && value < 1000000000000) {
                                    return `${(value/1000000000).toFixed(1)} млрд.${dataLabelSuffix}`;
                                } else {
                                    return `${value}${dataLabelSuffix}`;
                                }
                            } else {
                                return `${value}${dataLabelSuffix}`;
                            }
                        },
                        beginAtZero: true,
                        fontSize: 14,
                        suggestedMax: Math.max(...arrayWithData)*1.25,
                    }
                }],
                yAxes: [{
                    scaleLabel : {
                        labelString: axisNames.y,
                        display: axisNames.y !== '',
                        fontFamily: '\'Open Sans\', sans-serif',
                        fontSize: 14,
                        fontColor: 'black',
                        padding: 0,
                    },
                    ticks: {
                        callback: function(value, index, values) {
                            if (showVerbalRounding) {
                                if (value >= 1000 && value < 1000000) {
                                    return `${(value/1000).toFixed(1)} тис.${dataLabelSuffix}`;
                                } else if (value >= 1000000 && value < 1000000000) {
                                    return `${(value/1000000).toFixed(1)} млн.${dataLabelSuffix}`;
                                } else if (value >= 1000000000 && value < 1000000000000) {
                                    return `${(value/1000000000).toFixed(1)} млрд.${dataLabelSuffix}`;
                                } else {
                                    return `${value}${dataLabelSuffix}`;
                                }
                            } else {
                                return `${value}${dataLabelSuffix}`;
                            }
                        },
                        beginAtZero: true,
                        fontSize: 14,
                        suggestedMax: Math.max(...arrayWithData)*1.25,
                    }
                }]
            }
        }
    }

    let
        chartCanvases = document.querySelectorAll(chartSelector),
        articleChartsInstances = [];

    if (chartCanvases.length <= chartsArray.length) {
        /*
            Building a chart according to amount of canvases (chart holders)
        */
        chartCanvases.forEach((canvas, index) => {
            let
                currentChartData = chartsArray[index],
                chart = new ChartPrototype;
            chart.type = currentChartData.type;
            chart.data.datasets[0].label = currentChartData.label;
            /*
                optimizing canvas size depends on incoming data and other information,
                before assigning it as a chart holder
            */
            optimizeCanvasSize(canvas, currentChartData);
            /*
                fills chart prototype with data according to it's structure
            */
            currentChartData.dataset.forEach((data) => {
                chart.data.datasets[0].data.push(data.value); //[0,1,2,3,4,N,...,Nx]
                chart.data.labels.push(data.label); //[label1,label2,label3,...,labelN]
            })
            proceedAdditionalOptionsToChart(chart, currentChartData);
            articleChartsInstances.push(new Chart(canvas, chart));
        })
    } else {
        /*
            Building a chart according to amount of datasets
        */
        chartsArray.forEach((currentChartData, index) => {
            let
                canvas = chartCanvases[index],
                chart = new ChartPrototype;
            chart.type = currentChartData.type;
            chart.data.datasets[0].label = currentChartData.label;
            /*
                optimizing canvas size depends on incoming data and other information,
                before assigning it as a chart holder
            */
            // optimizeCanvasSize(canvas, currentChartData);
            /*
                fills chart prototype with data according to it's structure
            */
            currentChartData.dataset.forEach((data) => {
                chart.data.datasets[0].data.push(data.value); //[data1,data2,data3,...,dataN]
                chart.data.labels.push(data.label); //[label1,label2,label3,...,labelN]
            })
            proceedAdditionalOptionsToChart(chart, currentChartData);
            articleChartsInstances.push(new Chart(canvas, chart));
        })
    }

    return articleChartsInstances;
}

/**
 * do errors validation of html inputs
 * 
 * 1) gets all fields wich are needed to be validated
 * 2) checks it value, if it match required rule (basically regexp based)
 * 3) fills error array with invalid inputs IDs and error messages
 * 4) returns this array to further proceed
 */
 function doFieldsValidation(elementsForValidation, rules) {
    let errors = [], nodesFromHTML;

    elementsForValidation.forEach(element => {
        nodesFromHTML = document.querySelectorAll(element.selector);

        nodesFromHTML.forEach(node => {

            element.rules.every(rule => {
                
                if (!rules[rule](node.value)) {
                    errors.push({nodeID:node.id, message:element.errorMessage})
                    return false;
                } else {
                    return true;
                }
            }) 
            
        })

    });

    return errors;
}

/**
 * Removes old error displaying, generate new depends on needs 
 * 
 * returns true, if errors is still on the page, false - if there is no errors left
 */
 function handleErrorDisplaying (errors, errorsContainerSelector) {
    let chartErrorsContainer = document.querySelector(errorsContainerSelector);
    chartErrorsContainer.hidden = true;
    chartErrorsContainer.innerHTML = '';

    document.querySelectorAll('.is-invalid').forEach(errorNode => {
        errorNode.classList.remove('is-invalid');
    })

    if (errors.length > 0) {
        chartErrorsContainer.hidden = false;
        errors.forEach(error => {
            chartErrorsContainer.innerHTML += `<li>${error.message}</li>`;
            document.querySelector(`#${error.nodeID}`).classList.add('is-invalid');
        })
        return true;
    } else {
        return false;
    }
}

function clearModal() {  
    chartFieldsIDs.forEach(ID => {
        if (ID == 'chart_verbal_rounding' || ID == 'chart_verbal_rounding_when_hovered') {
            document.querySelector(`#${ID}`).checked = false;
        } else {
            document.querySelector(`#${ID}`).value = '';
        }
    })
    currentChartDataset = 0;
    datasetContainer.innerHTML = '';

    let myModalEl = document.getElementById('diagramModal')
    let modal = bootstrap.Modal.getInstance(myModalEl)
    modal.hide();
}

document.querySelector('#submit_chart_data').onclick = () => {
    if (handleErrorDisplaying(doFieldsValidation(elementsForValidation, rules), '#chart_errors')) {
        return false
    }

    /* Defining and filling chart fields with values */
    let chartFields = {};
    chartFieldsIDs.forEach(ID => {
        let chartFieldValue = document.querySelector(`#${ID}`).value;

        if (ID == 'chart_verbal_rounding') {
            chartFields[ID] = chartFieldValue == 'on' ? 'true' : 'false';
        } else if (ID == 'chart_verbal_rounding_when_hovered') {
            chartFields[ID] = chartFieldValue == 'on' ? 'true' : 'false';
        } else {
            chartFields[ID] = document.querySelector(`#${ID}`).value;
        }
    });
    /* Defining and filling chart datasets with values */
    let dataset = [];
    let datasetElement = {};
    let datasetElements = document.querySelectorAll('.dataset_element');

    datasetElements.forEach((element, index) => {
        if (index % 2 == 0) {
            datasetElement.label = element.value;
        }

        if (index % 2 == 1) {
            datasetElement.value = element.value;
            dataset.push(datasetElement);
            datasetElement = {};
        }        
    });

    /* Defining and filling chart itself */
    let chartInstance = {
        // numberInList: charts.length,
        title: stringCut(40 ,chartFields.chart_title),
        legend: chartFields.chart_legend,
        type: chartFields.chart_type,
        axis: {
            x: chartFields.chart_axis_x,
            y: chartFields.chart_axis_y
        },
        suffix: chartFields.chart_sufix,
        isVerbalRoundingEnabled: chartFields.chart_verbal_rounding,
        isVerbalRoundingEnabledForHoveredLabels: chartFields.chart_verbal_rounding_when_hovered,
        dataset: dataset
    }

    charts.push(chartInstance);
    clearModal();

    articleChartsInstances = buildCharts(chartHTMLTemplate, chartSelector, chartContainerSelector, charts);
}


// charts = [
//     {
//         title: ['Виконання бюджету', 'Виконання бюджету', 'Виконання бюджету', 'Виконання бюджету', 'Виконання бюджету', 'Виконання бюджету'],
//         legend: 'План',
//         type: 'pie',
//         axis: {
//             x: 'назва фонду',
//             y: 'грн'
//         },
//         suffix: 'грн',
//         isVerbalRoundingEnabled: 'true',
//         isVerbalRoundingEnabledForHoveredLabels: 'true',
//         dataset: [
//             {label: 'Загальний фонд', value: '1701400000'},
//             {label: 'Міжбюджетні трансферти', value: '492900000'},
//             {label: 'Спеціальний фонд', value: '134200000'},
//             {label: 'Бюджет розвитку', value: '33000000'},
//             {label: 'Міжбюджетні трансферти', value: '492900000'},
//             {label: 'Спеціальний фонд', value: '134200000'},
//             {label: 'Бюджет розвитку', value: '33000000'},
//             {label: 'Міжбюджетні трансферти', value: '492900000'},
//             {label: 'Спеціальний фонд', value: '134200000'},
//             {label: 'Бюджет розвитку', value: '33000000'}
            
//         ] 
//     },
//     {
//         title: ['Виконання бюджету', 'Виконання бюджету', 'Виконання бюджету', 'Виконання бюджету', 'Виконання бюджету', 'Виконання бюджету'],
//         legend: 'План',
//         type: 'doughnut',
//         axis: {
//             x: 'назва фонду',
//             y: 'грн'
//         },
//         suffix: 'грн',
//         isVerbalRoundingEnabled: 'true',
//         isVerbalRoundingEnabledForHoveredLabels: 'true',
//         dataset: [
//             {label: 'Загальний фонд', value: '1701400000'},
//             {label: 'Міжбюджетні трансферти', value: '492900000'},
//             {label: 'Спеціальний фонд', value: '134200000'},
//             {label: 'Бюджет розвитку', value: '33000000'}
//         ] 
//     },
//     {
//         title: 'Виконання бюджету',
//         legend: 'План',
//         type: 'bar',
//         axis: {
//             x: 'назва фонду',
//             y: 'грн'
//         },
//         suffix: 'грн',
//         isVerbalRoundingEnabled: 'true',
//         isVerbalRoundingEnabledForHoveredLabels: 'true',
//         dataset: [
//             {label: 'Загальний фонд', value: '1701400000'},
//             {label: 'Міжбюджетні трансферти', value: '492900000'},
//             {label: 'Спеціальний фонд', value: '134200000'},
//             {label: 'Бюджет розвитку', value: '33000000'}
//         ] 
//     }
// ]

document.querySelector('#debug').onclick = () => {
    
    console.log(articleChartsInstances)
}

