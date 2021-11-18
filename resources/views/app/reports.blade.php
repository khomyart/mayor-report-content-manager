@extends('layouts.control_panel')

@section('title')
    @parent

    - звіти
@endsection

@section('content')

    123 звіти

@endsection

@section('style')
    @parent

    <link rel="stylesheet" href="{{asset('css/dashboard_page.css')}}">
@endsection
