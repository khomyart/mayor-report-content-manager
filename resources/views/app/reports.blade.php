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
                <button class="btn btn-primary p-1 px-2">
                    Створити новий звіт
                </button>
            </a>
        </nav>
        <div class="col-12 p-4">
            @foreach ($reports as $report)
                <div class="mb-4 p-3 report-element d-flex flex-row justify-content-between">
                    <div class="d-flex align-items-center">
                        {{$report["year"]}}, опублікований: {{ $report["published_at"]}}
                    </div>
                    <div>
                        <a class="btn btn-primary" href="{{'/reports/update/'.$report['id']}}"> Редагувати </a>
                        <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="{{'#reportRemovingModal'.$report["id"]}}">
                            Видалити
                        </button>
                        
                        <div class="modal fade" id="{{'reportRemovingModal'.$report["id"]}}" tabindex="-1" aria-labelledby="{{'reportRemovingModalLabel'.$report["id"]}}" aria-hidden="true">
                            <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title" id="{{'reportRemovingModalLabel'.$report["id"]}}">Видалення звіту</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    Ви дійсно бажаєте видалити звіт за {{ $report["year"] }} рік?
                                </div>
                                <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Відмінити</button>
                                <a class="btn btn-danger" href="{{'/reports/delete/'.$report['id']}}"> Видалити </a>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

@endsection

@section('css_import')
    @parent

    <link rel="stylesheet" href="{{asset('css/reports.css')}}">
@endsection
