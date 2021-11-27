@extends('layouts.control_panel')

@section('title')
    @parent

    - дешборд
@endsection

@php
    $currentPage = "dashboard";
@endphp

@section('content')

    123 дешборд

@endsection

@section('css_import')
    @parent

    <link rel="stylesheet" href="{{asset('css/dashboard_page.css')}}">
@endsection
