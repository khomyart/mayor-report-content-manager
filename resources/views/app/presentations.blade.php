@extends('layouts.control_panel')

@section('title')
    @parent

    - презентації
@endsection

@php
    $currentPage = "presentations";
@endphp

@section('content')

    123 презентації

@endsection

@section('css_import')
    @parent

    <link rel="stylesheet" href="{{asset('css/dashboard_page.css')}}">
@endsection
