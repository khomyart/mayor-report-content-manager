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
        {{url()->current()}}
        <form action="{{ isset($data) ? url('/reports/update/'.$data['id']) : route('create_report_action') }}" method="POST" class="mt-5 col-12" enctype="multipart/form-data">
            @csrf
            <div class="row mb-3">
                <div class="col-6">
                    <label for="year" class="form-label">Рік звіту</label>
                    <input type="number" class="form-control" id="year" placeholder="" name="year" value="{{ isset($data) ? $data["year"] : '' }}">
                </div>
                <div class="col-6">
                    <label for="published_at" class="form-label">Дата публікації</label>
                    <input type="date" class="form-control" id="published_at" placeholder="" name="published_at" value="{{ isset($data) ? $data["published_at"] : '' }}">
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-6">
                    <label for="report_image" class="form-label">Зображення звіту (10:6 - 500x300)</label>
                    <input class="form-control" type="file" id="report_image" name="report_image">
                </div>
                <div class="col-6">
                    <label for="report_book" class="form-label">PDF книжка звіту</label>
                    <input class="form-control" type="file" id="report_book" name="report_book">
                </div>
            </div>

            @if (isset($data))
                <div class="row mb-3">
                    <div class="col-6">
                        @if (isset($data["img_src"]))
                            <img src="{{ Storage::url($data["img_src"]); }}" alt="" style="width: 100%;">
                        @endif
                    </div>
                    <div class="col-6">
                            <div class="row" id="existing_additional_file_holder">
                                <div class="col-6 pt-3">
                                    ✔️
                                    <a id="existing_additional_file" name="existing_additional_file" href="{{ Storage::url($data["path_to_report_book"]); }}">
                                        Звіт книжка</a>
                                </div>
                            </div>
                    </div>
                </div>
            @endif

            <div class="d-flex flex-row mt-3 align-items-center justify-content-start">

                <button type="submit" class="btn btn-primary">Зберегти {{ isset($data) ? 'зміни' : '' }}</button>
                <div class="form-check ps-5">
                    <label class="form-check-label" for="is_active">
                        Активний
                    </label>
                    <input class="form-check-input" type="checkbox" id="is_active" name="is_active" {{ isset($data) && $data["is_active"] == "true" ? 'checked' : '' }}>
                </div>
            </div>
        </form>
    </div>
</div>

@endsection

@section('css_import')
    @parent

    <link rel="stylesheet" href="{{asset('css/reports.css')}}">
@endsection
