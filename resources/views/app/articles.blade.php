@extends('layouts.control_panel')

@section('title')
    @parent

    - статті
@endsection

@php
    $currentPage = "articles";
@endphp

@section('content')

<div class="articles container-fluid p-0 d-flex flex-column col-12" style="height: 100%">
    <nav class="button-holder col-12 d-flex flex-row p-3">
        <a href="{{ route('create_article_form') }}">
            <button class="btn btn-primary p-1 px-2">
                Створити нову статтю
            </button>
        </a>
    </nav>
    <div class="col-12 p-4">
        @foreach ($reports as $report)
        <div class="row mb-3">
            <div class="collapse-trigger d-flex flex-row" data-bs-toggle="collapse" data-bs-target="#articles{{ $report["id"] }}" aria-expanded="false" aria-controls="collapseExample">
                <hr class="col-5">
                <span class="col-2 d-flex justify-content-center align-items-center">
                    {{$report["year"]}}
                </span>
                <hr class="col-5">
            </div>
            <div class="collapse" id="articles{{ $report["id"] }}">
                <a href="{{ route('create_article_form', ['current_report_id' => $report['id']]) }}" class="btn btn-primary mb-3">
                    Створити статтю
                </a>
                <img src="{{ Storage::url($report["img_src"]) }}" alt="">
            </div>
        </div>
        @endforeach
    </div>
</div>

@endsection

@section('style')
    @parent

    <link rel="stylesheet" href="{{asset('css/articles.css')}}">
@endsection
