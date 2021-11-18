@extends('layouts.control_panel')

@section('title')
    @parent

    - дешборд
@endsection

@section('content')

    123 дешборд

@endsection

@section('style')
    @parent

    <link rel="stylesheet" href="{{asset('css/dashboard_page.css')}}">
@endsection
