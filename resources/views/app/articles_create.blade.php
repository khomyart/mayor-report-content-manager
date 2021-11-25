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


<div class="reports container-fluid p-0 d-flex flex-column align-items-center col-12" style="height: 100%">
    <nav class="button-holder col-12 d-flex p-3">
        <ol class="breadcrumb p-0 m-0">
            <li class="breadcrumb-item"><a href="{{ route('articles') }}">Статті</a></li>
            <li class="breadcrumb-item active" aria-current="page">Створити статтю</li>
        </ol>
    </nav>
    <div class="col-9 p-4">
        <form action="{{ route('create_article') }}" method="POST">
            @csrf
            <div class="row mb-4">
                <div class="col-4">
                    <select class="form-select" aria-label="form-select">
                        <option selected>Рік звіту</option>
                        @foreach ($reports as $report)
                            <option {{ isset($current_report_id) && $current_report_id == $report['id'] ? 'selected' : '' }} value="{{ $report['year'] }}"> 
                                {{ $report['year'] }} 
                            </option>
                        @endforeach
                    </select>
                </div>
                <div class="col-8">
                    <input class="form-control" type="text" placeholder="Назва статті" aria-label="article-name">
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
        <!-- Modal -->
        <div class="modal fade" id="diagramModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="diagramModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="diagramModalLabel">Створити діаграму</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                ...
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Відміна</button>
                <button type="button" class="btn btn-primary">Зберегти</button>
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

@section('style')
    @parent

    <link rel="stylesheet" href="{{asset('css/reports.css')}}">
@endsection


