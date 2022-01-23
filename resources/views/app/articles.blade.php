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
                Створити статтю
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
            <div class="collapse show" id="articles{{ $report["id"] }}">
                <div>
                    <a href="{{ route('create_article_form', ['current_report_id' => $report['id']]) }}" class="btn btn-primary mb-3">
                        Створити статтю ({{ $report['year'] }})
                    </a>
                </div>
                <div>
                    @foreach ($report["articles"] as $article)
                    <div class="mb-4 p-3 article-element d-flex flex-row justify-content-between">
                        <div class="d-flex align-items-center col-7">
                            {{ $article["name"] }}
                        </div>
                        <div class="col-4 d-flex align-items-center justify-content-end article-button-container">
                            @if (!$loop->first)
                                <a class="btn btn-primary text-align-center" href="{{ route('move_article', ['id' => $article["id"], 'direction' => 'down']) }}">+</a>
                            @endif
                            @if (!$loop->last)
                                <a class="btn btn-primary text-align-center" href="{{ route('move_article', ['id' => $article["id"], 'direction' => 'up']) }}">-</a>
                            @endif
                        
                            <a class="btn btn-primary" href="{{'/article/update/'.$article['id']}}"> Редагувати </a>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" data-bs-target="{{'#articleRemovingModal'.$article['id']}}">
                                Видалити
                            </button>
                        </div>
                        <div class="modal fade" id="{{'articleRemovingModal'.$article['id']}}" tabindex="-1" aria-labelledby="{{'articleRemovingModalLabel'.$article['id']}}" aria-hidden="true">
                            <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="modal-header">
                                <h5 class="modal-title" id="{{'articleRemovingModalLabel'.$article['id']}}">Видалення статті</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                    Ви дійсно бажаєте видалити статтю: "{{ $article['name'] }}"?
                                </div>
                                <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Відмінити</button>
                                <a class="btn btn-danger" href="{{route('remove_article', $article['id'])}}"> Видалити </a>
                                </div>
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
