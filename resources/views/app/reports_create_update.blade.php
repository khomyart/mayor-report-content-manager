@extends('layouts.control_panel')

@section('title')
    @parent

    - створити звіт
@endsection

@php
    $currentPage = "reports";
@endphp

@section('content')

<div class="reports container-fluid p-0 d-flex flex-column align-items-center col-12" style="height: 100%">
    <nav class="button-holder col-12 d-flex p-3">
        <ol class="breadcrumb p-0 m-0">
            <li class="breadcrumb-item"><a href="{{ route('reports') }}">Звіти</a></li>
            <li class="breadcrumb-item active" aria-current="page">Створити звіт</li>
        </ol>
    </nav>
    <div class="col-8 p-4">
        <form action="{{ route('create_report_action') }}" method="POST" class="mt-5 col-12" enctype="multipart/form-data">
            @csrf
            <div class="row">
                <div class="mb-3 col-6">
                    <label for="year" class="form-label">Рік звіту</label>
                    <input type="number" class="form-control" id="year" placeholder="" name="year">
                </div>
                <div class="mb-3 col-6">
                    <label for="published_at" class="form-label">Дата публікації</label>
                    <input type="date" class="form-control" id="published_at" placeholder="" name="published_at">
                </div>
            </div>
            <div class="row">
                <div class="mb-3 col-6">
                    <label for="report_image" class="form-label">Зображення звіту</label>
                    <input class="form-control" type="file" id="report_image" name="report_image">
                </div>
                <div class="mb-3 col-6">
                    <label for="report_book" class="form-label">PDF книжка звіту</label>
                    <input class="form-control" type="file" id="report_book" name="report_book">
                </div>
            </div>
            <div class="d-flex flex-row mt-3 align-items-center justify-content-start">
                <button type="submit" class="btn btn-primary">Зберегти</button> 
                <div class="form-check ps-5">
                    <label class="form-check-label" for="is_active">
                        Активний
                    </label>
                    <input class="form-check-input" type="checkbox" id="is_active" name="is_active">
                </div>
            </div>
        </form>
    </div>
</div>

@endsection

@section('style')
    @parent

    <link rel="stylesheet" href="{{asset('css/reports.css')}}">
@endsection
