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
    {
        selector: '#chart_axis_x', 
        rules: ['requeried', 'letters'], 
        errorMessage: 'Поле "Назва осі Х" повинно бути заповнене та не може містити цифри'
    },
    {
        selector: '#chart_axis_y', 
        rules: ['requeried', 'letters'], 
        errorMessage: 'Поле "Назва осі Y" повинно бути заповнене та не може містити цифри'
    },
    {
        selector: '#chart_sufix', 
        rules: ['requeried', 'letters'], 
        errorMessage: 'Поле "Суфікс показників" повинно заповнене та містити лише літери'
    },
    {
        selector: '.dataset_label', 
        rules: ['requeried'], 
        errorMessage: 'Назва набору даних повнинна бути заповнена'
    },
    {
        selector: '.dataset_value', 
        rules: ['requeried', 'numbers'], 
        errorMessage: 'Значення набору даних повинне бути заповнене та містити лише літери'
    },
    {
        selector: '#add_dataset_button', 
        rules: ['datasets'], 
        errorMessage: 'Додайте хоча б один набір данних!'
    },
]

let charts = [];

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
    // if (handleErrorDisplaying(doFieldsValidation(elementsForValidation, rules), '#chart_errors')) {
    //     return false;
    // }
 
    /* Defining and filling chart fields with values */
    let chartFields = {};
    chartFieldsIDs.forEach(ID => {
        let chartFieldValue = document.querySelector(`#${ID}`).value;

        /* Validation rules write down below 
        (return if something is incorrect) */

        /* Validation rules ends */

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
            datasetElement.name = element.value;
        }

        if (index % 2 == 1) {
            datasetElement.label = element.value;
            dataset.push(datasetElement);
            datasetElement = {};
        }        
    });

    /* Defining and filling chart itself */
    let chart = {
        // numberInList: charts.length,
        title: chartFields.chart_title,
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

    charts.push(chart);
    clearModal();
    console.log(charts)
}

document.querySelector('#debug').onclick = () => {

}

// console.log(charts);

