@extends('layouts.control_panel')

@section('title')
    @parent

    - статті
@endsection

@php
    $currentPage = "articles";
@endphp

@section('content')

    123 статті

@endsection

@section('style')
    @parent

    <link rel="stylesheet" href="{{asset('css/dashboard_page.css')}}">
@endsection
