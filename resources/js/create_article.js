import axios from "axios";

function datasetHTMLTemplate(currentChartDataset) {
    return `
    <div class="row mb-3 d-flex align-items-end" id="dataset_${currentChartDataset}">
        <div class="col-4">
            <label for="label_${currentChartDataset}" class="form-label">Назва поля</label>
            <input type="text" class="form-control dataset_element" id="label_${currentChartDataset}">
        </div>
        <div class="col-5">
            <label for="value_${currentChartDataset}" class="form-label">Значення</label>
            <input type="text" class="form-control dataset_element" id="value_${currentChartDataset}">
        </div>
        <div class="col-3">
            <button class="btn btn-primary" onclick="document.querySelector('#dataset_${currentChartDataset}').remove()">
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

let charts = [];

document.querySelector('#submit_chart_data').onclick = () => {
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

    console.log(chart)
}


