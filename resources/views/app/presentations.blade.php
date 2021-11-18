@extends('layouts.control_panel')

@section('title')
    @parent

    - презентації
@endsection

@section('content')

    123 презентації

@endsection

@section('style')
    @parent

    <link rel="stylesheet" href="{{asset('css/dashboard_page.css')}}">
@endsection
