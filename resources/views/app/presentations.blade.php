@extends('layouts.control_panel')

@section('title')
    @parent

    - презентації
@endsection

@php
    $currentPage = "presentations";
@endphp

@section('content')

<div class="articles container-fluid p-0 d-flex flex-column col-12" style="height: 100%">
    <nav class="button-holder col-12 d-flex flex-row p-3">
        <button class="btn btn-primary p-1 px-2" data-bs-toggle="modal" data-bs-target="#presentationCreateModal">
            Створити розділ презентації
        </button>

        <div class="modal fade" id="presentationCreateModal" tabindex="-1" aria-labelledby="presentationCreateModalLabel" aria-hidden="true">
            <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="presentationCreateModal">Створення розділу презентації</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="createPresentation" action="{{ route('create_presentation') }}" method="post">
                        @csrf
                        <select class="form-select mb-3" name="report_id">
                            <option selected disabled value="">Оберіть рік звіту</option>
                            @foreach ($reports as $report)
                                <option value="{{$report['id']}}">{{$report['year']}}</option>
                            @endforeach
                        </select>
                        <div class="mb-3">
                            <label for="createPresentationName" class="form-label">Назва розділу презентації</label>
                            <input type="input" name="presentation_name" class="form-control" id="createPresentationName">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Відмінити</button>
                <button class="btn btn-success" form="createPresentation" type="submit"> Створити </button>
                </div>
            </div>
            </div>
        </div>
    </nav>
    <div class="col-12 p-4">
        @foreach ($reports as $report)
        <div class="row mb-3">
            <div class="collapse-trigger d-flex flex-row" data-bs-toggle="collapse" data-bs-target="#presentations{{ $report["id"] }}" aria-expanded="false" aria-controls="collapsePresentations">
                <hr class="col-5">
                <span class="col-2 d-flex justify-content-center align-items-center">
                    {{$report["year"]}}
                </span>
                <hr class="col-5">
            </div>
            <div class="collapse show" id="presentations{{ $report["id"] }}">
                <div>
                    <button type="button" class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="{{'#presentationCreatingModal'.$report['id']}}">
                        Створити розділ презентації для {{$report['year']}} року
                    </button>
                    
                    <div class="modal fade" id="{{'presentationCreatingModal'.$report['id']}}" tabindex="-1" aria-labelledby="{{'presentationCreatingModalLabel'.$report['id']}}" aria-hidden="true">
                        <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="{{'presentationCreatingModalLabel'.$report['id']}}">Створення презентації</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                
                                <form id="{{'createPresentation'.$report['id']}}" action="{{ route('create_presentation') }}" method="post">
                                    @csrf
                                    <select class="form-select mb-3" name="report_id">
                                        <option disabled value="">Оберіть рік звіту</option>
                                        @foreach ($reports as $formReport)
                                            <option {{$formReport['id'] == $report['id'] ? 'selected' : ''}} value="{{$formReport['id']}}">{{$formReport['year']}}</option>
                                        @endforeach
                                    </select>
                                    <div class="mb-3">
                                        <label for="{{'createPresentationName'.$report['id']}}" class="form-label">Назва розділу презентації</label>
                                        <input type="input" name="presentation_name" class="form-control" id="{{'createPresentationName'.$report['id']}}">
                                    </div>
                                </form>

                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Відмінити</button>
                            <button class="btn btn-success" form="{{'createPresentation'.$report['id']}}" type="submit"> Створити </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    
                </div>
                <div>
                    @foreach ($report["presentations"] as $presentation)
                    <div class="mb-4 p-3 article-element d-flex flex-row justify-content-between">
                        <div class="d-flex align-items-center col-7">
                            {{ $presentation["name"] }}
                        </div>
                        <div class="col-5 d-flex align-items-center justify-content-end article-button-container">
                            @if (!$loop->first)
                                <a class="btn btn-primary text-align-center" href="{{ route('move_presentation', ['id' => $presentation["id"], 'direction' => 'down']) }}">+</a>
                            @endif
                            @if (!$loop->last)
                                <a class="btn btn-primary text-align-center" href="{{ route('move_presentation', ['id' => $presentation["id"], 'direction' => 'up']) }}">-</a>
                            @endif
                        
                            <a class="btn btn-primary" href="{{ route('show_slides', $presentation["id"]) }}">
                                Слайди
                            </a>
                            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="{{'#presentationUpdateingModal'.$presentation['id']}}">
                                Редагувати
                            </button>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="{{'#presentationRemovingModal'.$presentation['id']}}">
                                Видалити
                            </button>                  
                        </div>
                    </div>
                    
                    <div class="modal fade" id="{{'presentationRemovingModal'.$presentation['id']}}" tabindex="-1" aria-labelledby="{{'presentationRemovingModalLabel'.$presentation['id']}}" aria-hidden="true">
                        <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="{{'presentationRemovingModalLabel'.$presentation['id']}}">Видалення презентації</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                Ви дійсно бажаєте видалити презентацію: "{{ $presentation['name'] }}"?
                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Відмінити</button>
                            <a class="btn btn-danger" href="{{route('remove_presentation', $presentation['id'])}}"> Видалити </a>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="modal fade" id="{{'presentationUpdateingModal'.$presentation['id']}}" tabindex="-1" aria-labelledby="{{'presentationUpdateingModalLabel'.$presentation['id']}}" aria-hidden="true">
                        <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h5 class="modal-title" id="{{'presentationUpdateingModalLabel'.$presentation['id']}}">Редагування заголовку презентації</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                
                                <form id="{{'updatePresentation'.$presentation['id']}}" action="{{ route('update_presentation') }}" method="post">
                                    @csrf
                                    <select class="form-select mb-3" name="report_id">
                                        <option disabled value="">Оберіть рік звіту</option>
                                        @foreach ($reports as $formReport)
                                            <option {{$formReport['id'] == $report['id'] ? 'selected' : ''}} value="{{$formReport['id']}}">{{$formReport['year']}}</option>
                                        @endforeach
                                    </select>
                                    <div class="mb-3">
                                        <input type="text" hidden name="presentation_id" value="{{$presentation['id']}}">
                                        <label for="{{'updatePresentationName'.$presentation['id']}}" class="form-label">Назва розділу презентації</label>
                                        <input type="input" name="presentation_name" class="form-control" id="{{'updatePresentationName'.$presentation['id']}}"
                                            value="{{$presentation['name']}}">
                                    </div>
                                </form>

                            </div>
                            <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Відмінити</button>
                            <button class="btn btn-success" form="{{'updatePresentation'.$presentation['id']}}" type="submit"> Оновити </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    @endforeach
                </div>
                {{-- <img src="{{ Storage::url($report["img_src"]) }}" alt=""> --}}
            </div>
        </div>
        @endforeach
    </div>
</div>

@endsection

@section('css_import')
    @parent

    <link rel="stylesheet" href="{{asset('css/articles.css')}}">
@endsection
