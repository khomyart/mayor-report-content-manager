@extends('layouts.control_panel')

@section('title')
    @parent

    - створити статтю
@endsection

@php
    $currentPage = "articles";
@endphp

@section('content')
<script src="https://cdn.ckeditor.com/ckeditor5/31.0.0/classic/ckeditor.js"></script>


<div class="articles container-fluid p-0 d-flex flex-column align-items-center col-12" style="height: 100%">
    <nav class="button-holder col-12 d-flex p-3">
        <ol class="breadcrumb p-0 m-0">
            <li class="breadcrumb-item"><a href="{{ route('articles') }}">Статті</a></li>
            <li class="breadcrumb-item active" aria-current="page">Створити статтю</li>
        </ol>
    </nav>
    <div class="col-9 p-4">
        <form id="article_form" action="{{ route('create_article') }}" method="POST" class="mb-5">
            @csrf
            <div class="row mb-4">
                <div class="col-3">
                    <select class="form-select" aria-label="form-select" name="report_year">
                        <option selected value="">Рік звіту</option>
                        @foreach ($reports as $report)
                            <option {{ isset($current_report_id) && $current_report_id == $report['id'] ? 'selected' : '' }} value="{{ $report['year'] }}"> 
                                {{ $report['year'] }} 
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-9">
                    <input class="form-control" type="text" placeholder="Назва статті" aria-label="article-name" name="article_name">
                </div>
            </div>           

            <textarea id="editor" name="article_text" placeholder="Текст статті"></textarea>

            <div class="row mb-4">
                <div class="col-6 pt-3">
                    <label for="additional_files" class="form-label">Додатковий файл статті</label>
                    <input class="form-control" type="file" id="additional_files" name="additional_files">
                </div>
                <div class="col-4 pt-5 text-align-right">
                    <!-- Button trigger modal -->
                    <button type="button" class="btn btn-primary col-12" data-bs-toggle="modal" data-bs-target="#diagramModal">
                        Створити діаграму
                    </button>
                </div>
                <div class="col-2 pt-5">
                    <button type="submit" class="btn btn-primary col-12"> Зберегти </button>
                </div>
            </div>
        </form> 
        <div class="charts-container d-flex flex-row col-12 px-3 mb-3">
            
        </div>

        <!-- Modal -->
        <div class="modal fade" id="diagramModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="diagramModalLabel" aria-hidden="true">
            {{-- modal-lg --}}
            <div class="modal-dialog modal-dialog-scrollable ">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="diagramModalLabel">Створити діаграму</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <ul id="chart_errors" hidden class="alert alert-danger ps-5">

                        </ul>
                        <div class="mb-3">
                            <label for="chart_title" class="form-label">Назва графіка</label>
                            <input type="text" class="form-control" id="chart_title" name="chart_title">
                        </div>
                        <div class="mb-3">
                            <label for="chart_legend" class="form-label">Додаткова назва графіка</label>
                            <input type="text" class="form-control" id="chart_legend" name="chart_legend">
                        </div>
                        <div class="mb-3">
                            <select class="form-select" id="chart_type" aria-label="chart_type" name="chart_type">
                                <option selected value="">Оберіть тип графіку</option>
                                <option value="pie">Пиріг</option>
                                <option value="doughnut">Пончик</option>
                                <option value="bar">Стовп</option>
                                <option value="horizontalBar">Горизонтальний стовп</option>
                            </select>
                        </div>
                        <div class="row mb-3">
                            <div class="col-6">
                                <label for="chart_axis_x" class="form-label">Назва осі X</label>
                                <input type="text" class="form-control" id="chart_axis_x" name="chart_axis[x]">
                            </div>
                            <div class="col-6">
                                <label for="chart_axis_y" class="form-label">Назва осі Y</label>
                                <input type="text" class="form-control" id="chart_axis_y" name="chart_axis[y]">
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-6">
                                <label for="chart_sufix" class="form-label">Суфікс показників</label>
                                <input type="text" class="form-control" id="chart_sufix" name="chart_sufix">
                            </div>
                            <div class="col-6 d-flex flex-column align-items-start justify-content-evenly">
                                <div>
                                    <input class="form-check-input" type="checkbox" name="chart_verbal_rounding" id="chart_verbal_rounding">
                                    <label class="form-check-label" for="chart_verbal_rounding">
                                        Вербальне скорочення
                                    </label>
                                </div>
                                <div>
                                    <input class="form-check-input" type="checkbox" name="chart_verbal_rounding_when_hovered" id="chart_verbal_rounding_when_hovered">
                                    <label class="form-check-label" for="chart_verbal_rounding_when_hovered">
                                        при наведенні
                                    </label>
                                </div>
                            </div>
                        </div>
                        <h5>Набори даних</h5>
                        <hr class="mb-3">
                        <div class="row mb-3 px-3">
                            <a id="add_dataset_button" class="btn btn-primary">
                                Додати набір даних
                            </a>
                        </div>
                        <div id="datasets_container">

                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" id="debug" class="btn btn-primary">Debug</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Відміна</button>
                        <button type="button" id="submit_chart_data" class="btn btn-primary">Зберегти</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    ClassicEditor
    .create( document.querySelector( '#editor' ), {
        toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
            ]
        }
    })
</script>
@endsection

@section('css_import')
    @parent

    <link rel="stylesheet" href="{{asset('css/articles.css')}}">

    {{-- change place for this libs after template setup --}}
    
@endsection

@section('javascript_import')
    @parent
    <script
        defer
        src="https://code.jquery.com/jquery-3.6.0.js"
        integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk="
        crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.min.js" integrity="sha512-d9xgZrVZpmmQlfonhQUvTR7lMPtO7NkZMkA0ABN3PHCbKA5nqylQ/yWlFAyY6hYgdF1Qh6nYiuADWwKB4C2WSw==" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@0.7.0"></script>
    <script defer src="{{ asset('js/create_article.js') }}"></script>
@show


{{-- <div class="col-12 col-md-10 col-xxl-8 mb-4"> <canvas class="__article_id___chart"></canvas> </div> --}}