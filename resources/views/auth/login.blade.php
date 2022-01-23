@extends('layouts.app')

@section('title')
    @parent

    - сторінка авторизації
@endsection

@section('content')
    <div class="container-fluid w-100 h-100 d-flex justify-content-center align-items-center flex-column">
        <div class="col-2">
            @isset($errors)
                <!-- Error messages block -->
                <div class="errors-holder col-12 d-flex flex-column">
                @foreach($errors->all() as $error)
                    <div class="alert alert-danger mb-3" role="alert">
                        {{ $error }}
                    </div>
                @endforeach
                </div>
            @endisset

            <!-- Authorization form -->
            <form class="col-12" method="POST" action="{{ route('login') }}">
                @csrf
                <div class="mb-3">
                    <label for="login" class="form-label">Логін користувача</label>
                    <input type="text" class="form-control" id="login" aria-describedby="loginHelp" name="name">
                    <div id="loginHelp" class="form-text">Прізвище та ім'я</div>
                </div>
                <div class="mb-3">
                    <label for="password" class="form-label">Пароль</label>
                    <input type="password" class="form-control" id="exampleInputPassword1" name="password">
                </div>
                {{-- <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="check">
                    <label class="form-check-label" for="check">Запам'ятати мене</label>
                </div> --}}
                <button type="submit" class="btn btn-primary">Увійти</button>
            </form>
        </div>
    </div>
@endsection

@section('style')
    @parent

    <link rel="stylesheet" href="{{asset('css/login_page.css')}}">
@endsection
