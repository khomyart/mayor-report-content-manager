<!DOCTYPE html>
<html lang="ua">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">
    <title>Mayor report presentation</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <link rel="stylesheet" href="{{asset('slide_editor_css/1_style.css')}}">
    <link rel="stylesheet" href="{{asset('slide_editor_css/2_context_panel.css')}}">
    <link rel="stylesheet" href="{{asset('slide_editor_css/3_slides_related_panels.css')}}">
    <link rel="stylesheet" href="{{asset('slide_editor_css/4_navigation_panel.css')}}">
</head>
<body style="position: relative; display: none;">
    <div class="c-container">
        <div class="items-panel">
            <div class="slides-related-panels-buttons-holder">
                <div id="templates_list" class="slides-related-panels-button">
                    Шаблони
                </div>
                <div id="images_list" class="slides-related-panels-button">
                    Зображення
                </div>
            </div>
            <div class="item-panel-buttons">
                <div class="drag-and-drop-item" i-name="block" i-addinfo="" i-is-selectable="false" i-is-movable="true" i-type="structure">
                    БЛОК
                </div>
                <div class="drag-and-drop-items-separator">
                </div>
                <div class="drag-and-drop-item" i-name="text" i-addinfo="" i-is-selectable="false" i-is-movable="true" i-type="element">
                    ТЕКСТ
                </div>
                <div class="drag-and-drop-item" i-name="href" i-addinfo="" i-is-selectable="false" i-is-movable="true" i-type="element">
                    ПОСИЛ.
                </div>
                <div class="drag-and-drop-item" i-name="img" i-addinfo="" i-is-selectable="false" i-is-movable="true" i-type="element">
                    ЗОБР.
                </div>
            </div>
            <div class="navigation-panel-buttons-holder">
                <div id="goToPresentations" class="navigation-panel-button">
                    Презентації
                </div>
            </div>
        </div>
        <div class="side-bars-and-main-field-holder">
            <div class="slides-panel-holder">
                <div class="slides-panel-buttons">
                    <button id="save_slides_list" class="btn btn-primary slides-panel-button">
                        Зберегти
                    </button>
                    <button class="btn btn-primary slides-panel-button" data-bs-toggle="modal" data-bs-target="#createSlideModal">
                        Створити
                    </button>
                </div>
                <div class="slides-panel">
                    
                </div>
            </div>
            
            <div class="templates-panel-holder">
                <div class="slides-panel-buttons">
                    <button id="update_template_list" class="btn btn-primary slides-panel-button">
                        Оновити
                    </button>
                </div>
                <div class="templates-panel">

                </div>
            </div>

            <div class="images-panel-holder">
                <div class="images-panel-buttons">
                    <button class="btn btn-primary image-panel-button" data-bs-toggle="modal" data-bs-target="#createImageModal">
                        Додати
                    </button>
                </div>
                <div class="images-panel">

                </div>
            </div>

            <div class="pahlava" id="pahlava">
                <div class="main-field-holder" id="main_field_holder">
                    <div class="main-field" id="main_field">
                    </div>
                </div>
            </div>
            <div class="context-panel">

                <div class="cpf-container" ci-name="position">
                    <div class="cpf-container-label">
                        Розміщення
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-half">
                            <div class="cpf-input-label">
                                X (%)
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_position_x" step="1" min="0" max="100" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-half">
                            <div class="cpf-input-label">
                                Y (%)
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_position_y" step="1" min="0" max="100" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="zIndex">
                    <div class="cpf-container-label">
                        Рівень шару
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <button class="zIndex-button" id="zIndex_rise">
                                    В
                                </button>
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <button class="zIndex-button" id="zIndex_rise_to_end">
                                    ВВ
                                </button>
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <button class="zIndex-button" id="zIndex_down">
                                    Н
                                </button>
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <button class="zIndex-button" id="zIndex_down_to_end">
                                    НН
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="anchor">
                    <div class="cpf-container-label">
                        Якір
                    </div>
                    <div class="cpf-inputs-holder w-full add-margin-bot">
                        <button class="anchor-button w-tiny" id="acnhor_top_left" ca-value="0%,0%">11</button>
                        <button class="anchor-button w-tiny" id="acnhor_top_center" ca-value="-50%,0%">12</button>
                        <button class="anchor-button w-tiny" id="acnhor_top_right" ca-value="-100%,0%">13</button>

                        <button class="anchor-button w-tiny" id="acnhor_middle_left" ca-value="0%,-50%">21</button>
                        <button class="anchor-button w-tiny" id="acnhor_middle_center" ca-value="-50%,-50%">22</button>
                        <button class="anchor-button w-tiny" id="acnhor_middle_right" ca-value="-100%,-50%">23</button>

                        <button class="anchor-button w-tiny" id="acnhor_bottom_left" ca-value="0%,-100%">31</button>
                        <button class="anchor-button w-tiny" id="acnhor_bottom_center" ca-value="-50%,-100%">32</button>
                        <button class="anchor-button w-tiny" id="acnhor_bottom_right" ca-value="-100%,-100%">33</button>
                    </div>
                </div>

                <div class="cpf-container" ci-name="width">
                    <div class="cpf-container-label">
                        Ширина
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-middle">
                            <div class="cpf-input-label">
                                Зн. (%)
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_width_range" type="range" step="1" min="2" max="100" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                                Зн. (ч.)
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_width_input" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label t-align-center">
                                Авто
                            </div>
                            <div class="cpf-input-holder">
                                <input type="checkbox" style="height: 24px; width: 24px;" id="panel_width_checkbox" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="height">
                    <div class="cpf-container-label">
                        Висота
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-middle">
                            <div class="cpf-input-label">
                                Зн. (%)
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_height_range" type="range" step="1" min="2" max="100" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                                Зн. (ч.)
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_height_input" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label t-align-center">
                                Авто
                            </div>
                            <div class="cpf-input-holder">
                                <input type="checkbox" style="height: 24px; width: 24px;" id="panel_height_checkbox" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="resetBorderWidth">
                    <div class="cpf-container-label">
                        Товщина грані
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-full">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <button id="reset_border_width_button"> Онулити </button>                               
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="textEditor">
                    <div class="cpf-container-label">
                        Текст
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-full">
                            <div id="textEditor" class="context-panel-text-editor">

                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="image">
                    <div class="cpf-container-label">
                        Зображення
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-full">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <select id="panel_image_name_select">

                                </select>                                
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="href">
                    <div class="cpf-container-label">
                        Посилання
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-wide">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_href_input" type="input" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <button id="panel_href_button" class="btn btn-primary">Тест</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="opacity">
                    <div class="cpf-container-label">
                        Чіткість
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-wide">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_opacity_range" type="range" step="1" min="3" max="100" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_opacity_input" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="padding">
                    <div class="cpf-container-label">
                        Внутрішній відступ
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-wide">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_padding_range" type="range" step="0.1" min="0" max="10" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_padding_input" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="marginBottom">
                    <div class="cpf-container-label">
                        Відступ нижньої грані абзацу
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-wide">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_margin_bottom_range" type="range" step="0.1" min="-5" max="10" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_margin_bottom_input" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="fontSize">
                    <div class="cpf-container-label">
                        Розмір шрифта
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-wide">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_font_size_range" type="range" step="0.1" min="1" max="30" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_font_size_input" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="backgroundColor">
                    <div class="cpf-container-label">
                        Колір тла
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_background_color_input" type="color" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-middle">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_background_color_opacity_range" type="range" step="1" min="0" max="100" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_background_color_opacity_input" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="backgroundLinearGradient">
                    <div class="cpf-container-label">
                        Градієнт тла
                    </div>
                    <div class="cpf-inputs-holder d-column">
                        <div class="cpf-inputs-holder d-row">
                            <div class="cpf-inputs-holder d-column w-half">
                                <div class="cpf-input-block w-full">
                                    <div class="cpf-input-label">
                                        Від
                                    </div>
                                    <div class="cpf-input-holder">
                                        <input id="panel_background_linear_gradient_from_input" type="color" ci-type="input">
                                    </div>
                                </div>
                                <div class="cpf-input-block w-full">
                                    <div class="cpf-input-label">
                                        Прозорість
                                    </div>
                                    <div class="cpf-input-holder">
                                        <input id="panel_background_linear_gradient_from_opacity_range" type="range" step="1" min="0" max="100" ci-type="input">
                                    </div>
                                </div>
                                <div class="cpf-input-block w-full">
                                    <div class="cpf-input-label">
                                        Значення
                                    </div>
                                    <div class="cpf-input-holder">
                                        <input id="panel_background_linear_gradient_from_value_range" type="range" step="1" min="0" max="100" ci-type="input">
                                    </div>
                                </div>
                            </div>

                            <div class="cpf-inputs-holder d-column w-half">
                                <div class="cpf-input-block w-full">
                                    <div class="cpf-input-label">
                                        До
                                    </div>
                                    <div class="cpf-input-holder">
                                        <input id="panel_background_linear_gradient_to_input" type="color" ci-type="input">
                                    </div>
                                </div>
                                <div class="cpf-input-block w-full">
                                    <div class="cpf-input-label">
                                        Прозорість
                                    </div>
                                    <div class="cpf-input-holder">
                                        <input id="panel_background_linear_gradient_to_opacity_range" type="range" step="1" min="0" max="100" ci-type="input">
                                    </div>
                                </div>
                                <div class="cpf-input-block w-full">
                                    <div class="cpf-input-label">
                                        Значення
                                    </div>
                                    <div class="cpf-input-holder">
                                        <input id="panel_background_linear_gradient_to_value_range" type="range" step="1" min="0" max="100" ci-type="input">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="cpf-inputs-holder w-full">
                            <div class="cpf-input-block w-wide">
                                <div class="cpf-input-label">
                                    Напрямок (градуси)
                                </div>
                                <div class="cpf-input-holder">
                                    <input id="panel_background_linear_gradient_deg_range" type="range" step="1" min="0" max="360" ci-type="input">
                                </div>
                            </div>
                            <div class="cpf-input-block w-narrow">
                                <div class="cpf-input-label">
                                    Зн.
                                </div>
                                <div class="cpf-input-holder">
                                    <input id="panel_background_linear_gradient_deg_input" ci-type="input">
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="cpf-container" ci-name="borderColor">
                    <div class="cpf-container-label">
                        Колір граней
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_border_color_input" type="color" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-middle">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_border_color_opacity_range" type="range" step="1" min="0" max="100" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_border_color_opacity_input" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="borderWidth">
                    <div class="cpf-container-label">
                        Товщина граней
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-wide">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_border_width_range" type="range" step="0.1" min="0" max="10" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_border_width_input" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="cpf-container" ci-name="borderRadius">
                    <div class="cpf-container-label">
                        Округлість блоку
                    </div>
                    <div class="cpf-inputs-holder w-full">
                        <div class="cpf-input-block w-wide">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_border_radius_range" type="range" step="0.1" min="0" max="35" ci-type="input">
                            </div>
                        </div>
                        <div class="cpf-input-block w-narrow">
                            <div class="cpf-input-label">
                            </div>
                            <div class="cpf-input-holder">
                                <input id="panel_border_radius_input" ci-type="input">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="context-panel-footer">

                </div>
            </div>
        </div>
    </div>

    <!-- FUNCTIONAL MODALS -->
    <div class="modal fade" id="createSlideModal" tabindex="-1" aria-labelledby="createSlideModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="createSlideModalLabel">Створити слайд</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="new_slide_name" class="form-label">Ім'я слайду</label>
                    <input type="text" class="form-control" id="new_slide_name" placeholder="Новий слайд">
                </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрити</button>
            <button type="button" id="add_slide" class="btn btn-primary">Створити</button>
            </div>
        </div>
        </div>
    </div>

    <div class="modal fade" id="removeSlideModal" tabindex="-1" aria-labelledby="removeSlideModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="removeSlideModalLabel">Видалити слайд</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Ви точно бажаєте видалити слайд?
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрити</button>
            <button type="button" id="remove_slide" class="btn btn-danger">Видалити</button>
            </div>
        </div>
        </div>
    </div>
    
    <div class="modal fade" id="renameSlideModal" tabindex="-1" aria-labelledby="renameSlideModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="renameSlideModalLabel">Перейменувати слайд</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="edited_slide_name" class="form-label">Ім'я слайду</label>
                    <input type="text" class="form-control" id="edited_slide_name" placeholder="Ім'я слайду">
                </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрити</button>
            <button type="button" id="rename_slide" class="btn btn-primary">Перейменувати</button>
            </div>
        </div>
        </div>
    </div>

    <div class="modal fade" id="applySlideTemplateModal" tabindex="-1" aria-labelledby="applySlideTemplateModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="applySlideTemplateModalLabel">Застосувати шаблон</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div id="apply_slide_template_text_area" class="modal-body">
                
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрити</button>
            <button type="button" id="apply_template_to_slide" class="btn btn-success">Застосувати</button>
            </div>
        </div>
        </div>
    </div>

    <div class="modal fade" id="createImageModal" tabindex="-1" aria-labelledby="createImageModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="createImageModalLabel">Додати зображення</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="image_name" class="form-label">Ім'я</label>
                    <input type="text" class="form-control" id="image_name" placeholder="Нове зображення">
                </div>
                <div class="mb-3">
                    <label for="image_file" class="form-label">Файл</label>
                    <input type="file" class="form-control" id="image_file" placeholder="Натисніть, щоб обрати зображення">
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрити</button>
                <button type="button" id="add_image" class="btn btn-success">Зберегти</button>
            </div>
        </div>
        </div>
    </div>

    <div class="modal fade" id="removeImageModal" tabindex="-1" aria-labelledby="removeImageModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="removeSlideModalLabel">Видалити слайд</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                Ви точно бажаєте видалити зображення "<span id="delete_image_name"></span>"?
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрити</button>
            <button type="button" id="remove_image" class="btn btn-danger">Видалити</button>
            </div>
        </div>
        </div>
    </div>

    <div class="modal fade" id="renameImageModal" tabindex="-1" aria-labelledby="renameImageModalLabel" aria-hidden="true">
        <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h5 class="modal-title" id="renameImageModalLabel">Перейменувати слайд</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="mb-3">
                    <label for="edited_slide_name" class="form-label">Ім'я зображення</label>
                    <input type="text" class="form-control" id="edited_image_name" placeholder="Ім'я зображення">
                </div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрити</button>
            <button type="button" id="rename_image" class="btn btn-primary">Перейменувати</button>
            </div>
        </div>
        </div>
    </div>

    <script src="{{asset('slide_editor_js/ckeditor/ckeditor.js')}}"></script>
    <script>
        let editor;
        InlineEditor
            .create( document.querySelector( '#textEditor' ), {
            })
            .then( newEditor => {
                editor = newEditor;
            } )
            .catch( error => {
                console.error( error );
            } );
    </script>

    {{-- <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script> --}}
    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.25.0/axios.min.js"></script>

    <script src="{{asset('slide_editor_js/1_config.js')}}" type="application/javascript"></script>
    <script src="{{asset('slide_editor_js/1.2_available_items_and_context_methods.js')}}" type="application/javascript"></script>
    <script src="{{asset('slide_editor_js/1.3_context_panel_items.js')}}" type="application/javascript"></script>
    <script src="{{asset('slide_editor_js/1.4_slides_related_panels.js')}}" type="application/javascript"></script>
    <script src="{{asset('slide_editor_js/2_viewport.js')}}" type="application/javascript"></script>
    <script src="{{asset('slide_editor_js/3_items.js')}}" type="application/javascript"></script>
    <script src="{{asset('slide_editor_js/4_app.js')}}" type="application/javascript"></script>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>

    <script>
        CONFIG.serverUrl = {!! json_encode($serverUrl) !!};
        CONFIG.presentationUrl = {!! json_encode($url) !!};
        CONFIG.presentationName = {!! json_encode($presentationName) !!}
        CONFIG.presentationId = {!! json_encode($presentationId) !!};
        CONFIG.reportId = {!! json_encode($reportId) !!};
        CONFIG.CSRF = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        CONFIG.UI.itemTemplates.imageSrcTemplate = `${CONFIG.serverUrl}/storage/image_placeholder.png`,
        
        CONFIG.mode = {!! json_encode($mode) !!};

        slidesConfig.slideList = {!! json_encode($slides) !!}; 
        imagesConfig.imageList = {!! json_encode($images) !!}; 
        templatesConfig.templateList = {!! json_encode($templates) !!}

        window.addEventListener('load', function() {
            slidesConfig.getList(true);
            
            if (CONFIG.mode == 'template') {
                // srpConfig.buttons.templatesList.remove()
                goToPresentationsButton.innerHTML = 'Звіти'
            } else {
                goToPresentationsButton.innerHTML = 'Презентації'
            }
        })
    </script>
</body>
</html>