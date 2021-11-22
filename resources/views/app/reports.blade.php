@extends('layouts.control_panel')

@section('title')
    @parent

    - звіти
@endsection

@php
    $currentPage = "reports";
@endphp

@section('content')

    <div class="reports container-fluid p-0 d-flex flex-column col-12" style="height: 100%">
        <nav class="button-holder col-12 d-flex flex-row p-3">
            <a href="{{ route('create_report_form') }}">
                <button class="btn btn-primary p-1">
                    Створити новий звіт
                </button>
            </a>
        </nav>
        <div class="col-12 p-4">
            @foreach ($reports as $report)
                <div class="mb-4 p-3 report-element">
                    {{$report["year"]}}
                </div>
            @endforeach
        </div>
    </div>

@endsection

@section('style')
    @parent

    <link rel="stylesheet" href="{{asset('css/reports.css')}}">
@endsection
