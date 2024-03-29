const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix .js('resources/js/app.js', 'public/js')
    .js('resources/js/create_article.js', 'public/js')
    .js('resources/js/update_article.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css')
    .postCss('resources/css/login_page.css', 'public/css')
    .postCss('resources/css/control_panel.css', 'public/css')
    .postCss('resources/css/reports.css', 'public/css')
    .postCss('resources/css/articles.css', 'public/css')
    .postCss('resources/css/dashboard_page.css', 'public/css');

