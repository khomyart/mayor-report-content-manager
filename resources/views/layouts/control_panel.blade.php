@php
$menu = [
    // [
    //     "display_name" => 'Головна',
    //     "redirects_to" => 'dashboard',
    // ],
    [
        "display_name" => 'Звіти',
        "redirects_to" => 'reports',
    ],
    [
        "display_name" => 'Статті',
        "redirects_to" => 'articles',
    ],
    [
        "display_name" => 'Презентації',
        "redirects_to" => 'presentations',
    ],     
];
@endphp

<!doctype html>
<html lang="ua">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <!-- CSS -->
    @section('css_import')
        <link rel="stylesheet" href="{{ asset('css/app.css') }}">
        <link rel="stylesheet" href="{{ asset('css/control_panel.css') }}">
    @show

    @section('javascript_import')
        <script defer src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    @show

    <title>@section('title') Редактор звітів міського голови @show</title>
</head>
<body>
    
    <div class="container-fluid d-flex flex-row col-12 p-0" style="height: 100%;">
        <div class="menu">
            <div class="d-flex flex-column">
                <div class="logo">

                </div>
                @foreach ($menu as $menu_item)
                    <a class="{{$currentPage == $menu_item['redirects_to'] ? 'active-menu-element' : 'menu-element'}}" href="{{ route($menu_item['redirects_to']) }}">
                        {{$menu_item['display_name']}}
                    </a>
                @endforeach
                </div>
        </div>
        <div class="content-container">
            @yield('content')
        </div>
    </div>   
</body>
</html>
